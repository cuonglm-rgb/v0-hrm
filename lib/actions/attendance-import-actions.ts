"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import * as XLSX from "xlsx"
import { createVNTimestamp } from "@/lib/utils/date-utils"

interface ImportResult {
  success: boolean
  total: number
  imported: number
  skipped: number
  errors: string[]
}

/**
 * Import chấm công từ file Excel
 * Format file:
 * | Mã N.Viên | Tên nhân viên | Phòng ban | Ngày | Thứ | Vào | Ra |
 * | NV001     | Nguyễn Văn A  | IT        | 01   | T2  | 08:30 | 17:30 |
 */
export async function importAttendanceFromExcel(
  formData: FormData
): Promise<ImportResult> {
  const supabase = await createClient()

  const file = formData.get("file") as File
  const monthYear = formData.get("monthYear") as string // Format: "2025-11"

  if (!file) {
    return { success: false, total: 0, imported: 0, skipped: 0, errors: ["Không có file"] }
  }

  if (!monthYear) {
    return { success: false, total: 0, imported: 0, skipped: 0, errors: ["Chưa chọn tháng/năm"] }
  }

  const [year, month] = monthYear.split("-").map(Number)

  try {
    // Đọc file Excel
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "array" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Chuyển đổi sang JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][]

    if (rawData.length < 2) {
      return { success: false, total: 0, imported: 0, skipped: 0, errors: ["File rỗng hoặc không có dữ liệu"] }
    }

    // Bỏ header row
    const dataRows = rawData.slice(1)
    const errors: string[] = []
    let imported = 0
    let skipped = 0

    // Lấy danh sách employee để map employee_code -> id
    const { data: employees } = await supabase
      .from("employees")
      .select("id, employee_code")

    const employeeMap = new Map(
      employees?.map((e) => [e.employee_code?.toLowerCase().trim(), e.id]) || []
    )

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i]
      const rowNum = i + 2 // +2 vì bỏ header và index từ 0

      // Kiểm tra row có đủ dữ liệu không
      if (!row || row.length < 6) {
        skipped++
        continue
      }

      // Format: Mã N.Viên | Tên nhân viên | Phòng ban | Ngày | Thứ | Vào | Ra
      const employeeCode = String(row[0] || "").trim().toLowerCase()
      // row[1] = Tên nhân viên (bỏ qua, dùng để đối chiếu)
      // row[2] = Phòng ban (bỏ qua)
      const dayValue = row[3] // Ngày trong tháng (1-31)
      // row[4] = Thứ (bỏ qua)
      const checkInValue = row[5] // Giờ vào
      const checkOutValue = row[6] // Giờ ra

      // Validate employee_code
      if (!employeeCode) {
        skipped++
        continue
      }

      const employeeId = employeeMap.get(employeeCode)
      if (!employeeId) {
        errors.push(`Dòng ${rowNum}: Không tìm thấy nhân viên "${row[0]}"`)
        skipped++
        continue
      }

      // Parse ngày
      let day: number
      if (typeof dayValue === "number") {
        day = Math.floor(dayValue)
      } else {
        day = parseInt(String(dayValue || "").trim(), 10)
      }

      if (isNaN(day) || day < 1 || day > 31) {
        errors.push(`Dòng ${rowNum}: Ngày không hợp lệ "${dayValue}"`)
        skipped++
        continue
      }

      // Tạo date string
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`

      // Validate ngày hợp lệ trong tháng
      const testDate = new Date(year, month - 1, day)
      if (testDate.getMonth() !== month - 1) {
        errors.push(`Dòng ${rowNum}: Ngày ${day} không tồn tại trong tháng ${month}`)
        skipped++
        continue
      }

      // Parse giờ vào
      const checkInTime = parseTimeValue(checkInValue)
      if (!checkInTime) {
        // Không có giờ vào thì bỏ qua dòng này
        skipped++
        continue
      }

      // Parse giờ ra (optional)
      const checkOutTime = parseTimeValue(checkOutValue)

      // Tạo timestamp với múi giờ VN (+07:00)
      const checkInTimestamp = createVNTimestamp(dateStr, checkInTime)
      const checkOutTimestamp = checkOutTime ? createVNTimestamp(dateStr, checkOutTime) : null

      // Kiểm tra đã có record cho ngày này chưa
      const { data: existing } = await supabase
        .from("attendance_logs")
        .select("id")
        .eq("employee_id", employeeId)
        .gte("check_in", `${dateStr}T00:00:00`)
        .lt("check_in", `${dateStr}T23:59:59`)
        .single()

      if (existing) {
        // Update record hiện có
        const { error } = await supabase
          .from("attendance_logs")
          .update({
            check_in: checkInTimestamp,
            check_out: checkOutTimestamp,
            source: "import",
          })
          .eq("id", existing.id)

        if (error) {
          errors.push(`Dòng ${rowNum}: Lỗi cập nhật - ${error.message}`)
          skipped++
        } else {
          imported++
        }
      } else {
        // Insert record mới
        const { error } = await supabase.from("attendance_logs").insert({
          employee_id: employeeId,
          check_in: checkInTimestamp,
          check_out: checkOutTimestamp,
          source: "import",
        })

        if (error) {
          errors.push(`Dòng ${rowNum}: Lỗi thêm mới - ${error.message}`)
          skipped++
        } else {
          imported++
        }
      }
    }

    revalidatePath("/dashboard/attendance")
    revalidatePath("/dashboard/attendance-management")

    return {
      success: true,
      total: dataRows.length,
      imported,
      skipped,
      errors: errors.slice(0, 10), // Giới hạn 10 lỗi đầu
    }
  } catch (error) {
    console.error("Error importing attendance:", error)
    return {
      success: false,
      total: 0,
      imported: 0,
      skipped: 0,
      errors: [`Lỗi đọc file: ${error instanceof Error ? error.message : "Unknown error"}`],
    }
  }
}

/**
 * Parse giá trị thời gian từ Excel
 * Hỗ trợ: "08:30", "8:30", 0.354166... (Excel time fraction)
 */
function parseTimeValue(value: unknown): string | null {
  if (value === null || value === undefined || value === "") {
    return null
  }

  if (typeof value === "number") {
    // Excel time fraction (0.0 = 00:00, 0.5 = 12:00, 1.0 = 24:00)
    const totalMinutes = Math.round(value * 24 * 60)
    const hours = Math.floor(totalMinutes / 60) % 24
    const minutes = totalMinutes % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
  }

  const timeStr = String(value).trim()
  
  // Match HH:mm or H:mm format
  const match = timeStr.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
  if (match) {
    const hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2], 10)
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
    }
  }

  return null
}

/**
 * Tạo file Excel mẫu để download
 */
export async function generateAttendanceTemplate(): Promise<{
  success: boolean
  data?: string
  error?: string
}> {
  try {
    const supabase = await createClient()

    // Lấy danh sách nhân viên active với phòng ban
    const { data: employees } = await supabase
      .from("employees")
      .select("employee_code, full_name, departments(name)")
      .eq("status", "active")
      .order("employee_code")

    // Tạo workbook
    const wb = XLSX.utils.book_new()

    // Sheet 1: Template với format mới
    const templateData = [
      ["Mã N.Viên", "Tên nhân viên", "Phòng ban", "Ngày", "Thứ", "Vào", "Ra"],
      ["NV001", "Nguyễn Văn A", "IT", 1, "T2", "08:30", "17:30"],
      ["NV001", "Nguyễn Văn A", "IT", 2, "T3", "08:45", "17:45"],
      ["NV002", "Trần Thị B", "HR", 1, "T2", "08:30", "17:30"],
    ]
    const ws1 = XLSX.utils.aoa_to_sheet(templateData)

    // Set column widths
    ws1["!cols"] = [
      { wch: 12 }, // Mã N.Viên
      { wch: 20 }, // Tên nhân viên
      { wch: 15 }, // Phòng ban
      { wch: 6 },  // Ngày
      { wch: 5 },  // Thứ
      { wch: 8 },  // Vào
      { wch: 8 },  // Ra
    ]

    XLSX.utils.book_append_sheet(wb, ws1, "Chấm công")

    // Sheet 2: Danh sách nhân viên
    const employeeData: (string | null | undefined)[][] = [
      ["Mã N.Viên", "Tên nhân viên", "Phòng ban"],
      ...(employees?.map((e) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dept = (e as any).departments as { name: string } | null
        return [e.employee_code, e.full_name, dept?.name || ""]
      }) || []),
    ]
    const ws2 = XLSX.utils.aoa_to_sheet(employeeData)
    ws2["!cols"] = [{ wch: 12 }, { wch: 25 }, { wch: 20 }]
    XLSX.utils.book_append_sheet(wb, ws2, "Danh sách NV")

    // Xuất ra base64
    const buffer = XLSX.write(wb, { type: "base64", bookType: "xlsx" })

    return { success: true, data: buffer }
  } catch (error) {
    console.error("Error generating template:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
