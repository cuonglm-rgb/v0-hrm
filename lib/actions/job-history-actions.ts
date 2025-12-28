"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { EmployeeJobHistory, EmployeeJobHistoryWithRelations } from "@/lib/types/database"

export async function getMyJobHistory(): Promise<EmployeeJobHistoryWithRelations[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return []

  const { data, error } = await supabase
    .from("employee_job_history")
    .select(`
      *,
      department:departments(*),
      position:positions(*)
    `)
    .eq("employee_id", employee.id)
    .order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching job history:", error)
    return []
  }

  return (data || []) as EmployeeJobHistoryWithRelations[]
}

export async function getEmployeeJobHistory(employee_id: string): Promise<EmployeeJobHistoryWithRelations[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("employee_job_history")
    .select(`
      *,
      department:departments(*),
      position:positions(*)
    `)
    .eq("employee_id", employee_id)
    .order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching job history:", error)
    return []
  }

  return (data || []) as EmployeeJobHistoryWithRelations[]
}

export async function createJobHistory(input: {
  employee_id: string
  department_id?: string | null
  position_id?: string | null
  salary?: number | null
  start_date: string
  end_date?: string | null
}) {
  const supabase = await createClient()

  // Đóng record cũ nếu có
  if (!input.end_date) {
    await supabase
      .from("employee_job_history")
      .update({ end_date: input.start_date })
      .eq("employee_id", input.employee_id)
      .is("end_date", null)
  }

  const { error } = await supabase.from("employee_job_history").insert({
    employee_id: input.employee_id,
    department_id: input.department_id,
    position_id: input.position_id,
    salary: input.salary,
    start_date: input.start_date,
    end_date: input.end_date,
  })

  if (error) {
    console.error("Error creating job history:", error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/dashboard/employees/${input.employee_id}`)
  return { success: true }
}

export async function updateJobHistory(
  id: string,
  data: Partial<Pick<EmployeeJobHistory, "department_id" | "position_id" | "salary" | "start_date" | "end_date">>
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("employee_job_history")
    .update(data)
    .eq("id", id)

  if (error) {
    console.error("Error updating job history:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}
