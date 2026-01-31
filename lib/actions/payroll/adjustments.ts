"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// =============================================
// PAYROLL ADJUSTMENT DETAILS
// =============================================

export async function getPayrollAdjustmentDetails(payroll_item_id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payroll_adjustment_details")
    .select(`
      *,
      adjustment_type:payroll_adjustment_types(id, name, code, category)
    `)
    .eq("payroll_item_id", payroll_item_id)
    .order("category")

  if (error) {
    console.error("Error fetching adjustment details:", error)
    return []
  }

  return data || []
}

// =============================================
// MANUAL ADJUSTMENT
// =============================================

export async function addManualAdjustment(input: {
  payroll_item_id: string
  category: "allowance" | "deduction" | "penalty"
  amount: number
  reason: string
}) {
  const supabase = await createClient()

  const { data: item } = await supabase
    .from("payroll_items")
    .select(`
      id,
      payroll_run:payroll_runs(status)
    `)
    .eq("id", input.payroll_item_id)
    .single()

  if (!item) {
    return { success: false, error: "Không tìm thấy bản ghi lương" }
  }

  const runStatus = (item.payroll_run as any)?.status
  if (runStatus !== "draft" && runStatus !== "review") {
    return { success: false, error: "Chỉ có thể chỉnh sửa bảng lương ở trạng thái Nháp hoặc Đang xem xét" }
  }

  const codeMap = {
    allowance: "MANUAL_ALLOWANCE",
    deduction: "MANUAL_DEDUCTION", 
    penalty: "MANUAL_PENALTY"
  }

  let { data: adjType } = await supabase
    .from("payroll_adjustment_types")
    .select("id")
    .eq("code", codeMap[input.category])
    .single()

  if (!adjType) {
    const nameMap = {
      allowance: "Điều chỉnh cộng thủ công",
      deduction: "Điều chỉnh trừ thủ công",
      penalty: "Phạt thủ công"
    }
    const { data: newType, error: createError } = await supabase
      .from("payroll_adjustment_types")
      .insert({
        code: codeMap[input.category],
        name: nameMap[input.category],
        category: input.category,
        calculation_type: "fixed",
        amount: 0,
        is_active: true,
        is_auto_applied: false
      })
      .select("id")
      .single()

    if (createError) {
      console.error("Error creating adjustment type:", createError)
      return { success: false, error: "Không thể tạo loại điều chỉnh" }
    }
    adjType = newType
  }

  const { error: insertError } = await supabase
    .from("payroll_adjustment_details")
    .insert({
      payroll_item_id: input.payroll_item_id,
      adjustment_type_id: adjType.id,
      category: input.category,
      base_amount: input.amount,
      adjusted_amount: 0,
      final_amount: input.amount,
      reason: input.reason,
      occurrence_count: 1
    })

  if (insertError) {
    console.error("Error inserting adjustment:", insertError)
    return { success: false, error: insertError.message }
  }

  await recalculatePayrollItemTotals(input.payroll_item_id)

  revalidatePath("/dashboard/payroll")
  return { success: true }
}

export async function deleteAdjustmentDetail(id: string) {
  const supabase = await createClient()

  const { data: detail } = await supabase
    .from("payroll_adjustment_details")
    .select(`
      payroll_item_id,
      payroll_item:payroll_items(
        payroll_run:payroll_runs(status)
      )
    `)
    .eq("id", id)
    .single()

  if (!detail) {
    return { success: false, error: "Không tìm thấy bản ghi" }
  }

  const runStatus = (detail.payroll_item as any)?.payroll_run?.status
  if (runStatus !== "draft" && runStatus !== "review") {
    return { success: false, error: "Chỉ có thể chỉnh sửa bảng lương ở trạng thái Nháp hoặc Đang xem xét" }
  }

  const { error } = await supabase
    .from("payroll_adjustment_details")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting adjustment:", error)
    return { success: false, error: error.message }
  }

  await recalculatePayrollItemTotals(detail.payroll_item_id)

  revalidatePath("/dashboard/payroll")
  return { success: true }
}

export async function recalculatePayrollItemTotals(payroll_item_id: string) {
  const supabase = await createClient()

  const { data: item } = await supabase
    .from("payroll_items")
    .select("*")
    .eq("id", payroll_item_id)
    .single()

  if (!item) return

  const { data: details } = await supabase
    .from("payroll_adjustment_details")
    .select("category, final_amount")
    .eq("payroll_item_id", payroll_item_id)

  let totalAllowances = 0
  let totalDeductions = 0
  let totalPenalties = 0

  for (const d of details || []) {
    if (d.category === "allowance") totalAllowances += d.final_amount
    else if (d.category === "deduction") totalDeductions += d.final_amount
    else if (d.category === "penalty") totalPenalties += d.final_amount
  }

  const standardDays = item.standard_working_days || 26
  const dailySalary = item.base_salary / standardDays
  const workingSalary = dailySalary * (item.working_days + item.leave_days)
  const unpaidDeduction = 0

  const totalIncome = workingSalary + totalAllowances
  const totalDeduction = unpaidDeduction + totalDeductions + totalPenalties
  const netSalary = totalIncome - totalDeduction

  await supabase
    .from("payroll_items")
    .update({
      allowances: totalAllowances,
      total_income: totalIncome,
      total_deduction: totalDeduction,
      net_salary: netSalary
    })
    .eq("id", payroll_item_id)
}
