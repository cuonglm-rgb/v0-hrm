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
import { MAKEUP_CODES, getMakeupDeficitLinks } from "@/lib/utils/makeup-utils"
import { PayrollLogger } from "@/lib/utils/payroll-logger"

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
  const logger = new PayrollLogger()
  const originalConsoleLog = console.log

  const { data: item } = await supabase
    .from("payroll_items")
    .select(`
      *,
      employee:employees(id, full_name, employee_code, shift_id, official_date, join_date, resignation_date),
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

  logger.section(`TÍNH LƯƠNG: ${emp.full_name} (${emp.employee_code}) - Tháng ${month}/${year}`)
  
  // Kiểm tra ngày nghỉ việc
  let effectiveEndDate = endDate
  if (emp.resignation_date) {
    const resignDate = emp.resignation_date
    if (resignDate < startDate) {
      logger.log(`⚠️  Nhân viên đã nghỉ việc trước kỳ lương (${resignDate}) - Bỏ qua`)
      return { success: false, error: `Nhân viên đã nghỉ việc trước kỳ lương (${resignDate})` }
    }
    if (resignDate < endDate) {
      effectiveEndDate = resignDate
      logger.log(`📅 Nhân viên nghỉ việc ngày ${resignDate} - Chỉ tính lương đến ngày này`)
    }
  }
  
  logger.log(`\nCông chuẩn: ${STANDARD_WORKING_DAYS} ngày`)
  logger.log(`Lương cơ bản: ${baseSalary.toLocaleString()} VNĐ`)
  logger.log(`-> Lương ngày: ${dailySalary.toLocaleString()} VNĐ`)

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
    .or(`and(check_in.gte.${startDate},check_in.lte.${effectiveEndDate}T23:59:59),and(check_in.is.null,check_out.gte.${startDate},check_out.lte.${effectiveEndDate}T23:59:59)`)

  const { data: overtimeRequestDates } = await supabase
    .from("employee_requests")
    .select(`request_date, from_time, to_time, time_slots:request_time_slots(*), request_type:request_types!request_type_id(code)`)
    .eq("employee_id", emp.id)
    .eq("status", "approved")
    .gte("request_date", startDate)
    .lte("request_date", effectiveEndDate)

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

  const { data: employeeRequests } = await supabase
    .from("employee_requests")
    .select(`
      *,
      request_type:request_types!request_type_id(code, name, affects_payroll, deduct_leave_balance, requires_date_range, requires_single_date)
    `)
    .eq("employee_id", emp.id)
    .eq("status", "approved")
    .or(`and(request_date.gte.${startDate},request_date.lte.${effectiveEndDate}),and(from_date.lte.${effectiveEndDate},to_date.gte.${startDate})`)

  // Query phân công lịch thứ 7 override theo nhân viên
  const { data: saturdaySchedules } = await supabase
    .from("saturday_work_schedule")
    .select("work_date, is_working")
    .eq("employee_id", emp.id)
    .gte("work_date", startDate)
    .lte("work_date", endDate)

  const saturdayScheduleMap = new Map<string, boolean>(
    (saturdaySchedules || []).map((s: any) => [s.work_date, s.is_working as boolean])
  )

  // Trả về true nếu thứ 7 đó là ngày LÀM VIỆC của nhân viên
  const isEmployeeWorkingSaturday = (dateStr: string): boolean => {
    if (saturdayScheduleMap.has(dateStr)) return saturdayScheduleMap.get(dateStr)!
    const [y, m, d] = dateStr.split('-').map(Number)
    return !isSaturdayOff(new Date(Date.UTC(y, m - 1, d)))
  }

  const makeupDates = new Set<string>()
  // Map: date -> { fromTime, toTime, dayFraction } for partial-day WFH requests
  const partialWfhDates = new Map<string, { fromTime: string, toTime: string, dayFraction: number }>()
  
  // Helper function to calculate day fraction for a request
  const calculateRequestDayFraction = (request: any): number => {
    const reqType = request.request_type as any
    const fromTime = request.from_time
    const toTime = request.to_time
    
    if (!fromTime || !toTime) return 1
    
    const fromMinutes = parseTime(fromTime)
    const toMinutes = parseTime(toTime)
    const morningHours = (breakStartMin - shiftStartMin) / 60
    const afternoonHours = (shiftEndMin - breakEndMin) / 60
    const totalWorkHours = morningHours + afternoonHours
    
    let leaveHours = (toMinutes - fromMinutes) / 60
    if (leaveHours <= 0) leaveHours = totalWorkHours
    
    // Check if it's morning or afternoon half-day
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
      if (reqType?.code === "full_day_makeup" && request.request_date) {
        makeupDates.add(request.request_date)
      }
      
      // Identify partial-day WFH requests
      // Handle both single date format (request_date) and date range format (from_date = to_date)
      if (reqType?.code === "work_from_home" && (request.request_date || (request.from_date === request.to_date))) {
        const dayFraction = calculateRequestDayFraction(request)
        if (dayFraction === 0.5) {
          // Get time range from from_time/to_time
          const fromTime = request.from_time
          const toTime = request.to_time
          
          if (fromTime && toTime) {
            const dateStr = request.request_date || request.from_date
            partialWfhDates.set(dateStr, { fromTime, toTime, dayFraction })
          }
        }
      }
    }
  }

  const leaveDates = new Set<string>()
  const halfDayLeaveDates = new Map<string, number>() // date -> 0.5 for half-day leaves
  
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
        const diffTime = reqEnd.getTime() - reqStart.getTime()
        const fullDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
        
        // Check if single-day leave with time range (potential half-day)
        if (fullDays === 1 && (request.from_time || request.to_time)) {
          const dayFraction = calculateRequestDayFraction(request)
          if (dayFraction === 0.5) {
            halfDayLeaveDates.set(request.from_date, 0.5)
          }
        }
        
        const current = new Date(reqStart)
        while (current <= reqEnd) {
          const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
          leaveDates.add(dateStr)
          current.setDate(current.getDate() + 1)
        }
      } else if (request.request_date) {
        leaveDates.add(request.request_date)
        
        // Check if this is a half-day leave
        if (reqType.requires_single_date && (request.from_time || request.to_time)) {
          const dayFraction = calculateRequestDayFraction(request)
          if (dayFraction === 0.5) {
            halfDayLeaveDates.set(request.request_date, 0.5)
          }
        }
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

  // Đếm ngày công (ngày làm bù full_day_makeup không tăng working days — chỉ consume deficit)
  let workingDaysCount = 0
  let fullDayCount = 0
  let halfDayAttendanceCount = 0
  const countedDates = new Set<string>()
  const attendanceDates = new Set<string>()
  const attendanceDayFractions = new Map<string, number>() // Track attendance fraction per date
  
  // Helper function to check if two time ranges overlap
  const timeRangesOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
    const s1 = parseTime(start1)
    const e1 = parseTime(end1)
    const s2 = parseTime(start2)
    const e2 = parseTime(end2)
    return s1 < e2 && s2 < e1
  }
  
  if (allAttendanceLogs) {
    for (const log of allAttendanceLogs) {
      const logDate = log.check_in ? toDateStringVN(log.check_in) : toDateStringVN(log.check_out)
      attendanceDates.add(logDate)
      if (makeupDates.has(logDate)) continue
      if (!overtimeDates.has(logDate) && !countedDates.has(logDate)) {
        // Bỏ qua thứ 7 nghỉ: nhân viên tự đến không có phiếu OT
        const [ly, lm, ld] = logDate.split('-').map(Number)
        if (new Date(Date.UTC(ly, lm - 1, ld)).getUTCDay() === 6 && !isEmployeeWorkingSaturday(logDate)) {
          logger.log(`📋 Ngày ${logDate}: Thứ 7 nghỉ của nhân viên, chấm công tự phát - không tính ngày công`)
          continue
        }

        // Check if this day has a half-day leave request
        const halfDayFraction = halfDayLeaveDates.get(logDate)
        
        // Check if this day has a partial-day WFH request
        const partialWfh = partialWfhDates.get(logDate)
        
        if (halfDayFraction) {
          // Count as 0.5 day (the other 0.5 is in paidLeaveDays)
          workingDaysCount += 0.5
          halfDayAttendanceCount++
          attendanceDayFractions.set(logDate, 0.5)
        } else if (partialWfh) {
          // Check for time overlap between WFH and attendance
          const checkInTime = log.check_in ? new Date(log.check_in).toISOString().slice(11, 16) : null
          const checkOutTime = log.check_out ? new Date(log.check_out).toISOString().slice(11, 16) : null
          
          if (checkInTime && checkOutTime) {
            const hasOverlap = timeRangesOverlap(partialWfh.fromTime, partialWfh.toTime, checkInTime, checkOutTime)
            
            if (hasOverlap) {
              // Overlap detected - prioritize physical attendance, don't count WFH portion
              // Count as full day attendance (WFH will be ignored in processLeaveRequests)
              workingDaysCount++
              fullDayCount++
              attendanceDayFractions.set(logDate, 1.0)
            } else {
              // No overlap - count as 0.5 day attendance (the other 0.5 is WFH)
              workingDaysCount += 0.5
              halfDayAttendanceCount++
              attendanceDayFractions.set(logDate, 0.5)
            }
          } else {
            // Missing check-in or check-out time, assume 0.5 day attendance
            workingDaysCount += 0.5
            halfDayAttendanceCount++
            attendanceDayFractions.set(logDate, 0.5)
          }
        } else {
          // Count as full day
          workingDaysCount++
          fullDayCount++
          attendanceDayFractions.set(logDate, 1.0)
        }
        countedDates.add(logDate)
      }
    }
  }

  let consumed_days = 0
  const consumedDetailPairs: string[] = []
  const makeupLogLines: string[] = []
  if (employeeRequests) {
    for (const request of employeeRequests) {
      const reqType = request.request_type as any
      if (reqType?.code !== "full_day_makeup" || !request.request_date) continue
      const links = getMakeupDeficitLinks((request.custom_data as Record<string, unknown>) || null)
      const hasAttendance = attendanceDates.has(request.request_date)
      const linkDesc = links.map((l) => `${l.deficit_date}:${l.amount}`).join(", ")
      const requestSum = links.reduce((s, l) => s + l.amount, 0)
      if (hasAttendance) {
        consumed_days += requestSum
        for (const link of links) consumedDetailPairs.push(`${link.deficit_date}:${link.amount}`)
        makeupLogLines.push(`  [COUNTED] request_id=${request.id} ngày làm bù=${request.request_date} có chấm công → bù ${linkDesc} (cộng ${requestSum} ngày)`)
      } else {
        makeupLogLines.push(`  [SKIP] request_id=${request.id} ngày làm bù=${request.request_date} không có chấm công → không cộng (links: ${linkDesc || "—"})`)
      }
    }
  }
  consumedDetailPairs.sort()
  logger.subsection(`📋 LÀM BÙ (full_day_makeup) — ${emp.full_name} (${emp.employee_code || emp.id}):`)
  if (makeupLogLines.length === 0) {
    logger.log(`Không có phiếu full_day_makeup đã duyệt trong kỳ.`)
  } else {
    makeupLogLines.forEach((line) => logger.log(line))
    logger.log(`→ Tổng consumed_days = ${consumed_days} ngày${consumedDetailPairs.length > 0 ? ` | Chi tiết: ${consumedDetailPairs.join(", ")}` : ""}`)
  }

  logger.subsection(`📊 Attendance logs: ${allAttendanceLogs?.length || 0} bản ghi`)
  logger.subsection(`📊 Ngày công từ chấm công (trừ ngày làm bù):`)
  logger.log(`- Full days: ${fullDayCount} ngày`)
  logger.log(`- Half days: ${halfDayAttendanceCount} ngày (= ${halfDayAttendanceCount * 0.5} ngày công)`)
  logger.log(`- Tổng: ${workingDaysCount} ngày`)
  logger.subsection(`📊 Consumed deficit (bù thiếu, theo amount): ${consumed_days} ngày${consumedDetailPairs.length > 0 ? ` (${consumedDetailPairs.join(", ")})` : ""}`)
  logger.subsection(`📊 OT full day: ${overtimeDates.size} ngày, OT trong ca: ${overtimeWithinShift.size} ngày`)

  // Lấy danh sách ngày lễ và ngày nghỉ công ty
  const holidays = await listHolidays(year)
  const holidayDates = new Set(
    holidays
      .filter(h => h.holiday_date >= startDate && h.holiday_date <= effectiveEndDate)
      .map(h => h.holiday_date)
  )
  const holidayMap = new Map(
    holidays
      .filter(h => h.holiday_date >= startDate && h.holiday_date <= effectiveEndDate)
      .map(h => [h.holiday_date, h.name])
  )
  
  // Query ngày nghỉ công ty kèm danh sách nhân viên được áp dụng
  const { data: specialDays } = await supabase
    .from("special_work_days")
    .select(`
      work_date, 
      is_company_holiday,
      reason,
      assigned_employees:special_work_day_employees(employee_id)
    `)
    .eq("is_company_holiday", true)
    .gte("work_date", startDate)
    .lte("work_date", effectiveEndDate)
  
  // Lọc ngày nghỉ công ty áp dụng cho nhân viên này
  // Quy tắc: Nếu không có assigned_employees -> áp dụng toàn công ty
  //          Nếu có assigned_employees -> chỉ áp dụng nếu nhân viên nằm trong danh sách
  const companyHolidayDates = new Set<string>()
  const companyHolidayMap = new Map<string, string>()
  
  for (const s of specialDays || []) {
    const assignedEmps = s.assigned_employees || []
    // Nếu không có ai được chọn -> áp dụng toàn công ty
    if (assignedEmps.length === 0) {
      companyHolidayDates.add(s.work_date)
      companyHolidayMap.set(s.work_date, s.reason || "Nghỉ công ty")
    } else if (assignedEmps.some((ae: any) => ae.employee_id === emp.id)) {
      // Nếu có danh sách -> kiểm tra nhân viên có trong danh sách không
      companyHolidayDates.add(s.work_date)
      companyHolidayMap.set(s.work_date, s.reason || "Nghỉ công ty")
    }
  }

  // Process leave requests (employeeRequests đã query ở trên)
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
      if ((MAKEUP_CODES as readonly string[]).includes(code)) continue
      if (!affectsPayroll && code !== "unpaid_leave") continue

      let days = 0
      let requestDate: string | null = null
      
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
          requestDate = request.from_date
        } else {
          days = fullDays
        }
      } else if (reqType.requires_single_date && request.request_date) {
        days = calculateDayFraction(request.from_time, request.to_time)
        requestDate = request.request_date
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
          requestDate = request.from_date
        } else {
          days = fullDays
        }
      }

      if (days <= 0) continue

      if (code === "unpaid_leave") {
        unpaidLeaveDays += days
      } else if (code === "work_from_home" && affectsPayroll) {
        // Xử lý WFH: chỉ cộng phần chưa được tính từ attendance
        if (requestDate) {
          // Single date: check attendance cho ngày đó
          if (attendanceDayFractions.has(requestDate)) {
            const attendanceFraction = attendanceDayFractions.get(requestDate) || 0
            // WFH to add = 1 - attendance fraction (regardless of WFH request duration)
            const wfhToAdd = Math.max(0, 1 - attendanceFraction)
            workFromHomeDays += wfhToAdd
          } else {
            workFromHomeDays += days
          }
        } else if (request.from_date && request.to_date) {
          // Date range: check attendance cho từng ngày
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
            
            if (attendanceDayFractions.has(dateStr)) {
              const attendanceFraction = attendanceDayFractions.get(dateStr) || 0
              const wfhToAdd = Math.max(0, 1 - attendanceFraction)
              workFromHomeDays += wfhToAdd
            } else {
              workFromHomeDays += 1
            }
            
            current.setDate(current.getDate() + 1)
          }
        } else {
          workFromHomeDays += days
        }
      } else if (affectsPayroll) {
        paidLeaveDays += days
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
  const periodEnd = parseDate(effectiveEndDate)
  
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

  // Log chi tiết ngày lễ
  logger.subsection(`🎉 Ngày lễ trong tháng: ${holidayDates.size} ngày`)
  if (holidayDates.size > 0) {
    const sortedHolidays = Array.from(holidayDates).sort()
    for (const date of sortedHolidays) {
      const name = holidayMap.get(date) || "Ngày lễ"
      logger.log(`- ${date}: ${name}`)
    }
  }

  // Log chi tiết ngày nghỉ công ty
  logger.subsection(`🏢 Ngày nghỉ công ty: ${companyHolidayDates.size} ngày`)
  if (companyHolidayDates.size > 0) {
    const sortedCompanyHolidays = Array.from(companyHolidayDates).sort()
    for (const date of sortedCompanyHolidays) {
      const reason = companyHolidayMap.get(date) || "Nghỉ công ty"
      logger.log(`- ${date}: ${reason}`)
    }
  }

  logger.subsection(`🎁 Ngày lễ được cộng (ngày làm việc, không đi & không nghỉ): ${holidayWorkDays} ngày`)
  logger.subsection(`🎁 Ngày nghỉ công ty được cộng: ${companyHolidayWorkDays} ngày`)
  logger.subsection(`📊 Tổng working days sau cộng: ${workingDaysCount} ngày`)

  // Get violations
  const shiftInfo: ShiftInfo = {
    startTime: shiftStart,
    endTime: shiftEnd,
    breakStart: breakStart || null,
    breakEnd: breakEnd || null,
  }
  
  // Capture console.log từ getEmployeeViolations (chỉ lấy log quan trọng)
  const violationLogs: string[] = []
  console.log = (...args: any[]) => {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
    // Chỉ capture log về phiếu và xử lý, bỏ qua log chi tiết từng ngày
    if (message.includes('[Violations] Tìm thấy') || 
        message.includes('[Violations] Phiếu') || 
        message.includes('[Violations] Xử lý') ||
        (message.includes('[Violations]') && message.includes('Chỉ làm ca'))) {
      violationLogs.push(message)
    }
    originalConsoleLog(...args)
  }
  
  const violations = await getEmployeeViolations(supabase, emp.id, startDate, effectiveEndDate, shiftInfo)
  
  // Restore console.log và thêm logs vào logger
  console.log = originalConsoleLog
  violationLogs.forEach(log => logger.log(log))
  
  const violationsWithoutOT = violations.filter((v) => !overtimeDates.has(v.date))

  // Log violations với giờ chấm công thực tế (thay thế log cũ)
  logger.subsection(`📋 CHI TIẾT CHẤM CÔNG:`)
  for (const log of allAttendanceLogs || []) {
    const logDate = log.check_in ? toDateStringVN(log.check_in) : toDateStringVN(log.check_out)
    const checkInTime = log.check_in ? new Date(log.check_in).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }) : null
    const checkOutTime = log.check_out ? new Date(log.check_out).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }) : null
    
    // Kiểm tra có phiếu quên chấm công không
    const violation = violations.find(v => v.date === logDate)
    const hasCheckInRequest = violation?.forgotCheckIn || false
    const hasCheckOutRequest = violation?.forgotCheckOut || false
    const isHalfDay = violation?.isHalfDay || false
    
    logger.violation(logDate, checkInTime, checkOutTime, hasCheckInRequest, hasCheckOutRequest, isHalfDay)
  }

  logger.log(`[Debug] Tổng violations: ${violations.length}`)
  logger.log(`[Debug] Violations without OT: ${violationsWithoutOT.length}`)
  logger.log(`[Debug] Violations có forgotCheckIn: ${violations.filter(v => v.forgotCheckIn).map(v => v.date).join(', ')}`)
  logger.log(`[Debug] Violations có forgotCheckOut: ${violations.filter(v => v.forgotCheckOut).map(v => v.date).join(', ')}`)

  const absentDays = violationsWithoutOT.filter((v) => v.isAbsent).length
  const halfDays = violationsWithoutOT.filter((v) => v.isHalfDay && !v.isAbsent).length
  // workingDaysCount đã tính đúng half-day rồi (0.5), không cần trừ thêm
  // consumed_days chỉ để audit, KHÔNG cộng vào công vì ngày làm bù đã được tính trong workingDaysCount
  const actualAttendanceDays = workingDaysCount
  const lateCount = violationsWithoutOT.filter((v) => v.lateMinutes > 0 && !v.isHalfDay).length
  const forgotCheckinCount = violationsWithoutOT.filter((v) => v.forgotCheckIn).length
  const forgotCheckoutCount = violationsWithoutOT.filter((v) => v.forgotCheckOut).length

  logger.subsection(`📝 PHIẾU NGHỈ:`)
  logger.log(`- Nghỉ phép có lương: ${paidLeaveDays} ngày`)
  logger.log(`- Nghỉ không lương: ${unpaidLeaveDays} ngày`)
  logger.log(`- Work from home: ${workFromHomeDays} ngày`)
  
  logger.subsection(`⚠️  VI PHẠM:`)
  logger.log(`- Vắng mặt: ${absentDays} ngày`)
  logger.log(`- Làm nửa ngày: ${halfDays} lần`)
  logger.log(`- Đi muộn: ${lateCount} lần`)
  logger.log(`- Quên chấm công đến: ${forgotCheckinCount} lần`)
  logger.log(`- Quên chấm công về: ${forgotCheckoutCount} lần`)
  logger.log(`- Actual attendance: ${actualAttendanceDays} ngày (chấm công thực tế, consumed ${consumed_days} chỉ để audit)`)

  // Tính ngày đủ giờ cho phụ cấp - giống hệt generate-payroll.ts
  const fullAttendanceDays = violationsWithoutOT.filter((v) => 
    v.hasCheckIn && v.hasCheckOut && !v.isHalfDay && !v.isAbsent &&
    v.lateMinutes === 0 && v.earlyMinutes === 0 &&
    !v.forgotCheckIn && !v.forgotCheckOut  // Loại trừ ngày có quên chấm công
  ).length

  const { data: empAdjustments } = await supabase
    .from("employee_adjustments")
    .select("*, adjustment_type:payroll_adjustment_types(*)")
    .eq("employee_id", emp.id)
    .lte("effective_date", endDate)
    .or(`end_date.is.null,end_date.gte.${startDate}`)

  // Process adjustments - sử dụng hàm chung từ generate-payroll.ts
  // Capture console.log từ processAdjustments
  const adjustmentLogs: string[] = []
  console.log = (...args: any[]) => {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
    adjustmentLogs.push(message)
    originalConsoleLog(...args)
  }

  const adjustmentResult = await processAdjustments(
    supabase, emp, baseSalary, dailySalary, month, year,
    adjustmentTypes, empAdjustments, violationsWithoutOT,
    fullAttendanceDays, lateCount, unpaidLeaveDays, absentDays,
    allAttendanceLogs || [], startDate, effectiveEndDate
  )

  // Restore console.log và thêm logs vào logger
  console.log = originalConsoleLog
  adjustmentLogs.forEach(log => logger.log(log))

  const { totalAllowances, totalDeductions, totalPenalties, details: adjustmentDetails } = adjustmentResult

  // OT
  // Capture console.log từ calculateOvertimePay
  const otLogs: string[] = []
  console.log = (...args: any[]) => {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
    otLogs.push(message)
    originalConsoleLog(...args)
  }

  const otResult = await calculateOvertimePay(emp.id, baseSalary, STANDARD_WORKING_DAYS, startDate, effectiveEndDate)
  
  // Restore console.log và thêm logs vào logger
  console.log = originalConsoleLog
  otLogs.forEach(log => logger.log(log))
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
  
  // Tính tự động nghỉ không lương cho những ngày không có chấm công và không có phiếu
  // Công thức: Nghỉ KL = Công chuẩn - Ngày công - Nghỉ phép - Nghỉ KL (có phiếu) - Vắng mặt
  const totalAccountedDays = actualWorkingDays + paidLeaveDays + unpaidLeaveDays + absentDays
  const autoUnpaidLeaveDays = Math.max(0, STANDARD_WORKING_DAYS - totalAccountedDays)
  const finalUnpaidLeaveDays = unpaidLeaveDays + autoUnpaidLeaveDays
  
  const grossSalary = dailySalary * (actualWorkingDays + paidLeaveDays) + totalAllowances + otResult.totalOTPay + kpiBonus
  const totalDeduction = totalDeductions + totalPenalties
  const netSalary = grossSalary - totalDeduction

  // Thêm phần tổng kết
  logger.subsection(`📊 TỔNG KẾT:`)
  logger.log(`- Công chuẩn: ${STANDARD_WORKING_DAYS} ngày`)
  logger.log(`- Ngày công thực tế: ${actualWorkingDays} ngày`)
  logger.log(`- Ngày công bù: ${consumed_days} ngày`)
  logger.log(`- Nghỉ phép có lương: ${paidLeaveDays} ngày`)
  logger.log(`- Nghỉ không lương (có phiếu): ${unpaidLeaveDays} ngày`)
  if (autoUnpaidLeaveDays > 0) {
    logger.log(`- Nghỉ không lương (tự động): ${autoUnpaidLeaveDays} ngày`)
  }
  logger.log(`- Nghỉ không lương (tổng): ${finalUnpaidLeaveDays} ngày`)
  logger.log(`- Vắng mặt: ${absentDays} ngày`)
  
  const totalAllDays = actualWorkingDays + paidLeaveDays + finalUnpaidLeaveDays + absentDays
  logger.log(`- Tổng: ${totalAllDays} ngày`)
  
  // Kiểm tra công thức: Ngày công + Nghỉ phép + Nghỉ KL = Công chuẩn (consumed_days chỉ để audit, không tính vào công thức)
  const formulaTotal = actualWorkingDays + paidLeaveDays + finalUnpaidLeaveDays
  logger.log(``)
  logger.log(`✓ Kiểm tra công thức: ${actualWorkingDays} (công) + ${paidLeaveDays} (phép) + ${finalUnpaidLeaveDays} (KL) = ${formulaTotal} ngày`)
  if (consumed_days > 0) {
    logger.log(`  (Ngày bù ${consumed_days} chỉ để audit, không cộng vào công thức vì đã tính trong chấm công)`)
  }
  
  if (formulaTotal < STANDARD_WORKING_DAYS) {
    logger.log(`⚠️  Thiếu ${STANDARD_WORKING_DAYS - formulaTotal} ngày so với công chuẩn`)
  } else if (formulaTotal > STANDARD_WORKING_DAYS) {
    logger.log(`⚠️  Vượt ${formulaTotal - STANDARD_WORKING_DAYS} ngày so với công chuẩn`)
  } else {
    logger.log(`✅ Đúng công chuẩn (${STANDARD_WORKING_DAYS} ngày)`)
  }
  logger.log(`- Ngày công thực tế: ${actualWorkingDays} ngày`)
  logger.log(`- Nghỉ phép có lương: ${paidLeaveDays} ngày`)
  logger.log(`- Nghỉ không lương: ${finalUnpaidLeaveDays} ngày`)
  logger.log(`- Vắng mặt: ${absentDays} ngày`)
  logger.log(`- Tổng: ${totalAllDays} ngày`)
  if (totalAllDays < STANDARD_WORKING_DAYS) {
    logger.log(`⚠️  Thiếu ${STANDARD_WORKING_DAYS - totalAllDays} ngày so với công chuẩn`)
  } else if (totalAllDays > STANDARD_WORKING_DAYS) {
    logger.log(`✅ Vượt ${totalAllDays - STANDARD_WORKING_DAYS} ngày so với công chuẩn`)
  } else {
    logger.log(`✅ Đủ công chuẩn`)
  }

  logger.subsection(`💰 TÍNH LƯƠNG:`)
  logger.log(`- Lương cơ bản: ${baseSalary.toLocaleString()} VNĐ`)
  logger.log(`- Lương ngày: ${dailySalary.toLocaleString()} VNĐ`)
  logger.log(`- Ngày công tính lương: ${actualWorkingDays} ngày`)
  logger.log(`- Phép có lương: ${paidLeaveDays} ngày`)
  logger.log(`- Lương theo công: ${(dailySalary * (actualWorkingDays + paidLeaveDays)).toLocaleString()} VNĐ`)
  logger.log(`- Phụ cấp: ${totalAllowances.toLocaleString()} VNĐ`)
  logger.log(`- OT: ${otResult.totalOTPay.toLocaleString()} VNĐ (${otResult.details.length} lần)`)
  logger.log(`- KPI Bonus: ${kpiBonus.toLocaleString()} VNĐ`)
  logger.log(`- Tổng thu nhập: ${grossSalary.toLocaleString()} VNĐ`)
  logger.log(`- Khấu trừ: ${totalDeductions.toLocaleString()} VNĐ`)
  logger.log(`- Phạt: ${totalPenalties.toLocaleString()} VNĐ`)
  logger.log(`- Thực lĩnh: ${netSalary.toLocaleString()} VNĐ`)
  

  
  logger.section(`KẾT THÚC TÍNH LƯƠNG: ${emp.full_name}`)

  const consumedDeficitDetailStr = consumedDetailPairs.length > 0 ? consumedDetailPairs.join(",") : null

  // Lưu log vào database
  const calculationLog = logger.getLog()

  // Restore console.log
  console.log = originalConsoleLog

  await supabase
    .from("payroll_items")
    .update({
      working_days: actualWorkingDays,
      makeup_days: consumed_days,
      leave_days: paidLeaveDays,
      unpaid_leave_days: finalUnpaidLeaveDays,
      base_salary: baseSalary,
      allowances: totalAllowances + otResult.totalOTPay + kpiBonus,
      total_income: grossSalary,
      total_deduction: totalDeduction,
      net_salary: netSalary,
      standard_working_days: STANDARD_WORKING_DAYS,
      consumed_deficit_days: consumed_days,
      consumed_deficit_detail: consumedDeficitDetailStr,
      calculation_log: calculationLog,
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
