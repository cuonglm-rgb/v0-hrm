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
 * Format file mới:
 * Dòng 1: CHI TIẾT CHẤM CÔNG (header title)
 * Dòng 2: Từ ngày ... đến ngày ... (date range)
 * Dòng 3: Mã N.Viên | Tên nhân viên | Phòng ban | Chức vụ | Ngày | Thứ | Vào | Ra | ...
 * Dòng 4+: Data rows
 * 
 * Chỉ quan tâm: Mã N.Viên, Tên nhân viên, Ngày (dd/mm/yyyy), Thứ, Vào, Ra
 */
export async function importAttendanceFromExcel(
  formData: FormData
): Promise<ImportResult> {
  const supabase = await createClient()

  const file = formData.get("file") as File

  if (!file) {
    return { success: false, total: 0, imported: 0, skipped: 0, errors: ["Không có file"] }
  }

  try {
    // Đọc file Excel
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "array" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Chuyển đổi sang JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][]

    if (rawData.length < 4) {
      return { success: false, total: 0, imported: 0, skipped: 0, errors: ["File rỗng hoặc không có dữ liệu"] }
    }

    // Tìm dòng header (dòng có "Mã N.Viên")
    let headerRowIndex = -1
    for (let i = 0; i < Math.min(rawData.length, 10); i++) {
      const row = rawData[i]
      if (row && row.some((cell) => String(cell || "").includes("Mã N.Viên"))) {
        headerRowIndex = i
        break
      }
    }

    if (headerRowIndex === -1) {
      return { success: false, total: 0, imported: 0, skipped: 0, errors: ["Không tìm thấy header 'Mã N.Viên' trong file"] }
    }

    // Lấy header để xác định vị trí các cột
    const headerRow = rawData[headerRowIndex]
    const colIndex = {
      employeeCode: -1,
      date: -1,
      checkIn: -1,
      checkOut: -1,
    }

    for (let i = 0; i < headerRow.length; i++) {
      const colName = String(headerRow[i] || "").trim().toLowerCase()
      if (colName.includes("mã n.viên") || colName.includes("mã nv") || colName === "mã n.viên") {
        colIndex.employeeCode = i
      } else if (colName === "ngày") {
        colIndex.date = i
      } else if (colName === "vào") {
        colIndex.checkIn = i
      } else if (colName === "ra") {
        colIndex.checkOut = i
      }
    }

    // Validate required columns
    if (colIndex.employeeCode === -1) {
      return { success: false, total: 0, imported: 0, skipped: 0, errors: ["Không tìm thấy cột 'Mã N.Viên'"] }
    }
    if (colIndex.date === -1) {
      return { success: false, total: 0, imported: 0, skipped: 0, errors: ["Không tìm thấy cột 'Ngày'"] }
    }
    if (colIndex.checkIn === -1) {
      return { success: false, total: 0, imported: 0, skipped: 0, errors: ["Không tìm thấy cột 'Vào'"] }
    }
    if (colIndex.checkOut === -1) {
      return { success: false, total: 0, imported: 0, skipped: 0, errors: ["Không tìm thấy cột 'Ra'"] }
    }

    // Bỏ các dòng header, lấy data rows
    const dataRows = rawData.slice(headerRowIndex + 1)
    const errors: string[] = []
    let imported = 0
    let skipped = 0

    // Lấy danh sách employee để map employee_code -> id
    const { data: employees } = await supabase
      .from("employees")
      .select("id, employee_code")

    const employeeMap = new Map(
      employees?.map((e) => [String(e.employee_code || "").toLowerCase().trim(), e.id]) || []
    )

    // Thu thập và gộp dữ liệu theo employee + date
    // Key: "employeeId_dateStr" -> { checkInTimes: string[], checkOutTimes: string[] }
    const groupedData = new Map<string, {
      employeeId: string
      dateStr: string
      checkInTimes: string[]  // Tất cả giờ vào
      checkOutTimes: string[] // Tất cả giờ ra
    }>()

    // Phase 1: Parse và gộp tất cả rows theo employee + date
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i]
      const rowNum = i + headerRowIndex + 2

      if (!row || row.length === 0) {
        skipped++
        continue
      }

      const employeeCodeRaw = row[colIndex.employeeCode]
      const dateValue = row[colIndex.date]
      const checkInValue = row[colIndex.checkIn]
      const checkOutValue = row[colIndex.checkOut]

      const employeeCode = String(employeeCodeRaw || "").trim().toLowerCase()

      if (!employeeCode) {
        skipped++
        continue
      }

      const employeeId = employeeMap.get(employeeCode)
      if (!employeeId) {
        errors.push(`Dòng ${rowNum}: Không tìm thấy nhân viên "${employeeCodeRaw}"`)
        skipped++
        continue
      }

      const dateStr = parseDateValue(dateValue)
      if (!dateStr) {
        errors.push(`Dòng ${rowNum}: Ngày không hợp lệ "${dateValue}"`)
        skipped++
        continue
      }

      const checkInTime = parseTimeValue(checkInValue)
      const checkOutTime = parseTimeValue(checkOutValue)

      // Nếu không có cả giờ vào và giờ ra thì bỏ qua
      if (!checkInTime && !checkOutTime) {
        skipped++
        continue
      }

      // Gộp vào group
      const key = `${employeeId}_${dateStr}`
      let group = groupedData.get(key)
      if (!group) {
        group = {
          employeeId,
          dateStr,
          checkInTimes: [],
          checkOutTimes: [],
        }
        groupedData.set(key, group)
      }

      if (checkInTime) {
        group.checkInTimes.push(checkInTime)
      }
      if (checkOutTime) {
        group.checkOutTimes.push(checkOutTime)
      }
    }

    // Phase 2: Tạo validRows từ grouped data (lấy giờ vào sớm nhất, giờ ra muộn nhất)
    const allDates = new Set<string>()
    const validRows: Array<{
      employeeId: string
      dateStr: string
      checkInTimestamp: string
      checkOutTimestamp: string | null
    }> = []

    for (const group of groupedData.values()) {
      // Sắp xếp và lấy giờ vào sớm nhất
      const sortedCheckIns = group.checkInTimes.sort()
      const earliestCheckIn = sortedCheckIns[0]

      // Sắp xếp và lấy giờ ra muộn nhất
      const sortedCheckOuts = group.checkOutTimes.sort()
      const latestCheckOut = sortedCheckOuts[sortedCheckOuts.length - 1]

      if (!earliestCheckIn) {
        skipped++
        continue
      }

      const checkInTimestamp = createVNTimestamp(group.dateStr, earliestCheckIn)
      const checkOutTimestamp = latestCheckOut ? createVNTimestamp(group.dateStr, latestCheckOut) : null

      allDates.add(group.dateStr)
      validRows.push({
        employeeId: group.employeeId,
        dateStr: group.dateStr,
        checkInTimestamp,
        checkOutTimestamp,
      })
    }

    if (validRows.length === 0) {
      return {
        success: true,
        total: dataRows.length,
        imported: 0,
        skipped,
        errors: errors.slice(0, 10),
      }
    }

    // Phase 3: Query existing records một lần
    const dateArray = Array.from(allDates)
    const minDate = dateArray.sort()[0]
    const maxDate = dateArray.sort()[dateArray.length - 1]

    const { data: existingLogs } = await supabase
      .from("attendance_logs")
      .select("id, employee_id, check_in")
      .gte("check_in", `${minDate}T00:00:00`)
      .lte("check_in", `${maxDate}T23:59:59`)

    // Tạo map để tra cứu nhanh: "employeeId_date" -> log id
    const existingMap = new Map<string, string>()
    existingLogs?.forEach((log) => {
      if (log.check_in) {
        const logDate = log.check_in.split("T")[0]
        const key = `${log.employee_id}_${logDate}`
        existingMap.set(key, log.id)
      }
    })

    // Phase 4: Phân loại insert vs update
    const toInsert: Array<{
      employee_id: string
      check_in: string
      check_out: string | null
      source: string
    }> = []

    const toUpdate: Array<{
      id: string
      check_in: string
      check_out: string | null
      source: string
    }> = []

    for (const row of validRows) {
      const key = `${row.employeeId}_${row.dateStr}`
      const existingId = existingMap.get(key)

      if (existingId) {
        toUpdate.push({
          id: existingId,
          check_in: row.checkInTimestamp,
          check_out: row.checkOutTimestamp,
          source: "import",
        })
      } else {
        toInsert.push({
          employee_id: row.employeeId,
          check_in: row.checkInTimestamp,
          check_out: row.checkOutTimestamp,
          source: "import",
        })
      }
    }

    // Phase 4: Batch insert (chunks of 100)
    const BATCH_SIZE = 100
    for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
      const batch = toInsert.slice(i, i + BATCH_SIZE)
      const { error } = await supabase.from("attendance_logs").insert(batch)
      if (error) {
        errors.push(`Lỗi insert batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`)
      } else {
        imported += batch.length
      }
    }

    // Phase 5: Batch update (từng record vì Supabase không hỗ trợ bulk update)
    // Nhưng dùng Promise.all để chạy song song
    const UPDATE_PARALLEL = 20
    for (let i = 0; i < toUpdate.length; i += UPDATE_PARALLEL) {
      const batch = toUpdate.slice(i, i + UPDATE_PARALLEL)
      const results = await Promise.all(
        batch.map((item) =>
          supabase
            .from("attendance_logs")
            .update({
              check_in: item.check_in,
              check_out: item.check_out,
              source: item.source,
            })
            .eq("id", item.id)
        )
      )
      results.forEach((result, idx) => {
        if (result.error) {
          errors.push(`Lỗi update: ${result.error.message}`)
        } else {
          imported++
        }
      })
    }

    revalidatePath("/dashboard/attendance")
    revalidatePath("/dashboard/attendance-management")

    return {
      success: true,
      total: dataRows.length,
      imported,
      skipped,
      errors: errors.slice(0, 10),
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
 * Parse giá trị ngày từ Excel
 * Hỗ trợ: "01/01/2026" (dd/mm/yyyy), Excel date serial number
 * Returns: "2026-01-01" (yyyy-mm-dd) hoặc null
 */
function parseDateValue(value: unknown): string | null {
  if (value === null || value === undefined || value === "") {
    return null
  }

  if (typeof value === "number") {
    // Excel date serial number (days since 1900-01-01)
    // Excel có bug: coi 1900 là năm nhuận nên cần trừ 1 nếu > 60
    const excelEpoch = new Date(1899, 11, 30) // 1899-12-30
    const date = new Date(excelEpoch.getTime() + value * 24 * 60 * 60 * 1000)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const dateStr = String(value).trim()

  // Match dd/mm/yyyy format
  const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (match) {
    const day = parseInt(match[1], 10)
    const month = parseInt(match[2], 10)
    const year = parseInt(match[3], 10)

    // Validate date
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 2000 && year <= 2100) {
      const testDate = new Date(year, month - 1, day)
      if (testDate.getDate() === day && testDate.getMonth() === month - 1) {
        return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      }
    }
  }

  return null
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

    // Sheet 1: Template với format mới (giống file export từ máy chấm công)
    const templateData = [
      ["CHI TIẾT CHẤM CÔNG"],
      ["Từ ngày 01/01/2026 đến ngày 31/01/2026"],
      ["Mã N.Viên", "Tên nhân viên", "Phòng ban", "Chức vụ", "Ngày", "Thứ", "Vào", "Ra"],
      ["2", "Nguyễn Văn A", "Văn phòng", "Nhân viên", "02/01/2026", "Sáu", "7:53", "17:25"],
      ["2", "Nguyễn Văn A", "Văn phòng", "Nhân viên", "03/01/2026", "Bảy", "8:00", "17:30"],
      ["3", "Trần Thị B", "Kế toán", "Nhân viên", "02/01/2026", "Sáu", "8:15", "17:45"],
    ]
    const ws1 = XLSX.utils.aoa_to_sheet(templateData)

    // Set column widths
    ws1["!cols"] = [
      { wch: 12 }, // Mã N.Viên
      { wch: 20 }, // Tên nhân viên
      { wch: 15 }, // Phòng ban
      { wch: 12 }, // Chức vụ
      { wch: 12 }, // Ngày
      { wch: 6 },  // Thứ
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
