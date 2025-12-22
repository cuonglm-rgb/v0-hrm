"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Department, Position } from "@/lib/types/database"

export async function listDepartments(): Promise<Department[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("departments").select("*").order("name")

  if (error) {
    console.error("Error listing departments:", error)
    return []
  }

  return data || []
}

export async function listPositions(): Promise<Position[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("positions").select("*").order("level", { ascending: false })

  if (error) {
    console.error("Error listing positions:", error)
    return []
  }

  return data || []
}

export async function createDepartment(data: { name: string; code?: string; parent_id?: string }) {
  const supabase = await createClient()

  const { error } = await supabase.from("departments").insert(data)

  if (error) {
    console.error("Error creating department:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/departments")
  return { success: true }
}

export async function updateDepartment(id: string, data: { name?: string; code?: string; parent_id?: string | null }) {
  const supabase = await createClient()

  const { error } = await supabase.from("departments").update(data).eq("id", id)

  if (error) {
    console.error("Error updating department:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/departments")
  return { success: true }
}
