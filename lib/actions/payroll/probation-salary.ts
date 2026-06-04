import { isSaturdayOff } from "./working-days-utils"

// Đếm ngày làm việc theo lịch (trừ CN, T7 nghỉ — KHÔNG trừ ngày lễ/nghỉ công ty)
// Quy tắc giống calculateStandardWorkingDays để mẫu số khớp.
function countCalendarWorkingDays(startDate: string, endDate: string): number {
  if (startDate > endDate) return 0
  const [sy, sm, sd] = startDate.split("-").map(Number)
  const [ey, em, ed] = endDate.split("-").map(Number)
  const start = new Date(Date.UTC(sy, sm - 1, sd))
  const end = new Date(Date.UTC(ey, em - 1, ed))
  let count = 0
  const cur = new Date(start)
  while (cur <= end) {
    const dow = cur.getUTCDay()
    if (dow !== 0 && !(dow === 6 && isSaturdayOff(cur))) {
      count++
    }
    cur.setUTCDate(cur.getUTCDate() + 1)
  }
  return count
}

function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + n)
  const yy = dt.getUTCFullYear()
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(dt.getUTCDate()).padStart(2, "0")
  return `${yy}-${mm}-${dd}`
}

export interface ProbationSplit {
  probationPaidDays: number
  officialPaidDays: number
  probationRatio: number
  probationDiscount: number
  probationCalendarDays: number
  officialCalendarDays: number
}

/**
 * Pro-rate paid days theo official_date.
 * - Nếu officialDate null hoặc > effectiveEndDate: toàn kỳ là thử việc.
 * - Nếu officialDate <= effectiveStartDate: toàn kỳ là chính thức.
 * - Ngược lại: chia theo tỉ lệ số ngày làm việc theo lịch.
 *
 * probationDiscount = dailySalary * probationPaidDays * (1 - probationRate)
 */
export function calculateProbationSplit(args: {
  effectiveStartDate: string
  effectiveEndDate: string
  officialDate: string | null
  totalPaidDays: number
  dailySalary: number
  probationRate: number
}): ProbationSplit {
  const { effectiveStartDate, effectiveEndDate, officialDate, totalPaidDays, dailySalary, probationRate } = args

  let probationRatio: number
  let probationCalendarDays = 0
  let officialCalendarDays = 0

  if (!officialDate || officialDate > effectiveEndDate) {
    probationRatio = 1
    probationCalendarDays = countCalendarWorkingDays(effectiveStartDate, effectiveEndDate)
  } else if (officialDate <= effectiveStartDate) {
    probationRatio = 0
    officialCalendarDays = countCalendarWorkingDays(effectiveStartDate, effectiveEndDate)
  } else {
    const dayBeforeOfficial = addDays(officialDate, -1)
    probationCalendarDays = countCalendarWorkingDays(effectiveStartDate, dayBeforeOfficial)
    officialCalendarDays = countCalendarWorkingDays(officialDate, effectiveEndDate)
    const total = probationCalendarDays + officialCalendarDays
    probationRatio = total > 0 ? probationCalendarDays / total : 0
  }

  const probationPaidDays = totalPaidDays * probationRatio
  const officialPaidDays = totalPaidDays - probationPaidDays
  const probationDiscount = dailySalary * probationPaidDays * (1 - probationRate)

  return {
    probationPaidDays,
    officialPaidDays,
    probationRatio,
    probationDiscount,
    probationCalendarDays,
    officialCalendarDays,
  }
}
