"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type {
  PayrollRun,
  PayrollItemWithRelations,
  SalaryStructure,
  PayrollAdjustmentType,
} from "@/lib/types/database"
import { calculateOvertimePay, listHolidays } from "./overtime-actions"

// =============================================
// TÍNH CÔNG CHUẨN ĐỘNG THEO THÁNG
// =============================================

// Tuần gốc để xác định quy luật thứ 7 xen kẽ
// Tuần chứa ngày 6/1/2026 là tuần NGHỈ thứ 7
// Dùng số tuần ISO để xác định: tuần lẻ nghỉ, tuần chẵn làm (hoặc ngược lại)
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
function isSaturdayOff(date: Date): boolean {
  const refWeek = getISOWeekNumber(REFERENCE_DATE)
  const currentWeek = getISOWeekNumber(date)
  
  // Nếu tuần gốc nghỉ, thì các tuần cùng tính chẵn/lẻ với tuần gốc cũng nghỉ
  const refIsOdd = refWeek % 2 === 1
  const currentIsOdd = currentWeek % 2 === 1
  
  if (REFERENCE_WEEK_IS_OFF) {
    // Tuần gốc nghỉ → tuần cùng loại (chẵn/lẻ) cũng nghỉ
    return refIsOdd === currentIsOdd
  } else {
    // Tuần gốc làm → tuần khác loại nghỉ
    return refIsOdd !== currentIsOdd
  }
}

// Tính công chuẩn của một tháng
export async function calculateStandardWorkingDays(month: number, year: number): Promise<{
  totalDays: number
  sundays: number
  saturdaysOff: number
  holidays: number
  standardDays: number
}> {
  // Lấy danh sách ngày lễ
  const holidays = await listHolidays(year)
  const holidayDates = new Set(holidays.map(h => h.holiday_date))
  
  const firstDay = new Date(Date.UTC(year, month - 1, 1))
  const lastDay = new Date(Date.UTC(year, month, 0)).getDate()
  
  let sundays = 0
  let saturdaysOff = 0
  let holidayCount = 0
  
  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(Date.UTC(year, month - 1, day))
    const dayOfWeek = date.getUTCDay()
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    
    // Đếm Chủ nhật
    if (dayOfWeek === 0) {
      sundays++
      continue // Không đếm ngày lễ trùng Chủ nhật
    }
    
    // Đếm Thứ 7 nghỉ (xen kẽ)
    if (dayOfWeek === 6 && isSaturdayOff(date)) {
      saturdaysOff++
      continue // Không đếm ngày lễ trùng Thứ 7 nghỉ
    }
    
    // Đếm ngày lễ (không trùng với ngày nghỉ cuối tuần)
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

// =============================================
// EMPLOYEE ACTIONS
// =============================================

export async function getMyPayslips(): Promise<PayrollItemWithRelations[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return []

  const { data, error } = await supabase
    .from("payroll_items")
    .select(
      `
      *,
      payroll_run:payroll_runs(*)
    `
    )
    .eq("employee_id", employee.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching payslips:", error)
    return []
  }

  return (data || []) as PayrollItemWithRelations[]
}

// =============================================
// HR ACTIONS - PAYROLL RUNS
// =============================================

export async function listPayrollRuns(): Promise<PayrollRun[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payroll_runs")
    .select("*")
    .order("year", { ascending: false })
    .order("month", { ascending: false })

  if (error) {
    console.error("Error listing payroll runs:", error)
    return []
  }

  return data || []
}

export async function getPayrollRun(id: string): Promise<PayrollRun | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payroll_runs")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching payroll run:", error)
    return null
  }

  return data
}

export async function getPayrollItems(
  payroll_run_id: string
): Promise<PayrollItemWithRelations[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payroll_items")
    .select(
      `
      *,
      employee:employees(id, full_name, employee_code, department_id, department:departments(name))
    `
    )
    .eq("payroll_run_id", payroll_run_id)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching payroll items:", error)
    return []
  }

  return (data || []) as PayrollItemWithRelations[]
}

// =============================================
// HR ACTIONS - GENERATE PAYROLL (với phụ cấp, quỹ, phạt)
// =============================================

interface AttendanceViolation {
  date: string
  lateMinutes: number
  earlyMinutes: number
  isHalfDay: boolean // Nghỉ nửa ngày (ca sáng hoặc ca chiều)
  isAbsent: boolean // Không tính công (đi muộn >1 tiếng không có phép)
  hasApprovedRequest: boolean
  approvedRequestTypes: string[] // Các loại phiếu đã approved ["late_arrival", "early_leave", "half_day_leave"]
}

