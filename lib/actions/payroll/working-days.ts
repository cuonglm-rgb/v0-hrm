"use server"

import { listHolidays } from "../overtime-actions"
import { isSaturdayOff } from "./working-days-utils"

// =============================================
// TÍNH CÔNG CHUẨN ĐỘNG THEO THÁNG
// =============================================

// Tính công chuẩn của một tháng
export async function calculateStandardWorkingDays(month: number, year: number): Promise<{
  totalDays: number
  sundays: number
  saturdaysOff: number
  holidays: number
  standardDays: number
}> {
  const holidays = await listHolidays(year)
  const holidayDates = new Set(holidays.map(h => h.holiday_date))

  const lastDay = new Date(Date.UTC(year, month, 0)).getDate()

  let sundays = 0
  let saturdaysOff = 0
  let holidayCount = 0

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(Date.UTC(year, month - 1, day))
    const dayOfWeek = date.getUTCDay()
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    if (dayOfWeek === 0) {
      sundays++
      continue
    }

    if (dayOfWeek === 6 && isSaturdayOff(date)) {
      saturdaysOff++
      continue
    }

    if (holidayDates.has(dateStr)) {
      holidayCount++
    }
  }

  const standardDays = lastDay - sundays - saturdaysOff - holidayCount

  return {
    totalDays: lastDay,
    sundays,
    saturdaysOff,
    holidays: holidayCount,
    standardDays,
  }
}
