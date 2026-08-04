"use server"

import { createClient, createServiceClient } from "@/lib/supabase/server"
import { getTodayVN, getTimePartsVN, toDateStringVN } from "@/lib/utils/date-utils"
import { getAnnualLeaveUsage } from "@/lib/actions/request-type-actions"
import { calculateAvailableBalance } from "@/lib/utils/leave-utils"
import { resolveScheduleScope, type ScheduleScope } from "@/lib/utils/dashboard-scope"

// Xác định phạm vi xem "Lịch làm việc" của user hiện tại (tự phân quyền, không tin tham số client)
async function getMyScheduleScope(): Promise<ScheduleScope> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { mode: "none" }

  const { data: employee } = await supabase
    .from("employees")
    .select("id, department_id, position:positions!position_id(level)")
    .eq("user_id", user.id)
    .single()

  const { data: roles } = await supabase
    .from("user_roles")
    .select("department_id, role:roles!role_id(code)")
    .eq("user_id", user.id)

  const roleCodes = (roles || []).map((r: any) => r.role?.code).filter(Boolean)
  const managerDeptIds = (roles || [])
    .filter((r: any) => r.role?.code === "manager" && r.department_id)
    .map((r: any) => r.department_id as string)
  const positionLevel = (employee as any)?.position?.level ?? 0
  const ownDeptId = employee?.department_id ?? null
  const ownEmployeeId = employee?.id ?? null

  return resolveScheduleScope({ roleCodes, positionLevel, managerDeptIds, ownDeptId, ownEmployeeId })
}

// Giới hạn truy vấn danh sách nhân viên theo phạm vi xem
function scopeEmployeeQuery<T>(query: T, scope: ScheduleScope): T {
  const q = query as any
  if (scope.mode === "dept") return q.in("department_id", scope.deptIds)
  if (scope.mode === "self") return q.eq("id", scope.employeeId)
  return query // all
}

/** Widget "Lịch làm việc" có được hiển thị cho user hiện tại không */
export async function canViewWorkSchedule(): Promise<boolean> {
  const scope = await getMyScheduleScope()
  return scope.mode !== "none"
}

// =============================================
// DASHBOARD (Trang chủ) - Các truy vấn tổng hợp
//
// Ghi chú: các widget tổng hợp toàn công ty (lịch làm việc, sự kiện,
// sinh nhật, thâm niên) dùng service client để đọc dữ liệu toàn công ty
// một cách nhất quán cho mọi người xem (RLS sẽ giới hạn nhân viên thường
// chỉ thấy dữ liệu của mình → widget rỗng). Chỉ trả về số liệu tổng hợp
// và thông tin nhân sự nội bộ (tên/phòng ban) đúng tinh thần portal HR.
// =============================================

export interface WorkScheduleSummary {
  present: number
  late: number
  absent: number
  onLeave: number
  presentNames: string[]
  lateNames: string[]
  leaveNames: string[]
  /** false với ngày tương lai (chưa có dữ liệu chấm công) */
  hasAttendanceData: boolean
}

const LEAVE_CODE_PREFIXES = ["annual", "unpaid", "sick", "maternity"]

function isLeaveType(code: string | undefined, deductBalance: boolean | undefined): boolean {
  if (deductBalance) return true
  if (!code) return false
  return LEAVE_CODE_PREFIXES.some((p) => code.startsWith(p))
}

/** Số ngày (dương) từ hôm nay tới lần lặp lại tiếp theo của (tháng, ngày) trong năm */
function daysUntilAnnual(month: number, day: number, todayStr: string): { days: number; year: number } {
  const [ty, tm, td] = todayStr.split("-").map(Number)
  const todayUTC = Date.UTC(ty, tm - 1, td)
  let year = ty
  let next = Date.UTC(year, month - 1, day)
  if (next < todayUTC) {
    year = ty + 1
    next = Date.UTC(year, month - 1, day)
  }
  return { days: Math.round((next - todayUTC) / 86400000), year }
}

