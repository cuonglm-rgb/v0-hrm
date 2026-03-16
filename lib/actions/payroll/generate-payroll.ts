"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { PayrollAdjustmentType, AdjustmentAutoRules } from "@/lib/types/database"
import { calculateOvertimePay, listHolidays } from "../overtime-actions"
import { getEmployeeKPI } from "../kpi-actions"
import { toDateStringVN } from "@/lib/utils/date-utils"
import { calculateLeaveEntitlement } from "@/lib/utils/leave-utils"
import { calculateLeaveDays } from "@/lib/utils/date-utils"
import { calculateStandardWorkingDays } from "./working-days"
import { getEmployeeViolations } from "./violations"
import type { ShiftInfo } from "./types"
import { isSaturdayOff } from "./working-days-utils"
import { MAKEUP_CODES, LINKED_DEFICIT_DATE_KEY } from "@/lib/utils/makeup-utils"

// Helper: Kiểm tra ngày có phải ngày làm việc không (không phải CN, T7 nghỉ)
function isWorkingDay(date: Date): boolean {
  const dayOfWeek = date.getUTCDay()
  if (dayOfWeek === 0) return false // Chủ nhật
  if (dayOfWeek === 6 && isSaturdayOff(date)) return false // Thứ 7 nghỉ
  return true
}

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

  console.log(`\n========== TÍNH LƯƠNG: ${emp.full_name} (${emp.employee_code}) - Tháng ${month}/${year} ==========`)
  console.log(`Công chuẩn: ${STANDARD_WORKING_DAYS} ngày`)
  console.log(`Lương cơ bản: ${baseSalary.toLocaleString()} VNĐ -> Lương ngày: ${dailySalary.toLocaleString()} VNĐ`)

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

  // Lấy phiếu tăng ca (join thêm request_time_slots cho nhiều khung giờ)
  const { data: overtimeRequestDates } = await supabase
    .from("employee_requests")
    .select(`request_date, from_time, to_time, time_slots:request_time_slots(*), request_type:request_types!request_type_id(code)`)
    .eq("employee_id", emp.id)
    .eq("status", "approved")
    .gte("request_date", startDate)
    .lte("request_date", endDate)

  const overtimeDates = new Set<string>()
  const overtimeWithinShift = new Set<string>()

  // Query approved requests sớm để có makeupDates + leaveDates trước khi đếm công
  const { data: employeeRequests } = await supabase
    .from("employee_requests")
    .select(`
      *,
      request_type:request_types!request_type_id(code),
      time_slots:request_time_slots(*)
    `)
    .eq("employee_id", emp.id)
    .eq("status", "approved")
    .or(`and(request_date.gte.${startDate},request_date.lte.${endDate}),and(from_date.lte.${endDate},to_date.gte.${startDate})`)

  const makeupDates = new Set<string>()
  if (employeeRequests) {
    for (const request of employeeRequests) {
      const reqType = request.request_type as any
      if (reqType?.code !== "full_day_makeup" || !request.request_date) continue
      makeupDates.add(request.request_date)
    }
  }

  const leaveDates = new Set<string>()
  if (employeeRequests) {
    for (const request of employeeRequests) {
      const reqType = request.request_type as any
      if (!reqType || reqType.code === "overtime") continue
      if ((MAKEUP_CODES as readonly string[]).includes(reqType.code)) continue
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

  if (overtimeRequestDates) {
    for (const req of overtimeRequestDates) {
      const reqType = req.request_type as any
      if (reqType?.code !== "overtime") continue

      const date = req.request_date

      // Lấy danh sách khung giờ (ưu tiên request_time_slots, fallback về from_time/to_time)
      const timeSlots: { from_time: string; to_time: string }[] = []
      const reqTimeSlots = (req as any).time_slots as any[] | null
      if (reqTimeSlots && reqTimeSlots.length > 0) {
        for (const slot of reqTimeSlots) {
          timeSlots.push({ from_time: slot.from_time, to_time: slot.to_time })
        }
      } else if (req.from_time && req.to_time) {
        timeSlots.push({ from_time: req.from_time, to_time: req.to_time })
      }

      if (timeSlots.length === 0) {
        overtimeDates.add(date)
        continue
      }

      // Kiểm tra tất cả khung giờ: nếu TẤT CẢ đều nằm ngoài ca → overtimeWithinShift
      // Nếu có bất kỳ khung giờ nào trùng ca → overtimeDates (full day OT)
      let allOutsideShift = true
      for (const slot of timeSlots) {
        const fromMin = parseTime(slot.from_time)
        const toMin = parseTime(slot.to_time)
        const isBeforeShift = toMin <= shiftStartMin
        const isAfterShift = fromMin >= shiftEndMin
        const isDuringBreak = fromMin >= breakStartMin && toMin <= breakEndMin

        if (!(isBeforeShift || isAfterShift || isDuringBreak)) {
          allOutsideShift = false
          break
        }
      }

      if (allOutsideShift) {
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

  // Đếm ngày công (ngày làm bù full_day_makeup KHÔNG tăng working days — chỉ dùng để consume deficit)
  let workingDaysCount = 0
  const countedDates = new Set<string>()
  const attendanceDates = new Set<string>()
  if (allAttendanceLogs) {
    for (const log of allAttendanceLogs) {
      const logDate = log.check_in ? toDateStringVN(log.check_in) : toDateStringVN(log.check_out)
      attendanceDates.add(logDate)
      if (makeupDates.has(logDate)) continue
      if (!overtimeDates.has(logDate) && !countedDates.has(logDate)) {
        workingDaysCount++
        countedDates.add(logDate)
      }
    }
  }

  // Consumed deficits: mỗi linked_deficit_date chỉ được consume tối đa 1 lần (tránh 2 phiếu bù cùng 1 ngày = +2 công)
  const consumedDeficitDates = new Set<string>()
  if (employeeRequests) {
    for (const request of employeeRequests) {
      const reqType = request.request_type as any
      if (reqType?.code !== "full_day_makeup" || !request.request_date) continue
      const deficitDate = request.custom_data?.[LINKED_DEFICIT_DATE_KEY]
      if (!deficitDate) continue
      if (!attendanceDates.has(request.request_date)) continue
      consumedDeficitDates.add(deficitDate)
    }
  }
  const consumed_days = consumedDeficitDates.size

  console.log(`📊 Attendance logs: ${allAttendanceLogs?.length || 0} bản ghi`)
  console.log(`📊 Ngày công từ chấm công (trừ ngày làm bù): ${workingDaysCount} ngày`)
  console.log(`📊 Consumed deficit (bù thiếu, cap 1/deficit): ${consumed_days} ngày`)
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
      .filter((s: any) => {
        const assignedEmps = s.assigned_employees || []
        // Nếu không có ai được chọn -> áp dụng toàn công ty
        if (assignedEmps.length === 0) return true
        // Nếu có danh sách -> kiểm tra nhân viên có trong danh sách không
        return assignedEmps.some((ae: any) => ae.employee_id === emp.id)
      })
      .map((s: any) => s.work_date)
  )

  // Xử lý phiếu nghỉ
  const leaveResult = await processLeaveRequests(
    supabase, emp.id, startDate, endDate, year, emp.official_date, shiftMap, emp.shift_id
  )

  // Tính số ngày lễ và ngày nghỉ công ty mà nhân viên không đi làm và không có leave request
  let holidayWorkDays = 0
  let companyHolidayWorkDays = 0
  const parseDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d))
  }
  const periodStart = parseDate(startDate)
  const periodEnd = parseDate(endDate)
  
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
        // Nếu có đi làm nhưng không có OT -> loại khỏi working days
        else if (hasAttendance && !hasOT) {
          workingDaysCount--
        }
      }
      // NGÀY NGHỈ CÔNG TY: Nếu không đi làm -> tính lương, nếu đi làm -> đã được tính
      else if (isCompanyHoliday) {
        const hasAttendance = countedDates.has(dateStr)
        const hasLeave = leaveDates.has(dateStr)
        
        if (!hasAttendance && !hasLeave) {
          companyHolidayWorkDays++
        }
      }
    }
    
    current.setDate(current.getDate() + 1)
  }
  
  workingDaysCount += holidayWorkDays + companyHolidayWorkDays

  console.log(`🎉 Ngày lễ trong tháng: ${holidayDates.size} ngày`)
  console.log(`🏢 Ngày nghỉ công ty: ${companyHolidayDates.size} ngày`)
  console.log(`🎁 Ngày lễ được cộng (ngày làm việc, không đi & không nghỉ): ${holidayWorkDays} ngày`)
  console.log(`🎁 Ngày nghỉ công ty được cộng: ${companyHolidayWorkDays} ngày`)
  console.log(`📊 Tổng working days sau cộng: ${workingDaysCount} ngày`)

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
  const actualAttendanceDays = workingDaysCount - (halfDays * 0.5) + consumed_days
  const lateCount = violationsWithoutOT.filter((v) => v.lateMinutes > 0 && !v.isHalfDay).length
  const forgotCheckinCount = violationsWithoutOT.filter((v) => v.forgotCheckIn).length
  const forgotCheckoutCount = violationsWithoutOT.filter((v) => v.forgotCheckOut).length

  console.log(`\n📝 PHIẾU NGHỈ:`)
  console.log(`  - Nghỉ phép có lương: ${leaveResult.paidLeaveDays} ngày`)
  console.log(`  - Nghỉ không lương: ${leaveResult.unpaidLeaveDays} ngày`)
  console.log(`  - Work from home: ${leaveResult.workFromHomeDays} ngày`)
  console.log(`\n⚠️  VI PHẠM:`)
  console.log(`  - Vắng mặt: ${absentDays} ngày`)
  console.log(`  - Làm nửa ngày: ${halfDays} lần`)
  console.log(`  - Đi muộn: ${lateCount} lần`)
  console.log(`  - Quên chấm công đến: ${forgotCheckinCount} lần`)
  console.log(`  - Quên chấm công về: ${forgotCheckoutCount} lần`)
  console.log(`  - Actual attendance: ${actualAttendanceDays} ngày (${workingDaysCount} - ${halfDays * 0.5} + consumed ${consumed_days})`)

  // Tính ngày đủ giờ cho phụ cấp
  const fullAttendanceDays = violationsWithoutOT.filter((v) => 
    v.hasCheckIn && v.hasCheckOut && !v.isHalfDay && !v.isAbsent &&
    v.lateMinutes === 0 && v.earlyMinutes === 0 &&
    !v.forgotCheckIn && !v.forgotCheckOut  // Loại trừ ngày có quên chấm công
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

  console.log(`\n💰 TÍNH LƯƠNG:`)
  console.log(`  - Ngày công tính lương: ${actualWorkingDays} ngày`)
  console.log(`  - Phép có lương: ${leaveResult.paidLeaveDays} ngày`)
  console.log(`  - Lương theo công: ${(dailySalary * (actualWorkingDays + leaveResult.paidLeaveDays)).toLocaleString()} VNĐ`)
  console.log(`  - Phụ cấp: ${adjustmentResult.totalAllowances.toLocaleString()} VNĐ`)
  console.log(`  - OT: ${otResult.totalOTPay.toLocaleString()} VNĐ (${otResult.details.length} lần)`)
  console.log(`  - KPI Bonus: ${kpiBonus.toLocaleString()} VNĐ`)
  console.log(`  - Tổng thu nhập: ${grossSalary.toLocaleString()} VNĐ`)
  console.log(`  - Khấu trừ: ${adjustmentResult.totalDeductions.toLocaleString()} VNĐ`)
  console.log(`  - Phạt: ${adjustmentResult.totalPenalties.toLocaleString()} VNĐ`)
  console.log(`  - Thực lĩnh: ${netSalary.toLocaleString()} VNĐ`)
  console.log(`========== KẾT THÚC TÍNH LƯƠNG: ${emp.full_name} ==========\n`)

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
  if (consumed_days > 0) noteItems.push(`Consume deficit: ${consumed_days} ngày`)
  if (otResult.totalOTHours > 0) noteItems.push(`OT: ${otResult.totalOTHours}h`)
  if (kpiBonus > 0) noteItems.push(`KPI: ${kpiBonus.toLocaleString()}đ`)

  const consumedDeficitDetailStr =
    consumedDeficitDates.size > 0 ? [...consumedDeficitDates].sort().join(",") : null

  // Insert payroll item (lưu consumed theo tháng run để audit)
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
      consumed_deficit_days: consumed_days,
      consumed_deficit_detail: consumedDeficitDetailStr,
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
        requires_date_range, requires_single_date, requires_time_range,
        allows_multiple_time_slots
      ),
      time_slots:request_time_slots(*)
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

  // Helper: lấy from_time/to_time từ time_slots hoặc fallback
  const getEffectiveTimeRange = (request: any): { from_time: string | null; to_time: string | null } => {
    const slots = request.time_slots as any[] | null
    if (slots && slots.length > 0) {
      // Nếu có nhiều khung giờ, lấy khung giờ đầu tiên (dùng cho calculateDayFraction)
      // Trường hợp nhiều slot sẽ được xử lý riêng bên dưới
      return { from_time: slots[0].from_time, to_time: slots[0].to_time }
    }
    return { from_time: request.from_time, to_time: request.to_time }
  }

  // Helper: tính tổng phân số ngày từ nhiều khung giờ
  const calculateMultiSlotDayFraction = (request: any): number => {
    const slots = request.time_slots as any[] | null
    if (slots && slots.length > 1) {
      // Nhiều khung giờ: tính tổng phân số từ mỗi slot
      let totalFraction = 0
      for (const slot of slots) {
        totalFraction += calculateDayFraction(slot.from_time, slot.to_time)
      }
      // Cap tại 1 ngày
      return Math.min(totalFraction, 1)
    }
    // Một khung giờ hoặc không có: dùng logic cũ
    const { from_time, to_time } = getEffectiveTimeRange(request)
    return calculateDayFraction(from_time, to_time)
  }

  if (employeeRequests) {
    for (const request of employeeRequests) {
      const reqType = request.request_type as any
      if (!reqType) continue

      const code = reqType.code
      const affectsPayroll = reqType.affects_payroll === true

      if (code === "overtime") continue
      if ((MAKEUP_CODES as readonly string[]).includes(code)) continue
      if (!affectsPayroll && code !== "unpaid_leave") continue

      const { from_time: effFromTime, to_time: effToTime } = getEffectiveTimeRange(request)

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
        
        if (fullDays === 1 && (effFromTime && effToTime)) {
          days = calculateMultiSlotDayFraction(request)
        } else {
          days = fullDays
        }
      } else if (reqType.requires_single_date && request.request_date) {
        days = calculateMultiSlotDayFraction(request)
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
        
        if (fullDays === 1 && (effFromTime && effToTime)) {
          days = calculateMultiSlotDayFraction(request)
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
    .select(`from_date, to_date, from_time, to_time, time_slots:request_time_slots(*), request_type:request_types!inner(code, deduct_leave_balance)`)
    .eq("employee_id", employeeId)
    .eq("status", "approved")
    .gte("from_date", startOfYear)
    .lt("from_date", startDate)
    .filter("request_type.deduct_leave_balance", "eq", true)

  let historicUsed = 0
  if (historicRequests) {
    for (const hReq of historicRequests) {
      // Nếu có time_slots, dùng slot đầu tiên cho calculateLeaveDays (fallback)
      const slots = (hReq as any).time_slots as any[] | null
      const effFromTime = (slots && slots.length > 0) ? slots[0].from_time : hReq.from_time
      const effToTime = (slots && slots.length > 0) ? slots[0].to_time : hReq.to_time
      historicUsed += calculateLeaveDays(hReq.from_date, hReq.to_date || hReq.from_date, effFromTime, effToTime)
    }
  }

  const remainingBalance = Math.max(0, yearlyEntitlement - historicUsed)

  // Recalculate annual leave this month
  let annualLeaveThisMonth = 0
  if (employeeRequests) {
    for (const req of employeeRequests) {
      const reqType = req.request_type as any
      if (reqType.affects_payroll && reqType.deduct_leave_balance) {
        // Lấy from_time/to_time từ time_slots hoặc fallback
        const slots = (req as any).time_slots as any[] | null
        const effFromTime = (slots && slots.length > 0) ? slots[0].from_time : req.from_time
        const effToTime = (slots && slots.length > 0) ? slots[0].to_time : req.to_time
        const d = calculateLeaveDays(
          req.from_date,
          req.to_date || req.from_date,
          effFromTime,
          effToTime,
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

      // Kiểm tra phạm vi áp dụng: Nếu có assigned_employees thì chỉ áp dụng cho nhân viên được chọn
      const { data: assignedEmployees } = await supabase
        .from("adjustment_type_employees")
        .select("employee_id")
        .eq("adjustment_type_id", adjType.id)
      
      // Nếu có danh sách nhân viên được chọn (không rỗng)
      if (assignedEmployees && assignedEmployees.length > 0) {
        // Kiểm tra nhân viên hiện tại có trong danh sách không
        const isAssigned = assignedEmployees.some((ae: any) => ae.employee_id === emp.id)
        if (!isAssigned) {
          console.log(`[Adjustment] Bỏ qua ${adjType.name} - không áp dụng cho nhân viên này`)
          continue // Bỏ qua adjustment type này
        }
      }
      // Nếu không có ai được chọn (rỗng) -> áp dụng toàn công ty -> tiếp tục xử lý

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
          console.log(`\n[Allowance] Tính phụ cấp: ${adjType.name} (${adjType.code})`)
          
          const lateThresholdMinutes = rules?.late_threshold_minutes ?? 0
          const exemptWithRequest = rules?.exempt_with_request === true
          const exemptRequestTypes = rules?.exempt_request_types || []
          
          console.log(`[Allowance] - Ngưỡng đi muộn: ${lateThresholdMinutes} phút`)
          console.log(`[Allowance] - Miễn trừ nếu có phiếu: ${exemptWithRequest ? 'Có' : 'Không'}`)
          if (exemptWithRequest) {
            console.log(`[Allowance] - Loại phiếu được miễn: ${exemptRequestTypes.join(', ')}`)
          }
          
          // Lấy danh sách ngày có phiếu được duyệt (nếu bật miễn trừ)
          // Map: date -> Set<request_type_code>
          const exemptDatesByType = new Map<string, Set<string>>()
          if (exemptWithRequest && exemptRequestTypes.length > 0) {
            const { data: approvedRequests } = await supabase
              .from("employee_requests")
              .select(`
                request_date, from_date, to_date,
                request_type:request_types!request_type_id(code)
              `)
              .eq("employee_id", emp.id)
              .eq("status", "approved")
              .or(`and(request_date.gte.${startDate},request_date.lte.${endDate}),and(from_date.lte.${endDate},to_date.gte.${startDate})`)

            for (const req of approvedRequests || []) {
              const reqType = req.request_type as any
              if (!reqType || !exemptRequestTypes.includes(reqType.code)) continue
              
              // Xử lý phiếu có date range
              if (req.from_date && req.to_date) {
                const parseDate = (dateStr: string) => {
                  const [y, m, d] = dateStr.split('-').map(Number)
                  return new Date(Date.UTC(y, m - 1, d))
                }
                const reqFromDate = parseDate(req.from_date)
                const reqToDate = parseDate(req.to_date)
                const periodStart = parseDate(startDate)
                const periodEnd = parseDate(endDate)
                const reqStart = new Date(Math.max(reqFromDate.getTime(), periodStart.getTime()))
                const reqEnd = new Date(Math.min(reqToDate.getTime(), periodEnd.getTime()))
                
                const current = new Date(reqStart)
                while (current <= reqEnd) {
                  const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
                  if (!exemptDatesByType.has(dateStr)) {
                    exemptDatesByType.set(dateStr, new Set())
                  }
                  exemptDatesByType.get(dateStr)!.add(reqType.code)
                  current.setDate(current.getDate() + 1)
                }
              } else if (req.request_date) {
                if (!exemptDatesByType.has(req.request_date)) {
                  exemptDatesByType.set(req.request_date, new Set())
                }
                exemptDatesByType.get(req.request_date)!.add(reqType.code)
              }
            }
            console.log(`[Allowance] - Số ngày có phiếu miễn trừ: ${exemptDatesByType.size} ngày`)
          }
          
          const allowanceFullDays = violationsWithoutOT.filter((v) => 
            v.hasCheckIn && v.hasCheckOut && !v.isHalfDay && !v.isAbsent &&
            v.lateMinutes <= lateThresholdMinutes && v.earlyMinutes === 0 &&
            !v.forgotCheckIn && !v.forgotCheckOut  // Loại trừ ngày có quên chấm công
          ).length
          
          console.log(`[Allowance] - Ngày đủ điều kiện (chấm công đầy đủ, không vi phạm): ${allowanceFullDays} ngày`)
          
          // Đếm ngày vi phạm nhưng được miễn trừ do có phiếu
          const violationDaysWithExempt = violationsWithoutOT.filter((v) => {
            // Kiểm tra các loại vi phạm
            const hasLateViolation = v.lateMinutes > lateThresholdMinutes
            const hasEarlyViolation = v.earlyMinutes > 0
            const hasOtherViolation = v.forgotCheckOut || v.forgotCheckIn || v.isHalfDay || v.isAbsent
            
            const isViolation = hasLateViolation || hasEarlyViolation || hasOtherViolation
            if (!isViolation) return false
            
            // Nếu bật miễn trừ và ngày này có phiếu được duyệt -> kiểm tra loại phiếu
            if (exemptWithRequest && exemptDatesByType.has(v.date)) {
              const requestTypes = exemptDatesByType.get(v.date)!
              
              // Nếu đi muộn -> cần phiếu late_arrival
              if (hasLateViolation && requestTypes.has('late_arrival')) {
                return true
              }
              
              // Nếu về sớm -> cần phiếu early_leave
              if (hasEarlyViolation && requestTypes.has('early_leave')) {
                return true
              }
              
              // Các vi phạm khác (quên chấm công, nửa ngày) -> chấp nhận bất kỳ loại phiếu nào
              if (hasOtherViolation) {
                return true
              }
            }
            return false
          }).length
          
          console.log(`[Allowance] - Ngày vi phạm nhưng được miễn do có phiếu: ${violationDaysWithExempt} ngày`)
          
          const allowanceViolations = violationsWithoutOT.filter((v) => 
            v.lateMinutes > lateThresholdMinutes || v.earlyMinutes > 0 ||
            v.forgotCheckOut || v.forgotCheckIn || v.isHalfDay || v.isAbsent
          ).length - violationDaysWithExempt // Trừ đi số ngày được miễn
          
          console.log(`[Allowance] - Ngày vi phạm (không được miễn): ${allowanceViolations} ngày`)
          
          let eligibleDays = allowanceFullDays + violationDaysWithExempt // Cộng ngày được miễn
          console.log(`[Allowance] - Ngày đủ điều kiện ban đầu: ${eligibleDays} ngày (${allowanceFullDays} + ${violationDaysWithExempt})`)

          if (rules) {
            if (rules.late_grace_count !== undefined && allowanceViolations > 0) {
              const gracedViolationDays = Math.min(allowanceViolations, rules.late_grace_count)
              console.log(`[Allowance] - Số lần vi phạm được miễn (grace): ${gracedViolationDays} ngày (tối đa ${rules.late_grace_count})`)
              eligibleDays += gracedViolationDays
            }
            if (rules.deduct_on_absent && unpaidLeaveDays > 0) {
              console.log(`[Allowance] - Trừ ngày nghỉ không phép: ${unpaidLeaveDays} ngày`)
              eligibleDays -= unpaidLeaveDays
              eligibleDays = Math.max(0, eligibleDays)
            }
          }

          eligibleDays = Math.max(0, Math.floor(eligibleDays))
          const amount = eligibleDays * adjType.amount
          
          console.log(`[Allowance] - Tổng ngày được tính phụ cấp: ${eligibleDays} ngày`)
          console.log(`[Allowance] - Số tiền phụ cấp: ${eligibleDays} x ${adjType.amount.toLocaleString()}đ = ${amount.toLocaleString()}đ`)

          if (amount > 0) {
            let reasonParts = [`${eligibleDays} ngày x ${adjType.amount.toLocaleString()}đ`]
            if (violationDaysWithExempt > 0) {
              reasonParts.push(`(${violationDaysWithExempt} ngày miễn do có phiếu)`)
            }
            
            totalAllowances += amount
            adjustmentDetails.push({
              adjustment_type_id: adjType.id,
              category: "allowance",
              base_amount: allowanceFullDays * adjType.amount,
              adjusted_amount: (eligibleDays - allowanceFullDays) > 0 ? 0 : (allowanceFullDays - eligibleDays) * adjType.amount,
              final_amount: amount,
              reason: reasonParts.join(' '),
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
          console.log(`\n[Allowance] Tính phụ cấp cố định: ${adjType.name} (${adjType.code})`)
          console.log(`[Allowance] - Số tiền cố định: ${adjType.amount.toLocaleString()}đ`)
          
          if (rules?.full_deduct_threshold !== undefined) {
            console.log(`[Allowance] - Ngưỡng trừ toàn bộ: ${rules.full_deduct_threshold} lần đi muộn`)
            console.log(`[Allowance] - Số lần đi muộn: ${lateCount} lần`)
            console.log(`[Allowance] - Nghỉ không phép: ${unpaidLeaveDays} ngày`)
            console.log(`[Allowance] - Vắng mặt: ${absentDays} ngày`)
            
            const shouldDeduct = lateCount > rules.full_deduct_threshold || unpaidLeaveDays > 0 || absentDays > 0
            console.log(`[Allowance] - Kết quả: ${shouldDeduct ? 'MẤT phụ cấp' : 'ĐỦ điều kiện'}`)
            
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
            console.log(`[Allowance] - Không có điều kiện trừ, tính toàn bộ`)
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
          console.log(`\n[Allowance] Tính phụ cấp theo %: ${adjType.name} (${adjType.code})`)
          
          const calculateFrom = rules?.calculate_from || "base_salary"
          console.log(`[Allowance] - Tính từ: ${calculateFrom === "insurance_salary" ? "Lương BHXH" : "Lương cơ bản"}`)
          console.log(`[Allowance] - Tỷ lệ: ${adjType.amount}%`)
          
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
            console.log(`[Allowance] - Lương BHXH: ${insuranceSalary ? insuranceSalary.toLocaleString() : 'Không có'}đ`)
            
            if (!insuranceSalary || insuranceSalary <= 0) {
              console.log(`[Allowance] - Bỏ qua vì không có lương BHXH`)
              shouldSkip = true
            } else {
              salaryForCalculation = insuranceSalary
            }
          } else {
            console.log(`[Allowance] - Lương cơ bản: ${baseSalary.toLocaleString()}đ`)
          }
          
          if (!shouldSkip) {
            const percentageAmount = Math.round((salaryForCalculation * adjType.amount) / 100)
            console.log(`[Allowance] - Số tiền: ${salaryForCalculation.toLocaleString()} x ${adjType.amount}% = ${percentageAmount.toLocaleString()}đ`)
            
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
              const hasExemptRequest = v.approvedRequestTypes.some((t: string) => exemptRequestTypes.includes(t))
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
