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
 * Tính số ngày nghỉ dựa trên ngày và giờ
 * Nếu có giờ từ-đến trong cùng 1 ngày, tính theo số giờ / 8 (1 ngày = 8 giờ làm việc)
 */
export function calculateLeaveDays(
  fromDate: string | null, 
  toDate: string | null, 
  fromTime?: string | null, 
  toTime?: string | null
): number {
  if (!fromDate) return 0
  
  // Nếu cùng ngày và có giờ từ-đến, tính theo giờ
  if (fromDate === toDate || !toDate) {
    if (fromTime && toTime) {
      const [fromH, fromM] = fromTime.split(":").map(Number)
      const [toH, toM] = toTime.split(":").map(Number)
      const fromMinutes = fromH * 60 + fromM
      const toMinutes = toH * 60 + toM
      const hours = (toMinutes - fromMinutes) / 60
      // 8 giờ = 1 ngày, làm tròn 0.5
      return Math.round((hours / 8) * 2) / 2
    }
    return 1
  }
  
  // Nhiều ngày
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
