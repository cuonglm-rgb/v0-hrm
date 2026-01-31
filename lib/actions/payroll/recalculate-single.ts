"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { PayrollAdjustmentType } from "@/lib/types/database"
import { calculateOvertimePay } from "../overtime-actions"
import { getEmployeeKPI } from "../kpi-actions"
import { toDateStringVN } from "@/lib/utils/date-utils"
import { calculateStandardWorkingDays } from "./working-days"
import { getEmployeeViolations } from "./violations"
import { processAdjustments } from "./generate-payroll"
import type { ShiftInfo } from "./types"

// =============================================
// RECALCULATE SINGLE EMPLOYEE
// =============================================

export async function recalculateSingleEmployee(payroll_item_id: string) {
  const supabase = await createClient()

  const { data: item } = await supabase
    .from("payroll_items")
    .select(`
      *,
      employee:employees(id, full_name, employee_code, shift_id, official_date, join_date),
      payroll_run:payroll_runs(id, month, year, status)
    `)
    .eq("id", payroll_item_id)
    .single()

  if (!item) {
    return { success: false, error: "Không tìm thấy bản ghi lương" }
  }

  const run = item.payroll_run as any
  if (run.status !== "draft" && run.status !== "review") {
    return { success: false, error: "Chỉ có thể tính lại bảng lương ở trạng thái Nháp hoặc Đang xem xét" }
  }

  const emp = item.employee as any
  const month = run.month
  const year = run.year

  // Xóa adjustment details cũ
  await supabase
    .from("payroll_adjustment_details")
    .delete()
    .eq("payroll_item_id", payroll_item_id)

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`

  const workingDaysInfo = await calculateStandardWorkingDays(month, year)
  const STANDARD_WORKING_DAYS = workingDaysInfo.standardDays

  const { data: salary } = await supabase
    .from("salary_structure")
    .select("*")
    .eq("employee_id", emp.id)
    .lte("effective_date", endDate)
    .order("effective_date", { ascending: false })
    .limit(1)
    .maybeSingle()

  const baseSalary = salary?.base_salary || 0
  const dailySalary = baseSalary / STANDARD_WORKING_DAYS

  const { data: shifts } = await supabase.from("work_shifts").select("*")
  const shiftMap = new Map((shifts || []).map((s: any) => [s.id, s]))

  const { data: adjustmentTypes } = await supabase
    .from("payroll_adjustment_types")
    .select("*")
    .eq("is_active", true)

  // Query attendance logs - giống hệt generate-payroll.ts
  const { data: allAttendanceLogs } = await supabase
    .from("attendance_logs")
    .select("check_in, check_out")
    .eq("employee_id", emp.id)
    .or(`and(check_in.gte.${startDate},check_in.lte.${endDate}T23:59:59),and(check_in.is.null,check_out.gte.${startDate},check_out.lte.${endDate}T23:59:59)`)

  const { data: overtimeRequestDates } = await supabase
    .from("employee_requests")
    .select(`request_date, from_time, to_time, request_type:request_types!request_type_id(code)`)
    .eq("employee_id", emp.id)
    .eq("status", "approved")
    .gte("request_date", startDate)
    .lte("request_date", endDate)

  const empShift = emp.shift_id ? shiftMap.get(emp.shift_id) : null
  const shiftStart = empShift?.start_time?.slice(0, 5) || "08:00"
  const shiftEnd = empShift?.end_time?.slice(0, 5) || "17:00"
  const breakStart = empShift?.break_start?.slice(0, 5) || "12:00"
  const breakEnd = empShift?.break_end?.slice(0, 5) || "13:30"

  const parseTime = (t: string) => {
    const [h, m] = t.split(":").map(Number)
    return h * 60 + (m || 0)
  }

  const shiftStartMin = parseTime(shiftStart)
  const shiftEndMin = parseTime(shiftEnd)
  const breakStartMin = parseTime(breakStart)
  const breakEndMin = parseTime(breakEnd)

  const overtimeDates = new Set<string>()
  const overtimeWithinShift = new Set<string>()

  if (overtimeRequestDates) {
    for (const req of overtimeRequestDates) {
      const reqType = req.request_type as any
      if (reqType?.code !== "overtime") continue

      const date = req.request_date
      if (!req.from_time || !req.to_time) {
        overtimeDates.add(date)
        continue
      }

      const fromMin = parseTime(req.from_time)
      const toMin = parseTime(req.to_time)
      const isBeforeShift = toMin <= shiftStartMin
      const isAfterShift = fromMin >= shiftEndMin
      const isDuringBreak = fromMin >= breakStartMin && toMin <= breakEndMin

      if (isBeforeShift || isAfterShift || isDuringBreak) {
        overtimeWithinShift.add(date)
      } else {
        overtimeDates.add(date)
      }
    }
  }

  // Đếm ngày công - giống hệt generate-payroll.ts
  let workingDaysCount = 0
  const countedDates = new Set<string>()
  if (allAttendanceLogs) {
    for (const log of allAttendanceLogs) {
      const logDate = log.check_in ? toDateStringVN(log.check_in) : toDateStringVN(log.check_out)
      if (!overtimeDates.has(logDate) && !countedDates.has(logDate)) {
        workingDaysCount++
        countedDates.add(logDate)
      }
    }
  }

  // Process leave requests
  const { data: employeeRequests } = await supabase
    .from("employee_requests")
    .select(`
      *,
      request_type:request_types!request_type_id(
        code, name, affects_payroll, deduct_leave_balance,
        requires_date_range, requires_single_date
      )
    `)
    .eq("employee_id", emp.id)
    .eq("status", "approved")
    .or(`and(request_date.gte.${startDate},request_date.lte.${endDate}),and(from_date.lte.${endDate},to_date.gte.${startDate})`)

  let paidLeaveDays = 0
  let unpaidLeaveDays = 0
  let workFromHomeDays = 0

  const calculateDayFraction = (fromTime: string | null, toTime: string | null): number => {
    if (!fromTime || !toTime) return 1

    const parseTimeToMin = (t: string) => {
      const [h, m] = t.split(":").map(Number)
      return h * 60 + (m || 0)
    }

    const fromMinutes = parseTimeToMin(fromTime)
    const toMinutes = parseTimeToMin(toTime)
    const shiftStartMin = parseTimeToMin(shiftStart)
    const shiftEndMin = parseTimeToMin(shiftEnd)
    const breakStartMin = parseTimeToMin(breakStart)
    const breakEndMin = parseTimeToMin(breakEnd)

    const morningHours = (breakStartMin - shiftStartMin) / 60
    const afternoonHours = (shiftEndMin - breakEndMin) / 60
    const totalWorkHours = morningHours + afternoonHours

    let leaveHours = (toMinutes - fromMinutes) / 60
    if (leaveHours <= 0) leaveHours = totalWorkHours

    if (fromMinutes <= shiftStartMin + 30 && toMinutes >= breakStartMin - 30 && toMinutes <= breakEndMin + 30) {
      return 0.5
    }
    if (fromMinutes >= breakStartMin - 30 && fromMinutes <= breakEndMin + 30 && toMinutes >= shiftEndMin - 30) {
      return 0.5
    }
    if (leaveHours <= totalWorkHours / 2 + 0.5) {
      return 0.5
    }
    return 1
  }

  if (employeeRequests) {
    for (const request of employeeRequests) {
      const reqType = request.request_type as any
      if (!reqType) continue

      const code = reqType.code
      const affectsPayroll = reqType.affects_payroll === true

      if (code === "overtime") continue
      if (!affectsPayroll && code !== "unpaid_leave") continue

      let days = 0
      if (reqType.requires_date_range && request.from_date && request.to_date) {
        const parseDate = (dateStr: string) => {
          const [y, m, d] = dateStr.split('-').map(Number)
          return new Date(Date.UTC(y, m - 1, d))
        }
        const reqFromDate = parseDate(request.from_date)
        const reqToDate = parseDate(request.to_date)
        const periodStart = parseDate(startDate)
        const periodEnd = parseDate(endDate)
        const reqStart = new Date(Math.max(reqFromDate.getTime(), periodStart.getTime()))
        const reqEnd = new Date(Math.min(reqToDate.getTime(), periodEnd.getTime()))
        const diffTime = reqEnd.getTime() - reqStart.getTime()
        const fullDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
        
        if (fullDays === 1 && request.from_time && request.to_time) {
          days = calculateDayFraction(request.from_time, request.to_time)
        } else {
          days = fullDays
        }
      } else if (reqType.requires_single_date && request.request_date) {
        days = calculateDayFraction(request.from_time, request.to_time)
      } else if (request.from_date && request.to_date) {
        const parseDate = (dateStr: string) => {
          const [y, m, d] = dateStr.split('-').map(Number)
          return new Date(Date.UTC(y, m - 1, d))
        }
        const reqFromDate = parseDate(request.from_date)
        const reqToDate = parseDate(request.to_date)
        const periodStart = parseDate(startDate)
        const periodEnd = parseDate(endDate)
        const reqStart = new Date(Math.max(reqFromDate.getTime(), periodStart.getTime()))
        const reqEnd = new Date(Math.min(reqToDate.getTime(), periodEnd.getTime()))
        const diffTime = reqEnd.getTime() - reqStart.getTime()
        const fullDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
        
        if (fullDays === 1 && request.from_time && request.to_time) {
          days = calculateDayFraction(request.from_time, request.to_time)
        } else {
          days = fullDays
        }
      }

      if (days <= 0) continue

      if (code === "unpaid_leave") {
        unpaidLeaveDays += days
      } else if (code === "work_from_home" && affectsPayroll) {
        workFromHomeDays += days
      } else if (affectsPayroll) {
        paidLeaveDays += days
      }
    }
  }

  // Get violations
  const shiftInfo: ShiftInfo = {
    startTime: shiftStart,
    endTime: shiftEnd,
    breakStart: breakStart || null,
    breakEnd: breakEnd || null,
  }
  const violations = await getEmployeeViolations(supabase, emp.id, startDate, endDate, shiftInfo)
  const violationsWithoutOT = violations.filter((v) => !overtimeDates.has(v.date))

  const absentDays = violationsWithoutOT.filter((v) => v.isAbsent).length
  const halfDays = violationsWithoutOT.filter((v) => v.isHalfDay && !v.isAbsent).length
  const actualAttendanceDays = workingDaysCount - (halfDays * 0.5)
  const lateCount = violationsWithoutOT.filter((v) => v.lateMinutes > 0 && !v.isHalfDay).length

  // Tính ngày đủ giờ cho phụ cấp - giống hệt generate-payroll.ts
  const fullAttendanceDays = violationsWithoutOT.filter((v) => 
    v.hasCheckIn && v.hasCheckOut && !v.isHalfDay && !v.isAbsent &&
    v.lateMinutes === 0 && v.earlyMinutes === 0
  ).length

  const { data: empAdjustments } = await supabase
    .from("employee_adjustments")
    .select("*, adjustment_type:payroll_adjustment_types(*)")
    .eq("employee_id", emp.id)
    .lte("effective_date", endDate)
    .or(`end_date.is.null,end_date.gte.${startDate}`)

  // Process adjustments - sử dụng hàm chung từ generate-payroll.ts
  const adjustmentResult = await processAdjustments(
    supabase, emp, baseSalary, dailySalary, month, year,
    adjustmentTypes, empAdjustments, violationsWithoutOT,
    fullAttendanceDays, lateCount, unpaidLeaveDays, absentDays,
    allAttendanceLogs || [], startDate, endDate
  )

  const { totalAllowances, totalDeductions, totalPenalties, details: adjustmentDetails } = adjustmentResult

  // OT
  const otResult = await calculateOvertimePay(emp.id, baseSalary, STANDARD_WORKING_DAYS, startDate, endDate)
  const otAdjustmentType = adjustmentTypes?.find((t: any) => t.code === 'overtime')
  if (otAdjustmentType && otResult.details.length > 0) {
    for (const otDetail of otResult.details) {
      adjustmentDetails.push({
        adjustment_type_id: otAdjustmentType.id,
        category: 'allowance',
        base_amount: otDetail.amount,
        adjusted_amount: 0,
        final_amount: otDetail.amount,
        reason: `${otDetail.otType} (${otDetail.hours}h x ${otDetail.multiplier}) ngày ${otDetail.date}`,
        occurrence_count: otDetail.hours,
      })
    }
  }

  // KPI
  let kpiBonus = 0
  const kpiEvaluation = await getEmployeeKPI(emp.id, month, year)
  if (kpiEvaluation && kpiEvaluation.status === "achieved" && kpiEvaluation.final_bonus > 0) {
    kpiBonus = kpiEvaluation.final_bonus
    const kpiAdjustmentType = (adjustmentTypes as PayrollAdjustmentType[] | null)?.find(t => t.code === "KPI_BONUS")
    if (kpiAdjustmentType) {
      adjustmentDetails.push({
        adjustment_type_id: kpiAdjustmentType.id,
        category: 'allowance',
        base_amount: kpiBonus,
        adjusted_amount: 0,
        final_amount: kpiBonus,
        reason: kpiEvaluation.bonus_type === 'percentage' 
          ? `Thưởng KPI (${kpiEvaluation.bonus_percentage}% lương)`
          : 'Thưởng KPI',
        occurrence_count: 1,
      })
    }
  }

  // Final calculation
  const actualWorkingDays = actualAttendanceDays + workFromHomeDays
  const grossSalary = dailySalary * (actualWorkingDays + paidLeaveDays) + totalAllowances + otResult.totalOTPay + kpiBonus
  const totalDeduction = totalDeductions + totalPenalties
  const netSalary = grossSalary - totalDeduction

  await supabase
    .from("payroll_items")
    .update({
      working_days: actualWorkingDays,
      leave_days: paidLeaveDays,
      unpaid_leave_days: unpaidLeaveDays + absentDays,
      base_salary: baseSalary,
      allowances: totalAllowances + otResult.totalOTPay + kpiBonus,
      total_income: grossSalary,
      total_deduction: totalDeduction,
      net_salary: netSalary,
      standard_working_days: STANDARD_WORKING_DAYS,
    })
    .eq("id", payroll_item_id)

  if (adjustmentDetails.length > 0) {
    const detailsWithItemId = adjustmentDetails.map((d) => ({
      ...d,
      payroll_item_id: payroll_item_id,
    }))
    await supabase.from("payroll_adjustment_details").insert(detailsWithItemId)
  }

  revalidatePath("/dashboard/payroll")
  return { success: true, message: `Đã tính lại lương cho ${emp.full_name}` }
}
