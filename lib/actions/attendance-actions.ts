"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { AttendanceLog, AttendanceLogWithRelations } from "@/lib/types/database"
import { getTodayVN, getNowVN } from "@/lib/utils/date-utils"

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
    .order("check_in", { ascending: false })

  if (from) query = query.gte("check_in", from)
  if (to) query = query.lte("check_in", to)

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
      )
    `)
    .eq("employee_id", employee.id)
    .eq("status", "approved")
    .not("from_date", "is", null)

  if (from) query = query.gte("from_date", from)
  if (to) query = query.lte("to_date", to)

  const { data, error } = await query

  if (error) {
    console.error("Error fetching leave requests:", error)
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
        shift:work_shifts(id, name, start_time, end_time, break_start, break_end, break_minutes)
      )
    `)
    .order("check_in", { ascending: false })

  if (filters?.employee_id) query = query.eq("employee_id", filters.employee_id)
  if (filters?.from) query = query.gte("check_in", filters.from)
  if (filters?.to) query = query.lte("check_in", filters.to)

  // Tăng limit để hiển thị đủ dữ liệu (1 tháng x 30 ngày x 50 nhân viên = 1500)
  const { data, error } = await query.limit(5000)

  if (error) {
    console.error("Error listing attendance:", error)
    return []
  }

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