/**
 * Tổng hợp lịch làm việc cho 1 ngày: có mặt / đi trễ / vắng mặt / nghỉ phép.
 * Ngày tương lai chỉ có nghỉ phép đã lên lịch (present/late/absent = 0).
 */
export async function getWorkScheduleSummary(dateStr: string): Promise<WorkScheduleSummary> {
  const today = getTodayVN()
  const isFuture = dateStr > today

  const empty: WorkScheduleSummary = {
    present: 0,
    late: 0,
    absent: 0,
    onLeave: 0,
    presentNames: [],
    lateNames: [],
    leaveNames: [],
    hasAttendanceData: !isFuture,
  }

  const scope = await getMyScheduleScope()
  if (scope.mode === "none") return empty

  const supabase = createServiceClient()

  // Nhân viên đang làm việc (không tính đã nghỉ việc), giới hạn theo phạm vi xem
  let empQuery = supabase
    .from("employees")
    .select("id, full_name, shift_id, status")
    .neq("status", "resigned")
  empQuery = scopeEmployeeQuery(empQuery, scope)
  const { data: employees } = await empQuery

  const activeEmployees = employees || []
  const empMap = new Map(activeEmployees.map((e) => [e.id, e]))

  // Nghỉ phép đã duyệt phủ ngày này
  const { data: leaveRequests } = await supabase
    .from("employee_requests")
    .select(`
      employee_id, from_date, to_date, request_date,
      request_type:request_types!request_type_id(code, deduct_leave_balance)
    `)
    .eq("status", "approved")
    .or(`and(from_date.lte.${dateStr},to_date.gte.${dateStr}),request_date.eq.${dateStr}`)

  const leaveEmpIds = new Set<string>()
  for (const req of leaveRequests || []) {
    const rt = (req as any).request_type
    if (!isLeaveType(rt?.code, rt?.deduct_leave_balance)) continue
    if (empMap.has(req.employee_id)) leaveEmpIds.add(req.employee_id)
  }
  const leaveNames = [...leaveEmpIds].map((id) => empMap.get(id)!.full_name)

  if (isFuture) {
    return { ...empty, onLeave: leaveEmpIds.size, leaveNames }
  }

  // Chấm công trong ngày
  const { data: shifts } = await supabase.from("work_shifts").select("id, start_time")
  const shiftStartMap = new Map<string, string>(
    (shifts || []).map((s: any) => [s.id, (s.start_time || "08:00").slice(0, 5)])
  )

  const { data: logs } = await supabase
    .from("attendance_logs")
    .select("employee_id, check_in")
    .gte("check_in", dateStr)
    .lte("check_in", `${dateStr}T23:59:59`)

  const presentIds = new Set<string>()
  const lateIds = new Set<string>()
  for (const log of logs || []) {
    if (!log.check_in || !empMap.has(log.employee_id)) continue
    presentIds.add(log.employee_id)
    const emp = empMap.get(log.employee_id)!
    const startStr = shiftStartMap.get(emp.shift_id || "") || "08:00"
    const [sh, sm] = startStr.split(":").map(Number)
    const { hours, minutes } = getTimePartsVN(log.check_in)
    if (hours * 60 + minutes > sh * 60 + sm) lateIds.add(log.employee_id)
  }

  // Vắng mặt: chỉ tính cho ngày làm việc (T2-T6, không phải ngày lễ) để tránh
  // báo nhầm cuối tuần. Vắng = đang làm việc, không chấm công, không nghỉ phép.
  let absent = 0
  const [y, m, d] = dateStr.split("-").map(Number)
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay() // 0=CN, 6=T7
  const isWeekday = dow >= 1 && dow <= 5
  if (isWeekday) {
    const { data: holiday } = await supabase
      .from("holidays")
      .select("id")
      .eq("holiday_date", dateStr)
      .limit(1)
    const isHoliday = (holiday || []).length > 0
    if (!isHoliday) {
      for (const emp of activeEmployees) {
        if (!presentIds.has(emp.id) && !leaveEmpIds.has(emp.id)) absent++
      }
    }
  }

  return {
    present: presentIds.size,
    late: lateIds.size,
    absent,
    onLeave: leaveEmpIds.size,
    presentNames: [...presentIds].map((id) => empMap.get(id)!.full_name),
    lateNames: [...lateIds].map((id) => empMap.get(id)!.full_name),
    leaveNames,
    hasAttendanceData: true,
  }
}

