"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type {
  PayrollAdjustmentType,
  AdjustmentAutoRules,
  AdjustmentCategory,
  AdjustmentScopeType,
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
    .select(`
      *,
      assigned_employees:adjustment_type_employees(
        employee_id,
        employee:employees(id, full_name, employee_code)
      ),
      assigned_departments:adjustment_type_departments(
        department_id,
        department:departments(id, name)
      ),
      assigned_positions:adjustment_type_positions(
        position_id,
        position:positions(id, name)
      )
    `)
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
  calculation_type: "fixed" | "daily" | "per_occurrence" | "percentage"
  is_auto_applied: boolean
  auto_rules?: AdjustmentAutoRules
  description?: string
  effective_from?: string | null
  effective_to?: string | null
  scope_type?: AdjustmentScopeType
  employee_ids?: string[]      // dùng cho specific_employees (include) hoặc all_except (exclude)
  department_ids?: string[]    // dùng cho by_department_position
  position_ids?: string[]      // dùng cho by_department_position
}) {
  const supabase = await createClient()

  const { employee_ids, department_ids, position_ids, scope_type, ...insertData } = input
  const finalScopeType: AdjustmentScopeType = scope_type || "all_company"

  const { data: newType, error } = await supabase.from("payroll_adjustment_types").insert({
    name: insertData.name,
    code: insertData.code || null,
    category: insertData.category,
    amount: insertData.amount,
    calculation_type: insertData.calculation_type,
    is_auto_applied: insertData.is_auto_applied,
    auto_rules: insertData.auto_rules || null,
    description: insertData.description || null,
    is_active: true,
    effective_from: insertData.effective_from || null,
    effective_to: insertData.effective_to || null,
    scope_type: finalScopeType,
  }).select().single()

  if (error) {
    console.error("Error creating adjustment type:", error)
    return { success: false, error: error.message }
  }

  if (!newType) return { success: true }

  await syncScopeAssignments(supabase, newType.id, finalScopeType, {
    employee_ids,
    department_ids,
    position_ids,
  })

  revalidatePath("/dashboard/allowances")
  return { success: true }
}

// Đồng bộ các bảng junction theo scope_type. Luôn xóa hết trước khi insert mới
// để đảm bảo dữ liệu cũ ở scope_type khác không còn dây dưa.
async function syncScopeAssignments(
  supabase: any,
  adjustmentTypeId: string,
  scopeType: AdjustmentScopeType,
  ids: { employee_ids?: string[]; department_ids?: string[]; position_ids?: string[] }
) {
  await Promise.all([
    supabase.from("adjustment_type_employees").delete().eq("adjustment_type_id", adjustmentTypeId),
    supabase.from("adjustment_type_departments").delete().eq("adjustment_type_id", adjustmentTypeId),
    supabase.from("adjustment_type_positions").delete().eq("adjustment_type_id", adjustmentTypeId),
  ])

  if (scopeType === "specific_employees" || scopeType === "all_except") {
    const empIds = ids.employee_ids || []
    if (empIds.length > 0) {
      await supabase.from("adjustment_type_employees").insert(
        empIds.map((employee_id) => ({ adjustment_type_id: adjustmentTypeId, employee_id }))
      )
    }
  } else if (scopeType === "by_department_position") {
    const deptIds = ids.department_ids || []
    const posIds = ids.position_ids || []
    if (deptIds.length > 0) {
      await supabase.from("adjustment_type_departments").insert(
        deptIds.map((department_id) => ({ adjustment_type_id: adjustmentTypeId, department_id }))
      )
    }
    if (posIds.length > 0) {
      await supabase.from("adjustment_type_positions").insert(
        posIds.map((position_id) => ({ adjustment_type_id: adjustmentTypeId, position_id }))
      )
    }
  }
}

export async function updateAdjustmentType(
  id: string,
  input: {
    name?: string
    code?: string
    category?: AdjustmentCategory
    amount?: number
    calculation_type?: "fixed" | "daily" | "per_occurrence" | "percentage"
    is_auto_applied?: boolean
    auto_rules?: AdjustmentAutoRules | null
    description?: string
    is_active?: boolean
    effective_from?: string | null
    effective_to?: string | null
    scope_type?: AdjustmentScopeType
    employee_ids?: string[]
    department_ids?: string[]
    position_ids?: string[]
  }
) {
  const supabase = await createClient()

  const { employee_ids, department_ids, position_ids, scope_type, ...updateData } = input

  const payload: any = { ...updateData }
  if (scope_type !== undefined) payload.scope_type = scope_type

  const { error } = await supabase
    .from("payroll_adjustment_types")
    .update(payload)
    .eq("id", id)

  if (error) {
    console.error("Error updating adjustment type:", error)
    return { success: false, error: error.message }
  }

  // Chỉ sync junction khi caller có gửi scope_type — nếu không thì giữ nguyên
  if (scope_type !== undefined) {
    await syncScopeAssignments(supabase, id, scope_type, {
      employee_ids,
      department_ids,
      position_ids,
    })
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
