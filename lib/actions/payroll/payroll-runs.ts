"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { PayrollRun, PayrollItemWithRelations } from "@/lib/types/database"

// =============================================
// PAYROLL RUNS ACTIONS
// =============================================

export async function listPayrollRuns(): Promise<PayrollRun[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payroll_runs")
    .select("*")
    .order("year", { ascending: false })
    .order("month", { ascending: false })

  if (error) {
    console.error("Error listing payroll runs:", error)
    return []
  }

  return data || []
}

export async function getPayrollRun(id: string): Promise<PayrollRun | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payroll_runs")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching payroll run:", error)
    return null
  }

  return data
}

export async function getPayrollItems(
  payroll_run_id: string
): Promise<PayrollItemWithRelations[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payroll_items")
    .select(
      `
      *,
      employee:employees(id, full_name, employee_code, department_id, department:departments(name))
    `
    )
    .eq("payroll_run_id", payroll_run_id)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching payroll items:", error)
    return []
  }

  return (data || []) as PayrollItemWithRelations[]
}

export async function getMyPayslips(): Promise<PayrollItemWithRelations[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return []

  const { data, error } = await supabase
    .from("payroll_items")
    .select(
      `
      *,
      payroll_run:payroll_runs(*)
    `
    )
    .eq("employee_id", employee.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching payslips:", error)
    return []
  }

  return (data || []) as PayrollItemWithRelations[]
}

// =============================================
// PAYROLL STATUS ACTIONS
// =============================================

export async function sendPayrollForReview(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("payroll_runs")
    .update({ status: "review" })
    .eq("id", id)
    .eq("status", "draft")

  if (error) {
    console.error("Error sending payroll for review:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/payroll")
  return { success: true }
}

export async function lockPayroll(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("payroll_runs")
    .update({ status: "locked" })
    .eq("id", id)
    .in("status", ["draft", "review"])

  if (error) {
    console.error("Error locking payroll:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/payroll")
  return { success: true }
}

export async function markPayrollPaid(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("payroll_runs")
    .update({ status: "paid" })
    .eq("id", id)
    .eq("status", "locked")

  if (error) {
    console.error("Error marking payroll as paid:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/payroll")
  return { success: true }
}

export async function deletePayrollRun(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("payroll_runs")
    .delete()
    .eq("id", id)
    .in("status", ["draft", "review"])

  if (error) {
    console.error("Error deleting payroll run:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/payroll")
  return { success: true }
}