export type CalendarEventType = "onboard" | "offboard" | "leave" | "wfh" | "overtime"

export interface CalendarEvent {
  date: string // YYYY-MM-DD
  type: CalendarEventType
  label: string
  employeeName: string
}

const EVENT_LABELS: Record<CalendarEventType, string> = {
  onboard: "Onboard",
  offboard: "Offboard",
  leave: "Nghỉ phép",
  wfh: "Làm việc tại nhà",
  overtime: "Tăng ca",
}

function eachDate(from: string, to: string): string[] {
  const [fy, fm, fd] = from.split("-").map(Number)
  const [ty, tm, td] = to.split("-").map(Number)
  const start = Date.UTC(fy, fm - 1, fd)
  const end = Date.UTC(ty, tm - 1, td)
  const out: string[] = []
  for (let t = start; t <= end; t += 86400000) {
    const dt = new Date(t)
    out.push(
      `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`
    )
  }
  return out
}

/** Sự kiện trong khoảng [fromDate, toDate]: onboard/offboard/nghỉ phép/WFH/tăng ca */
export async function getCalendarEvents(fromDate: string, toDate: string): Promise<CalendarEvent[]> {
  const supabase = createServiceClient()
  const events: CalendarEvent[] = []

  // Onboard / Offboard từ ngày vào / ngày nghỉ việc
  const { data: employees } = await supabase
    .from("employees")
    .select("full_name, join_date, resignation_date")

  for (const emp of employees || []) {
    if (emp.join_date && emp.join_date >= fromDate && emp.join_date <= toDate) {
      events.push({ date: emp.join_date, type: "onboard", label: EVENT_LABELS.onboard, employeeName: emp.full_name })
    }
    if (emp.resignation_date && emp.resignation_date >= fromDate && emp.resignation_date <= toDate) {
      events.push({ date: emp.resignation_date, type: "offboard", label: EVENT_LABELS.offboard, employeeName: emp.full_name })
    }
  }

  // Phiếu đã duyệt: nghỉ phép / WFH / tăng ca
  const { data: requests } = await supabase
    .from("employee_requests")
    .select(`
      from_date, to_date, request_date,
      employee:employees!employee_requests_employee_id_fkey(full_name),
      request_type:request_types!request_type_id(code, deduct_leave_balance)
    `)
    .eq("status", "approved")
    .or(`and(from_date.lte.${toDate},to_date.gte.${fromDate}),and(request_date.gte.${fromDate},request_date.lte.${toDate})`)

  for (const req of requests || []) {
    const rt = (req as any).request_type
    const code: string | undefined = rt?.code
    let type: CalendarEventType | null = null
    if (code === "work_from_home") type = "wfh"
    else if (code === "overtime") type = "overtime"
    else if (isLeaveType(code, rt?.deduct_leave_balance)) type = "leave"
    if (!type) continue

    const name = (req as any).employee?.full_name || ""
    const dates =
      req.from_date && req.to_date
        ? eachDate(req.from_date, req.to_date)
        : req.request_date
          ? [req.request_date]
          : []
    for (const dt of dates) {
      if (dt < fromDate || dt > toDate) continue
      events.push({ date: dt, type, label: EVENT_LABELS[type], employeeName: name })
    }
  }

  return events
}

export interface BirthdayItem {
  id: string
  full_name: string
  avatar_url: string | null
  departmentName: string | null
  positionName: string | null
  date: string // MM-DD hiển thị
  daysUntil: number
}

