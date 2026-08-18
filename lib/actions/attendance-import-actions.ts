"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import * as XLSX from "xlsx"
import { createVNTimestamp } from "@/lib/utils/date-utils"
import {
  parseAttendanceSheet,
  type AttendanceGroup,
  type ParseResult,
} from "@/lib/utils/attendance-excel-parse"

interface ImportResult {
  success: boolean
  total: number
  imported: number
  skipped: number
  errors: string[]
}

interface ShiftInfo {
  startTime: string
  endTime: string
}

/**
 * Import chấm công từ dữ liệu đã parse sẵn.
 *
 * Client parse file Excel bằng `parseAttendanceSheet` rồi gửi lên theo từng chunk nhỏ.
 * Lý do: Vercel chặn cứng request body > 4.5MB (413 Content Too Large) trước khi
 * Next.js xử lý, nên không thể upload thẳng file Excel lớn qua server action.
 */
export async function importAttendanceGroups(groups: AttendanceGroup[]): Promise<ImportResult> {
  const supabase = await createClient()

  const errors: string[] = []
  let imported = 0
  let skipped = 0

  try {
    if (!groups || groups.length === 0) {
      return { success: true, total: 0, imported: 0, skipped: 0, errors: [] }
    }

    // Lấy danh sách employee để map employee_code -> id và shift_id
    const { data: employees } = await supabase
      .from("employees")
      .select("id, employee_code, shift_id")

    const employeeMap = new Map(
      employees?.map((e) => [String(e.employee_code || "").toLowerCase().trim(), e.id]) || []
    )

    // Map employee_id -> shift_id
    const employeeShiftMap = new Map(
      employees?.map((e) => [e.id, e.shift_id]) || []
    )

    // Lấy danh sách ca làm việc
    const { data: shifts } = await supabase
      .from("work_shifts")
      .select("id, start_time, end_time")

    const shiftMap = new Map<string, ShiftInfo>(
      shifts?.map((s) => [
        s.id,
        {
          startTime: s.start_time?.slice(0, 5) || "08:00",
          endTime: s.end_time?.slice(0, 5) || "17:00",
        },
      ]) || []
    )

    // Phase 1: Map group -> employee id, áp dụng luật giờ vào/ra theo ca làm việc
    // Xử lý đặc biệt: nếu chỉ có 1 lần chấm công và giờ >= giờ tan ca → đó là check-out
    const allDates = new Set<string>()
    const validRows: Array<{
      employeeId: string
      dateStr: string
      checkInTimestamp: string | null
      checkOutTimestamp: string | null
    }> = []

    const missingCodes = new Set<string>()

    for (const group of groups) {
      const employeeId = employeeMap.get(group.code)
      if (!employeeId) {
        missingCodes.add(group.codeRaw || group.code)
        skipped++
        continue
      }

      // Lấy thông tin ca làm việc của nhân viên
      const shiftId = employeeShiftMap.get(employeeId)
      const shiftInfo = shiftId ? shiftMap.get(shiftId) : null
      const shiftEndTime = shiftInfo?.endTime || "17:00"

      const earliestCheckIn = group.checkIn
      const latestCheckOut = group.checkOut

      // Trường hợp đặc biệt: chỉ có 1 lần chấm công (chỉ có giờ vào, không có giờ ra)
      // Nếu giờ chấm công >= giờ tan ca → đây là check-out, check-in thiếu
      if (earliestCheckIn && !latestCheckOut && group.checkInCount === 1) {
        if (earliestCheckIn >= shiftEndTime) {
          allDates.add(group.date)
          validRows.push({
            employeeId,
            dateStr: group.date,
            checkInTimestamp: null, // Check-in thiếu
            checkOutTimestamp: createVNTimestamp(group.date, earliestCheckIn),
          })
          continue
        }
      }

      // Trường hợp chỉ có giờ ra (từ cột "Ra" trong Excel) → check-in thiếu
      if (!earliestCheckIn && latestCheckOut) {
        allDates.add(group.date)
        validRows.push({
          employeeId,
          dateStr: group.date,
          checkInTimestamp: null,
          checkOutTimestamp: createVNTimestamp(group.date, latestCheckOut),
        })
        continue
      }

      if (!earliestCheckIn && !latestCheckOut) {
        skipped++
        continue
      }

      allDates.add(group.date)
      validRows.push({
        employeeId,
        dateStr: group.date,
        checkInTimestamp: earliestCheckIn ? createVNTimestamp(group.date, earliestCheckIn) : null,
        checkOutTimestamp: latestCheckOut ? createVNTimestamp(group.date, latestCheckOut) : null,
      })
    }

    missingCodes.forEach((code) => errors.push(`Không tìm thấy nhân viên "${code}"`))

    if (validRows.length === 0) {
      return {
        success: true,
        total: groups.length,
        imported: 0,
        skipped,
        errors: errors.slice(0, 10),
      }
    }

    // Phase 2: Query existing records một lần theo date range
    const dateArray = Array.from(allDates).sort()
    const minDate = dateArray[0]
    const maxDate = dateArray[dateArray.length - 1]

    // Tạo timestamp range cho VN timezone (UTC+7)
    const minTimestamp = `${minDate}T00:00:00+07:00`
    const maxTimestamp = `${maxDate}T23:59:59+07:00`

    // Lấy tất cả employee IDs liên quan
    const employeeIds = [...new Set(validRows.map((r) => r.employeeId))]

    // Query theo từng batch employee để tránh bị giới hạn 1000 rows
    const allExistingLogs: Array<{ id: string; employee_id: string; check_in: string | null; check_out: string | null }> = []
    const EMP_BATCH = 50
    for (let i = 0; i < employeeIds.length; i += EMP_BATCH) {
      const empBatch = employeeIds.slice(i, i + EMP_BATCH)
      const { data: batchLogs } = await supabase
        .from("attendance_logs")
        .select("id, employee_id, check_in, check_out")
        .in("employee_id", empBatch)
        .gte("check_in", minTimestamp)
        .lte("check_in", maxTimestamp)
        .limit(5000)
      if (batchLogs) allExistingLogs.push(...batchLogs)

      // Cũng query records chỉ có check_out (check_in null)
      const { data: checkOutOnlyLogs } = await supabase
        .from("attendance_logs")
        .select("id, employee_id, check_in, check_out")
        .in("employee_id", empBatch)
        .is("check_in", null)
        .gte("check_out", minTimestamp)
        .lte("check_out", maxTimestamp)
        .limit(5000)
      if (checkOutOnlyLogs) allExistingLogs.push(...checkOutOnlyLogs)
    }
    const existingLogs = allExistingLogs

    // Tạo map để tra cứu nhanh: "employeeId_date" -> log id
    const existingMap = new Map<string, string>()
    existingLogs?.forEach((log) => {
      // Lấy date từ check_in hoặc check_out, convert sang VN timezone
      let logDate: string | null = null
      const ts = log.check_in || log.check_out
      if (ts) {
        // Convert UTC timestamp sang VN date (UTC+7)
        const d = new Date(ts)
        const vnDate = new Date(d.getTime() + 7 * 60 * 60 * 1000)
        logDate = vnDate.toISOString().split("T")[0]
      }

      if (logDate && logDate >= minDate && logDate <= maxDate) {
        const key = `${log.employee_id}_${logDate}`
        existingMap.set(key, log.id)
      }
    })

    // Phase 3: Phân loại insert vs update
    const toInsert: Array<{
      employee_id: string
      check_in: string | null
      check_out: string | null
      source: string
    }> = []

    const toUpdate: Array<{
      id: string
      check_in: string | null
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
    // Nếu gặp duplicate constraint, insert từng record để skip duplicates
    const BATCH_SIZE = 100
    for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
      const batch = toInsert.slice(i, i + BATCH_SIZE)
      const { error } = await supabase.from("attendance_logs").insert(batch)
      if (error) {
        if (error.message.includes("duplicate key") || error.message.includes("idx_attendance_one_per_day")) {
          // Batch có duplicate → insert từng record để skip cái bị trùng
          for (const record of batch) {
            const { error: singleError } = await supabase.from("attendance_logs").insert(record)
            if (singleError) {
              if (singleError.message.includes("duplicate key") || singleError.message.includes("idx_attendance_one_per_day")) {
                // Record đã tồn tại → update thay vì skip
                // Tìm record cũ để update
                const dateStr = record.check_in ? record.check_in.split("T")[0] : record.check_out?.split("T")[0]
                if (dateStr) {
                  const dayStart = `${dateStr}T00:00:00+07:00`
                  const dayEnd = `${dateStr}T23:59:59+07:00`
                  const { data: existing } = await supabase
                    .from("attendance_logs")
                    .select("id")
                    .eq("employee_id", record.employee_id)
                    .gte("check_in", dayStart)
                    .lte("check_in", dayEnd)
                    .limit(1)
                    .single()
                  if (existing) {
                    const { error: updateError } = await supabase
                      .from("attendance_logs")
                      .update({
                        check_in: record.check_in,
                        check_out: record.check_out,
                        source: record.source,
                      })
                      .eq("id", existing.id)
                    if (!updateError) {
                      imported++
                    }
                  }
                }
              } else {
                errors.push(`Lỗi insert: ${singleError.message}`)
              }
            } else {
              imported++
            }
          }
        } else {
          errors.push(`Lỗi insert batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`)
        }
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
      results.forEach((result) => {
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
      total: groups.length,
      imported,
      skipped,
      errors: errors.slice(0, 10),
    }
  } catch (error) {
    console.error("Error importing attendance:", error)
    return {
      success: false,
      total: groups?.length || 0,
      imported,
      skipped,
      errors: [`Lỗi import: ${error instanceof Error ? error.message : "Unknown error"}`],
    }
  }
}

/**
 * Import chấm công từ file Excel (upload thẳng file lên server).
 *
 * CHÚ Ý: chỉ dùng cho file nhỏ. Trên Vercel, request body > 4.5MB bị chặn bằng 413
 * trước khi tới server action. Luồng chính ở UI parse file bằng `parseAttendanceSheet`
 * ngay trên trình duyệt rồi gọi `importAttendanceGroups` theo từng chunk.
 */
export async function importAttendanceFromExcel(
  formData: FormData
): Promise<ImportResult> {
  const file = formData.get("file") as File

  if (!file) {
    return { success: false, total: 0, imported: 0, skipped: 0, errors: ["Không có file"] }
  }

  let parsed: ParseResult
  try {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "array" })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][]
    parsed = parseAttendanceSheet(rawData)
  } catch (error) {
    console.error("Error reading attendance file:", error)
    return {
      success: false,
      total: 0,
      imported: 0,
      skipped: 0,
      errors: [`Lỗi đọc file: ${error instanceof Error ? error.message : "Unknown error"}`],
    }
  }

  if (!parsed.success) {
    return { success: false, total: 0, imported: 0, skipped: 0, errors: parsed.errors }
  }

  const result = await importAttendanceGroups(parsed.groups)

  return {
    ...result,
    total: parsed.total,
    skipped: parsed.skipped + result.skipped,
    errors: [...parsed.errors, ...result.errors].slice(0, 10),
  }
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
