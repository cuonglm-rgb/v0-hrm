"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface SaturdaySchedule {
  id: string
  employee_id: string
  work_date: string
  is_working: boolean
  note: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface SaturdayScheduleWithEmployee extends SaturdaySchedule {
  employee: {
    id: string
    full_name: string
    employee_code: string
    department: {
      id: string
      name: string
    } | null
  } | null
}

// =============================================
// CHECK PERMISSION
// =============================================

export async function checkSaturdaySchedulePermission(): Promise<{
  allowed: boolean
  level: number | null
  departmentId: string | null
}> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { allowed: false, level: null, departmentId: null }

  const { data: employee } = await supabase
    .from("employees")
    .select(`
      id,
      department_id,
      position:positions(id, level)
    `)
    .eq("user_id", user.id)
    .single()

  if (!employee || !employee.position) {
    return { allowed: false, level: null, departmentId: null }
  }

  const level = (employee.position as any).level
  const allowed = level >= 3

  return {
    allowed,
    level,
    departmentId: employee.department_id,
  }
}

// =============================================
// LIST SCHEDULES
// =============================================

export async function listSaturdaySchedules(params?: {
  year?: number
  month?: number
  employeeId?: string
}): Promise<SaturdayScheduleWithEmployee[]> {
  const supabase = await createClient()

  let query = supabase
    .from("saturday_work_schedule")
    .select(`
      *,
      employee:employees!saturday_work_schedule_employee_id_fkey(
        id,
        full_name,
        employee_code,
        department:departments(id, name)
      )
    `)
    .order("work_date", { ascending: false })

  if (params?.year && params?.month) {
    const startDate = `${params.year}-${String(params.month).padStart(2, '0')}-01`
    const endDate = `${params.year}-${String(params.month).padStart(2, '0')}-31`
    query = query.gte("work_date", startDate).lte("work_date", endDate)
  } else if (params?.year) {
    query = query.gte("work_date", `${params.year}-01-01`).lte("work_date", `${params.year}-12-31`)
  }

  if (params?.employeeId) {
    query = query.eq("employee_id", params.employeeId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error listing saturday schedules:", error)
    return []
  }

  return (data || []) as SaturdayScheduleWithEmployee[]
}

// =============================================
// GET SCHEDULE FOR DATE
// =============================================

export async function getSaturdaySchedule(
  employeeId: string,
  workDate: string
): Promise<SaturdaySchedule | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("saturday_work_schedule")
    .select("*")
    .eq("employee_id", employeeId)
    .eq("work_date", workDate)
    .single()

  if (error) return null

  return data as SaturdaySchedule
}

// =============================================
// SET SCHEDULE
// =============================================

export async function setSaturdaySchedule(data: {
  employee_id: string
  work_date: string
  is_working: boolean
  note?: string
}) {
  const supabase = await createClient()

  // Validate: work_date phải là thứ 7
  const date = new Date(data.work_date)
  if (date.getDay() !== 6) {
    return { success: false, error: "Ngày phải là thứ 7" }
  }

  // Get current employee
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return { success: false, error: "Employee not found" }

  // Upsert
  const { error } = await supabase
    .from("saturday_work_schedule")
    .upsert({
      employee_id: data.employee_id,
      work_date: data.work_date,
      is_working: data.is_working,
      note: data.note || null,
      created_by: employee.id,
    }, {
      onConflict: "employee_id,work_date"
    })

  if (error) {
    console.error("Error setting saturday schedule:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/attendance-management")
  return { success: true }
}

// =============================================
// BULK SET SCHEDULE
// =============================================

export async function bulkSetSaturdaySchedule(data: {
  employee_ids: string[]
  work_date: string
  is_working: boolean
  note?: string
}) {
  const supabase = await createClient()

  // Validate: work_date phải là thứ 7
  const date = new Date(data.work_date)
  if (date.getDay() !== 6) {
    return { success: false, error: "Ngày phải là thứ 7" }
  }

  // Get current employee
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return { success: false, error: "Employee not found" }

  // Bulk upsert
  const records = data.employee_ids.map(empId => ({
    employee_id: empId,
    work_date: data.work_date,
    is_working: data.is_working,
    note: data.note || null,
    created_by: employee.id,
  }))

  const { error } = await supabase
    .from("saturday_work_schedule")
    .upsert(records, {
      onConflict: "employee_id,work_date"
    })

  if (error) {
    console.error("Error bulk setting saturday schedule:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/attendance-management")
  return { success: true, count: data.employee_ids.length }
}

// =============================================
// DELETE SCHEDULE
// =============================================

export async function deleteSaturdaySchedule(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("saturday_work_schedule")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting saturday schedule:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/attendance-management")
  return { success: true }
}
