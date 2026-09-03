import { DEFAULT_SATURDAY_CONFIG, isSaturdayOffForEmployee, type SaturdayDefaultConfig } from "./saturday-utils"

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
  companyHolidayDates: string[] = []
): boolean {
  const d = typeof date === "string" ? new Date(date + "T00:00:00Z") : date
  const day = d.getUTCDay()

  if (day === 0) return true

  const dateStr = typeof date === "string"
    ? date
    : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

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
