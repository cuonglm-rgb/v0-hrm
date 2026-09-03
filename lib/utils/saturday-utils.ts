// =============================================
// SATURDAY UTILITIES
// =============================================
// Helper functions for Saturday work schedule

/** Chế độ thứ 7 mặc định của công ty */
export type SaturdayMode = "alternating" | "all_working" | "all_off"

export interface SaturdayDefaultConfig {
  /** alternating = xen kẽ 1 tuần làm / 1 tuần nghỉ; all_working = làm tất cả T7; all_off = nghỉ tất cả T7 */
  mode: SaturdayMode
  /** Một ngày thứ 7 bất kỳ dùng làm mốc (YYYY-MM-DD) */
  anchor_date: string
  /** Thứ 7 mốc là ngày LÀM VIỆC (true) hay NGHỈ (false) */
  anchor_is_working: boolean
  /**
   * Với nhân viên đã có lịch T7 riêng: các thứ 7 KHÔNG được phân công sẽ
   * là ngày nghỉ (true) hay vẫn theo lịch mặc định của công ty (false).
   */
  unassigned_saturday_is_off: boolean
}

/**
 * Mặc định giữ nguyên quy luật cũ: tuần chứa 6/1/2026 nghỉ thứ 7,
 * tức thứ 7 ngày 10/1/2026 là ngày NGHỈ.
 */
export const DEFAULT_SATURDAY_CONFIG: SaturdayDefaultConfig = {
  mode: "alternating",
  anchor_date: "2026-01-10",
  anchor_is_working: false,
  unassigned_saturday_is_off: false,
}

const MS_PER_DAY = 86400000

/**
 * Đưa một ngày về mốc UTC 00:00 theo đúng ngày lịch mà caller đang hiểu.
 * Với Date thì dùng getter local (giống toàn bộ code cũ), với string thì parse YYYY-MM-DD.
 */
function toCalendarUTC(date: Date | string): Date {
  if (typeof date === "string") {
    const [y, m, d] = date.slice(0, 10).split("-").map(Number)
    return new Date(Date.UTC(y, (m || 1) - 1, d || 1))
  }
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
}

/** Chuẩn hóa config đọc từ DB (jsonb), thiếu/sai field nào thì lấy giá trị mặc định */
export function normalizeSaturdayConfig(raw: unknown): SaturdayDefaultConfig {
  if (!raw || typeof raw !== "object") return DEFAULT_SATURDAY_CONFIG
  const v = raw as Record<string, unknown>

  const mode: SaturdayMode =
    v.mode === "all_working" || v.mode === "all_off" || v.mode === "alternating"
      ? v.mode
      : DEFAULT_SATURDAY_CONFIG.mode

  const anchorRaw = typeof v.anchor_date === "string" ? v.anchor_date.slice(0, 10) : ""
  const anchorValid = /^\d{4}-\d{2}-\d{2}$/.test(anchorRaw) && !Number.isNaN(toCalendarUTC(anchorRaw).getTime())

  return {
    mode,
    anchor_date: anchorValid ? anchorRaw : DEFAULT_SATURDAY_CONFIG.anchor_date,
    anchor_is_working:
      typeof v.anchor_is_working === "boolean" ? v.anchor_is_working : DEFAULT_SATURDAY_CONFIG.anchor_is_working,
    unassigned_saturday_is_off:
      typeof v.unassigned_saturday_is_off === "boolean"
        ? v.unassigned_saturday_is_off
        : DEFAULT_SATURDAY_CONFIG.unassigned_saturday_is_off,
  }
}

/**
 * Get all Saturdays in a given month
 */
export function getSaturdaysInMonth(year: number, month: number): string[] {
  const saturdays: string[] = []
  const lastDay = new Date(year, month, 0).getDate()

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month - 1, day)
    if (date.getDay() === 6) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      saturdays.push(dateStr)
    }
  }

  return saturdays
}

/**
 * Check if a date is Saturday
 */
export function isSaturday(date: Date | string): boolean {
  return toCalendarUTC(date).getUTCDay() === 6
}

/**
 * Get ISO week number
 */
export function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

/**
 * Thứ 7 này có nghỉ theo lịch mặc định của công ty không.
 *
 * Quy luật xen kẽ tính theo số tuần chênh lệch so với ngày mốc (không dùng
 * số tuần ISO, vì năm 53 tuần sẽ làm vỡ nhịp xen kẽ ở ranh giới năm).
 */
export function isSaturdayOffByDefault(
  date: Date | string,
  config: SaturdayDefaultConfig = DEFAULT_SATURDAY_CONFIG
): boolean {
  if (config.mode === "all_working") return false
  if (config.mode === "all_off") return true

  const anchor = toCalendarUTC(config.anchor_date)
  const target = toCalendarUTC(date)

  const diffDays = Math.round((target.getTime() - anchor.getTime()) / MS_PER_DAY)
  const weeks = Math.floor(diffDays / 7)
  const sameParityAsAnchor = ((weeks % 2) + 2) % 2 === 0

  // Cùng nhịp với tuần mốc → giống tuần mốc, khác nhịp → ngược lại
  return sameParityAsAnchor ? !config.anchor_is_working : config.anchor_is_working
}

/**
 * Thứ 7 `dateStr` có phải ngày nghỉ của nhân viên không (đã biết chắc là thứ 7).
 *
 * Thứ tự ưu tiên:
 *  1. Phân công riêng đúng ngày đó → theo `is_working`.
 *  2. `unassigned_saturday_is_off`: các thứ 7 chưa phân công là ngày nghỉ — nhưng CHỈ
 *     áp dụng trong tháng mà nhân viên thực sự có phân công. Phân công tháng 9 không
 *     được kéo theo tháng 8 thành ngày nghỉ.
 *  3. Lịch thứ 7 mặc định của công ty.
 *
 * `employeeSchedules` phải đã lọc theo đúng nhân viên đang xét.
 */
export function isSaturdayOffForEmployee(
  dateStr: string,
  employeeSchedules: { work_date: string; is_working: boolean }[],
  config: SaturdayDefaultConfig = DEFAULT_SATURDAY_CONFIG
): boolean {
  const schedule = employeeSchedules.find((s) => s.work_date === dateStr)
  if (schedule) return !schedule.is_working

  if (config.unassigned_saturday_is_off) {
    const month = dateStr.slice(0, 7)
    if (employeeSchedules.some((s) => s.work_date.slice(0, 7) === month)) return true
  }

  return isSaturdayOffByDefault(dateStr, config)
}

/** Danh sách n thứ 7 kế tiếp kể từ `from` (bao gồm cả `from` nếu đó là thứ 7) */
export function getUpcomingSaturdays(from: Date | string, count: number): string[] {
  const cur = toCalendarUTC(from)
  while (cur.getUTCDay() !== 6) cur.setUTCDate(cur.getUTCDate() + 1)

  const result: string[] = []
  for (let i = 0; i < count; i++) {
    result.push(
      `${cur.getUTCFullYear()}-${String(cur.getUTCMonth() + 1).padStart(2, "0")}-${String(cur.getUTCDate()).padStart(2, "0")}`
    )
    cur.setUTCDate(cur.getUTCDate() + 7)
  }
  return result
}
