"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type {
  PayrollAdjustmentType,
  AdjustmentAutoRules,
  AdjustmentCategory,
  EmployeeAdjustmentWithType,
} from "@/lib/types/database"
import { getNowVN } from "@/lib/utils/date-utils"

// =============================================
// ADJUSTMENT TYPE ACTIONS
// =============================================

export async function listAdjustmentTypes(
  category?: AdjustmentCategory
): Promise<PayrollAdjustmentType[]> {
  const supabase = await createClient()

  let query = supabase
    .from("payroll_adjustment_types")
    .select("*")
    .order("category")
    .order("name")

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) {
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      console.warn(
        "Bảng payroll_adjustment_types chưa tồn tại. Vui lòng chạy script 016-allowance-types.sql"
      )
    } else {
      console.error("Error listing adjustment types:", error.message || error)
    }
    return []
  }

  return data || []
}

export async function createAdjustmentType(input: {
  name: string
  code?: string
  category: AdjustmentCategory
  amount: number
  calculation_type: "fixed" | "daily" | "per_occurrence"
  is_auto_applied: boolean
  auto_rules?: AdjustmentAutoRules
  description?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("payroll_adjustment_types").insert({
    name: input.name,
    code: input.code || null,
    category: input.category,
    amount: input.amount,
    calculation_type: input.calculation_type,
    is_auto_applied: input.is_auto_applied,
    auto_rules: input.auto_rules || null,
    description: input.description || null,
    is_active: true,
  })

  if (error) {
    console.error("Error creating adjustment type:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/allowances")
  return { success: true }
}

export async function updateAdjustmentType(
  id: string,
  input: {
    name?: string
    code?: string
    category?: AdjustmentCategory
    amount?: number
    calculation_type?: "fixed" | "daily" | "per_occurrence"
    is_auto_applied?: boolean
    auto_rules?: AdjustmentAutoRules | null
    description?: string
    is_active?: boolean
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("payroll_adjustment_types")
    .update(input)
    .eq("id", id)

  if (error) {
    console.error("Error updating adjustment type:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/allowances")
  return { success: true }
}

export async function deleteAdjustmentType(id: string) {
  const supabase = await createClient()

  // Kiểm tra có nhân viên đang dùng không
  const { count } = await supabase
    .from("employee_adjustments")
    .select("*", { count: "exact", head: true })
    .eq("adjustment_type_id", id)

  if (count && count > 0) {
    return { success: false, error: "Không thể xóa loại điều chỉnh đang được gán cho nhân viên" }
  }

  const { error } = await supabase.from("payroll_adjustment_types").delete().eq("id", id)

  if (error) {
    console.error("Error deleting adjustment type:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/allowances")
  return { success: true }
}

// =============================================
// EMPLOYEE ADJUSTMENT ACTIONS
// =============================================

export async function listEmployeeAdjustments(
  employee_id: string
): Promise<EmployeeAdjustmentWithType[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("employee_adjustments")
    .select(
      `
      *,
      adjustment_type:payroll_adjustment_types(*)
    `
    )
    .eq("employee_id", employee_id)
    .order("effective_date", { ascending: false })

  if (error) {
    console.error("Error listing employee adjustments:", error)
    return []
  }

  return (data || []) as EmployeeAdjustmentWithType[]
}

export async function assignAdjustmentToEmployee(input: {
  employee_id: string
  adjustment_type_id: string
  custom_amount?: number
  custom_percentage?: number
  effective_date: string
  end_date?: string
  note?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("employee_adjustments").insert({
    employee_id: input.employee_id,
    adjustment_type_id: input.adjustment_type_id,
    custom_amount: input.custom_amount || null,
    custom_percentage: input.custom_percentage || null,
    effective_date: input.effective_date,
    end_date: input.end_date || null,
    note: input.note || null,
  })

  if (error) {
    console.error("Error assigning adjustment:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}

export async function removeEmployeeAdjustment(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("employee_adjustments").delete().eq("id", id)

  if (error) {
    console.error("Error removing employee adjustment:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}

export async function updateEmployeeAdjustment(
  id: string,
  input: {
    custom_amount?: number | null
    custom_percentage?: number | null
    effective_date?: string
    end_date?: string | null
    note?: string | null
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("employee_adjustments")
    .update({
      custom_amount: input.custom_amount,
      custom_percentage: input.custom_percentage,
      effective_date: input.effective_date,
      end_date: input.end_date,
      note: input.note,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating employee adjustment:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}

// =============================================
// TIME ADJUSTMENT REQUEST ACTIONS
// =============================================

export async function createTimeRequest(input: {
  request_type: "late_arrival" | "early_leave"
  request_date: string
  reason?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Chưa đăng nhập" }

  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!employee) return { success: false, error: "Không tìm thấy nhân viên" }

  const { error } = await supabase.from("time_adjustment_requests").insert({
    employee_id: employee.id,
    request_type: input.request_type,
    request_date: input.request_date,
    reason: input.reason || null,
    status: "pending",
  })

  if (error) {
    console.error("Error creating time request:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/attendance")
  return { success: true }
}

export async function approveTimeRequest(id: string, status: "approved" | "rejected") {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Chưa đăng nhập" }

  const { data: approver } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single()

  const { error } = await supabase
    .from("time_adjustment_requests")
    .update({
      status,
      approver_id: approver?.id,
      approved_at: getNowVN(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error approving time request:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/leave-approval")
  return { success: true }
}

export async function listMyTimeRequests() {
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
    .from("time_adjustment_requests")
    .select("*")
    .eq("employee_id", employee.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error listing time requests:", error)
    return []
  }

  return data || []
}

export async function listPendingTimeRequests() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("time_adjustment_requests")
    .select(
      `
      *,
      employee:employees(id, full_name, employee_code, department:departments(name))
    `
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error listing pending time requests:", error)
    return []
  }

  return data || []
}
