// Múi giờ Việt Nam: UTC+7
const VN_TIMEZONE = "Asia/Ho_Chi_Minh"

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
 * Lấy giờ hiện tại theo múi giờ Việt Nam
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
 * Lấy ngày hôm nay theo định dạng YYYY-MM-DD (theo múi giờ VN)
 */
export function getTodayVN(): string {
  const now = new Date()
  const vnDate = new Date(now.toLocaleString("en-US", { timeZone: VN_TIMEZONE }))
  return vnDate.toISOString().split("T")[0]
}

/**
 * Tính số ngày giữa 2 ngày
 */
export function calculateDays(from: string, to: string): number {
  const fromDate = new Date(from)
  const toDate = new Date(to)
  return Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
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
    if (config?.requires_time_range && fromTime && toTime) {
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
  const from = new Date(fromDate)
  const to = new Date(toDate)
  return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1
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
