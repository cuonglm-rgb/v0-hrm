"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { PayrollAdjustmentType } from "@/lib/types/database"
import { calculateOvertimePay, listHolidays } from "../overtime-actions"
import { getEmployeeKPI } from "../kpi-actions"
import { toDateStringVN } from "@/lib/utils/date-utils"
import { calculateStandardWorkingDays } from "./working-days"
import { getEmployeeViolations } from "./violations"
import { processAdjustments } from "./generate-payroll"
import type { ShiftInfo } from "./types"
import { isSaturdayOff } from "./working-days-utils"

// Helper: Kiểm tra ngày có phải ngày làm việc không (không phải CN, T7 nghỉ)
function isWorkingDay(date: Date): boolean {
  const dayOfWeek = date.getUTCDay()
  if (dayOfWeek === 0) return false // Chủ nhật
  if (dayOfWeek === 6 && isSaturdayOff(date)) return false // Thứ 7 nghỉ
  return true
}

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

  console.log(`\n========== TÍNH LƯƠNG: ${emp.full_name} (${emp.employee_code}) - Tháng ${month}/${year} ==========`)
  console.log(`Công chuẩn: ${STANDARD_WORKING_DAYS} ngày (${workingDaysInfo.totalDays} ngày - ${workingDaysInfo.sundays} CN - ${workingDaysInfo.saturdaysOff} T7)`)

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

  console.log(`📊 Attendance logs: ${allAttendanceLogs?.length || 0} bản ghi`)
  console.log(`📊 Ngày công từ chấm công: ${workingDaysCount} ngày`)
  console.log(`📊 OT full day: ${overtimeDates.size} ngày, OT trong ca: ${overtimeWithinShift.size} ngày`)

  // Lấy danh sách ngày lễ và ngày nghỉ công ty
  const holidays = await listHolidays(year)
  const holidayDates = new Set(holidays.map(h => h.holiday_date))
  
  // Query ngày nghỉ công ty kèm danh sách nhân viên được áp dụng
  const { data: specialDays } = await supabase
    .from("special_work_days")
    .select(`
      work_date, 
      is_company_holiday,
      assigned_employees:special_work_day_employees(employee_id)
    `)
    .eq("is_company_holiday", true)
    .gte("work_date", startDate)
    .lte("work_date", endDate)
  
  // Lọc ngày nghỉ công ty áp dụng cho nhân viên này
  // Quy tắc: Nếu không có assigned_employees -> áp dụng toàn công ty
  //          Nếu có assigned_employees -> chỉ áp dụng nếu nhân viên nằm trong danh sách
  const companyHolidayDates = new Set(
    (specialDays || [])
      .filter(s => {
        const assignedEmps = s.assigned_employees || []
        // Nếu không có ai được chọn -> áp dụng toàn công ty
        if (assignedEmps.length === 0) return true
        // Nếu có danh sách -> kiểm tra nhân viên có trong danh sách không
        return assignedEmps.some((ae: any) => ae.employee_id === emp.id)
      })
      .map(s => s.work_date)
  )

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

  // Tạo Set các ngày có leave request để tránh tính trùng
  const leaveDates = new Set<string>()
  if (employeeRequests) {
    for (const request of employeeRequests) {
      const reqType = request.request_type as any
      if (!reqType) continue
      
      if (request.from_date && request.to_date) {
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
        
        const current = new Date(reqStart)
        while (current <= reqEnd) {
          const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
          leaveDates.add(dateStr)
          current.setDate(current.getDate() + 1)
        }
      } else if (request.request_date) {
        leaveDates.add(request.request_date)
      }
    }
  }

  // Tính số ngày lễ và ngày nghỉ công ty mà nhân viên không đi làm và không có leave request
  // Những ngày này sẽ được tính lương như đi làm
  let holidayWorkDays = 0
  let companyHolidayWorkDays = 0
  const parseDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d))
  }
  const periodStart = parseDate(startDate)
  const periodEnd = parseDate(endDate)
  
  // Duyệt qua tất cả ngày trong tháng
  const current = new Date(periodStart)
  while (current <= periodEnd) {
    const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
    
    // Chỉ xét ngày làm việc theo lịch (không phải CN, T7 nghỉ)
    if (isWorkingDay(current)) {
      const isHoliday = holidayDates.has(dateStr)
      const isCompanyHoliday = companyHolidayDates.has(dateStr)
      
      // NGÀY LỄ: Chỉ tính lương nếu không đi làm HOẶC có đi làm nhưng có phiếu OT
      if (isHoliday) {
        const hasAttendance = countedDates.has(dateStr)
        const hasOT = overtimeDates.has(dateStr) || overtimeWithinShift.has(dateStr)
        const hasLeave = leaveDates.has(dateStr)
        
        // Nếu không đi làm và không có phiếu nghỉ -> tính lương tự động
        if (!hasAttendance && !hasLeave) {
          holidayWorkDays++
        }
        // Nếu có đi làm nhưng không có OT -> loại khỏi working days (đã được tính trước đó)
        else if (hasAttendance && !hasOT) {
          // Trừ đi vì đã được tính trong workingDaysCount
          workingDaysCount--
        }
      }
      // NGÀY NGHỈ CÔNG TY: Nếu không đi làm -> tính lương, nếu đi làm -> đã được tính
      else if (isCompanyHoliday) {
        const hasAttendance = countedDates.has(dateStr)
        const hasLeave = leaveDates.has(dateStr)
        
        // Nếu không đi làm và không có phiếu nghỉ -> tính lương tự động
        if (!hasAttendance && !hasLeave) {
          companyHolidayWorkDays++
        }
        // Nếu có đi làm -> giữ nguyên trong workingDaysCount (tính lương bình thường)
      }
    }
    
    current.setDate(current.getDate() + 1)
  }
  
  // Cộng ngày lễ và ngày nghỉ công ty vào working days
  workingDaysCount += holidayWorkDays + companyHolidayWorkDays

  console.log(`🎉 Ngày lễ trong tháng: ${holidayDates.size} ngày`)
  console.log(`🏢 Ngày nghỉ công ty: ${companyHolidayDates.size} ngày`)
  console.log(`🎁 Ngày lễ được cộng (ngày làm việc, không đi & không nghỉ): ${holidayWorkDays} ngày`)
  console.log(`🎁 Ngày nghỉ công ty được cộng: ${companyHolidayWorkDays} ngày`)
  console.log(`📊 Tổng working days sau cộng: ${workingDaysCount} ngày`)

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

  console.log(`\n📝 PHIẾU NGHỈ:`)
  console.log(`  - Nghỉ phép có lương: ${paidLeaveDays} ngày`)
  console.log(`  - Nghỉ không lương: ${unpaidLeaveDays} ngày`)
  console.log(`  - Work from home: ${workFromHomeDays} ngày`)
  console.log(`\n⚠️  VI PHẠM:`)
  console.log(`  - Vắng mặt: ${absentDays} ngày`)
  console.log(`  - Làm nửa ngày: ${halfDays} lần`)
  console.log(`  - Đi muộn: ${lateCount} lần`)
  console.log(`  - Actual attendance: ${actualAttendanceDays} ngày (${workingDaysCount} - ${halfDays * 0.5})`)

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

  console.log(`\n💰 TÍNH LƯƠNG:`)
  console.log(`  - Lương cơ bản: ${baseSalary.toLocaleString()} VNĐ`)
  console.log(`  - Lương ngày: ${dailySalary.toLocaleString()} VNĐ`)
  console.log(`  - Ngày công tính lương: ${actualWorkingDays} ngày`)
  console.log(`  - Phép có lương: ${paidLeaveDays} ngày`)
  console.log(`  - Lương theo công: ${(dailySalary * (actualWorkingDays + paidLeaveDays)).toLocaleString()} VNĐ`)
  console.log(`  - Phụ cấp: ${totalAllowances.toLocaleString()} VNĐ`)
  console.log(`  - OT: ${otResult.totalOTPay.toLocaleString()} VNĐ (${otResult.details.length} lần)`)
  console.log(`  - KPI Bonus: ${kpiBonus.toLocaleString()} VNĐ`)
  console.log(`  - Tổng thu nhập: ${grossSalary.toLocaleString()} VNĐ`)
  console.log(`  - Khấu trừ: ${totalDeductions.toLocaleString()} VNĐ`)
  console.log(`  - Phạt: ${totalPenalties.toLocaleString()} VNĐ`)
  console.log(`  - Thực lĩnh: ${netSalary.toLocaleString()} VNĐ`)
  console.log(`========== KẾT THÚC TÍNH LƯƠNG: ${emp.full_name} ==========\n`)

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
