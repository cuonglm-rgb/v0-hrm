import { isSaturdayOffByDefault } from "./saturday-utils"

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

export function isEmployeeOffDay(
  date: Date | string,
  saturdaySchedules: { employee_id: string; work_date: string; is_working: boolean }[],
  employeeId: string,
  holidays: { holiday_date: string }[] = []
): boolean {
  const d = typeof date === "string" ? new Date(date + "T00:00:00Z") : date
  const day = d.getUTCDay()

  if (day === 0) return true

  const dateStr = typeof date === "string"
    ? date
    : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

  if (holidays.some(h => h.holiday_date === dateStr)) return true

  if (day === 6) {
    const empSchedules = saturdaySchedules.filter(s => s.employee_id === employeeId)
    const schedule = empSchedules.find(s => s.work_date === dateStr)

    if (schedule) return !schedule.is_working
    if (empSchedules.length > 0) return true

    return isSaturdayOffByDefault(d)
  }

  return false
}

export function isSameMonth(dateA: string, dateB: string): boolean {
  return dateA.slice(0, 7) === dateB.slice(0, 7)
}
