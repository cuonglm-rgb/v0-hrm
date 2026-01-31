// =============================================
// WORKING DAYS UTILITIES (non-server)
// =============================================

// Tuần gốc để xác định quy luật thứ 7 xen kẽ
const REFERENCE_DATE = new Date(Date.UTC(2026, 0, 6)) // 6/1/2026
const REFERENCE_WEEK_IS_OFF = true // Tuần này nghỉ thứ 7

// Lấy số tuần ISO của một ngày
function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

// Kiểm tra thứ 7 có phải ngày nghỉ không (theo quy luật xen kẽ)
export function isSaturdayOff(date: Date): boolean {
  const refWeek = getISOWeekNumber(REFERENCE_DATE)
  const currentWeek = getISOWeekNumber(date)

  const refIsOdd = refWeek % 2 === 1
  const currentIsOdd = currentWeek % 2 === 1

  if (REFERENCE_WEEK_IS_OFF) {
    return refIsOdd === currentIsOdd
  } else {
    return refIsOdd !== currentIsOdd
  }
}
