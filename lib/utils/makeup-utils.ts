import { DEFAULT_SATURDAY_CONFIG, isSaturdayOffByDefault, isSaturdayOffForEmployee, type SaturdayDefaultConfig } from "./saturday-utils"

export const MAKEUP_CODES = ["late_early_makeup", "full_day_makeup"] as const
export type MakeupCode = typeof MAKEUP_CODES[number]
export const LINKED_DEFICIT_DATE_KEY = "linked_deficit_date"
export const LINKED_DEFICIT_LINKS_KEY = "linked_deficit_links"

export type MakeupDeficitLink = { deficit_date: string; amount: number }

/** Chuẩn hóa đọc deficit links từ custom_data: linked_deficit_links hoặc fallback linked_deficit_date (1 link amount 1). */
export function getMakeupDeficitLinks(customData: Record<string, unknown> | null | undefined): MakeupDeficitLink[] {
  if (!customData) return []
  const links = customData[LINKED_DEFICIT_LINKS_KEY] as MakeupDeficitLink[] | undefined
  if (Array.isArray(links) && links.length > 0) return links
  const single = customData[LINKED_DEFICIT_DATE_KEY] as string | undefined
  if (single) return [{ deficit_date: single, amount: 1 }]
  return []
}

export function isMakeupRequestType(code: string): code is MakeupCode {
  return MAKEUP_CODES.includes(code as MakeupCode)
}

export interface MakeupRequestLike {
  employee_id: string
  status: string
  request_date: string | null
  custom_data?: Record<string, unknown> | null
  request_type?: { code?: string | null; name?: string | null } | null
}

/**
 * Tìm phiếu làm bù (đi muộn/về sớm) đã duyệt bù cho NGÀY THIẾU CÔNG `date`.
 * request_date của phiếu là ngày ĐI LÀM BÙ, còn ngày thiếu công gốc nằm trong
 * custom_data — cùng cách hiểu với deficitDateToMakeupDate ở generate-payroll.ts.
 */
export function findLateEarlyMakeupForDeficitDate<T extends MakeupRequestLike>(
  date: string,
  employeeId: string | undefined,
  requests: T[]
): T | null {
  if (!employeeId) return null
  const req = requests.find(
    (r) =>
      r.employee_id === employeeId &&
      r.status === "approved" &&
      r.request_type?.code === "late_early_makeup" &&
      r.request_date !== date &&
      getMakeupDeficitLinks(r.custom_data).some((link) => link.deficit_date === date)
  )
  return req || null
}

/** Ngày nghỉ công ty (special_work_days.is_company_holiday) kèm danh sách nhân viên được áp dụng. */
export type CompanyHolidayLike = {
  work_date: string
  assigned_employees?: { employee_id: string }[] | null
}

/**
 * Lọc ngày nghỉ công ty áp dụng cho 1 nhân viên.
 * Quy tắc (giống generate-payroll.ts): không có assigned_employees -> áp dụng toàn công ty;
 * có danh sách -> chỉ áp dụng cho nhân viên nằm trong danh sách.
 */
export function getCompanyHolidayDatesForEmployee(
  specialDays: CompanyHolidayLike[] | null | undefined,
  employeeId: string
): string[] {
  const dates: string[] = []
  for (const s of specialDays || []) {
    const assigned = s.assigned_employees || []
    if (assigned.length === 0 || assigned.some((ae) => ae.employee_id === employeeId)) {
      dates.push(s.work_date)
    }
  }
  return dates
}

export function isEmployeeOffDay(
  date: Date | string,
  saturdaySchedules: { employee_id: string; work_date: string; is_working: boolean }[],
  employeeId: string,
  holidays: { holiday_date: string }[] = [],
  config: SaturdayDefaultConfig = DEFAULT_SATURDAY_CONFIG,
  companyHolidayDates: string[] = [],
  makeupWorkDates: string[] = []
): boolean {
  const d = typeof date === "string" ? new Date(date + "T00:00:00Z") : date
  const day = d.getUTCDay()

  const dateStr = typeof date === "string"
    ? date
    : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

  // Ngày làm bù của công ty (special_work_days.is_makeup_workday) là ngày làm việc, kể cả CN/T7
  if (makeupWorkDates.includes(dateStr)) return false

  if (day === 0) return true

  if (holidays.some(h => h.holiday_date === dateStr)) return true

  // Ngày nghỉ công ty (special_work_days.is_company_holiday) cũng là ngày nghỉ của nhân viên
  if (companyHolidayDates.includes(dateStr)) return true

  if (day === 6) {
    const empSchedules = saturdaySchedules.filter(s => s.employee_id === employeeId)
    return isSaturdayOffForEmployee(dateStr, empSchedules, config)
  }

  return false
}

export function isSameMonth(dateA: string, dateB: string): boolean {
  return dateA.slice(0, 7) === dateB.slice(0, 7)
}

/**
 * Ngày đó vốn là ngày nghỉ theo lịch mặc định công ty (CN hoặc T7 nghỉ) —
 * điều kiện để một ngày được chọn làm ngày làm bù.
 */
export function isOffByCompanyDefault(
  dateStr: string,
  config: SaturdayDefaultConfig = DEFAULT_SATURDAY_CONFIG
): boolean {
  const day = new Date(dateStr + "T00:00:00Z").getUTCDay()
  if (day === 0) return true
  if (day === 6) return isSaturdayOffByDefault(dateStr, config)
  return false
}

/**
 * Điều chỉnh công chuẩn riêng của 1 nhân viên do ngày làm bù trong tháng.
 *
 * calculateStandardWorkingDays đã +1 cho mỗi ngày làm bù TOÀN CÔNG TY (rơi vào ngày nghỉ mặc định).
 * Ở đây bù phần chênh theo từng nhân viên:
 *  - Ngày làm bù chỉ áp dụng cho nhân viên được chọn → +1 với người được chọn.
 *  - T7 làm bù mà nhân viên vốn đã được phân công làm (saturday_work_schedule.is_working) →
 *    với họ đó đã là ngày làm sẵn, không cộng công chuẩn (toàn công ty: −1, riêng: 0).
 *
 * `employeeSatSchedules` phải đã lọc theo đúng nhân viên đang xét.
 */
export function getMakeupStandardAdjustment(
  makeupDays: CompanyHolidayLike[] | null | undefined,
  employeeId: string,
  employeeSatSchedules: { work_date: string; is_working: boolean }[],
  config: SaturdayDefaultConfig = DEFAULT_SATURDAY_CONFIG
): number {
  let adjustment = 0
  for (const m of makeupDays || []) {
    if (!isOffByCompanyDefault(m.work_date, config)) continue
    const assigned = m.assigned_employees || []
    const isCompanyWide = assigned.length === 0
    if (!isCompanyWide && !assigned.some((ae) => ae.employee_id === employeeId)) continue

    const alreadyWorking = employeeSatSchedules.some((s) => s.work_date === m.work_date && s.is_working)
    if (isCompanyWide && alreadyWorking) adjustment--
    else if (!isCompanyWide && !alreadyWorking) adjustment++
  }
  return adjustment
}
