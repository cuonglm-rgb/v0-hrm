"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { KPIEvaluation, KPIEvaluationWithRelations, KPIStatus, KPIBonusType } from "@/lib/types/database"

// =============================================
// KPI EVALUATION ACTIONS
// =============================================

export async function listKPIEvaluations(
  month: number,
  year: number
): Promise<KPIEvaluationWithRelations[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("kpi_evaluations")
    .select(`
      *,
      employee:employees!kpi_evaluations_employee_id_fkey(id, full_name, employee_code, department_id, department:departments(name)),
      evaluator:employees!kpi_evaluations_evaluated_by_fkey(id, full_name)
    `)
    .eq("month", month)
    .eq("year", year)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error listing KPI evaluations:", error)
    return []
  }

  return (data || []) as KPIEvaluationWithRelations[]
}

export async function getEmployeeKPI(
  employeeId: string,
  month: number,
  year: number
): Promise<KPIEvaluation | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("kpi_evaluations")
    .select("*")
    .eq("employee_id", employeeId)
    .eq("month", month)
    .eq("year", year)
    .maybeSingle()

  if (error) {
    console.error("Error fetching KPI evaluation:", error)
    return null
  }

  return data
}

export async function getMyKPIHistory(): Promise<KPIEvaluationWithRelations[]> {
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
    .from("kpi_evaluations")
    .select(`
      *,
      evaluator:employees!kpi_evaluations_evaluated_by_fkey(id, full_name)
    `)
    .eq("employee_id", employee.id)
    .order("year", { ascending: false })
    .order("month", { ascending: false })

  if (error) {
    console.error("Error fetching KPI history:", error)
    return []
  }

  return (data || []) as KPIEvaluationWithRelations[]
}


interface SaveKPIInput {
  employeeId: string
  month: number
  year: number
  status: KPIStatus
  bonusType: KPIBonusType
  bonusPercentage?: number | null
  bonusAmount?: number | null
  note?: string | null
}

export async function saveKPIEvaluation(input: SaveKPIInput) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Chưa đăng nhập" }

  // Lấy employee_id của người đánh giá
  const { data: evaluator } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  // Tính final_bonus
  let finalBonus = 0
  
  if (input.status === "achieved") {
    if (input.bonusType === "fixed" && input.bonusAmount) {
      finalBonus = input.bonusAmount
    } else if (input.bonusType === "percentage" && input.bonusPercentage) {
      // Lấy lương cơ bản của nhân viên để tính % thưởng
      const { data: salary } = await supabase
        .from("salary_structure")
        .select("base_salary")
        .eq("employee_id", input.employeeId)
        .order("effective_date", { ascending: false })
        .limit(1)
        .maybeSingle()

      const baseSalary = salary?.base_salary || 0
      finalBonus = Math.round(baseSalary * input.bonusPercentage / 100)
    }
  }

  // Kiểm tra đã có đánh giá chưa
  const { data: existing } = await supabase
    .from("kpi_evaluations")
    .select("id")
    .eq("employee_id", input.employeeId)
    .eq("month", input.month)
    .eq("year", input.year)
    .maybeSingle()

  const now = new Date().toISOString()

  if (existing) {
    // Update
    const { error } = await supabase
      .from("kpi_evaluations")
      .update({
        status: input.status,
        bonus_type: input.bonusType,
        bonus_percentage: input.bonusPercentage || null,
        bonus_amount: input.bonusAmount || null,
        final_bonus: finalBonus,
        note: input.note || null,
        evaluated_by: evaluator?.id || null,
        evaluated_at: now,
        updated_at: now,
      })
      .eq("id", existing.id)

    if (error) {
      console.error("Error updating KPI evaluation:", error)
      return { success: false, error: error.message }
    }
  } else {
    // Insert
    const { error } = await supabase
      .from("kpi_evaluations")
      .insert({
        employee_id: input.employeeId,
        month: input.month,
        year: input.year,
        status: input.status,
        bonus_type: input.bonusType,
        bonus_percentage: input.bonusPercentage || null,
        bonus_amount: input.bonusAmount || null,
        final_bonus: finalBonus,
        note: input.note || null,
        evaluated_by: evaluator?.id || null,
        evaluated_at: now,
      })

    if (error) {
      console.error("Error creating KPI evaluation:", error)
      return { success: false, error: error.message }
    }
  }

  revalidatePath("/dashboard/kpi")
  revalidatePath("/dashboard/payroll")
  return { success: true }
}

export async function deleteKPIEvaluation(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("kpi_evaluations")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting KPI evaluation:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/kpi")
  return { success: true }
}

// Lấy danh sách nhân viên chưa đánh giá KPI trong tháng
export async function getEmployeesWithoutKPI(month: number, year: number) {
  const supabase = await createClient()

  // Lấy tất cả nhân viên active
  const { data: employees } = await supabase
    .from("employees")
    .select("id, full_name, employee_code, department:departments(name)")
    .in("status", ["active", "onboarding"])
    .order("full_name")

  if (!employees) return []

  // Lấy danh sách đã đánh giá
  const { data: evaluated } = await supabase
    .from("kpi_evaluations")
    .select("employee_id")
    .eq("month", month)
    .eq("year", year)

  const evaluatedIds = new Set((evaluated || []).map(e => e.employee_id))

  // Lọc nhân viên chưa đánh giá
  return employees.filter(emp => !evaluatedIds.has(emp.id))
}
