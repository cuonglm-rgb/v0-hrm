"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { SalaryStructure } from "@/lib/types/database"

// =============================================
// SALARY STRUCTURE ACTIONS
// =============================================

export async function listSalaryStructure(
  employee_id: string
): Promise<SalaryStructure[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("salary_structure")
    .select("*")
    .eq("employee_id", employee_id)
    .order("effective_date", { ascending: false })

  if (error) {
    console.error("Error listing salary structure:", error)
    return []
  }

  return data || []
}

export async function createSalaryStructure(input: {
  employee_id: string
  base_salary: number
  allowance?: number
  insurance_salary?: number
  effective_date: string
  note?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("salary_structure").insert({
    employee_id: input.employee_id,
    base_salary: input.base_salary,
    allowance: input.allowance || 0,
    insurance_salary: input.insurance_salary || null,
    effective_date: input.effective_date,
    note: input.note,
  })

  if (error) {
    console.error("Error creating salary structure:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}

export async function deleteSalaryStructure(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("salary_structure")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting salary structure:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}

export async function getMySalary(): Promise<SalaryStructure | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return null

  const { data } = await supabase
    .from("salary_structure")
    .select("*")
    .eq("employee_id", employee.id)
    .order("effective_date", { ascending: false })
    .limit(1)
    .single()

  return data || null
}
