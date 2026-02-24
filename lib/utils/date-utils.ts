// Múi giờ Việt Nam: UTC+7
export const VN_TIMEZONE = "Asia/Ho_Chi_Minh"
export const VN_OFFSET_HOURS = 7

/**
 * Chuyển đổi Date sang giờ Việt Nam và trả về các thành phần
 * Sử dụng Intl.DateTimeFormat để đảm bảo chính xác trên mọi server
 */
export function getVNDateParts(date: Date = new Date()): {
  year: number
  month: number
  day: number
  hours: number
  minutes: number
  seconds: number
} {
  // Sử dụng Intl.DateTimeFormat để lấy các thành phần theo timezone VN
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: VN_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
  
  const parts = formatter.formatToParts(date)
  const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || "0", 10)
  
  return {
    year: getPart("year"),
    month: getPart("month"),
    day: getPart("day"),
    hours: getPart("hour"),
    minutes: getPart("minute"),
    seconds: getPart("second"),
  }
}

/**
 * Lấy ngày hôm nay theo định dạng YYYY-MM-DD (theo múi giờ VN)
 * SỬ DỤNG HÀM NÀY THAY CHO new Date().toISOString().split("T")[0]
 */
export function getTodayVN(): string {
  const { year, month, day } = getVNDateParts()
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

/**
 * Lấy ngày cuối tháng theo định dạng YYYY-MM-DD
 * SỬ DỤNG HÀM NÀY THAY CHO new Date(year, month, 0).toISOString().split("T")[0]
 */
export function getLastDayOfMonthVN(year: number, month: number): string {
  // Tạo ngày đầu tháng tiếp theo rồi trừ 1 ngày
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`
}

/**
 * Chuyển đổi timestamp (ISO string hoặc Date) sang ngày YYYY-MM-DD theo giờ VN
 * SỬ DỤNG HÀM NÀY THAY CHO new Date(timestamp).toISOString().split("T")[0]
 */
export function toDateStringVN(timestamp: string | Date): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
  const { year, month, day } = getVNDateParts(date)
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

/**
 * Lấy giờ và phút từ timestamp theo giờ VN
 * SỬ DỤNG HÀM NÀY THAY CHO date.getHours() và date.getMinutes()
 */
export function getTimePartsVN(timestamp: string | Date): { hours: number; minutes: number } {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
  const { hours, minutes } = getVNDateParts(date)
  return { hours, minutes }
}

/**
 * Tạo ISO timestamp với timezone VN (+07:00)
 * Dùng khi cần lưu vào database với timezone rõ ràng
 */
export function createVNTimestamp(dateStr: string, timeStr: string): string {
  return `${dateStr}T${timeStr}:00+07:00`
}

/**
 * Lấy timestamp hiện tại theo giờ VN dạng ISO string
 */
export function getNowVN(): string {
  const { year, month, day, hours, minutes, seconds } = getVNDateParts()
  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  return `${dateStr}T${timeStr}+07:00`
}

/**
 * Format date theo định dạng Việt Nam (dd/MM/yyyy)
 */
export function formatDateVN(dateStr: string | null | undefined): string {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    timeZone: VN_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

/**
 * Format time theo định dạng Việt Nam (HH:mm)
 */
export function formatTimeVN(dateStr: string | null | undefined): string {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleTimeString("vi-VN", {
    timeZone: VN_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Format datetime đầy đủ theo định dạng Việt Nam
 */
export function formatDateTimeVN(dateStr: string | null | undefined): string {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleString("vi-VN", {
    timeZone: VN_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Lấy giờ hiện tại theo múi giờ Việt Nam (cho client-side)
 * @deprecated Sử dụng getVNDateParts() cho server-side
 */
export function getCurrentTimeVN(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: VN_TIMEZONE }))
}

/**
 * Format giờ hiện tại với giây
 */
export function formatCurrentTimeVN(date: Date): string {
  return date.toLocaleTimeString("vi-VN", {
    timeZone: VN_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

/**
 * Tính số ngày giữa 2 ngày (sử dụng UTC để tránh timezone issues)
 */
export function calculateDays(from: string, to: string): number {
  // Parse dates as UTC to avoid timezone issues
  const [fromY, fromM, fromD] = from.split("-").map(Number)
  const [toY, toM, toD] = to.split("-").map(Number)
  const fromDate = Date.UTC(fromY, fromM - 1, fromD)
  const toDate = Date.UTC(toY, toM - 1, toD)
  return Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1
}

/**
 * Tính số ngày nghỉ dựa trên ngày, giờ và cấu hình loại phiếu
 * @param fromDate - Ngày bắt đầu
 * @param toDate - Ngày kết thúc (có thể null nếu chỉ cần 1 ngày)
 * @param fromTime - Giờ bắt đầu (optional)
 * @param toTime - Giờ kết thúc (optional)
 * @param config - Cấu hình loại phiếu
 */
export function calculateLeaveDays(
  fromDate: string | null, 
  toDate: string | null, 
  fromTime?: string | null, 
  toTime?: string | null,
  config?: {
    requires_date_range?: boolean
    requires_single_date?: boolean
    requires_time_range?: boolean
  }
): number {
  if (!fromDate) return 0
  
  // Nếu cấu hình chỉ cần 1 ngày -> luôn trả về 1
  if (config?.requires_single_date && !config?.requires_date_range) {
    return 1
  }
  
  // Nếu không có toDate hoặc cùng ngày
  if (!toDate || fromDate === toDate) {
    // Nếu có time range, tính theo giờ (nghỉ nửa ngày)
    // Cho phép tính theo giờ khi có fromTime/toTime, kể cả khi không truyền config
    if (fromTime && toTime) {
      const [fromH, fromM] = fromTime.split(":").map(Number)
      const [toH, toM] = toTime.split(":").map(Number)
      const fromMinutes = fromH * 60 + (fromM || 0)
      const toMinutes = toH * 60 + (toM || 0)
      const hours = (toMinutes - fromMinutes) / 60
      
      // Nếu >= 8 giờ hoặc gần cả ngày (>= 7 giờ) -> 1 ngày
      if (hours >= 7) {
        return 1
      }
      
      // Tính theo công thức: số giờ / 8, làm tròn 0.5
      if (hours > 0) {
        return Math.round((hours / 8) * 2) / 2
      }
    }
    return 1
  }
  
  // Nhiều ngày: tính số ngày từ fromDate đến toDate (bao gồm cả 2 ngày)
  return calculateDays(fromDate, toDate)
}

/**
 * Format nguồn chấm công sang tiếng Việt
 */
export function formatSourceVN(source: string | null | undefined): string {
  const sources: Record<string, string> = {
    manual: "Thủ công",
    fingerprint: "Vân tay",
    face: "Khuôn mặt",
    qr: "Mã QR",
    web: "Web",
    import: "Import",
  }
  return sources[source || "manual"] || source || "Thủ công"
}

/**
 * Lấy ngày hôm nay theo định dạng YYYY-MM-DD cho client-side
 * Sử dụng cho các form input trên browser
 */
export function getTodayForInput(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
