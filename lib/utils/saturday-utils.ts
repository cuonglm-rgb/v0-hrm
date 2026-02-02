// =============================================
// SATURDAY UTILITIES
// =============================================
// Helper functions for Saturday work schedule

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
  const d = typeof date === 'string' ? new Date(date) : date
  return d.getDay() === 6
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
 * Check if Saturday is off according to default schedule (xen kẽ)
 * Reference: Week of 2026-01-06 is OFF week
 */
export function isSaturdayOffByDefault(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  
  // Reference date and week
  const REFERENCE_DATE = new Date(Date.UTC(2026, 0, 6)) // 6/1/2026
  const REFERENCE_WEEK_IS_OFF = true // This week is OFF

  const refWeek = getISOWeekNumber(REFERENCE_DATE)
  const currentWeek = getISOWeekNumber(d)

  const refIsOdd = refWeek % 2 === 1
  const currentIsOdd = currentWeek % 2 === 1

  if (REFERENCE_WEEK_IS_OFF) {
    return refIsOdd === currentIsOdd
  } else {
    return refIsOdd !== currentIsOdd
  }
}
