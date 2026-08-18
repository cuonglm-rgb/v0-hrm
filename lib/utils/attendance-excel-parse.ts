/**
 * Parse file chấm công Excel — dùng chung cho cả client và server.
 *
 * Lý do tách riêng: Vercel giới hạn cứng body của mỗi request POST là 4.5MB
 * (413 Content Too Large) trước cả khi Next.js xử lý, nên `serverActions.bodySizeLimit`
 * không nâng được. Vì vậy file Excel được parse ngay trên trình duyệt, chỉ gửi lên
 * server dữ liệu đã gộp (rất nhẹ) theo từng chunk.
 */

/** Một nhóm chấm công đã gộp theo (mã nhân viên + ngày) */
export interface AttendanceGroup {
  /** Mã nhân viên (đã lowercase + trim) — dùng để map với DB */
  code: string
  /** Mã nhân viên như trong file — chỉ dùng để hiển thị lỗi */
  codeRaw: string
  /** Ngày dạng yyyy-MM-dd */
  date: string
  /** Giờ vào sớm nhất HH:mm, null nếu không có */
  checkIn: string | null
  /** Giờ ra muộn nhất HH:mm, null nếu không có */
  checkOut: string | null
  /** Số lần chấm công ở cột "Vào" — dùng cho case chỉ có 1 lần chấm công */
  checkInCount: number
}

export interface ParseResult {
  success: boolean
  /** Tổng số dòng dữ liệu trong file */
  total: number
  /** Số dòng bị bỏ qua khi parse */
  skipped: number
  errors: string[]
  groups: AttendanceGroup[]
}

/**
 * Parse dữ liệu thô của sheet (dạng mảng 2 chiều từ XLSX.utils.sheet_to_json với header: 1)
 *
 * Format file:
 * Dòng 1: CHI TIẾT CHẤM CÔNG (header title)
 * Dòng 2: Từ ngày ... đến ngày ... (date range)
 * Dòng 3: Mã N.Viên | Tên nhân viên | Phòng ban | Chức vụ | Ngày | Thứ | Vào | Ra | ...
 * Dòng 4+: Data rows
 */
export function parseAttendanceSheet(rawData: unknown[][]): ParseResult {
  const empty = (errors: string[]): ParseResult => ({
    success: false,
    total: 0,
    skipped: 0,
    errors,
    groups: [],
  })

  if (rawData.length < 4) {
    return empty(["File rỗng hoặc không có dữ liệu"])
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
    return empty(["Không tìm thấy header 'Mã N.Viên' trong file"])
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

  if (colIndex.employeeCode === -1) return empty(["Không tìm thấy cột 'Mã N.Viên'"])
  if (colIndex.date === -1) return empty(["Không tìm thấy cột 'Ngày'"])
  if (colIndex.checkIn === -1) return empty(["Không tìm thấy cột 'Vào'"])
  if (colIndex.checkOut === -1) return empty(["Không tìm thấy cột 'Ra'"])

  const dataRows = rawData.slice(headerRowIndex + 1)
  const errors: string[] = []
  let skipped = 0

  // Gộp dữ liệu theo employee code + date
  const grouped = new Map<string, AttendanceGroup>()

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i]
    const rowNum = i + headerRowIndex + 2

    if (!row || row.length === 0) {
      skipped++
      continue
    }

    const employeeCodeRaw = row[colIndex.employeeCode]
    const employeeCode = String(employeeCodeRaw || "").trim().toLowerCase()

    if (!employeeCode) {
      skipped++
      continue
    }

    const dateStr = parseDateValue(row[colIndex.date])
    if (!dateStr) {
      errors.push(`Dòng ${rowNum}: Ngày không hợp lệ "${row[colIndex.date]}"`)
      skipped++
      continue
    }

    const checkInTime = parseTimeValue(row[colIndex.checkIn])
    const checkOutTime = parseTimeValue(row[colIndex.checkOut])

    // Không có cả giờ vào lẫn giờ ra → bỏ qua
    if (!checkInTime && !checkOutTime) {
      skipped++
      continue
    }

    const key = `${employeeCode}_${dateStr}`
    let group = grouped.get(key)
    if (!group) {
      group = {
        code: employeeCode,
        codeRaw: String(employeeCodeRaw ?? "").trim(),
        date: dateStr,
        checkIn: null,
        checkOut: null,
        checkInCount: 0,
      }
      grouped.set(key, group)
    }

    if (checkInTime) {
      group.checkInCount++
      // Giờ vào sớm nhất
      if (!group.checkIn || checkInTime < group.checkIn) {
        group.checkIn = checkInTime
      }
    }
    if (checkOutTime) {
      // Giờ ra muộn nhất
      if (!group.checkOut || checkOutTime > group.checkOut) {
        group.checkOut = checkOutTime
      }
    }
  }

  return {
    success: true,
    total: dataRows.length,
    skipped,
    errors,
    groups: Array.from(grouped.values()),
  }
}

/**
 * Parse giá trị ngày từ Excel
 * Hỗ trợ: "01/01/2026" (dd/mm/yyyy), Excel date serial number
 * Returns: "2026-01-01" (yyyy-mm-dd) hoặc null
 */
export function parseDateValue(value: unknown): string | null {
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
export function parseTimeValue(value: unknown): string | null {
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
