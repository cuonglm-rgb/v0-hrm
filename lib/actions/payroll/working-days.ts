"use server"

import { listHolidays } from "../overtime-actions"
import { isSaturdayOff } from "./working-days-utils"
import { getSaturdayDefaultConfig } from "../work-schedule-settings-actions"
import { isOffByCompanyDefault, type CompanyHolidayLike } from "@/lib/utils/makeup-utils"

// =============================================
// TÍNH CÔNG CHUẨN ĐỘNG THEO THÁNG
// =============================================

// Tính công chuẩn của một tháng
export async function calculateStandardWorkingDays(month: number, year: number): Promise<{
  totalDays: number
  sundays: number
  saturdaysOff: number
  holidays: number
  companyHolidays: number
  makeupWorkDays: number
  standardDays: number
}> {
  const holidays = await listHolidays(year)
  const holidayDates = new Set(holidays.map(h => h.holiday_date))
  const saturdayConfig = await getSaturdayDefaultConfig()

  // Lấy danh sách ngày nghỉ công ty
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const { data: specialDays } = await supabase
    .from("special_work_days")
    .select("work_date, is_company_holiday")
    .eq("is_company_holiday", true)
    .gte("work_date", `${year}-${String(month).padStart(2, '0')}-01`)
    .lte("work_date", `${year}-${String(month).padStart(2, '0')}-31`)

  const companyHolidayDates = new Set((specialDays || []).map(s => s.work_date))

  // Ngày làm bù toàn công ty rơi vào ngày nghỉ mặc định → +1 công chuẩn.
  // Ngày làm bù chỉ áp dụng cho một số nhân viên được cộng riêng qua getMakeupStandardAdjustment.
  const monthLastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const makeupDays = await listMakeupWorkDays(
    `${year}-${String(month).padStart(2, '0')}-01`,
    `${year}-${String(month).padStart(2, '0')}-${String(monthLastDay).padStart(2, '0')}`
  )
  const makeupWorkDays = makeupDays.filter(
    m => (m.assigned_employees || []).length === 0 && isOffByCompanyDefault(m.work_date, saturdayConfig)
  ).length

  const lastDay = new Date(Date.UTC(year, month, 0)).getDate()

  let sundays = 0
  let saturdaysOff = 0
  let holidayCount = 0
  let companyHolidayCount = 0

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(Date.UTC(year, month - 1, day))
    const dayOfWeek = date.getUTCDay()
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    if (dayOfWeek === 0) {
      sundays++
      continue
    }

    if (dayOfWeek === 6 && isSaturdayOff(date, saturdayConfig)) {
      saturdaysOff++
      continue
    }

    if (holidayDates.has(dateStr)) {
      holidayCount++
      continue
    }

    if (companyHolidayDates.has(dateStr)) {
      companyHolidayCount++
    }
  }

  // Không trừ ngày lễ và ngày nghỉ công ty nữa - được tính lương luôn
  const standardDays = lastDay - sundays - saturdaysOff + makeupWorkDays

  return {
    totalDays: lastDay,
    sundays,
    saturdaysOff,
    holidays: holidayCount,
    companyHolidays: companyHolidayCount,
    makeupWorkDays,
    standardDays,
  }
}

// Danh sách ngày làm bù (special_work_days.is_makeup_workday) trong khoảng ngày, kèm phạm vi nhân viên
export async function listMakeupWorkDays(startDate: string, endDate: string): Promise<CompanyHolidayLike[]> {
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const { data } = await supabase
    .from("special_work_days")
    .select("work_date, assigned_employees:special_work_day_employees(employee_id)")
    .eq("is_makeup_workday", true)
    .gte("work_date", startDate)
    .lte("work_date", endDate)

  return (data || []) as CompanyHolidayLike[]
}
