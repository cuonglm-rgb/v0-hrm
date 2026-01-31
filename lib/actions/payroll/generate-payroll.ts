"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { PayrollAdjustmentType, AdjustmentAutoRules } from "@/lib/types/database"
import { calculateOvertimePay } from "../overtime-actions"
import { getEmployeeKPI } from "../kpi-actions"
import { toDateStringVN } from "@/lib/utils/date-utils"
import { calculateLeaveEntitlement } from "@/lib/utils/leave-utils"
import { calculateLeaveDays } from "@/lib/utils/date-utils"
import { calculateStandardWorkingDays } from "./working-days"
import { getEmployeeViolations } from "./violations"
import type { ShiftInfo } from "./types"

// =============================================
// GENERATE PAYROLL
// =============================================

export async function generatePayroll(month: number, year: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Chưa đăng nhập" }

  // Kiểm tra đã có payroll run chưa
  const { data: existingRun } = await supabase
    .from("payroll_runs")
    .select("id, status")
    .eq("month", month)
    .eq("year", year)
    .single()

  if (existingRun) {
    if (existingRun.status !== "draft" && existingRun.status !== "review") {
      return { success: false, error: "Bảng lương tháng này đã khóa, không thể tạo lại" }
    }
    await supabase.from("payroll_adjustment_details").delete().in(
      "payroll_item_id",
      (await supabase.from("payroll_items").select("id").eq("payroll_run_id", existingRun.id)).data?.map((i: any) => i.id) || []
    )
    await supabase.from("payroll_items").delete().eq("payroll_run_id", existingRun.id)
    await supabase.from("payroll_runs").delete().eq("id", existingRun.id)
  }

  // Tạo payroll run mới
  const { data: run, error: runError } = await supabase
    .from("payroll_runs")
    .insert({ month, year, status: "draft", created_by: user.id })
    .select()
    .single()

  if (runError) {
    console.error("Error creating payroll run:", runError)
    return { success: false, error: runError.message }
  }

  // Lấy danh sách nhân viên active hoặc onboarding
  const { data: employees, error: empError } = await supabase
    .from("employees")
    .select("id, full_name, employee_code, shift_id, official_date, join_date")
    .in("status", ["active", "onboarding"])

  if (empError || !employees || employees.length === 0) {
    return { success: false, error: "Không có nhân viên. Vui lòng kiểm tra trạng thái nhân viên." }
  }

  // Lấy các loại điều chỉnh active
  const { data: adjustmentTypes } = await supabase
    .from("payroll_adjustment_types")
    .select("*")
    .eq("is_active", true)

  // Lấy work shifts
  const { data: shifts } = await supabase.from("work_shifts").select("*")
  const shiftMap = new Map((shifts || []).map((s: any) => [s.id, s]))

  // Tính ngày đầu và cuối tháng
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`

  // Tính công chuẩn động theo tháng
  const workingDaysInfo = await calculateStandardWorkingDays(month, year)
  const STANDARD_WORKING_DAYS = workingDaysInfo.standardDays

  console.log(`[Payroll] Tháng ${month}/${year}: Công chuẩn: ${STANDARD_WORKING_DAYS} ngày`)

  let processedCount = 0
  for (const emp of employees) {
    const result = await processEmployeePayroll(
      supabase, emp, run.id, month, year, startDate, endDate,
      STANDARD_WORKING_DAYS, adjustmentTypes, shiftMap
    )
    if (result) processedCount++
  }

  revalidatePath("/dashboard/payroll")
  return { success: true, data: run, message: `Đã tạo bảng lương cho ${processedCount} nhân viên` }
}

// =============================================
// REFRESH PAYROLL
// =============================================

export async function refreshPayroll(id: string) {
  const supabase = await createClient()

  const { data: run, error: runError } = await supabase
    .from("payroll_runs")
    .select("*")
    .eq("id", id)
    .single()

  if (runError || !run) {
    return { success: false, error: "Không tìm thấy bảng lương" }
  }

  if (run.status !== "draft" && run.status !== "review") {
    return { success: false, error: "Chỉ có thể tính lại bảng lương ở trạng thái Nháp hoặc Đang xem xét" }
  }

  const result = await generatePayroll(run.month, run.year)
  return result
}


// =============================================
// PROCESS SINGLE EMPLOYEE PAYROLL
// =============================================

async function processEmployeePayroll(
  supabase: any,
  emp: any,
  runId: string,
  month: number,
  year: number,
  startDate: string,
  endDate: string,
  STANDARD_WORKING_DAYS: number,
  adjustmentTypes: any,
  shiftMap: Map<string, any>
): Promise<boolean> {
  // Lấy lương hiệu lực
  const { data: salary } = await supabase
    .from("salary_structure")
    .select("*")
    .eq("employee_id", emp.id)
    .lte("effective_date", endDate)
    .order("effective_date", { ascending: false })
    .limit(1)
    .maybeSingle()

  const baseSalary = salary?.base_salary || 0
  if (baseSalary <= 0) {
    console.log(`[Payroll] ${emp.full_name}: Bỏ qua - chưa có lương cơ bản`)
    return false
  }
  
  const dailySalary = baseSalary / STANDARD_WORKING_DAYS

  // Lấy shift của nhân viên
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

  // Lấy phiếu tăng ca
  const { data: overtimeRequestDates } = await supabase
    .from("employee_requests")
    .select(`request_date, from_time, to_time, request_type:request_types!request_type_id(code)`)
    .eq("employee_id", emp.id)
    .eq("status", "approved")
    .gte("request_date", startDate)
    .lte("request_date", endDate)

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

  // Lấy attendance logs
  const { data: allAttendanceLogs } = await supabase
    .from("attendance_logs")
    .select("check_in, check_out")
    .eq("employee_id", emp.id)
    .or(`and(check_in.gte.${startDate},check_in.lte.${endDate}T23:59:59),and(check_in.is.null,check_out.gte.${startDate},check_out.lte.${endDate}T23:59:59)`)

  // Đếm ngày công
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

  // Xử lý phiếu nghỉ
  const leaveResult = await processLeaveRequests(
    supabase, emp.id, startDate, endDate, year, emp.official_date, shiftMap, emp.shift_id
  )

  // Lấy vi phạm chấm công
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

  // Tính ngày đủ giờ cho phụ cấp
  const fullAttendanceDays = violationsWithoutOT.filter((v) => 
    v.hasCheckIn && v.hasCheckOut && !v.isHalfDay && !v.isAbsent &&
    v.lateMinutes === 0 && v.earlyMinutes === 0
  ).length

  // Lấy điều chỉnh được gán cho nhân viên
  const { data: empAdjustments } = await supabase
    .from("employee_adjustments")
    .select("*, adjustment_type:payroll_adjustment_types(*)")
    .eq("employee_id", emp.id)
    .lte("effective_date", endDate)
    .or(`end_date.is.null,end_date.gte.${startDate}`)

  // Tính toán phụ cấp, khấu trừ, phạt
  const adjustmentResult = await processAdjustments(
    supabase, emp, baseSalary, dailySalary, month, year,
    adjustmentTypes, empAdjustments, violationsWithoutOT,
    fullAttendanceDays, lateCount, leaveResult.unpaidLeaveDays, absentDays,
    allAttendanceLogs, startDate, endDate
  )

  // Tính OT
  const otResult = await calculateOvertimePay(emp.id, baseSalary, STANDARD_WORKING_DAYS, startDate, endDate)
  const otAdjustmentType = adjustmentTypes?.find((t: any) => t.code === 'overtime')
  if (otAdjustmentType && otResult.details.length > 0) {
    for (const otDetail of otResult.details) {
      adjustmentResult.details.push({
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

  // Tính KPI
  let kpiBonus = 0
  const kpiEvaluation = await getEmployeeKPI(emp.id, month, year)
  if (kpiEvaluation && kpiEvaluation.status === "achieved" && kpiEvaluation.final_bonus > 0) {
    kpiBonus = kpiEvaluation.final_bonus
    const kpiAdjustmentType = (adjustmentTypes as PayrollAdjustmentType[] | null)?.find(t => t.code === "KPI_BONUS")
    if (kpiAdjustmentType) {
      adjustmentResult.details.push({
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

  // Tính lương cuối cùng
  const actualWorkingDays = actualAttendanceDays + leaveResult.workFromHomeDays
  const grossSalary = dailySalary * (actualWorkingDays + leaveResult.paidLeaveDays) + 
    adjustmentResult.totalAllowances + otResult.totalOTPay + kpiBonus
  const totalDeduction = adjustmentResult.totalDeductions + adjustmentResult.totalPenalties
  const netSalary = grossSalary - totalDeduction

  // Tạo ghi chú
  let noteItems: string[] = []
  if (actualAttendanceDays > 0) noteItems.push(`Chấm công: ${actualAttendanceDays} ngày`)
  if (leaveResult.workFromHomeDays > 0) noteItems.push(`WFH: ${leaveResult.workFromHomeDays} ngày`)
  if (leaveResult.paidLeaveDays > 0) noteItems.push(`Nghỉ phép: ${leaveResult.paidLeaveDays} ngày`)
  if (lateCount > 0) noteItems.push(`Đi muộn: ${lateCount} lần`)
  if (halfDays > 0) noteItems.push(`Nửa ngày: ${halfDays}`)
  if (absentDays > 0) noteItems.push(`Không tính công: ${absentDays}`)
  const penaltyCount = adjustmentResult.details.filter(d => d.category === 'penalty').length
  if (penaltyCount > 0) noteItems.push(`Phạt: ${penaltyCount} lần`)
  if (otResult.totalOTHours > 0) noteItems.push(`OT: ${otResult.totalOTHours}h`)
  if (kpiBonus > 0) noteItems.push(`KPI: ${kpiBonus.toLocaleString()}đ`)

  // Insert payroll item
  const { data: payrollItem, error: insertError } = await supabase
    .from("payroll_items")
    .insert({
      payroll_run_id: runId,
      employee_id: emp.id,
      working_days: actualWorkingDays,
      leave_days: leaveResult.paidLeaveDays,
      unpaid_leave_days: leaveResult.unpaidLeaveDays + absentDays,
      base_salary: baseSalary,
      allowances: adjustmentResult.totalAllowances + otResult.totalOTPay + kpiBonus,
      total_income: grossSalary,
      total_deduction: totalDeduction,
      net_salary: netSalary,
      standard_working_days: STANDARD_WORKING_DAYS,
      note: noteItems.join(", ") || null,
    })
    .select()
    .single()

  if (insertError) {
    console.error(`Error inserting payroll item for ${emp.full_name}:`, insertError)
    return false
  }

  // Insert adjustment details
  if (payrollItem && adjustmentResult.details.length > 0) {
    const detailsWithItemId = adjustmentResult.details.map((d) => ({
      ...d,
      payroll_item_id: payrollItem.id,
    }))
    await supabase.from("payroll_adjustment_details").insert(detailsWithItemId)
  }

  return true
}


// =============================================
// PROCESS LEAVE REQUESTS
// =============================================

async function processLeaveRequests(
  supabase: any,
  employeeId: string,
  startDate: string,
  endDate: string,
  year: number,
  officialDate: string | null,
  shiftMap: Map<string, any>,
  shiftId: string | null
): Promise<{
  paidLeaveDays: number
  unpaidLeaveDays: number
  workFromHomeDays: number
}> {
  const { data: employeeRequests } = await supabase
    .from("employee_requests")
    .select(`
      *,
      request_type:request_types!request_type_id(
        code, name, affects_payroll, deduct_leave_balance,
        requires_date_range, requires_single_date
      )
    `)
    .eq("employee_id", employeeId)
    .eq("status", "approved")
    .or(`and(request_date.gte.${startDate},request_date.lte.${endDate}),and(from_date.lte.${endDate},to_date.gte.${startDate})`)

  let paidLeaveDays = 0
  let unpaidLeaveDays = 0
  let workFromHomeDays = 0

  const empShift = shiftId ? shiftMap.get(shiftId) : null
  const shiftStart = empShift?.start_time?.slice(0, 5) || "08:00"
  const shiftEnd = empShift?.end_time?.slice(0, 5) || "17:00"
  const breakStart = empShift?.break_start?.slice(0, 5) || "12:00"
  const breakEnd = empShift?.break_end?.slice(0, 5) || "13:00"

  const calculateDayFraction = (fromTime: string | null, toTime: string | null): number => {
    if (!fromTime || !toTime) return 1

    const parseTime = (t: string) => {
      const [h, m] = t.split(":").map(Number)
      return h * 60 + (m || 0)
    }

    const fromMinutes = parseTime(fromTime)
    const toMinutes = parseTime(toTime)
    const shiftStartMin = parseTime(shiftStart)
    const shiftEndMin = parseTime(shiftEnd)
    const breakStartMin = parseTime(breakStart)
    const breakEndMin = parseTime(breakEnd)

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

  // Leave balance cap
  const yearlyEntitlement = calculateLeaveEntitlement(officialDate, year)
  const startOfYear = `${year}-01-01`

  const { data: historicRequests } = await supabase
    .from("employee_requests")
    .select(`from_date, to_date, from_time, to_time, request_type:request_types!inner(code, deduct_leave_balance)`)
    .eq("employee_id", employeeId)
    .eq("status", "approved")
    .gte("from_date", startOfYear)
    .lt("from_date", startDate)
    .filter("request_type.deduct_leave_balance", "eq", true)

  let historicUsed = 0
  if (historicRequests) {
    for (const hReq of historicRequests) {
      historicUsed += calculateLeaveDays(hReq.from_date, hReq.to_date || hReq.from_date, hReq.from_time, hReq.to_time)
    }
  }

  const remainingBalance = Math.max(0, yearlyEntitlement - historicUsed)

  // Recalculate annual leave this month
  let annualLeaveThisMonth = 0
  if (employeeRequests) {
    for (const req of employeeRequests) {
      const reqType = req.request_type as any
      if (reqType.affects_payroll && reqType.deduct_leave_balance) {
        const d = calculateLeaveDays(
          req.from_date,
          req.to_date || req.from_date,
          req.from_time,
          req.to_time,
          { requires_date_range: reqType.requires_date_range, requires_single_date: reqType.requires_single_date }
        )
        annualLeaveThisMonth += d
      }
    }
  }

  const paidAnnual = Math.min(annualLeaveThisMonth, remainingBalance)
  const unpaidAnnual = Math.max(0, annualLeaveThisMonth - paidAnnual)

  if (unpaidAnnual > 0) {
    paidLeaveDays -= unpaidAnnual
    unpaidLeaveDays += unpaidAnnual
  }

  return { paidLeaveDays, unpaidLeaveDays, workFromHomeDays }
}


// =============================================
// PROCESS ADJUSTMENTS (ALLOWANCES, DEDUCTIONS, PENALTIES)
// =============================================

export async function processAdjustments(
  supabase: any,
  emp: any,
  baseSalary: number,
  dailySalary: number,
  month: number,
  year: number,
  adjustmentTypes: any,
  empAdjustments: any,
  violationsWithoutOT: any[],
  fullAttendanceDays: number,
  lateCount: number,
  unpaidLeaveDays: number,
  absentDays: number,
  allAttendanceLogs: any[],
  startDate: string,
  endDate: string
): Promise<{
  totalAllowances: number
  totalDeductions: number
  totalPenalties: number
  details: any[]
}> {
  let totalAllowances = 0
  let totalDeductions = 0
  let totalPenalties = 0
  const adjustmentDetails: any[] = []

  const globalPenaltyByDate = new Map<string, { 
    date: string
    reason: string
    amount: number
    adjustmentTypeId: string
  }>()

  if (adjustmentTypes) {
    for (const adjType of adjustmentTypes as PayrollAdjustmentType[]) {
      if (!adjType.is_auto_applied) continue

      const rules = adjType.auto_rules as AdjustmentAutoRules | null
      const empOverride = empAdjustments?.find((ea: any) => ea.adjustment_type_id === adjType.id)

      // DEDUCTIONS
      if (adjType.category === "deduction") {
        let finalAmount = adjType.amount
        let reason = adjType.name

        if (empOverride) {
          if (empOverride.custom_percentage) {
            finalAmount = Math.round((baseSalary * empOverride.custom_percentage) / 100)
            reason = `${adjType.name} (${empOverride.custom_percentage}% lương)`
          } else if (empOverride.custom_amount) {
            finalAmount = empOverride.custom_amount
          }
        } else if (adjType.calculation_type === "percentage") {
          const deductRules = adjType.auto_rules as AdjustmentAutoRules | null
          const calculateFrom = deductRules?.calculate_from || "base_salary"
          const percentage = adjType.amount
          
          let salaryForCalculation = baseSalary
          let shouldSkip = false
          
          if (calculateFrom === "insurance_salary") {
            const { data: salaryData } = await supabase
              .from("salary_structure")
              .select("insurance_salary, base_salary")
              .eq("employee_id", emp.id)
              .lte("effective_date", `${year}-${String(month).padStart(2, "0")}-01`)
              .order("effective_date", { ascending: false })
              .limit(1)
              .single()
            
            const insuranceSalary = salaryData?.insurance_salary
            if (!insuranceSalary || insuranceSalary <= 0) {
              shouldSkip = true
            } else {
              salaryForCalculation = insuranceSalary
            }
          }
          
          if (shouldSkip) continue
          
          finalAmount = Math.round((salaryForCalculation * percentage) / 100)
          reason = `${percentage}% ${calculateFrom === "insurance_salary" ? "lương BHXH" : "lương cơ bản"}`
        } else if (rules?.calculate_from === "base_salary" && rules?.percentage) {
          finalAmount = Math.round((baseSalary * rules.percentage) / 100)
        }

        totalDeductions += finalAmount
        adjustmentDetails.push({
          adjustment_type_id: adjType.id,
          category: "deduction",
          base_amount: adjType.amount,
          adjusted_amount: 0,
          final_amount: finalAmount,
          reason: reason,
          occurrence_count: 1,
        })
        continue
      }

      // ALLOWANCES
      if (adjType.category === "allowance") {
        if (adjType.calculation_type === "daily") {
          const lateThresholdMinutes = rules?.late_threshold_minutes ?? 0
          
          const allowanceFullDays = violationsWithoutOT.filter((v) => 
            v.hasCheckIn && v.hasCheckOut && !v.isHalfDay && !v.isAbsent &&
            v.lateMinutes <= lateThresholdMinutes && v.earlyMinutes === 0
          ).length
          
          const allowanceViolations = violationsWithoutOT.filter((v) => 
            v.lateMinutes > lateThresholdMinutes || v.earlyMinutes > 0 ||
            v.forgotCheckOut || v.isHalfDay || v.isAbsent
          ).length
          
          let eligibleDays = allowanceFullDays

          if (rules) {
            if (rules.late_grace_count !== undefined) {
              const gracedViolationDays = Math.min(allowanceViolations, rules.late_grace_count)
              eligibleDays = allowanceFullDays + gracedViolationDays
            }
            if (rules.deduct_on_absent && unpaidLeaveDays > 0) {
              eligibleDays -= unpaidLeaveDays
              eligibleDays = Math.max(0, eligibleDays)
            }
          }

          eligibleDays = Math.max(0, Math.floor(eligibleDays))
          const amount = eligibleDays * adjType.amount

          if (amount > 0) {
            totalAllowances += amount
            adjustmentDetails.push({
              adjustment_type_id: adjType.id,
              category: "allowance",
              base_amount: allowanceFullDays * adjType.amount,
              adjusted_amount: (eligibleDays - allowanceFullDays) > 0 ? 0 : (allowanceFullDays - eligibleDays) * adjType.amount,
              final_amount: amount,
              reason: `${eligibleDays} ngày x ${adjType.amount.toLocaleString()}đ`,
              occurrence_count: eligibleDays,
            })
          } else {
            adjustmentDetails.push({
              adjustment_type_id: adjType.id,
              category: "allowance",
              base_amount: 0,
              adjusted_amount: 0,
              final_amount: 0,
              reason: `0 ngày (không có ngày đi làm)`,
              occurrence_count: 0,
            })
          }
        }

        if (adjType.calculation_type === "fixed") {
          if (rules?.full_deduct_threshold !== undefined) {
            const shouldDeduct = lateCount > rules.full_deduct_threshold || unpaidLeaveDays > 0 || absentDays > 0
            if (!shouldDeduct) {
              totalAllowances += adjType.amount
              adjustmentDetails.push({
                adjustment_type_id: adjType.id,
                category: "allowance",
                base_amount: adjType.amount,
                adjusted_amount: 0,
                final_amount: adjType.amount,
                reason: "Đủ điều kiện chuyên cần",
                occurrence_count: 1,
              })
            } else {
              adjustmentDetails.push({
                adjustment_type_id: adjType.id,
                category: "allowance",
                base_amount: adjType.amount,
                adjusted_amount: adjType.amount,
                final_amount: 0,
                reason: `Mất phụ cấp: đi muộn ${lateCount} lần, nghỉ không phép ${unpaidLeaveDays} ngày`,
                occurrence_count: 0,
              })
            }
          } else {
            totalAllowances += adjType.amount
            adjustmentDetails.push({
              adjustment_type_id: adjType.id,
              category: "allowance",
              base_amount: adjType.amount,
              adjusted_amount: 0,
              final_amount: adjType.amount,
              reason: adjType.name,
              occurrence_count: 1,
            })
          }
        }

        if (adjType.calculation_type === "percentage") {
          const calculateFrom = rules?.calculate_from || "base_salary"
          
          let salaryForCalculation = baseSalary
          let shouldSkip = false
          
          if (calculateFrom === "insurance_salary") {
            const { data: salaryData } = await supabase
              .from("salary_structure")
              .select("insurance_salary, base_salary")
              .eq("employee_id", emp.id)
              .lte("effective_date", `${year}-${String(month).padStart(2, "0")}-01`)
              .order("effective_date", { ascending: false })
              .limit(1)
              .single()
            
            const insuranceSalary = salaryData?.insurance_salary
            if (!insuranceSalary || insuranceSalary <= 0) {
              shouldSkip = true
            } else {
              salaryForCalculation = insuranceSalary
            }
          }
          
          if (!shouldSkip) {
            const percentageAmount = Math.round((salaryForCalculation * adjType.amount) / 100)
            totalAllowances += percentageAmount
            adjustmentDetails.push({
              adjustment_type_id: adjType.id,
              category: adjType.category,
              base_amount: percentageAmount,
              adjusted_amount: 0,
              final_amount: percentageAmount,
              reason: `${adjType.amount}% ${calculateFrom === "insurance_salary" ? "lương BHXH" : "lương cơ bản"}`,
              occurrence_count: 1,
            })
          }
        }
        continue
      }

      // PENALTIES
      if (adjType.category === "penalty" && (rules?.trigger === "late" || rules?.trigger === "attendance")) {
        const thresholdMinutes = rules?.late_threshold_minutes || 30
        const exemptWithRequest = rules?.exempt_with_request !== false
        const exemptRequestTypes = rules?.exempt_request_types || ["late_arrival", "early_leave"]
        const penaltyConditions = rules?.penalty_conditions || []

        // Late/Early penalties
        if (rules?.trigger === "late") {
          for (const v of violationsWithoutOT) {
            if (v.isAbsent) continue
            
            const shouldPenalize = v.lateMinutes > thresholdMinutes || v.earlyMinutes > thresholdMinutes
            if (!shouldPenalize) continue

            if (exemptWithRequest && v.hasApprovedRequest) {
              const hasExemptRequest = v.approvedRequestTypes.some(t => exemptRequestTypes.includes(t))
              if (hasExemptRequest) continue
            }

            const existing = globalPenaltyByDate.get(v.date)
            if (!existing) {
              let penaltyAmount = 0
              if (rules?.penalty_type === "half_day_salary") {
                penaltyAmount = dailySalary / 2
              } else if (rules?.penalty_type === "full_day_salary") {
                penaltyAmount = dailySalary
              } else if (rules?.penalty_type === "fixed_amount") {
                penaltyAmount = adjType.amount
              }

              const reason = v.lateMinutes > thresholdMinutes 
                ? `Đi muộn ${v.lateMinutes} phút` 
                : `Về sớm ${v.earlyMinutes} phút`

              globalPenaltyByDate.set(v.date, {
                date: v.date,
                reason,
                amount: penaltyAmount,
                adjustmentTypeId: adjType.id,
              })
            }
          }
        }

        // Forgot check-in/check-out penalties
        if (rules?.trigger === "attendance") {
          if (penaltyConditions.includes("forgot_checkin")) {
            const { data: approvedForgotCheckin } = await supabase
              .from("employee_requests")
              .select(`request_date, request_type:request_types!request_type_id(code)`)
              .eq("employee_id", emp.id)
              .eq("status", "approved")
              .gte("request_date", startDate)
              .lte("request_date", endDate)

            const approvedForgotCheckinDates = new Set<string>()
            for (const req of approvedForgotCheckin || []) {
              const reqType = req.request_type as any
              if (reqType?.code === "forgot_checkin") {
                approvedForgotCheckinDates.add(req.request_date)
              }
            }

            for (const log of allAttendanceLogs || []) {
              if (log.check_in) continue
              if (!log.check_out) continue

              const logDate = toDateStringVN(log.check_out)
              if (exemptWithRequest && approvedForgotCheckinDates.has(logDate)) continue

              const existing = globalPenaltyByDate.get(logDate)
              if (!existing) {
                let penaltyAmount = 0
                if (rules?.penalty_type === "half_day_salary") {
                  penaltyAmount = dailySalary / 2
                } else if (rules?.penalty_type === "full_day_salary") {
                  penaltyAmount = dailySalary
                } else if (rules?.penalty_type === "fixed_amount") {
                  penaltyAmount = adjType.amount
                }

                globalPenaltyByDate.set(logDate, {
                  date: logDate,
                  reason: "Quên chấm công đến",
                  amount: penaltyAmount,
                  adjustmentTypeId: adjType.id,
                })
              }
            }
          }

          if (penaltyConditions.includes("forgot_checkout")) {
            const { data: approvedForgotCheckout } = await supabase
              .from("employee_requests")
              .select(`request_date, request_type:request_types!request_type_id(code)`)
              .eq("employee_id", emp.id)
              .eq("status", "approved")
              .gte("request_date", startDate)
              .lte("request_date", endDate)

            const approvedForgotCheckoutDates = new Set<string>()
            for (const req of approvedForgotCheckout || []) {
              const reqType = req.request_type as any
              if (reqType?.code === "forgot_checkout") {
                approvedForgotCheckoutDates.add(req.request_date)
              }
            }

            for (const v of violationsWithoutOT) {
              if (!v.forgotCheckOut) continue
              if (exemptWithRequest && approvedForgotCheckoutDates.has(v.date)) continue

              const existing = globalPenaltyByDate.get(v.date)
              if (!existing) {
                let penaltyAmount = 0
                if (rules?.penalty_type === "half_day_salary") {
                  penaltyAmount = dailySalary / 2
                } else if (rules?.penalty_type === "full_day_salary") {
                  penaltyAmount = dailySalary
                } else if (rules?.penalty_type === "fixed_amount") {
                  penaltyAmount = adjType.amount
                }

                globalPenaltyByDate.set(v.date, {
                  date: v.date,
                  reason: "Quên chấm công về",
                  amount: penaltyAmount,
                  adjustmentTypeId: adjType.id,
                })
              }
            }
          }
        }
      }
    }
  }

  // Add penalties from global map
  for (const pv of globalPenaltyByDate.values()) {
    totalPenalties += pv.amount
    adjustmentDetails.push({
      adjustment_type_id: pv.adjustmentTypeId,
      category: "penalty",
      base_amount: pv.amount,
      adjusted_amount: 0,
      final_amount: pv.amount,
      reason: `${pv.reason} ngày ${pv.date}`,
      occurrence_count: 1,
    })
  }

  // Manual adjustments
  if (empAdjustments) {
    for (const empAdj of empAdjustments) {
      const adjType = empAdj.adjustment_type as PayrollAdjustmentType
      if (!adjType) continue
      if (adjType.is_auto_applied) continue

      let finalAmount = empAdj.custom_amount || adjType.amount
      if (empAdj.custom_percentage) {
        finalAmount = Math.round((baseSalary * empAdj.custom_percentage) / 100)
      }

      if (adjType.category === "allowance") {
        totalAllowances += finalAmount
      } else if (adjType.category === "deduction") {
        totalDeductions += finalAmount
      } else if (adjType.category === "penalty") {
        totalPenalties += finalAmount
      }

      adjustmentDetails.push({
        adjustment_type_id: adjType.id,
        category: adjType.category,
        base_amount: adjType.amount,
        adjusted_amount: 0,
        final_amount: finalAmount,
        reason: empAdj.custom_percentage
          ? `${adjType.name} (${empAdj.custom_percentage}% lương)`
          : adjType.name,
        occurrence_count: 1,
      })
    }
  }

  return {
    totalAllowances,
    totalDeductions,
    totalPenalties,
    details: adjustmentDetails,
  }
}
