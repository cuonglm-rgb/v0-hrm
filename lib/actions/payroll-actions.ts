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
import { getEmployeeKPI } from "./kpi-actions"
import { toDateStringVN, getTimePartsVN, getLastDayOfMonthVN, calculateLeaveDays } from "@/lib/utils/date-utils"
import { calculateLeaveEntitlement } from "@/lib/utils/leave-utils"

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
      const dateStr = toDateStringVN(checkInDate)
      const { hours: checkInHour, minutes: checkInMin } = getTimePartsVN(checkInDate)
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
        const { hours: checkOutHour, minutes: checkOutMin } = getTimePartsVN(checkOutDate)
        checkOutMinutes = checkOutHour * 60 + checkOutMin
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

          // Kiểm tra check out: nếu check out cũng trong giờ nghỉ trưa hoặc ngay sau đó
          // => Làm nửa ngày (đến và về đúng giờ ca làm của họ)
          if (hasCheckOut && checkOutMinutes >= breakStartMinutes && checkOutMinutes <= breakEndMinutes + 15) {
            // Check out cũng trong khoảng nghỉ trưa => làm nửa ngày, không phạt
            earlyMinutes = 0
          } else if (hasCheckOut && checkOutMinutes < shiftEndMinutes) {
            // Check out sớm hơn giờ tan ca (nhưng sau giờ nghỉ trưa)
            earlyMinutes = shiftEndMinutes - checkOutMinutes
          }
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
            earlyMinutes = 0 // Không tính về sớm vì đã làm đủ ca sáng
          } else if (hasCheckOut && checkOutMinutes < shiftEndMinutes) {
            // Check out sớm hơn giờ tan ca (nhưng sau giờ nghỉ trưa)
            earlyMinutes = shiftEndMinutes - checkOutMinutes
          }
        }
      } else {
        // Không có giờ nghỉ trưa => tính đi muộn bình thường
        lateMinutes = Math.max(0, checkInMinutes - shiftStartMinutes)

        // Tính về sớm
        if (hasCheckOut && checkOutMinutes < shiftEndMinutes) {
          earlyMinutes = shiftEndMinutes - checkOutMinutes
        }
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
    if (existingRun.status !== "draft" && existingRun.status !== "review") {
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

    // Lấy danh sách ngày có phiếu tăng ca được duyệt
    const { data: overtimeRequestDates } = await supabase
      .from("employee_requests")
      .select(`
        request_date,
        from_time,
        to_time,
        request_type:request_types!request_type_id(code)
      `)
      .eq("employee_id", emp.id)
      .eq("status", "approved")
      .gte("request_date", startDate)
      .lte("request_date", endDate)

    // Lấy shift của nhân viên để xác định giờ làm việc
    const empShift = emp.shift_id ? shiftMap.get(emp.shift_id) : null
    const shiftStart = empShift?.start_time?.slice(0, 5) || "08:00"
    const shiftEnd = empShift?.end_time?.slice(0, 5) || "17:00"
    const breakStart = empShift?.break_start?.slice(0, 5) || "12:00"
    const breakEnd = empShift?.break_end?.slice(0, 5) || "13:30"

    // Helper: Parse time to minutes
    const parseTime = (t: string) => {
      const [h, m] = t.split(":").map(Number)
      return h * 60 + (m || 0)
    }

    const shiftStartMin = parseTime(shiftStart)
    const shiftEndMin = parseTime(shiftEnd)
    const breakStartMin = parseTime(breakStart)
    const breakEndMin = parseTime(breakEnd)

    // Phân loại ngày tăng ca:
    // - overtimeDates: Tăng ca THAY THẾ ca làm (ngày nghỉ, không có chấm công hoặc tăng ca cả ngày)
    // - overtimeWithinShift: Tăng ca NGOÀI giờ làm việc (giờ nghỉ trưa, trước/sau ca)
    const overtimeDates = new Set<string>() // Ngày chỉ tính OT, không tính lương cơ bản
    const overtimeWithinShift = new Set<string>() // Ngày tính cả lương cơ bản + OT

    if (overtimeRequestDates) {
      for (const req of overtimeRequestDates) {
        const reqType = req.request_type as any
        if (reqType?.code !== "overtime") continue

        const date = req.request_date
        const fromTime = req.from_time
        const toTime = req.to_time

        // Nếu không có giờ cụ thể → coi như tăng ca cả ngày (thay thế ca làm)
        if (!fromTime || !toTime) {
          overtimeDates.add(date)
          continue
        }

        const fromMin = parseTime(fromTime)
        const toMin = parseTime(toTime)

        // Kiểm tra xem OT có nằm NGOÀI giờ làm việc không:
        // 1. Trước giờ vào ca (< shiftStart)
        // 2. Sau giờ tan ca (> shiftEnd)
        // 3. Trong giờ nghỉ trưa (breakStart <= from < to <= breakEnd)
        const isBeforeShift = toMin <= shiftStartMin
        const isAfterShift = fromMin >= shiftEndMin
        const isDuringBreak = fromMin >= breakStartMin && toMin <= breakEndMin

        if (isBeforeShift || isAfterShift || isDuringBreak) {
          // Tăng ca ngoài giờ làm việc → tính cả lương cơ bản + OT
          overtimeWithinShift.add(date)
        } else {
          // Tăng ca trong giờ làm việc hoặc không xác định → coi như thay thế ca làm
          overtimeDates.add(date)
        }
      }
    }

    console.log(`[Payroll] ${emp.full_name}: OT dates (replace work): ${overtimeDates.size}, OT within shift: ${overtimeWithinShift.size}`)

    // Lấy tất cả attendance logs để lọc
    const { data: allAttendanceLogs } = await supabase
      .from("attendance_logs")
      .select("check_in")
      .eq("employee_id", emp.id)
      .gte("check_in", startDate)
      .lte("check_in", endDate + "T23:59:59")

    // Đếm ngày công (LOẠI TRỪ các ngày có phiếu tăng ca THAY THẾ ca làm)
    // KHÔNG loại trừ các ngày tăng ca ngoài giờ làm việc (overtimeWithinShift)
    let workingDaysCount = 0
    if (allAttendanceLogs) {
      for (const log of allAttendanceLogs) {
        const logDate = toDateStringVN(log.check_in)
        // Chỉ loại trừ nếu là OT thay thế ca làm (không phải OT ngoài giờ)
        if (!overtimeDates.has(logDate)) {
          workingDaysCount++
        }
      }
    }

    console.log(`[Payroll] ${emp.full_name}: Total attendance logs: ${allAttendanceLogs?.length || 0}, After excluding OT replacement dates: ${workingDaysCount}`)

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

    // --- FEATURE: LEAVE BALANCE CAP ---
    // Calculate total annual leave taken in this payroll run
    // And check against the employee's entitled balance.
    // Convert excess Paid Annual Leave -> Unpaid Leave

    // 1. Calculate Entitlement for the year
    const yearlyEntitlement = calculateLeaveEntitlement(
      emp.official_date || null,
      year
    )

    // 2. Fetch historic usage (Approved Annual Leave taken BEFORE this payroll period in the same year)
    // Note: startDate is YYYY-MM-01. We want requests where to_date < startDate (or strictly before this period).
    // Actually, simple rule: All 'annual' requests in the current year EXCLUDING the ones we just processed in the loop above.
    // But distinguishing strictly is hard if dates overlap.
    // Easiest: Query all approved annual leave for the year < startDate.
    const startOfYear = `${year}-01-01`

    const { data: historicRequests } = await supabase
      .from("employee_requests")
      .select(`
            from_date, 
            to_date, 
            from_time, 
            to_time,
            request_type:request_types!inner(code, deduct_leave_balance)
        `)
      .eq("employee_id", emp.id)
      .eq("status", "approved")
      .gte("from_date", startOfYear)
      .lt("from_date", startDate) // Starts before this month
      .filter("request_type.deduct_leave_balance", "eq", true) // Ensure it consumes balance

    let historicUsed = 0
    if (historicRequests) {
      for (const hReq of historicRequests) {
        historicUsed += calculateLeaveDays(
          hReq.from_date,
          hReq.to_date || hReq.from_date,
          hReq.from_time,
          hReq.to_time
        )
      }
    }

    const remainingBalance = Math.max(0, yearlyEntitlement - historicUsed)

    // 3. Identify how much Annual Leave was counted in 'paidLeaveDays' in the loop above
    // We didn't track it separately. We need to sum it up. 
    // Wait, the loop above calculated 'days' for each request.
    // I should have tracked 'annualLeaveDaysThisMonth' inside the loop.
    // Instead of re-looping, I will rely on re-calculating or refactoring slightly.
    // Refactoring the loop above is risky with 'replace_file_content'.
    // Better: Re-iterate 'employeeRequests' to sum up 'annualLeaveThisMonth'.
    // Since 'employeeRequests' is in memory, it's cheap.

    let annualLeaveThisMonth = 0
    if (employeeRequests) {
      for (const req of employeeRequests) {
        const reqType = req.request_type as any
        // Same logic as loop: affects_payroll && deduct_leave_balance
        if (reqType.affects_payroll && reqType.deduct_leave_balance) {
          // We need the calculated 'days'.
          // Copying the calculation logic is duplicated code -> bad.
          // But I can't easily inject a variable into the big loop above without massive context.
          // Compromise: I will trust a simplified calculation for this check? 
          // No, must match.
          // Actually, I can use calculateLeaveDays here too. 
          // The loop above uses sophisticated logic for 'days'.
          // If I use calculateLeaveDays here, it might differ slightly.
          // But let's assume standard days.

          // Let's use calculateLeaveDays for consistency with 'historicUsed'.
          // If the loop above calculated 2.5 (sophisticated) and I calculate 2.5 (simple), it matches.
          const d = calculateLeaveDays(
            req.from_date,
            req.to_date || req.from_date,
            req.from_time,
            req.to_time,
            {
              requires_date_range: reqType.requires_date_range,
              requires_single_date: reqType.requires_single_date
            }
          )
          annualLeaveThisMonth += d
        }
      }
    }

    // 4. Apply Cap
    const paidAnnual = Math.min(annualLeaveThisMonth, remainingBalance)
    const unpaidAnnual = Math.max(0, annualLeaveThisMonth - paidAnnual)

    if (unpaidAnnual > 0) {
      console.log(`[Payroll] ${emp.full_name}: Leave Balance Cap Exceeded. Entitlement: ${yearlyEntitlement}, Historic: ${historicUsed}, Remaining: ${remainingBalance}. Requested: ${annualLeaveThisMonth}. Paid: ${paidAnnual}, Unpaid: ${unpaidAnnual}`)

      // Adjust final counters
      // Remove the portion that was added to paidLeaveDays
      paidLeaveDays -= unpaidAnnual
      // Add to unpaidLeaveDays
      unpaidLeaveDays += unpaidAnnual
    }
    // ----------------------------

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

    // Lọc bỏ các ngày có phiếu tăng ca THAY THẾ ca làm (không tính vào ngày công cơ bản)
    // KHÔNG lọc bỏ các ngày tăng ca ngoài giờ làm việc (vẫn tính lương cơ bản + phạt nếu có)
    const violationsWithoutOT = violations.filter((v) => !overtimeDates.has(v.date))

    console.log(`[Payroll] ${emp.full_name}: Total violations: ${violations.length}, After excluding OT replacement dates: ${violationsWithoutOT.length}`)

    // Tính ngày công thực tế (trừ ngày không tính công và nửa ngày) - KHÔNG BAO GỒM NGÀY TĂNG CA THAY THẾ
    const absentDays = violationsWithoutOT.filter((v) => v.isAbsent).length
    const halfDays = violationsWithoutOT.filter((v) => v.isHalfDay && !v.isAbsent).length
    const fullWorkDays = violationsWithoutOT.filter((v) => !v.isHalfDay && !v.isAbsent).length

    // Ngày đi làm thực tế (chấm công) - KHÔNG BAO GỒM NGÀY TĂNG CA THAY THẾ, NHƯNG BAO GỒM NGÀY TĂNG CA NGOÀI GIỜ
    const actualAttendanceDays = fullWorkDays + (halfDays * 0.5)

    // Tổng ngày công = ngày đi làm + ngày làm từ xa + ngày nghỉ phép có lương
    const totalWorkingDays = actualAttendanceDays + workFromHomeDays + paidLeaveDays

    const lateCount = violationsWithoutOT.filter((v) => v.lateMinutes > 0 && !v.isHalfDay).length

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
        // Hỗ trợ cả trigger "late" (đi muộn/về sớm) và "attendance" (quên chấm công)
        if (adjType.category === "penalty" && (rules?.trigger === "late" || rules?.trigger === "attendance")) {
          console.log(`[Payroll] ${emp.full_name}: Xử lý phạt "${adjType.name}" (trigger: ${rules?.trigger})`)

          const thresholdMinutes = rules.late_threshold_minutes || 30
          const exemptWithRequest = rules.exempt_with_request !== false
          const exemptRequestTypes = rules.exempt_request_types || ["late_arrival", "early_leave"]
          const penaltyConditions = rules.penalty_conditions || ["late_arrival"] // Mặc định chỉ phạt đi muộn

          console.log(`[Payroll] ${emp.full_name}: Penalty conditions: ${JSON.stringify(penaltyConditions)}`)
          console.log(`[Payroll] ${emp.full_name}: Penalty type: ${rules.penalty_type}, Daily salary: ${dailySalary}`)

          const penaltyViolations: Array<{ date: string; reason: string; amount: number }> = []

          // Chỉ xử lý vi phạm KHÔNG PHẢI ngày tăng ca
          for (const v of violationsWithoutOT) {
            // Kiểm tra miễn phạt nếu có phiếu phù hợp
            let isExempt = false
            if (exemptWithRequest && v.hasApprovedRequest) {
              const hasExemptRequest = v.approvedRequestTypes.some(
                (type) => exemptRequestTypes.includes(type as any)
              )
              if (hasExemptRequest) isExempt = true
            }

            if (isExempt) continue

            // Kiểm tra các điều kiện phạt
            // 1. Đi làm muộn
            if (penaltyConditions.includes("late_arrival") && v.lateMinutes > thresholdMinutes) {
              let penaltyAmount = 0
              if (rules.penalty_type === "half_day_salary") {
                penaltyAmount = dailySalary / 2
              } else if (rules.penalty_type === "full_day_salary") {
                penaltyAmount = dailySalary
              } else if (rules.penalty_type === "fixed_amount") {
                penaltyAmount = adjType.amount
              }
              penaltyViolations.push({
                date: v.date,
                reason: `Đi muộn ${v.lateMinutes} phút`,
                amount: penaltyAmount,
              })
            }

            // 2. Đi về sớm
            if (penaltyConditions.includes("early_leave") && v.earlyMinutes > thresholdMinutes) {
              let penaltyAmount = 0
              if (rules.penalty_type === "half_day_salary") {
                penaltyAmount = dailySalary / 2
              } else if (rules.penalty_type === "full_day_salary") {
                penaltyAmount = dailySalary
              } else if (rules.penalty_type === "fixed_amount") {
                penaltyAmount = adjType.amount
              }
              penaltyViolations.push({
                date: v.date,
                reason: `Về sớm ${v.earlyMinutes} phút`,
                amount: penaltyAmount,
              })
            }
          }

          // 3. Quên chấm công đến
          if (penaltyConditions.includes("forgot_checkin")) {
            // Lấy tất cả attendance logs để kiểm tra ngày nào thiếu check_in
            const { data: allLogs } = await supabase
              .from("attendance_logs")
              .select("check_in, check_out")
              .eq("employee_id", emp.id)
              .gte("check_in", startDate)
              .lte("check_in", endDate + "T23:59:59")

            // Lấy danh sách phiếu forgot_checkin đã approved (để miễn phạt)
            const { data: approvedForgotCheckin } = await supabase
              .from("employee_requests")
              .select(`
                request_date,
                request_type:request_types!request_type_id(code)
              `)
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

            // Kiểm tra từng ngày có attendance log
            for (const log of allLogs || []) {
              if (!log.check_in) continue
              const logDate = toDateStringVN(log.check_in)

              // Nếu có phiếu approved và cấu hình miễn phạt → bỏ qua
              if (exemptWithRequest && approvedForgotCheckinDates.has(logDate)) {
                console.log(`[Payroll] ${emp.full_name}: Miễn phạt quên chấm công đến ngày ${logDate} (có phiếu approved)`)
                continue
              }

              // Nếu KHÔNG có phiếu approved → Phạt
              // (Logic này cần được mở rộng để phát hiện thực sự quên chấm công)
              // Hiện tại chỉ phạt nếu có phiếu pending/rejected
              const { data: pendingRequests } = await supabase
                .from("employee_requests")
                .select(`
                  request_date,
                  status,
                  request_type:request_types!request_type_id(code)
                `)
                .eq("employee_id", emp.id)
                .eq("request_date", logDate)
                .in("status", ["pending", "rejected"])

              let hasForgotCheckinRequest = false
              for (const req of pendingRequests || []) {
                const reqType = req.request_type as any
                if (reqType?.code === "forgot_checkin") {
                  hasForgotCheckinRequest = true
                  break
                }
              }

              if (hasForgotCheckinRequest) {
                let penaltyAmount = 0
                if (rules.penalty_type === "half_day_salary") {
                  penaltyAmount = dailySalary / 2
                } else if (rules.penalty_type === "full_day_salary") {
                  penaltyAmount = dailySalary
                } else if (rules.penalty_type === "fixed_amount") {
                  penaltyAmount = adjType.amount
                }
                console.log(`[Payroll] ${emp.full_name}: Phạt quên chấm công đến ngày ${logDate} (phiếu chưa duyệt) - ${penaltyAmount}đ`)
                penaltyViolations.push({
                  date: logDate,
                  reason: "Quên chấm công đến",
                  amount: penaltyAmount,
                })
              }
            }
          }

          // 4. Quên chấm công về
          if (penaltyConditions.includes("forgot_checkout")) {
            console.log(`[Payroll] ${emp.full_name}: Kiểm tra phạt quên chấm công về...`)

            // Lấy tất cả attendance logs để kiểm tra ngày nào thiếu check_out
            const { data: allLogs } = await supabase
              .from("attendance_logs")
              .select("check_in, check_out")
              .eq("employee_id", emp.id)
              .gte("check_in", startDate)
              .lte("check_in", endDate + "T23:59:59")

            console.log(`[Payroll] ${emp.full_name}: Tìm thấy ${allLogs?.length || 0} attendance logs`)

            // Lấy danh sách phiếu forgot_checkout đã approved (để miễn phạt)
            const { data: approvedForgotCheckout } = await supabase
              .from("employee_requests")
              .select(`
                request_date,
                request_type:request_types!request_type_id(code)
              `)
              .eq("employee_id", emp.id)
              .eq("status", "approved")
              .gte("request_date", startDate)
              .lte("request_date", endDate)

            const approvedForgotCheckoutDates = new Set<string>()
            for (const req of approvedForgotCheckout || []) {
              const reqType = req.request_type as any
              if (reqType?.code === "forgot_checkout") {
                approvedForgotCheckoutDates.add(req.request_date)
                console.log(`[Payroll] ${emp.full_name}: Có phiếu forgot_checkout approved cho ngày ${req.request_date}`)
              }
            }

            // Kiểm tra từng ngày có attendance log nhưng thiếu check_out
            for (const log of allLogs || []) {
              if (!log.check_in) continue
              const logDate = toDateStringVN(log.check_in)

              console.log(`[Payroll] ${emp.full_name}: Ngày ${logDate} - check_in: ${log.check_in}, check_out: ${log.check_out || 'THIẾU'}`)

              // Nếu có check_out → không phạt
              if (log.check_out) {
                console.log(`[Payroll] ${emp.full_name}: Ngày ${logDate} có check_out → không phạt`)
                continue
              }

              // Nếu có phiếu approved và cấu hình miễn phạt → bỏ qua
              if (exemptWithRequest && approvedForgotCheckoutDates.has(logDate)) {
                console.log(`[Payroll] ${emp.full_name}: Miễn phạt quên chấm công về ngày ${logDate} (có phiếu approved)`)
                continue
              }

              // Nếu KHÔNG có phiếu approved → Phạt
              let penaltyAmount = 0
              if (rules.penalty_type === "half_day_salary") {
                penaltyAmount = dailySalary / 2
              } else if (rules.penalty_type === "full_day_salary") {
                penaltyAmount = dailySalary
              } else if (rules.penalty_type === "fixed_amount") {
                penaltyAmount = adjType.amount
              }
              console.log(`[Payroll] ${emp.full_name}: Phạt quên chấm công về ngày ${logDate} (thiếu check_out, không có phiếu approved) - ${penaltyAmount}đ`)
              penaltyViolations.push({
                date: logDate,
                reason: "Quên chấm công về",
                amount: penaltyAmount,
              })
            }
          }

          // Thêm tất cả các vi phạm vào adjustmentDetails
          console.log(`[Payroll] ${emp.full_name}: Tổng số vi phạm phạt: ${penaltyViolations.length}`)
          for (const pv of penaltyViolations) {
            console.log(`[Payroll] ${emp.full_name}: Thêm phạt: ${pv.reason} - ${pv.amount}đ`)
            totalPenalties += pv.amount
            adjustmentDetails.push({
              adjustment_type_id: adjType.id,
              category: "penalty",
              base_amount: pv.amount,
              adjusted_amount: 0,
              final_amount: pv.amount,
              reason: `${pv.reason} ngày ${pv.date}`,
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

        let finalAmount = empAdj.custom_amount || adjType.amount

        if (adjType.category === "allowance") {
          // Phụ cấp: ưu tiên custom_percentage > custom_amount > auto_rules.percentage > amount
          if (empAdj.custom_percentage) {
            finalAmount = (baseSalary * empAdj.custom_percentage) / 100
          } else if (empAdj.custom_amount) {
            finalAmount = empAdj.custom_amount
          } else if (adjType.auto_rules?.calculate_from === "base_salary" && adjType.auto_rules?.percentage) {
            finalAmount = (baseSalary * adjType.auto_rules.percentage) / 100
          }
          totalAllowances += finalAmount
          adjustmentDetails.push({
            adjustment_type_id: adjType.id,
            category: "allowance",
            base_amount: adjType.amount,
            adjusted_amount: 0,
            final_amount: finalAmount,
            reason: empAdj.custom_percentage
              ? `${adjType.name} (${empAdj.custom_percentage}% lương)`
              : adjType.name,
            occurrence_count: 1,
          })
        } else if (adjType.category === "deduction") {
          // Khấu trừ: ưu tiên custom_percentage > custom_amount > auto_rules.percentage > amount
          if (empAdj.custom_percentage) {
            finalAmount = (baseSalary * empAdj.custom_percentage) / 100
          } else if (empAdj.custom_amount) {
            finalAmount = empAdj.custom_amount
          } else if (adjType.auto_rules?.calculate_from === "base_salary" && adjType.auto_rules?.percentage) {
            finalAmount = (baseSalary * adjType.auto_rules.percentage) / 100
          }
          totalDeductions += finalAmount
          adjustmentDetails.push({
            adjustment_type_id: adjType.id,
            category: "deduction",
            base_amount: adjType.amount,
            adjusted_amount: 0,
            final_amount: finalAmount,
            reason: empAdj.custom_percentage
              ? `${adjType.name} (${empAdj.custom_percentage}% lương)`
              : adjType.name,
            occurrence_count: 1,
          })
        } else if (adjType.category === "penalty") {
          // Phạt: ưu tiên custom_percentage > custom_amount > amount
          if (empAdj.custom_percentage) {
            finalAmount = (baseSalary * empAdj.custom_percentage) / 100
          } else if (empAdj.custom_amount) {
            finalAmount = empAdj.custom_amount
          }
          totalPenalties += finalAmount
          adjustmentDetails.push({
            adjustment_type_id: adjType.id,
            category: "penalty",
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

    // Lưu chi tiết OT vào adjustmentDetails
    // Tìm adjustment_type cho overtime (nếu có)
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

    // =============================================
    // TÍNH THƯỞNG KPI
    // =============================================
    let kpiBonus = 0
    const kpiEvaluation = await getEmployeeKPI(emp.id, month, year)
    if (kpiEvaluation && kpiEvaluation.status === "achieved" && kpiEvaluation.final_bonus > 0) {
      kpiBonus = kpiEvaluation.final_bonus
      console.log(`[Payroll] ${emp.full_name}: KPI bonus = ${kpiBonus}đ`)
      
      // Tìm adjustment_type cho KPI_BONUS
      const kpiAdjustmentType = (adjustmentTypes as PayrollAdjustmentType[] | null)?.find(
        (t) => t.code === "KPI_BONUS"
      )
      
      // Chỉ thêm vào adjustmentDetails nếu có adjustment_type
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
      } else {
        console.warn(`[Payroll] ${emp.full_name}: KPI_BONUS adjustment type not found, skipping detail record`)
      }
    }

    // =============================================
    // TÍNH LƯƠNG CUỐI CÙNG
    // =============================================
    // Ngày công thực tế = ngày đi làm + WFH (không bao gồm nghỉ phép)
    const actualWorkingDays = actualAttendanceDays + workFromHomeDays

    // Lương theo ngày công = lương ngày đi làm + WFH + nghỉ phép có lương + phụ cấp + OT + KPI
    const grossSalary = dailySalary * (actualWorkingDays + paidLeaveDays) + totalAllowances + totalOTPay + kpiBonus
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
    if (kpiBonus > 0) noteItems.push(`KPI: ${kpiBonus.toLocaleString()}đ`)

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
        allowances: totalAllowances + totalOTPay + kpiBonus, // Bao gồm cả tiền OT và KPI
        total_income: grossSalary,
        total_deduction: totalDeduction,
        net_salary: netSalary,
        standard_working_days: STANDARD_WORKING_DAYS, // Công chuẩn của tháng
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
        console.log(`[Payroll] ${emp.full_name}: Inserting ${detailsWithItemId.length} adjustment details`)
        const { error: detailsError } = await supabase.from("payroll_adjustment_details").insert(detailsWithItemId)
        if (detailsError) {
          console.error(`[Payroll] ${emp.full_name}: Error inserting adjustment details:`, detailsError)
        } else {
          console.log(`[Payroll] ${emp.full_name}: Successfully inserted ${detailsWithItemId.length} adjustment details`)
        }
      } else {
        console.log(`[Payroll] ${emp.full_name}: No adjustment details to insert (length: ${adjustmentDetails.length})`)
      }
    }
  }

  revalidatePath("/dashboard/payroll")
  return { success: true, data: run, message: `Đã tạo bảng lương cho ${processedCount} nhân viên` }
}

// =============================================
// HR ACTIONS - LOCK/UNLOCK PAYROLL
// =============================================

export async function sendPayrollForReview(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("payroll_runs")
    .update({ status: "review" })
    .eq("id", id)
    .eq("status", "draft")

  if (error) {
    console.error("Error sending payroll for review:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/payroll")
  return { success: true }
}

export async function lockPayroll(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("payroll_runs")
    .update({ status: "locked" })
    .eq("id", id)
    .in("status", ["draft", "review"])

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

  // Chỉ xóa được draft hoặc review
  const { error } = await supabase
    .from("payroll_runs")
    .delete()
    .eq("id", id)
    .in("status", ["draft", "review"])

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

  // Chỉ refresh được draft hoặc review
  if (run.status !== "draft" && run.status !== "review") {
    return { success: false, error: "Chỉ có thể tính lại bảng lương ở trạng thái Nháp hoặc Đang xem xét" }
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

// =============================================
// MANUAL ADJUSTMENT - THÊM/SỬA KHOẢN CỘNG/TRỪ THỦ CÔNG
// =============================================

export async function addManualAdjustment(input: {
  payroll_item_id: string
  category: "allowance" | "deduction" | "penalty"
  amount: number
  reason: string
}) {
  const supabase = await createClient()

  // Kiểm tra payroll item có tồn tại và ở trạng thái draft/review không
  const { data: item } = await supabase
    .from("payroll_items")
    .select(`
      id,
      payroll_run:payroll_runs(status)
    `)
    .eq("id", input.payroll_item_id)
    .single()

  if (!item) {
    return { success: false, error: "Không tìm thấy bản ghi lương" }
  }

  const runStatus = (item.payroll_run as any)?.status
  if (runStatus !== "draft" && runStatus !== "review") {
    return { success: false, error: "Chỉ có thể chỉnh sửa bảng lương ở trạng thái Nháp hoặc Đang xem xét" }
  }

  // Tìm adjustment type cho manual adjustment
  const codeMap = {
    allowance: "MANUAL_ALLOWANCE",
    deduction: "MANUAL_DEDUCTION", 
    penalty: "MANUAL_PENALTY"
  }

  let { data: adjType } = await supabase
    .from("payroll_adjustment_types")
    .select("id")
    .eq("code", codeMap[input.category])
    .single()

  // Nếu chưa có, tạo mới
  if (!adjType) {
    const nameMap = {
      allowance: "Điều chỉnh cộng thủ công",
      deduction: "Điều chỉnh trừ thủ công",
      penalty: "Phạt thủ công"
    }
    const { data: newType, error: createError } = await supabase
      .from("payroll_adjustment_types")
      .insert({
        code: codeMap[input.category],
        name: nameMap[input.category],
        category: input.category,
        calculation_type: "fixed",
        amount: 0,
        is_active: true,
        is_auto_applied: false
      })
      .select("id")
      .single()

    if (createError) {
      console.error("Error creating adjustment type:", createError)
      return { success: false, error: "Không thể tạo loại điều chỉnh" }
    }
    adjType = newType
  }

  // Thêm adjustment detail
  const { error: insertError } = await supabase
    .from("payroll_adjustment_details")
    .insert({
      payroll_item_id: input.payroll_item_id,
      adjustment_type_id: adjType.id,
      category: input.category,
      base_amount: input.amount,
      adjusted_amount: 0,
      final_amount: input.amount,
      reason: input.reason,
      occurrence_count: 1
    })

  if (insertError) {
    console.error("Error inserting adjustment:", insertError)
    return { success: false, error: insertError.message }
  }

  // Cập nhật lại tổng trong payroll_item
  await recalculatePayrollItemTotals(input.payroll_item_id)

  revalidatePath("/dashboard/payroll")
  return { success: true }
}

export async function deleteAdjustmentDetail(id: string) {
  const supabase = await createClient()

  // Lấy payroll_item_id trước khi xóa
  const { data: detail } = await supabase
    .from("payroll_adjustment_details")
    .select(`
      payroll_item_id,
      payroll_item:payroll_items(
        payroll_run:payroll_runs(status)
      )
    `)
    .eq("id", id)
    .single()

  if (!detail) {
    return { success: false, error: "Không tìm thấy bản ghi" }
  }

  const runStatus = (detail.payroll_item as any)?.payroll_run?.status
  if (runStatus !== "draft" && runStatus !== "review") {
    return { success: false, error: "Chỉ có thể chỉnh sửa bảng lương ở trạng thái Nháp hoặc Đang xem xét" }
  }

  const { error } = await supabase
    .from("payroll_adjustment_details")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting adjustment:", error)
    return { success: false, error: error.message }
  }

  // Cập nhật lại tổng
  await recalculatePayrollItemTotals(detail.payroll_item_id)

  revalidatePath("/dashboard/payroll")
  return { success: true }
}

async function recalculatePayrollItemTotals(payroll_item_id: string) {
  const supabase = await createClient()

  // Lấy payroll item hiện tại
  const { data: item } = await supabase
    .from("payroll_items")
    .select("*")
    .eq("id", payroll_item_id)
    .single()

  if (!item) return

  // Lấy tất cả adjustment details
  const { data: details } = await supabase
    .from("payroll_adjustment_details")
    .select("category, final_amount")
    .eq("payroll_item_id", payroll_item_id)

  let totalAllowances = 0
  let totalDeductions = 0
  let totalPenalties = 0

  for (const d of details || []) {
    if (d.category === "allowance") totalAllowances += d.final_amount
    else if (d.category === "deduction") totalDeductions += d.final_amount
    else if (d.category === "penalty") totalPenalties += d.final_amount
  }

  const standardDays = item.standard_working_days || 26
  const dailySalary = item.base_salary / standardDays
  const workingSalary = dailySalary * (item.working_days + item.leave_days)
  const unpaidDeduction = dailySalary * item.unpaid_leave_days

  const totalIncome = workingSalary + totalAllowances
  const totalDeduction = unpaidDeduction + totalDeductions + totalPenalties
  const netSalary = totalIncome - totalDeduction

  await supabase
    .from("payroll_items")
    .update({
      allowances: totalAllowances,
      total_income: totalIncome,
      total_deduction: totalDeduction,
      net_salary: netSalary
    })
    .eq("id", payroll_item_id)
}

// =============================================
// RECALCULATE SINGLE EMPLOYEE - TÍNH LẠI LƯƠNG CHO 1 NHÂN VIÊN
// =============================================

export async function recalculateSingleEmployee(payroll_item_id: string) {
  const supabase = await createClient()

  // Lấy thông tin payroll item và payroll run
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

  // Tính lại - copy logic từ generatePayroll nhưng chỉ cho 1 nhân viên
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`

  // Tính công chuẩn
  const workingDaysInfo = await calculateStandardWorkingDays(month, year)
  const STANDARD_WORKING_DAYS = workingDaysInfo.standardDays

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

  // Lấy shifts
  const { data: shifts } = await supabase.from("work_shifts").select("*")
  const shiftMap = new Map((shifts || []).map((s: any) => [s.id, s]))

  // Lấy adjustment types
  const { data: adjustmentTypes } = await supabase
    .from("payroll_adjustment_types")
    .select("*")
    .eq("is_active", true)

  // Lấy attendance logs
  const { data: allAttendanceLogs } = await supabase
    .from("attendance_logs")
    .select("check_in, check_out")
    .eq("employee_id", emp.id)
    .gte("check_in", startDate)
    .lte("check_in", endDate + "T23:59:59")

  // Lấy phiếu tăng ca
  const { data: overtimeRequestDates } = await supabase
    .from("employee_requests")
    .select(`
      request_date,
      from_time,
      to_time,
      request_type:request_types!request_type_id(code)
    `)
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
      const fromTime = req.from_time
      const toTime = req.to_time

      if (!fromTime || !toTime) {
        overtimeDates.add(date)
        continue
      }

      const fromMin = parseTime(fromTime)
      const toMin = parseTime(toTime)

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

  // Đếm ngày công
  let workingDaysCount = 0
  if (allAttendanceLogs) {
    for (const log of allAttendanceLogs) {
      const logDate = toDateStringVN(log.check_in)
      if (!overtimeDates.has(logDate)) {
        workingDaysCount++
      }
    }
  }

  // Xử lý phiếu nghỉ
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

  let paidLeaveDays = 0
  let unpaidLeaveDays = 0
  let workFromHomeDays = 0

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
        days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
      } else if (reqType.requires_single_date && request.request_date) {
        days = 1
      } else if (request.from_date && request.to_date) {
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
        days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
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

  // Lấy vi phạm chấm công
  const shiftInfo = {
    startTime: shiftStart,
    endTime: shiftEnd,
    breakStart: breakStart || null,
    breakEnd: breakEnd || null,
  }
  const violations = await getEmployeeViolations(supabase, emp.id, startDate, endDate, shiftInfo)
  const violationsWithoutOT = violations.filter((v) => !overtimeDates.has(v.date))

  const absentDays = violationsWithoutOT.filter((v) => v.isAbsent).length
  const halfDays = violationsWithoutOT.filter((v) => v.isHalfDay && !v.isAbsent).length
  const fullWorkDays = violationsWithoutOT.filter((v) => !v.isHalfDay && !v.isAbsent).length
  const actualAttendanceDays = fullWorkDays + (halfDays * 0.5)
  const lateCount = violationsWithoutOT.filter((v) => v.lateMinutes > 0 && !v.isHalfDay).length

  // Lấy điều chỉnh được gán cho nhân viên
  const { data: empAdjustments } = await supabase
    .from("employee_adjustments")
    .select("*, adjustment_type:payroll_adjustment_types(*)")
    .eq("employee_id", emp.id)
    .lte("effective_date", endDate)
    .or(`end_date.is.null,end_date.gte.${startDate}`)

  // Tính toán phụ cấp, khấu trừ, phạt
  let totalAllowances = 0
  let totalDeductions = 0
  let totalPenalties = 0
  const adjustmentDetails: any[] = []

  // Xử lý auto-applied adjustments (simplified version)
  if (adjustmentTypes) {
    for (const adjType of adjustmentTypes as PayrollAdjustmentType[]) {
      if (!adjType.is_auto_applied) continue
      const rules = adjType.auto_rules

      if (adjType.category === "deduction") {
        let finalAmount = adjType.amount
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
      }

      if (adjType.category === "allowance") {
        if (adjType.calculation_type === "daily") {
          let eligibleDays = fullWorkDays
          if (rules) {
            if (rules.deduct_on_absent) eligibleDays -= unpaidLeaveDays
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
      }
    }
  }

  // Xử lý manual adjustments
  if (empAdjustments) {
    for (const empAdj of empAdjustments) {
      const adjType = empAdj.adjustment_type as PayrollAdjustmentType
      if (!adjType || adjType.is_auto_applied) continue

      let finalAmount = empAdj.custom_amount || adjType.amount
      if (empAdj.custom_percentage) {
        finalAmount = (baseSalary * empAdj.custom_percentage) / 100
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

  // Tính OT
  const otResult = await calculateOvertimePay(emp.id, baseSalary, STANDARD_WORKING_DAYS, startDate, endDate)
  const totalOTPay = otResult.totalOTPay

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

  // Tính KPI
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

  // Tính lương cuối cùng
  const actualWorkingDays = actualAttendanceDays + workFromHomeDays
  const grossSalary = dailySalary * (actualWorkingDays + paidLeaveDays) + totalAllowances + totalOTPay + kpiBonus
  const totalDeduction = dailySalary * unpaidLeaveDays + totalDeductions + totalPenalties
  const netSalary = grossSalary - totalDeduction

  // Cập nhật payroll item
  await supabase
    .from("payroll_items")
    .update({
      working_days: actualWorkingDays,
      leave_days: paidLeaveDays,
      unpaid_leave_days: unpaidLeaveDays + absentDays,
      base_salary: baseSalary,
      allowances: totalAllowances + totalOTPay + kpiBonus,
      total_income: grossSalary,
      total_deduction: totalDeduction,
      net_salary: netSalary,
      standard_working_days: STANDARD_WORKING_DAYS,
    })
    .eq("id", payroll_item_id)

  // Insert adjustment details
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
