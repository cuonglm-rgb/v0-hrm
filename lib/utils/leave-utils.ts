import { differenceInMonths, differenceInYears, endOfYear, startOfYear, isBefore, getMonth, getDate, getYear, parseISO } from "date-fns"

/**
 * Calculates the total annual leave entitlement for a specific year.
 * 
 * Rules:
 * - Base: 14 days/year.
 * - Start counting from "official_date".
 * - If official_date day <= 15: Count from that month.
 * - If official_date day > 15: Count from next month.
 * - Year 1 (incomplete year): ceil(14/12 * working_months).
 * - Seniority: From 3rd FULL year (based on official_date), +1 day every 2 years, max 20 days total.
 * 
 * @param officialDateStr - The official start date (YYYY-MM-DD).
 * @param currentYear - The year to calculate for.
 * @returns Total leave days entitled for that year.
 */
export function calculateLeaveEntitlement(officialDateStr: string | null, currentYear: number = new Date().getFullYear()): number {
  if (!officialDateStr) return 0
  
  const officialDate = parseISO(officialDateStr)
  const joinYear = getYear(officialDate)
  
  if (currentYear < joinYear) return 0

  // 1. Calculate working months in the current year
  let workingMonths = 0
  
  if (currentYear === joinYear) {
    // Logic: If day <= 15, count this month. Else count from next month.
    const day = getDate(officialDate)
    const month = getMonth(officialDate) + 1 // 1-12
    const startMonth = day <= 15 ? month : month + 1
    
    // If startMonth > 12, it means they joined late Dec > 15th -> 0 months this year
    if (startMonth > 12) {
      workingMonths = 0
    } else {
      workingMonths = 12 - startMonth + 1
    }
  } else {
    workingMonths = 12
  }

  // 2. Base calculation (14 days per year)
  // Rule: 14/12 * working_months, round up (ceil)
  let baseDays = Math.ceil((14 / 12) * workingMonths)
  
  // 3. Seniority Bonus
  // Rule: From 3rd year (2 years + 1 day?), 1 day per 2 years. Max 20 days.
  // The example says: "2026 joined, 2026 (7), 2027 (14), 2028 (14), 2029 (15 - 3rd year)"
  // So Seniority = currentYear - joinYear.
  // If seniority >= 3: bonus = floor((seniority - 1) / 2) ? 
  // Example check:
  // 2029 - 2026 = 3. Bonus needs to be 1. (3-1)/2 = 1. Correct.
  // 2030 - 2026 = 4. Bonus needs to be 1. (4-1)/2 = 1.5 -> 1. Correct.
  // 2031 - 2026 = 5. Bonus needs to be 2. (5-1)/2 = 2. Correct.
  
  let seniorityBonus = 0
  const seniorityYears = currentYear - joinYear
  
  if (seniorityYears >= 3) {
    seniorityBonus = Math.floor((seniorityYears - 1) / 2)
  }
  
  let totalDays = baseDays + seniorityBonus
  
  // Cap at 20 days? "tối đa 20 ngày" usually means total entitlement or just the bonus part?
  // Assuming total entitlement max is 20 days is a common rule, OR base is fixed 14 and bonus adds up.
  // Usually standard is max 12+seniority. Here base is 14.
  // Let's assume the cap of 20 applies to the TOTAL.
  if (totalDays > 20) {
    totalDays = 20
  }

  return totalDays
}

/**
 * Calculates the available leave balance at a specific point in time, considering the "1 day/month for first 5 months" rule.
 * 
 * @param officialDateStr 
 * @param currentYear 
 * @param usedDays 
 * @returns 
 */
export function calculateAvailableBalance(
  officialDateStr: string | null, 
  usedDays: number, 
  targetDate: Date = new Date()
): { totalEntitlement: number, availableToUse: number, remaining: number, isRestricted: boolean } {
  const currentYear = getYear(targetDate)
  const totalEntitlement = calculateLeaveEntitlement(officialDateStr, currentYear)
  
  if (!officialDateStr) {
    return { totalEntitlement: 0, availableToUse: 0, remaining: 0, isRestricted: false }
  }

  const officialDate = parseISO(officialDateStr)
  
  // Check 5-month rule
  // Rule: "05 tháng đầu tiên kể từ khi chính thức mỗi tháng chỉ có 1 phép"
  // This implies that during the first 5 months, the ACCRUED leave is capped at 1 * months_passed.
  // After 5 months, the full annual entitlement becomes available (or pro-rated rest).
  
  const monthsSinceOfficial = differenceInMonths(targetDate, officialDate)
  
  let availableToUse = totalEntitlement
  let isRestricted = false

  // If within the first 6 months (covering the 5 month period roughly, let's be precise)
  // "05 tháng đầu tiên" -> Months 0, 1, 2, 3, 4. At month 5 (start of 6th month), restriction lifts?
  // Or is it a rolling accrual? "5 tháng đầu... mỗi tháng chỉ có 1 phép"
  // Let's interpret: Max available = (MonthIndex + 1) * 1 for the first 5 months.
  
  if (monthsSinceOfficial < 5 && monthsSinceOfficial >= 0) {
      isRestricted = true
      // Cap available leave to 1 day per month passed (inclusive of current month?)
      // Usually you earn leave at the END of the month.
      // But user demand "mỗi tháng chỉ có 1 phép". Let's assume 1 day becomes available at start or end.
      // Let's be generous: 1 day per month started.
      const accrued = monthsSinceOfficial + 1 
      // If total entitlement for the year is LESS than accrual (e.g. joined late Dec), cap it.
      availableToUse = Math.min(accrued, totalEntitlement)
  }

  const remaining = Math.max(0, availableToUse - usedDays)
  
  return {
    totalEntitlement,
    availableToUse,
    remaining,
    isRestricted
  }
}
