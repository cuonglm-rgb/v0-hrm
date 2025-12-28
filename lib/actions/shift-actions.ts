"use server"

import { createClient } from "@/lib/supabase/server"
import type { WorkShift } from "@/lib/types/database"

export async function listWorkShifts(): Promise<WorkShift[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("work_shifts")
    .select("*")
    .order("name")

  if (error) {
    console.error("Error fetching work shifts:", error)
    return []
  }

  return data || []
}

export async function getMyShift(): Promise<WorkShift | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
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
