"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { AttendanceLog, AttendanceLogWithRelations } from "@/lib/types/database"

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

  // Kiểm tra đã check-in hôm nay chưa
  const today = new Date().toISOString().split("T")[0]
  const { data: existing } = await supabase
    .from("attendance_logs")
    .select("id")
    .eq("employee_id", employee.id)
    .gte("check_in", today)
    .lt("check_in", today + "T23:59:59")
    .single()

  if (existing) {
    return { success: false, error: "Already checked in today" }
  }

  const { error } = await supabase.from("attendance_logs").insert({
    employee_id: employee.id,
    check_in: new Date().toISOString(),
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

  // Tìm record check-in hôm nay
  const today = new Date().toISOString().split("T")[0]
  const { data: attendance } = await supabase
    .from("attendance_logs")
    .select("id, check_out")
    .eq("employee_id", employee.id)
    .gte("check_in", today)
    .lt("check_in", today + "T23:59:59")
    .single()

  if (!attendance) {
    return { success: false, error: "No check-in record found for today" }
  }

  if (attendance.check_out) {
    return { success: false, error: "Already checked out today" }
  }

  const { error } = await supabase
    .from("attendance_logs")
    .update({ check_out: new Date().toISOString() })
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

  const { data, error } = await query.limit(100)

  if (error) {
    console.error("Error listing attendance:", error)
    return []
  }

  return (data || []) as AttendanceLogWithRelations[]
}