export async function getUpcomingBirthdays(days = 30): Promise<BirthdayItem[]> {
  const supabase = createServiceClient()
  const today = getTodayVN()

  const { data: employees } = await supabase
    .from("employees")
    .select("id, full_name, avatar_url, dob, status, department:departments(name), position:positions!position_id(name)")
    .neq("status", "resigned")
    .not("dob", "is", null)

  const items: BirthdayItem[] = []
  for (const emp of employees || []) {
    if (!emp.dob) continue
    const [, mm, dd] = String(emp.dob).slice(0, 10).split("-").map(Number)
    if (!mm || !dd) continue
    const { days: daysUntil } = daysUntilAnnual(mm, dd, today)
    if (daysUntil > days) continue
    items.push({
      id: emp.id,
      full_name: emp.full_name,
      avatar_url: emp.avatar_url,
      departmentName: (emp as any).department?.name || null,
      positionName: (emp as any).position?.name || null,
      date: `${String(dd).padStart(2, "0")}/${String(mm).padStart(2, "0")}`,
      daysUntil,
    })
  }

  return items.sort((a, b) => a.daysUntil - b.daysUntil)
}

export interface AnniversaryItem {
  id: string
  full_name: string
  avatar_url: string | null
  departmentName: string | null
  positionName: string | null
  years: number
  date: string // dd/MM hiển thị
  daysUntil: number
}

export async function getUpcomingAnniversaries(days = 30): Promise<AnniversaryItem[]> {
  const supabase = createServiceClient()
  const today = getTodayVN()

  const { data: employees } = await supabase
    .from("employees")
    .select("id, full_name, avatar_url, official_date, join_date, status, department:departments(name), position:positions!position_id(name)")
    .neq("status", "resigned")

  const items: AnniversaryItem[] = []
  for (const emp of employees || []) {
    const startDate: string | null = emp.official_date || emp.join_date
    if (!startDate) continue
    const [sy, sm, sd] = String(startDate).slice(0, 10).split("-").map(Number)
    if (!sy || !sm || !sd) continue
    const { days: daysUntil, year } = daysUntilAnnual(sm, sd, today)
    if (daysUntil > days) continue
    const years = year - sy
    if (years <= 0) continue // chưa đủ 1 năm
    items.push({
      id: emp.id,
      full_name: emp.full_name,
      avatar_url: emp.avatar_url,
      departmentName: (emp as any).department?.name || null,
      positionName: (emp as any).position?.name || null,
      years,
      date: `${String(sd).padStart(2, "0")}/${String(sm).padStart(2, "0")}`,
      daysUntil,
    })
  }

  return items.sort((a, b) => a.daysUntil - b.daysUntil)
}

export interface SeniorityData {
  /** 'upcoming' = kỷ niệm sắp tới; 'ranking' = xếp hạng thâm niên cao nhất (fallback) */
  mode: "upcoming" | "ranking"
  items: AnniversaryItem[]
}

/**
 * Dữ liệu widget Thâm niên:
 * - Ưu tiên các kỷ niệm ngày vào làm trong `windowDays` ngày tới (ai sắp tròn 1,2,3... năm).
 * - Nếu không có ai → hiển thị bảng xếp hạng nhân viên thâm niên cao nhất.
 */
