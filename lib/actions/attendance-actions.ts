"use server"

import { createClient, createServiceClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { AttendanceLog, AttendanceLogWithRelations } from "@/lib/types/database"
import { getTodayVN, getNowVN, createVNTimestamp } from "@/lib/utils/date-utils"
import { warnIfTruncated } from "@/lib/utils/postgrest-limit"

// Kiểm tra user hiện tại có phải HR/Admin không (cho các thao tác chỉnh chấm công thủ công)
async function requireHrOrAdmin(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Chưa đăng nhập" }

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role:roles!role_id(code)")
    .eq("user_id", user.id)

  const isHrAdmin = (roles || []).some(
    (r: any) => r.role?.code === "hr" || r.role?.code === "admin"
  )
  return isHrAdmin ? { ok: true } : { ok: false, error: "Bạn không có quyền chỉnh sửa chấm công" }
}

// Tạo mới hoặc cập nhật một bản ghi chấm công thủ công (HR/Admin) cho một ngày cụ thể.
// check_in_time / check_out_time dạng "HH:mm" theo giờ VN; để trống = null.
export async function upsertAttendanceLog(input: {
  id?: string
  employee_id: string
  date: string // YYYY-MM-DD
  check_in_time?: string | null
  check_out_time?: string | null
  note?: string | null
}): Promise<{ success: boolean; error?: string }> {
  const guard = await requireHrOrAdmin()
  if (!guard.ok) return { success: false, error: guard.error }

  if (!input.employee_id || !input.date) {
    return { success: false, error: "Thiếu thông tin nhân viên hoặc ngày" }
  }

  const check_in = input.check_in_time ? createVNTimestamp(input.date, input.check_in_time) : null
  const check_out = input.check_out_time ? createVNTimestamp(input.date, input.check_out_time) : null

  if (!check_in && !check_out) {
    return { success: false, error: "Cần nhập ít nhất giờ vào hoặc giờ ra" }
  }
  if (check_in && check_out && check_out < check_in) {
    return { success: false, error: "Giờ ra phải sau giờ vào" }
  }

  // Đã xác thực HR/Admin -> dùng service client để chỉnh bản ghi của nhân viên khác (bỏ RLS)
  const supabase = createServiceClient()

  // Khoảng thời gian của ngày (theo giờ VN) để tìm & dọn các bản ghi trùng ngày
  const dayStart = `${input.date}T00:00:00+07:00`
  const dayEnd = `${input.date}T23:59:59+07:00`
  const sameDayFilter = `and(check_in.gte.${dayStart},check_in.lte.${dayEnd}),and(check_in.is.null,check_out.gte.${dayStart},check_out.lte.${dayEnd})`

  // Xác định bản ghi đích: id truyền vào, hoặc bản ghi cùng ngày đã tồn tại (upsert thật để tránh tạo trùng)
  let targetId = input.id
  if (!targetId) {
    const { data: existing } = await supabase
      .from("attendance_logs")
      .select("id")
      .eq("employee_id", input.employee_id)
      .or(sameDayFilter)
      .order("check_in", { ascending: true, nullsFirst: false })
    if (existing && existing.length > 0) {
      targetId = existing[0].id
    }
  }

  if (targetId) {
    const { error } = await supabase
      .from("attendance_logs")
      .update({ check_in, check_out, note: input.note ?? null, source: "manual" })
      .eq("id", targetId)
    if (error) {
      console.error("Error updating attendance log:", error)
      return { success: false, error: error.message }
    }
  } else {
    const { data: inserted, error } = await supabase
      .from("attendance_logs")
      .insert({
        employee_id: input.employee_id,
        check_in,
        check_out,
        note: input.note ?? null,
        source: "manual",
      })
      .select("id")
      .single()
    if (error) {
      console.error("Error creating attendance log:", error)
      return { success: false, error: error.message }
    }
    targetId = inserted?.id
  }

  // Dọn các bản ghi trùng ngày còn lại (nếu có) - giữ lại bản vừa lưu
  if (targetId) {
    await supabase
      .from("attendance_logs")
      .delete()
      .eq("employee_id", input.employee_id)
      .neq("id", targetId)
      .or(sameDayFilter)
  }

  revalidatePath("/dashboard/attendance-management")
  revalidatePath("/dashboard/attendance")
  return { success: true }
}

export async function deleteAttendanceLog(id: string): Promise<{ success: boolean; error?: string }> {
  const guard = await requireHrOrAdmin()
  if (!guard.ok) return { success: false, error: guard.error }

  const supabase = createServiceClient()
  const { error } = await supabase.from("attendance_logs").delete().eq("id", id)
  if (error) {
    console.error("Error deleting attendance log:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/attendance-management")
  revalidatePath("/dashboard/attendance")
  return { success: true }
}

export async function getMyAttendance(from?: string, to?: string): Promise<AttendanceLog[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Lấy employee_id của user
  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return []

  let query = supabase
    .from("attendance_logs")
    .select("*")
    .eq("employee_id", employee.id)
    .order("check_in", { ascending: false, nullsFirst: false })

  // Filter theo check_in hoặc check_out (trường hợp check_in null)
  if (from) {
    query = query.or(`check_in.gte.${from},and(check_in.is.null,check_out.gte.${from})`)
  }
  if (to) {
    query = query.or(`check_in.lte.${to},and(check_in.is.null,check_out.lte.${to})`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching attendance:", error)
    return []
  }

  return data || []
}

// Lấy thông tin phiếu nghỉ được duyệt của nhân viên
export async function getMyApprovedLeaveRequests(from?: string, to?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return []

  let query = supabase
    .from("employee_requests")
    .select(`
      *,
      request_type:request_types(
        id,
        name,
        code,
        affects_attendance,
        affects_payroll
      ),
      time_slots:request_time_slots(from_time, to_time, slot_order)
    `)
    .eq("employee_id", employee.id)
    .eq("status", "approved")
    .or("from_date.not.is.null,request_date.not.is.null")

  if (from && to) {
    query = query.or(`and(from_date.lte.${to},to_date.gte.${from}),and(request_date.gte.${from},request_date.lte.${to})`)
  } else if (from) {
    query = query.or(`to_date.gte.${from},request_date.gte.${from}`)
  } else if (to) {
    query = query.or(`from_date.lte.${to},request_date.lte.${to}`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching leave requests:", error)
    return []
  }

  return data || []
}

// Lấy tất cả phiếu nghỉ / làm bù được duyệt (cho HR/Admin, bao gồm phiếu có request_date như late_early_makeup)
// Truyền employeeId để chỉ lấy phiếu của 1 nhân viên (tránh giới hạn số dòng mặc định của PostgREST khi lấy toàn bộ)
export async function getAllApprovedLeaveRequests(from?: string, to?: string, employeeId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("employee_requests")
    .select(`
      *,
      request_type:request_types(
        id,
        name,
        code,
        affects_attendance,
        affects_payroll,
        deduct_leave_balance
      ),
      employee:employees!employee_requests_employee_id_fkey(
        id,
        employee_code,
        full_name
      ),
      time_slots:request_time_slots(from_time, to_time, slot_order)
    `)
    .eq("status", "approved")
    .or("from_date.not.is.null,request_date.not.is.null")

  if (employeeId) {
    query = query.eq("employee_id", employeeId)
  }

  if (from && to) {
    query = query.or(`and(from_date.lte.${to},to_date.gte.${from}),and(request_date.gte.${from},request_date.lte.${to})`)
  } else if (from) {
    query = query.or(`to_date.gte.${from},request_date.gte.${from}`)
  } else if (to) {
    query = query.or(`from_date.lte.${to},request_date.lte.${to}`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching all leave requests:", error)
    return []
  }

  return data || []
}

export async function checkIn() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return { success: false, error: "Employee not found" }

  // Kiểm tra đã check-in hôm nay chưa (theo giờ VN)
  const today = getTodayVN()
  const { data: existing } = await supabase
    .from("attendance_logs")
    .select("id")
    .eq("employee_id", employee.id)
    .gte("check_in", today + "T00:00:00+07:00")
    .lt("check_in", today + "T23:59:59+07:00")
    .single()

  if (existing) {
    return { success: false, error: "Already checked in today" }
  }

  const { error } = await supabase.from("attendance_logs").insert({
    employee_id: employee.id,
    check_in: getNowVN(),
    source: "manual",
  })

  if (error) {
    console.error("Error checking in:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/attendance")
  return { success: true }
}

export async function checkOut() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return { success: false, error: "Employee not found" }

  // Tìm record check-in hôm nay (theo giờ VN)
  const today = getTodayVN()
  const { data: attendance } = await supabase
    .from("attendance_logs")
    .select("id, check_out")
    .eq("employee_id", employee.id)
    .gte("check_in", today + "T00:00:00+07:00")
    .lt("check_in", today + "T23:59:59+07:00")
    .single()

  if (!attendance) {
    return { success: false, error: "No check-in record found for today" }
  }

  if (attendance.check_out) {
    return { success: false, error: "Already checked out today" }
  }

  const { error } = await supabase
    .from("attendance_logs")
    .update({ check_out: getNowVN() })
    .eq("id", attendance.id)

  if (error) {
    console.error("Error checking out:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/attendance")
  return { success: true }
}

export async function listAttendance(filters?: {
  employee_id?: string
  from?: string
  to?: string
}): Promise<AttendanceLogWithRelations[]> {
  const supabase = await createClient()

  let query = supabase
    .from("attendance_logs")
    .select(`
      *,
      employee:employees(
        id,
        full_name,
        employee_code,
        shift:work_shifts(id, name, start_time, end_time, break_start, break_end, break_minutes, single_check_per_day)
      )
    `)

  if (filters?.employee_id) query = query.eq("employee_id", filters.employee_id)
  
  // Filter theo check_in hoặc check_out (trường hợp check_in null - quên chấm công vào)
  if (filters?.from) {
    query = query.or(`check_in.gte.${filters.from},and(check_in.is.null,check_out.gte.${filters.from})`)
  }
  if (filters?.to) {
    query = query.or(`check_in.lte.${filters.to},and(check_in.is.null,check_out.lte.${filters.to})`)
  }

  // Order by check_in or check_out (for logs with null check_in)
  // Use coalesce to handle null check_in
  query = query.order("check_in", { ascending: false, nullsFirst: false })

  const { data, error } = await query

  if (error) {
    console.error("Error listing attendance:", error)
    return []
  }

  warnIfTruncated("listAttendance", data)

  return (data || []) as AttendanceLogWithRelations[]
}


// =============================================
// HOLIDAY ACTIONS
// =============================================

export interface Holiday {
  id: string
  name: string
  holiday_date: string
  year: number
  is_recurring: boolean
  description?: string
}

export async function getHolidays(year?: number): Promise<Holiday[]> {
  const supabase = await createClient()

  let query = supabase
    .from("holidays")
    .select("*")
    .order("holiday_date", { ascending: true })

  if (year) {
    query = query.eq("year", year)
  }

  const { data, error } = await query

  if (error) {
    // Bảng có thể chưa tồn tại
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      console.warn("Bảng holidays chưa tồn tại. Vui lòng chạy script 022-overtime-settings.sql")
    } else {
      console.error("Error fetching holidays:", error)
    }
    return []
  }

  return data || []
}

// Kiểm tra một ngày có phải ngày lễ không
export async function isHoliday(date: string): Promise<{ isHoliday: boolean; holidayName?: string }> {
  const supabase = await createClient()
  const year = new Date(date).getFullYear()

  const { data, error } = await supabase
    .from("holidays")
    .select("name")
    .eq("holiday_date", date)
    .eq("year", year)
    .single()

  if (error || !data) {
    return { isHoliday: false }
  }

  return { isHoliday: true, holidayName: data.name }
}
