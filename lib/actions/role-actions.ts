"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Role, RoleCode } from "@/lib/types/database"

export async function listRoles(): Promise<Role[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("roles").select("*").order("name")

  if (error) {
    console.error("Error listing roles:", error)
    return []
  }

  return data || []
}

export async function assignRole(userId: string, roleCode: RoleCode, departmentId?: string) {
  const supabase = await createClient()

  // Get role id from code
  const { data: role } = await supabase.from("roles").select("id").eq("code", roleCode).single()

  if (!role) {
    return { success: false, error: "Role not found" }
  }

  const { error } = await supabase.from("user_roles").upsert(
    {
      user_id: userId,
      role_id: role.id,
      department_id: departmentId || null,
    },
    {
      onConflict: "user_id,role_id",
    },
  )

  if (error) {
    console.error("Error assigning role:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}

export async function removeRole(userId: string, roleCode: RoleCode) {
  const supabase = await createClient()

  // Get role id from code
  const { data: role } = await supabase.from("roles").select("id").eq("code", roleCode).single()

  if (!role) {
    return { success: false, error: "Role not found" }
  }

  const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role_id", role.id)

  if (error) {
    console.error("Error removing role:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}

export async function getUserRoles(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_roles")
    .select(`
      *,
      role:roles(*)
    `)
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching user roles:", error)
    return []
  }

  return data || []
}