export async function getSeniorityData(windowDays = 30, rankingLimit = 8): Promise<SeniorityData> {
  const upcoming = await getUpcomingAnniversaries(windowDays)
  if (upcoming.length > 0) return { mode: "upcoming", items: upcoming }

  // Fallback: xếp hạng thâm niên (làm lâu nhất trước)
  const supabase = createServiceClient()
  const today = getTodayVN()
  const [ty, tm, td] = today.split("-").map(Number)
  const todayUTC = Date.UTC(ty, tm - 1, td)

  const { data: employees } = await supabase
    .from("employees")
    .select("id, full_name, avatar_url, official_date, join_date, status, department:departments(name), position:positions!position_id(name)")
    .neq("status", "resigned")

  const rows: { item: AnniversaryItem; startUTC: number }[] = []
  for (const emp of employees || []) {
    const startDate: string | null = emp.official_date || emp.join_date
    if (!startDate) continue
    const [sy, sm, sd] = String(startDate).slice(0, 10).split("-").map(Number)
    if (!sy || !sm || !sd) continue
    const startUTC = Date.UTC(sy, sm - 1, sd)
    if (startUTC > todayUTC) continue // chưa vào làm

    // Số năm đã hoàn thành tính tới hôm nay
    let years = ty - sy
    if (Date.UTC(ty, sm - 1, sd) > todayUTC) years -= 1

    rows.push({
      startUTC,
      item: {
        id: emp.id,
        full_name: emp.full_name,
        avatar_url: emp.avatar_url,
        departmentName: (emp as any).department?.name || null,
        positionName: (emp as any).position?.name || null,
        years: Math.max(0, years),
        date: `${String(sd).padStart(2, "0")}/${String(sm).padStart(2, "0")}/${sy}`,
        daysUntil: 0,
      },
    })
  }

  rows.sort((a, b) => a.startUTC - b.startUTC) // vào làm sớm nhất = thâm niên cao nhất
  return { mode: "ranking", items: rows.slice(0, rankingLimit).map((r) => r.item) }
}

/**
 * Tổng hợp lịch làm việc cho một KHOẢNG ngày [fromStr, toStr].
 * Số liệu là số nhân viên riêng biệt: có mặt / đi trễ / nghỉ phép ít nhất 1 ngày;
 * vắng mặt = có ít nhất 1 ngày làm việc (T2-T6, không lễ) không chấm công & không nghỉ phép.
 * Chỉ tính tới hôm nay (ngày tương lai chưa có dữ liệu chấm công).
 */