interface ShiftInfo {
  startTime: string // "08:00"
  endTime: string // "17:00"
  breakStart: string | null // "12:00"
  breakEnd: string | null // "13:30"
}

interface ApprovedRequest {
  date: string
  types: string[] // ["late_arrival", "early_leave", "half_day_leave"]
}

async function getEmployeeViolations(
  supabase: any,
  employeeId: string,
  startDate: string,
  endDate: string,
  shift: ShiftInfo
): Promise<AttendanceViolation[]> {
  const violations: AttendanceViolation[] = []

  // Lấy attendance logs
  const { data: logs } = await supabase
    .from("attendance_logs")
    .select("check_in, check_out")
    .eq("employee_id", employeeId)
    .gte("check_in", startDate)
    .lte("check_in", endDate + "T23:59:59")

  // Lấy phiếu đã approved từ employee_requests
  const { data: approvedRequests } = await supabase
    .from("employee_requests")
    .select(`
      request_date,
      request_type:request_types!request_type_id(code)
    `)
    .eq("employee_id", employeeId)
    .eq("status", "approved")
    .gte("request_date", startDate)
    .lte("request_date", endDate)

  // Group by date với các loại phiếu
  const approvedByDate = new Map<string, string[]>()
  
  for (const req of approvedRequests || []) {
    const reqType = req.request_type as any
    if (reqType?.code) {
      const types = approvedByDate.get(req.request_date) || []
      types.push(reqType.code)
      approvedByDate.set(req.request_date, types)
    }
  }

  if (logs) {
    const [shiftH, shiftM] = shift.startTime.split(":").map(Number)
    const shiftStartMinutes = shiftH * 60 + shiftM

    // Parse break times
    let breakStartMinutes = 0
    let breakEndMinutes = 0
    if (shift.breakStart && shift.breakEnd) {
      const [bsH, bsM] = shift.breakStart.split(":").map(Number)
      const [beH, beM] = shift.breakEnd.split(":").map(Number)
      breakStartMinutes = bsH * 60 + bsM
      breakEndMinutes = beH * 60 + beM
    }

    for (const log of logs) {
      if (!log.check_in) continue

      const checkInDate = new Date(log.check_in)
      const dateStr = checkInDate.toISOString().split("T")[0]
      const checkInHour = checkInDate.getHours()
      const checkInMin = checkInDate.getMinutes()
      const checkInMinutes = checkInHour * 60 + checkInMin

      const approvedRequestTypes = approvedByDate.get(dateStr) || []
      const hasApprovedRequest = approvedRequestTypes.length > 0

      // Parse shift end time
      const [shiftEndH, shiftEndM] = shift.endTime.split(":").map(Number)
      const shiftEndMinutes = shiftEndH * 60 + shiftEndM

      // Parse check out time
      let checkOutMinutes = 0
      let hasCheckOut = false
      if (log.check_out) {
        const checkOutDate = new Date(log.check_out)
        checkOutMinutes = checkOutDate.getHours() * 60 + checkOutDate.getMinutes()
        hasCheckOut = true
      }

      // Kiểm tra nếu check in trong giờ nghỉ trưa hoặc sau giờ nghỉ trưa
      // => Nghỉ ca sáng, đi làm ca chiều (tính nửa ngày)
      let isHalfDay = false
      let lateMinutes = 0
      let earlyMinutes = 0

      if (breakStartMinutes > 0 && breakEndMinutes > 0) {
        // Check in trong khoảng nghỉ trưa hoặc đầu ca chiều
        if (checkInMinutes >= breakStartMinutes && checkInMinutes <= breakEndMinutes + 15) {
          // Check in từ 12:00 đến 13:45 => nghỉ ca sáng, đi ca chiều
          isHalfDay = true
          lateMinutes = 0 // Không tính là đi muộn
        } else if (checkInMinutes > breakEndMinutes + 15) {
          // Check in sau 13:45 => đi muộn ca chiều
          lateMinutes = checkInMinutes - breakEndMinutes
          isHalfDay = true
        } else {
          // Check in trước giờ nghỉ trưa => tính đi muộn bình thường
          lateMinutes = Math.max(0, checkInMinutes - shiftStartMinutes)
          
          // Kiểm tra check out sớm (trước hoặc trong giờ nghỉ trưa)
          // => Chỉ làm ca sáng, nghỉ ca chiều (tính nửa ngày)
          if (hasCheckOut && checkOutMinutes <= breakEndMinutes) {
            // Check out trước 13:00 (hoặc breakEnd) => chỉ làm ca sáng
            isHalfDay = true
            earlyMinutes = shiftEndMinutes - checkOutMinutes
          }
        }
      } else {
        // Không có giờ nghỉ trưa => tính đi muộn bình thường
        lateMinutes = Math.max(0, checkInMinutes - shiftStartMinutes)
      }

      // Đi muộn >60 phút và không có phép => không tính công (isAbsent)
      const isAbsent = lateMinutes > 60 && !hasApprovedRequest

      violations.push({
        date: dateStr,
        lateMinutes,
        earlyMinutes,
        isHalfDay,
        isAbsent,
        hasApprovedRequest,
        approvedRequestTypes, // Lưu các loại phiếu đã approved
      })
    }
  }

  return violations
}

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
    if (existingRun.status !== "draft") {
      return { success: false, error: "Bảng lương tháng này đã khóa, không thể tạo lại" }
    }
    // Xóa payroll items và adjustment details cũ
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
    .insert({
      month,
      year,
      status: "draft",
      created_by: user.id,
    })
    .select()
    .single()

  if (runError) {
    console.error("Error creating payroll run:", runError)
    return { success: false, error: runError.message }
  }

  // Lấy danh sách nhân viên active hoặc onboarding
  const { data: employees, error: empError } = await supabase
    .from("employees")
    .select("id, full_name, employee_code, shift_id")
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
  // Tính ngày cuối tháng đúng cách (tránh timezone issues)
  const lastDay = new Date(year, month, 0).getDate() // Lấy số ngày trong tháng
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`

  // Tính công chuẩn động theo tháng
  const workingDaysInfo = await calculateStandardWorkingDays(month, year)
  const STANDARD_WORKING_DAYS = workingDaysInfo.standardDays
  
  console.log(`[Payroll] Tháng ${month}/${year}: Tổng ${workingDaysInfo.totalDays} ngày, CN: ${workingDaysInfo.sundays}, T7 nghỉ: ${workingDaysInfo.saturdaysOff}, Lễ: ${workingDaysInfo.holidays} => Công chuẩn: ${STANDARD_WORKING_DAYS} ngày`)

  let processedCount = 0
  for (const emp of employees) {
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
    const dailySalary = baseSalary / STANDARD_WORKING_DAYS

    // Đếm ngày công
    const { count: workingDaysCount } = await supabase
      .from("attendance_logs")
      .select("*", { count: "exact", head: true })
      .eq("employee_id", emp.id)
      .gte("check_in", startDate)
      .lte("check_in", endDate + "T23:59:59")

    // =============================================
    // XỬ LÝ CÁC PHIẾU TỪ EMPLOYEE_REQUESTS
    // =============================================
    const { data: employeeRequests } = await supabase
      .from("employee_requests")
      .select(`
        *,
        request_type:request_types!request_type_id(
          code, 
          name, 
          affects_payroll, 
          deduct_leave_balance,
          requires_date_range,
          requires_single_date
        )
      `)
      .eq("employee_id", emp.id)
      .eq("status", "approved")
      .or(`and(request_date.gte.${startDate},request_date.lte.${endDate}),and(from_date.lte.${endDate},to_date.gte.${startDate})`)

    let paidLeaveDays = 0 // Nghỉ phép có lương (annual_leave, sick_leave, maternity_leave)
    let unpaidLeaveDays = 0 // Nghỉ không lương
    let workFromHomeDays = 0 // Làm việc từ xa (chỉ tính nếu affects_payroll=true)

    if (employeeRequests) {
      console.log(`[Payroll] ${emp.full_name}: Found ${employeeRequests.length} approved requests`)
      
      for (const request of employeeRequests) {
        const reqType = request.request_type as any
        if (!reqType) continue

        const code = reqType.code
        const affectsPayroll = reqType.affects_payroll === true
        
        console.log(`[Payroll] ${emp.full_name}: Processing ${code}, affects_payroll=${reqType.affects_payroll}, from=${request.from_date}, to=${request.to_date}`)

        // Bỏ qua phiếu tăng ca (đã xử lý riêng)
        if (code === "overtime") continue

        // Bỏ qua phiếu không ảnh hưởng lương (trừ nghỉ không lương)
        if (!affectsPayroll && code !== "unpaid_leave") {
          console.log(`[Payroll] ${emp.full_name}: Skipping ${code} because affects_payroll=false`)
          continue
        }

        // Tính số ngày của phiếu (có hỗ trợ nửa buổi)
        let days = 0
        
        // Helper: Tính số ngày nghỉ cho 1 ngày dựa trên from_time và to_time
        const calculateDayFraction = (fromTime: string | null, toTime: string | null): number => {
          if (!fromTime || !toTime) return 1 // Không có giờ → cả ngày
          
          // Lấy shift của nhân viên để xác định giờ làm việc
          const empShift = emp.shift_id ? shiftMap.get(emp.shift_id) : null
          const shiftStart = empShift?.start_time?.slice(0, 5) || "08:00"
          const shiftEnd = empShift?.end_time?.slice(0, 5) || "17:00"
          const breakStart = empShift?.break_start?.slice(0, 5) || "12:00"
          const breakEnd = empShift?.break_end?.slice(0, 5) || "13:00"
          
          // Parse time to minutes
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
          
          // Tính tổng giờ làm việc trong ngày (trừ nghỉ trưa)
          const morningHours = (breakStartMin - shiftStartMin) / 60 // Ca sáng
          const afternoonHours = (shiftEndMin - breakEndMin) / 60 // Ca chiều
          const totalWorkHours = morningHours + afternoonHours
          
          // Tính số giờ nghỉ
          let leaveHours = (toMinutes - fromMinutes) / 60
          if (leaveHours <= 0) leaveHours = totalWorkHours // Fallback nếu giờ không hợp lệ
          
          // Xác định nghỉ nửa buổi hay cả ngày
          // Nghỉ buổi sáng: từ đầu ca đến giờ nghỉ trưa (08:00 - 12:00)
          // Nghỉ buổi chiều: từ sau nghỉ trưa đến cuối ca (13:00 - 17:00)
          
          // Nếu nghỉ từ đầu ca sáng đến giờ nghỉ trưa → nửa ngày sáng
          if (fromMinutes <= shiftStartMin + 30 && toMinutes >= breakStartMin - 30 && toMinutes <= breakEndMin + 30) {
            console.log(`[Payroll] Half-day morning leave: ${fromTime} - ${toTime}`)
            return 0.5
          }
          
          // Nếu nghỉ từ sau nghỉ trưa đến cuối ca → nửa ngày chiều
          if (fromMinutes >= breakStartMin - 30 && fromMinutes <= breakEndMin + 30 && toMinutes >= shiftEndMin - 30) {
            console.log(`[Payroll] Half-day afternoon leave: ${fromTime} - ${toTime}`)
            return 0.5
          }
          
          // Nếu số giờ nghỉ <= một nửa tổng giờ làm việc → nửa ngày
          if (leaveHours <= totalWorkHours / 2 + 0.5) { // +0.5 để có margin
            console.log(`[Payroll] Half-day leave by hours: ${leaveHours}h / ${totalWorkHours}h total`)
            return 0.5
          }
          
          // Mặc định: cả ngày
          return 1
        }
        
        if (reqType.requires_date_range && request.from_date && request.to_date) {
          // Parse dates as UTC to avoid timezone issues
          const parseDate = (dateStr: string) => {
            const [year, month, day] = dateStr.split('-').map(Number)
            return new Date(Date.UTC(year, month - 1, day))
          }
          
          const reqFromDate = parseDate(request.from_date)
          const reqToDate = parseDate(request.to_date)
          const periodStart = parseDate(startDate)
          const periodEnd = parseDate(endDate)
          
          const reqStart = new Date(Math.max(reqFromDate.getTime(), periodStart.getTime()))
          const reqEnd = new Date(Math.min(reqToDate.getTime(), periodEnd.getTime()))
          
          // Tính số ngày = (endDate - startDate) / 1 ngày + 1
          const diffTime = reqEnd.getTime() - reqStart.getTime()
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
          const fullDays = diffDays + 1
          
          // Nếu chỉ 1 ngày và có from_time/to_time → kiểm tra nửa buổi
          if (fullDays === 1 && request.from_time && request.to_time) {
            days = calculateDayFraction(request.from_time, request.to_time)
          } else {
            days = fullDays
          }
          
          console.log(`[Payroll] Request ${code}: from=${request.from_date}, to=${request.to_date}, from_time=${request.from_time}, to_time=${request.to_time}, days=${days}`)
        } else if (reqType.requires_single_date && request.request_date) {
          // Phiếu 1 ngày - kiểm tra nửa buổi
          days = calculateDayFraction(request.from_time, request.to_time)
          console.log(`[Payroll] Request ${code}: date=${request.request_date}, from_time=${request.from_time}, to_time=${request.to_time}, days=${days}`)
        } else if (request.from_date && request.to_date) {
          // Fallback: nếu có from_date và to_date nhưng requires_date_range=false
          const parseDate = (dateStr: string) => {
            const [year, month, day] = dateStr.split('-').map(Number)
            return new Date(Date.UTC(year, month - 1, day))
          }
          
          const reqFromDate = parseDate(request.from_date)
          const reqToDate = parseDate(request.to_date)
          const periodStart = parseDate(startDate)
          const periodEnd = parseDate(endDate)
          
          const reqStart = new Date(Math.max(reqFromDate.getTime(), periodStart.getTime()))
          const reqEnd = new Date(Math.min(reqToDate.getTime(), periodEnd.getTime()))
          
          const diffTime = reqEnd.getTime() - reqStart.getTime()
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
          const fullDays = diffDays + 1
          
          // Nếu chỉ 1 ngày và có from_time/to_time → kiểm tra nửa buổi
          if (fullDays === 1 && request.from_time && request.to_time) {
            days = calculateDayFraction(request.from_time, request.to_time)
          } else {
            days = fullDays
          }
          
          console.log(`[Payroll] Request ${code} (fallback): from=${request.from_date}, to=${request.to_date}, from_time=${request.from_time}, to_time=${request.to_time}, days=${days}`)
        }

        if (days <= 0) continue

        // Phân loại theo code và affects_payroll
        if (code === "unpaid_leave") {
          // Nghỉ không lương - luôn trừ lương
          unpaidLeaveDays += days
          console.log(`[Payroll] ${emp.full_name}: unpaid_leave +${days} days`)
        } else if (code === "work_from_home" && affectsPayroll) {
          // Làm việc từ xa - chỉ tính nếu affects_payroll=true
          workFromHomeDays += days
          console.log(`[Payroll] ${emp.full_name}: work_from_home +${days} days (affects_payroll=${affectsPayroll})`)
        } else if (affectsPayroll && reqType.deduct_leave_balance) {
          // Nghỉ phép năm (annual_leave) - có lương, trừ phép
          paidLeaveDays += days
          console.log(`[Payroll] ${emp.full_name}: ${code} (paid leave with deduct) +${days} days`)
        } else if (affectsPayroll && !reqType.deduct_leave_balance) {
          // Nghỉ ốm, thai sản, công tác... - có lương, không trừ phép
          paidLeaveDays += days
          console.log(`[Payroll] ${emp.full_name}: ${code} (paid leave no deduct) +${days} days`)
        } else {
          console.log(`[Payroll] ${emp.full_name}: ${code} skipped (affects_payroll=${affectsPayroll})`)
        }
        // Các phiếu khác (late_arrival, early_leave, forgot_checkin) 
        // không ảnh hưởng đến số ngày công, chỉ ảnh hưởng đến phạt
      }
    }

    // Lấy shift của nhân viên
    const shiftData = emp.shift_id ? shiftMap.get(emp.shift_id) : null
    const shiftInfo: ShiftInfo = {
      startTime: shiftData?.start_time?.slice(0, 5) || "08:00",
      endTime: shiftData?.end_time?.slice(0, 5) || "17:00",
      breakStart: shiftData?.break_start?.slice(0, 5) || null,
      breakEnd: shiftData?.break_end?.slice(0, 5) || null,
    }

    // Lấy vi phạm chấm công
    const violations = await getEmployeeViolations(supabase, emp.id, startDate, endDate, shiftInfo)
    
    // Tính ngày công thực tế (trừ ngày không tính công và nửa ngày)
    const absentDays = violations.filter((v) => v.isAbsent).length
    const halfDays = violations.filter((v) => v.isHalfDay && !v.isAbsent).length
    const fullWorkDays = violations.filter((v) => !v.isHalfDay && !v.isAbsent).length
    
    // Ngày đi làm thực tế (chấm công)
    const actualAttendanceDays = fullWorkDays + (halfDays * 0.5)
    
    // Tổng ngày công = ngày đi làm + ngày làm từ xa + ngày nghỉ phép có lương
    const totalWorkingDays = actualAttendanceDays + workFromHomeDays + paidLeaveDays
    
    const lateCount = violations.filter((v) => v.lateMinutes > 0 && !v.isHalfDay).length

    // Lấy các điều chỉnh được gán cho nhân viên
    const { data: empAdjustments } = await supabase
      .from("employee_adjustments")
      .select("*, adjustment_type:payroll_adjustment_types(*)")
      .eq("employee_id", emp.id)
      .lte("effective_date", endDate)
      .or(`end_date.is.null,end_date.gte.${startDate}`)

    // =============================================
    // TÍNH TOÁN PHỤ CẤP, KHẤU TRỪ, PHẠT
    // =============================================
    let totalAllowances = 0 // Phụ cấp từ payroll_adjustment_types
    let totalDeductions = 0
    let totalPenalties = 0
    const adjustmentDetails: any[] = []

    // Xử lý các loại điều chỉnh tự động
    if (adjustmentTypes) {
      for (const adjType of adjustmentTypes as PayrollAdjustmentType[]) {
        if (!adjType.is_auto_applied) continue

        const rules = adjType.auto_rules

        // ========== KHẤU TRỪ TỰ ĐỘNG (Quỹ chung, BHXH...) ==========
        if (adjType.category === "deduction") {
          let finalAmount = adjType.amount

          // Tính BHXH theo % lương cơ bản nếu có rule
          if (rules?.calculate_from === "base_salary" && rules?.percentage) {
            finalAmount = (baseSalary * rules.percentage) / 100
          }

          totalDeductions += finalAmount
          adjustmentDetails.push({
            adjustment_type_id: adjType.id,
            category: "deduction",
            base_amount: adjType.amount,
            adjusted_amount: 0,
            final_amount: finalAmount,
            reason: adjType.name,
            occurrence_count: 1,
          })
          continue
        }

        // ========== PHỤ CẤP TỰ ĐỘNG ==========
        if (adjType.category === "allowance") {
          // Phụ cấp theo ngày công (ăn trưa) - chỉ tính ngày đi làm đủ, không tính nửa ngày
          if (adjType.calculation_type === "daily") {
            let eligibleDays = fullWorkDays // Chỉ tính ngày đi làm đủ

            if (rules) {
              // Trừ ngày nghỉ
              if (rules.deduct_on_absent) {
                eligibleDays -= unpaidLeaveDays
              }

              // Trừ nếu đi muộn quá số lần cho phép
              if (rules.deduct_on_late && rules.late_grace_count !== undefined) {
                const excessLateDays = Math.max(0, lateCount - rules.late_grace_count)
                eligibleDays -= excessLateDays
              }
            }

            eligibleDays = Math.max(0, eligibleDays)
            const amount = eligibleDays * adjType.amount

            if (amount > 0) {
              totalAllowances += amount
              adjustmentDetails.push({
                adjustment_type_id: adjType.id,
                category: "allowance",
                base_amount: fullWorkDays * adjType.amount,
                adjusted_amount: (fullWorkDays - eligibleDays) * adjType.amount,
                final_amount: amount,
                reason: `${eligibleDays} ngày x ${adjType.amount.toLocaleString()}đ`,
                occurrence_count: eligibleDays,
              })
            }
          }

          // Phụ cấp cố định (chuyên cần)
          if (adjType.calculation_type === "fixed") {
            if (rules?.full_deduct_threshold !== undefined) {
              // Có điều kiện - mất toàn bộ nếu vi phạm (đi muộn hoặc nghỉ không phép hoặc không tính công)
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
              // Không có điều kiện - cộng thẳng
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
          continue
        }

        // ========== PHẠT TỰ ĐỘNG ==========
        if (adjType.category === "penalty" && rules?.trigger === "late") {
          const thresholdMinutes = rules.late_threshold_minutes || 30
          const exemptWithRequest = rules.exempt_with_request !== false
          const exemptRequestTypes = rules.exempt_request_types || ["late_arrival", "early_leave"]

          const penaltyDays = violations.filter((v) => {
            if (v.lateMinutes <= thresholdMinutes) return false
            
            // Kiểm tra miễn phạt nếu có phiếu phù hợp
            if (exemptWithRequest && v.hasApprovedRequest) {
              // Kiểm tra xem có loại phiếu nào được miễn không
              const hasExemptRequest = v.approvedRequestTypes.some(
                (type) => exemptRequestTypes.includes(type as any)
              )
              if (hasExemptRequest) return false
            }
            return true
          })

          for (const v of penaltyDays) {
            let penaltyAmount = 0
            if (rules.penalty_type === "half_day_salary") {
              penaltyAmount = dailySalary / 2
            } else if (rules.penalty_type === "full_day_salary") {
              penaltyAmount = dailySalary
            } else if (rules.penalty_type === "fixed_amount") {
              penaltyAmount = adjType.amount
            }

            totalPenalties += penaltyAmount
            adjustmentDetails.push({
              adjustment_type_id: adjType.id,
              category: "penalty",
              base_amount: penaltyAmount,
              adjusted_amount: 0,
              final_amount: penaltyAmount,
              reason: `Đi muộn ${v.lateMinutes} phút ngày ${v.date}`,
              occurrence_count: 1,
            })
          }
        }
      }
    }

    // Xử lý các điều chỉnh được gán thủ công cho nhân viên
    if (empAdjustments) {
      for (const empAdj of empAdjustments) {
        const adjType = empAdj.adjustment_type as PayrollAdjustmentType
        if (!adjType || adjType.is_auto_applied) continue // Bỏ qua auto-applied (đã xử lý ở trên)

        const amount = empAdj.custom_amount || adjType.amount

        if (adjType.category === "allowance") {
          totalAllowances += amount
        } else if (adjType.category === "deduction") {
          // Tính BHXH theo % lương cơ bản
          let finalAmount = amount
          if (adjType.auto_rules?.calculate_from === "base_salary" && adjType.auto_rules?.percentage) {
            finalAmount = (baseSalary * adjType.auto_rules.percentage) / 100
          }
          totalDeductions += finalAmount
          adjustmentDetails.push({
            adjustment_type_id: adjType.id,
            category: "deduction",
            base_amount: amount,
            adjusted_amount: 0,
            final_amount: finalAmount,
            reason: adjType.name,
            occurrence_count: 1,
          })
        } else if (adjType.category === "penalty") {
          totalPenalties += amount
        }
      }
    }

    // =============================================
    // TÍNH TIỀN TĂNG CA (OT)
    // =============================================
    const otResult = await calculateOvertimePay(
      emp.id,
      baseSalary,
      STANDARD_WORKING_DAYS,
      startDate,
      endDate
    )
    const totalOTPay = otResult.totalOTPay

    // =============================================
    // TÍNH LƯƠNG CUỐI CÙNG
    // =============================================
    // Ngày công thực tế = ngày đi làm + WFH (không bao gồm nghỉ phép)
    const actualWorkingDays = actualAttendanceDays + workFromHomeDays
    
    // Lương theo ngày công = lương ngày đi làm + WFH + nghỉ phép có lương
    const grossSalary = dailySalary * (actualWorkingDays + paidLeaveDays) + totalAllowances + totalOTPay
    const totalDeduction = dailySalary * unpaidLeaveDays + totalDeductions + totalPenalties
    const netSalary = grossSalary - totalDeduction

    // Tạo ghi chú chi tiết với format có cấu trúc
    let noteItems: string[] = []
    let noteData: any = {
      attendance: actualAttendanceDays,
      wfh: workFromHomeDays,
      paidLeave: paidLeaveDays,
    }
    
    if (actualAttendanceDays > 0) noteItems.push(`Chấm công: ${actualAttendanceDays} ngày`)
    if (workFromHomeDays > 0) noteItems.push(`WFH: ${workFromHomeDays} ngày`)
    if (paidLeaveDays > 0) noteItems.push(`Nghỉ phép: ${paidLeaveDays} ngày`)
    if (lateCount > 0) noteItems.push(`Đi muộn: ${lateCount} lần`)
    if (halfDays > 0) noteItems.push(`Nửa ngày: ${halfDays}`)
    if (absentDays > 0) noteItems.push(`Không tính công: ${absentDays}`)
    const penaltyCount = adjustmentDetails.filter(d => d.category === 'penalty').length
    if (penaltyCount > 0) noteItems.push(`Phạt: ${penaltyCount} lần`)
    if (otResult.totalOTHours > 0) noteItems.push(`OT: ${otResult.totalOTHours}h`)

    // Insert payroll item
    const { data: payrollItem, error: insertError } = await supabase
      .from("payroll_items")
      .insert({
        payroll_run_id: run.id,
        employee_id: emp.id,
        working_days: actualWorkingDays, // Ngày công thực tế (chấm công + WFH)
        leave_days: paidLeaveDays, // Ngày nghỉ phép có lương (tách riêng)
        unpaid_leave_days: unpaidLeaveDays + absentDays, // Cộng thêm ngày không tính công
        base_salary: baseSalary,
        allowances: totalAllowances + totalOTPay, // Bao gồm cả tiền OT
        total_income: grossSalary,
        total_deduction: totalDeduction,
        net_salary: netSalary,
        note: noteItems.join(", ") || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error(`Error inserting payroll item for ${emp.full_name}:`, insertError)
    } else {
      processedCount++

      // Insert adjustment details
      if (payrollItem && adjustmentDetails.length > 0) {
        const detailsWithItemId = adjustmentDetails.map((d) => ({
          ...d,
          payroll_item_id: payrollItem.id,
        }))
        await supabase.from("payroll_adjustment_details").insert(detailsWithItemId)
      }
    }
  }

  revalidatePath("/dashboard/payroll")
  return { success: true, data: run, message: `Đã tạo bảng lương cho ${processedCount} nhân viên` }
}

// =============================================
// HR ACTIONS - LOCK/UNLOCK PAYROLL
// =============================================

export async function lockPayroll(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("payroll_runs")
    .update({ status: "locked" })
    .eq("id", id)
    .eq("status", "draft")

  if (error) {
    console.error("Error locking payroll:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/payroll")
  return { success: true }
}

export async function markPayrollPaid(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("payroll_runs")
    .update({ status: "paid" })
    .eq("id", id)
    .eq("status", "locked")

  if (error) {
    console.error("Error marking payroll as paid:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/payroll")
  return { success: true }
}

export async function deletePayrollRun(id: string) {
  const supabase = await createClient()

  // Chỉ xóa được draft
  const { error } = await supabase
    .from("payroll_runs")
    .delete()
    .eq("id", id)
    .eq("status", "draft")

  if (error) {
    console.error("Error deleting payroll run:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/payroll")
  return { success: true }
}

export async function refreshPayroll(id: string) {
  const supabase = await createClient()

  // Lấy thông tin payroll run
  const { data: run, error: runError } = await supabase
    .from("payroll_runs")
    .select("*")
    .eq("id", id)
    .single()

  if (runError || !run) {
    return { success: false, error: "Không tìm thấy bảng lương" }
  }

  // Chỉ refresh được draft
  if (run.status !== "draft") {
    return { success: false, error: "Chỉ có thể tính lại bảng lương ở trạng thái Nháp" }
  }

  // Gọi lại generatePayroll với tháng/năm của bảng lương hiện tại
  // generatePayroll sẽ tự động xóa dữ liệu cũ và tính lại
  const result = await generatePayroll(run.month, run.year)

  return result
}

// =============================================
// HR ACTIONS - SALARY STRUCTURE
// =============================================

export async function listSalaryStructure(
  employee_id: string
): Promise<SalaryStructure[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("salary_structure")
    .select("*")
    .eq("employee_id", employee_id)
    .order("effective_date", { ascending: false })

  if (error) {
    console.error("Error listing salary structure:", error)
    return []
  }

  return data || []
}

export async function createSalaryStructure(input: {
  employee_id: string
  base_salary: number
  allowance?: number
  effective_date: string
  note?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("salary_structure").insert({
    employee_id: input.employee_id,
    base_salary: input.base_salary,
    allowance: input.allowance || 0,
    effective_date: input.effective_date,
    note: input.note,
  })

  if (error) {
    console.error("Error creating salary structure:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}

export async function getMySalary(): Promise<SalaryStructure | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return null

  const { data } = await supabase
    .from("salary_structure")
    .select("*")
    .eq("employee_id", employee.id)
    .order("effective_date", { ascending: false })
    .limit(1)
    .single()

  return data || null
}

// =============================================
// PAYROLL ADJUSTMENT DETAILS
// =============================================

export async function getPayrollAdjustmentDetails(payroll_item_id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payroll_adjustment_details")
    .select(`
      *,
      adjustment_type:payroll_adjustment_types(id, name, code, category)
    `)
    .eq("payroll_item_id", payroll_item_id)
    .order("category")

  if (error) {
    console.error("Error fetching adjustment details:", error)
    return []
  }

  return data || []
}
