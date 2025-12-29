"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { WorkShift } from "@/lib/types/database"

export async function listWorkShifts(): Promise<WorkShift[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("work_shifts").select("*").order("name")

  if (error) {
    console.error("Error fetching work shifts:", error)
    return []
  }

  return data || []
}

export async function getMyShift(): Promise<WorkShift | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: employee } = await supabase
    .from("employees")
    .select("shift_id")
    .eq("user_id", user.id)
    .single()

  if (!employee?.shift_id) return null

  const { data: shift } = await supabase
    .from("work_shifts")
    .select("*")
    .eq("id", employee.shift_id)
    .single()

  return shift || null
}

export async function createWorkShift(input: {
  name: string
  start_time: string
  end_time: string
  break_start?: string
  break_end?: string
  break_minutes?: number
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("work_shifts").insert({
    name: input.name,
    start_time: input.start_time,
    end_time: input.end_time,
    break_start: input.break_start || null,
    break_end: input.break_end || null,
    break_minutes: input.break_minutes || 0,
  })

  if (error) {
    console.error("Error creating work shift:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/departments")
  return { success: true }
}

export async function updateWorkShift(
  id: string,
  input: {
    name?: string
    start_time?: string
    end_time?: string
    break_start?: string | null
    break_end?: string | null
    break_minutes?: number
  }
) {
  const supabase = await createClient()

  const { error } = await supabase.from("work_shifts").update(input).eq("id", id)

  if (error) {
    console.error("Error updating work shift:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/departments")
  return { success: true }
}

export async function deleteWorkShift(id: string) {
  const supabase = await createClient()

  // Kiểm tra có nhân viên đang dùng ca này không
  const { count } = await supabase
    .from("employees")
    .select("*", { count: "exact", head: true })
    .eq("shift_id", id)

  if (count && count > 0) {
    return { success: false, error: "Không thể xóa ca làm đang có nhân viên sử dụng" }
  }

  const { error } = await supabase.from("work_shifts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting work shift:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/departments")
  return { success: true }
}

export async function assignShiftToEmployee(employeeId: string, shiftId: string | null) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("employees")
    .update({ shift_id: shiftId })
    .eq("id", employeeId)

  if (error) {
    console.error("Error assigning shift:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}