export async function getWorkScheduleRange(fromStr: string, toStr: string): Promise<WorkScheduleSummary> {
  const today = getTodayVN()

  const scope = await getMyScheduleScope()
  if (scope.mode === "none") {
    return {
      present: 0,
      late: 0,
      absent: 0,
      onLeave: 0,
      presentNames: [],
      lateNames: [],
      leaveNames: [],
      hasAttendanceData: fromStr <= today,
    }
  }
  const supabase = createServiceClient()

  let empQuery = supabase
    .from("employees")
    .select("id, full_name, shift_id, status")
    .neq("status", "resigned")
  empQuery = scopeEmployeeQuery(empQuery, scope)
  const { data: employees } = await empQuery
  const activeEmployees = employees || []
  const empMap = new Map(activeEmployees.map((e) => [e.id, e]))

  const { data: shifts } = await supabase.from("work_shifts").select("id, start_time")
  const shiftStartMap = new Map<string, string>(
    (shifts || []).map((s: any) => [s.id, (s.start_time || "08:00").slice(0, 5)])
  )

  const rangeDates = eachDate(fromStr, toStr)
  const rangeDateSet = new Set(rangeDates)

  // Nghỉ phép đã duyệt trong khoảng
  const { data: leaveRequests } = await supabase
    .from("employee_requests")
    .select(`
      employee_id, from_date, to_date, request_date,
      request_type:request_types!request_type_id(code, deduct_leave_balance)
    `)
    .eq("status", "approved")
    .or(`and(from_date.lte.${toStr},to_date.gte.${fromStr}),and(request_date.gte.${fromStr},request_date.lte.${toStr})`)

  const leaveByDay = new Map<string, Set<string>>()
  const leaveSet = new Set<string>()
  for (const req of leaveRequests || []) {
    const rt = (req as any).request_type
    if (!isLeaveType(rt?.code, rt?.deduct_leave_balance)) continue
    if (!empMap.has(req.employee_id)) continue
    const days =
      req.from_date && req.to_date
        ? eachDate(req.from_date, req.to_date)
        : req.request_date
          ? [req.request_date]
          : []
    for (const d of days) {
      if (!rangeDateSet.has(d)) continue
      leaveSet.add(req.employee_id)
      if (!leaveByDay.has(d)) leaveByDay.set(d, new Set())
      leaveByDay.get(d)!.add(req.employee_id)
    }
  }

  // Chấm công (chỉ tới hôm nay)
  const presentByDay = new Map<string, Set<string>>()
  const presentSet = new Set<string>()
  const lateSet = new Set<string>()
  const hasAttendanceData = fromStr <= today
  if (hasAttendanceData) {
    const attTo = toStr < today ? toStr : today
    const { data: logs } = await supabase
      .from("attendance_logs")
      .select("employee_id, check_in")
      .gte("check_in", fromStr)
      .lte("check_in", `${attTo}T23:59:59`)

    for (const log of logs || []) {
      if (!log.check_in || !empMap.has(log.employee_id)) continue
      const day = toDateStringVN(log.check_in)
      if (!rangeDateSet.has(day)) continue
      presentSet.add(log.employee_id)
      if (!presentByDay.has(day)) presentByDay.set(day, new Set())
      presentByDay.get(day)!.add(log.employee_id)
      const emp = empMap.get(log.employee_id)!
      const startStr = shiftStartMap.get(emp.shift_id || "") || "08:00"
      const [sh, sm] = startStr.split(":").map(Number)
      const { hours, minutes } = getTimePartsVN(log.check_in)
      if (hours * 60 + minutes > sh * 60 + sm) lateSet.add(log.employee_id)
    }
  }

  // Vắng mặt trên các ngày làm việc tới hôm nay
  const { data: holidays } = await supabase
    .from("holidays")
    .select("holiday_date")
    .gte("holiday_date", fromStr)
    .lte("holiday_date", toStr)
  const holidaySet = new Set((holidays || []).map((h: any) => h.holiday_date))

  const absentSet = new Set<string>()
  for (const d of rangeDates) {
    if (d > today) continue
    const [yy, mm, dd] = d.split("-").map(Number)
    const dowd = new Date(Date.UTC(yy, mm - 1, dd)).getUTCDay()
    if (dowd < 1 || dowd > 5) continue
    if (holidaySet.has(d)) continue
    const presentThatDay = presentByDay.get(d) || new Set<string>()
    const leaveThatDay = leaveByDay.get(d) || new Set<string>()
    for (const emp of activeEmployees) {
      if (!presentThatDay.has(emp.id) && !leaveThatDay.has(emp.id)) absentSet.add(emp.id)
    }
  }

  const namesOf = (s: Set<string>) => [...s].map((id) => empMap.get(id)!.full_name)
  return {
    present: presentSet.size,
    late: lateSet.size,
    absent: absentSet.size,
    onLeave: leaveSet.size,
    presentNames: namesOf(presentSet),
    lateNames: namesOf(lateSet),
    leaveNames: namesOf(leaveSet),
    hasAttendanceData,
  }
}

export interface MyLeaveBalance {
  year: number
  total: number
  remaining: number
  used: number
  expired: number
}

/** Số dư phép năm của người dùng hiện tại cho một năm bất kỳ */
export async function getMyLeaveBalanceForYear(year: number): Promise<MyLeaveBalance> {
  const empty: MyLeaveBalance = { year, total: 0, remaining: 0, used: 0, expired: 0 }
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return empty

  const { data: employee } = await supabase
    .from("employees")
    .select("id, official_date")
    .eq("user_id", user.id)
    .single()
  if (!employee) return empty

  const used = await getAnnualLeaveUsage(employee.id, year)

  // Mốc tính: năm quá khứ -> cuối năm đó; năm tương lai -> đầu năm; năm hiện tại -> hôm nay
  const nowYear = Number(getTodayVN().slice(0, 4))
  const targetDate =
    year < nowYear
      ? new Date(Date.UTC(year, 11, 31))
      : year > nowYear
        ? new Date(Date.UTC(year, 0, 1))
        : new Date()

  const balance = calculateAvailableBalance(employee.official_date, used, targetDate)
  return {
    year,
    total: balance.totalEntitlement,
    remaining: balance.remaining,
    used,
    expired: 0, // Chưa mô hình hóa phép hết hạn
  }
}
