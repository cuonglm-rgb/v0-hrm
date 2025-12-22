"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Employee, EmployeeWithRelations, UserRoleWithRelations } from "@/lib/types/database"

export async function getMyEmployee(): Promise<EmployeeWithRelations | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("employees")
    .select(`
      *,
      department:departments(*),
      position:positions(*),
      manager:employees!manager_id(id, full_name, email)
    `)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("Error fetching employee:", error)
    return null
  }

  return data as EmployeeWithRelations
}

export async function getMyRoles(): Promise<UserRoleWithRelations[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("user_roles")
    .select(`
      *,
      role:roles(*)
    `)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching roles:", error)
    return []
  }

  return (data || []) as UserRoleWithRelations[]
}

export async function listEmployees(): Promise<EmployeeWithRelations[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("employees")
    .select(`
      *,
      department:departments(*),
      position:positions(*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error listing employees:", error)
    return []
  }

  return (data || []) as EmployeeWithRelations[]
}

export async function getEmployee(id: string): Promise<EmployeeWithRelations | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("employees")
    .select(`
      *,
      department:departments(*),
      position:positions(*),
      manager:employees!manager_id(id, full_name, email)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching employee:", error)
    return null
  }

  return data as EmployeeWithRelations
}

export async function updateEmployee(
  id: string,
  data: Partial<Pick<Employee, "full_name" | "phone" | "department_id" | "position_id" | "status" | "join_date">>,
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("employees")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error updating employee:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  revalidatePath(`/dashboard/employees/${id}`)
  return { success: true }
}

export async function updateMyProfile(data: Partial<Pick<Employee, "full_name" | "phone">>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { error } = await supabase
    .from("employees")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/profile")
  return { success: true }
}

export async function createEmployee(data: {
  full_name: string
  email: string
  phone?: string | null
  department_id?: string | null
  position_id?: string | null
  join_date?: string | null
}) {
  const supabase = await createClient()

  // Generate employee code
  const code = `NV${new Date().toISOString().slice(0, 7).replace("-", "")}${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`

  const { error } = await supabase.from("employees").insert({
    employee_code: code,
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    department_id: data.department_id,
    position_id: data.position_id,
    join_date: data.join_date,
    status: "onboarding",
  })

  if (error) {
    console.error("Error creating employee:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}
