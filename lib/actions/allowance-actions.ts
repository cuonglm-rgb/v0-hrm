"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type {
  AllowanceType,
  AllowanceDeductionRules,
  EmployeeAllowanceWithType,
} from "@/lib/types/database"

// =============================================
// ALLOWANCE TYPE ACTIONS
// =============================================

export async function listAllowanceTypes(): Promise<AllowanceType[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("allowance_types")
    .select("*")
    .order("name")

  if (error) {
    // Bảng chưa tồn tại - cần chạy script 016-allowance-types.sql
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      console.warn("Bảng allowance_types chưa tồn tại. Vui lòng chạy script 016-allowance-types.sql")
    } else {
      console.error("Error listing allowance types:", error.message || error)
    }
    return []
  }

  return data || []
}

export async function createAllowanceType(input: {
  name: string
  code?: string
  amount: number
  calculation_type: "fixed" | "daily"
  is_deductible: boolean
  deduction_rules?: AllowanceDeductionRules
  description?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("allowance_types").insert({
    name: input.name,
    code: input.code || null,
    amount: input.amount,
    calculation_type: input.calculation_type,
    is_deductible: input.is_deductible,
    deduction_rules: input.deduction_rules || null,
    description: input.description || null,
    is_active: true,
  })

  if (error) {
    console.error("Error creating allowance type:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/allowances")
  return { success: true }
}

export async function updateAllowanceType(
  id: string,
  input: {
    name?: string
    code?: string
    amount?: number
    calculation_type?: "fixed" | "daily"
    is_deductible?: boolean
    deduction_rules?: AllowanceDeductionRules | null
    description?: string
    is_active?: boolean
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("allowance_types")
    .update(input)
    .eq("id", id)

  if (error) {
    console.error("Error updating allowance type:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/allowances")
  return { success: true }
}

export async function deleteAllowanceType(id: string) {
  const supabase = await createClient()

  // Kiểm tra có nhân viên đang dùng không
  const { count } = await supabase
    .from("employee_allowances")
    .select("*", { count: "exact", head: true })
    .eq("allowance_type_id", id)

  if (count && count > 0) {
    return { success: false, error: "Không thể xóa phụ cấp đang được gán cho nhân viên" }
  }

  const { error } = await supabase.from("allowance_types").delete().eq("id", id)

  if (error) {
    console.error("Error deleting allowance type:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/allowances")
  return { success: true }
}

// =============================================
// EMPLOYEE ALLOWANCE ACTIONS
// =============================================

export async function listEmployeeAllowances(
  employee_id: string
): Promise<EmployeeAllowanceWithType[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("employee_allowances")
    .select(`
      *,
      allowance_type:allowance_types(*)
    `)
    .eq("employee_id", employee_id)
    .order("effective_date", { ascending: false })

  if (error) {
    console.error("Error listing employee allowances:", error)
    return []
  }

  return (data || []) as EmployeeAllowanceWithType[]
}

export async function assignAllowanceToEmployee(input: {
  employee_id: string
  allowance_type_id: string
  custom_amount?: number
  effective_date: string
  end_date?: string
  note?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("employee_allowances").insert({
    employee_id: input.employee_id,
    allowance_type_id: input.allowance_type_id,
    custom_amount: input.custom_amount || null,
    effective_date: input.effective_date,
    end_date: input.end_date || null,
    note: input.note || null,
  })

  if (error) {
    console.error("Error assigning allowance:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}

export async function updateEmployeeAllowance(
  id: string,
  input: {
    custom_amount?: number | null
    end_date?: string | null
    note?: string
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("employee_allowances")
    .update(input)
    .eq("id", id)

  if (error) {
    console.error("Error updating employee allowance:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}

export async function removeEmployeeAllowance(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("employee_allowances").delete().eq("id", id)

  if (error) {
    console.error("Error removing employee allowance:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/employees")
  return { success: true }
}

// =============================================
// HELPER: Tính phụ cấp cho payroll
// =============================================

export async function calculateEmployeeAllowances(
  employee_id: string,
  month: number,
  year: number,
  workingDays: number,
  lateCount: number,
  absentDays: number
) {
  const supabase = await createClient()

  const endDate = new Date(year, month, 0).toISOString().split("T")[0]
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`

  // Lấy các phụ cấp đang hiệu lực của nhân viên
  const { data: employeeAllowances } = await supabase
    .from("employee_allowances")
    .select(`
      *,
      allowance_type:allowance_types(*)
    `)
    .eq("employee_id", employee_id)
    .lte("effective_date", endDate)
    .or(`end_date.is.null,end_date.gte.${startDate}`)

  if (!employeeAllowances || employeeAllowances.length === 0) {
    return { totalAllowance: 0, details: [] }
  }

  const details: {
    allowance_type_id: string
    base_amount: number
    deducted_amount: number
    final_amount: number
    deduction_reason: string | null
    late_count: number
    absent_days: number
  }[] = []

  let totalAllowance = 0

  for (const ea of employeeAllowances) {
    const allowanceType = ea.allowance_type as AllowanceType
    if (!allowanceType || !allowanceType.is_active) continue

    const amount = ea.custom_amount || allowanceType.amount
    let baseAmount = amount
    let deductedAmount = 0
    let deductionReason: string | null = null

    // Tính base amount theo loại
    if (allowanceType.calculation_type === "daily") {
      baseAmount = amount * workingDays
    }

    // Áp dụng quy tắc trừ phụ cấp
    if (allowanceType.is_deductible && allowanceType.deduction_rules) {
      const rules = allowanceType.deduction_rules as AllowanceDeductionRules
      const reasons: string[] = []

      // Trừ khi nghỉ làm
      if (rules.deduct_on_absent && absentDays > 0) {
        if (allowanceType.calculation_type === "daily") {
          // Đã tính theo ngày công rồi, không cần trừ thêm
        } else {
          // Fixed: trừ theo tỷ lệ
          const deductPerDay = amount / 26 // 26 ngày công chuẩn
          deductedAmount += deductPerDay * absentDays
          reasons.push(`Nghỉ ${absentDays} ngày`)
        }
      }

      // Trừ khi đi muộn
      if (rules.deduct_on_late && lateCount > 0) {
        const graceCount = rules.late_grace_count || 0
        const excessLate = Math.max(0, lateCount - graceCount)

        if (excessLate > 0) {
          // Kiểm tra full_deduct_threshold
          if (rules.full_deduct_threshold && lateCount >= rules.full_deduct_threshold) {
            deductedAmount = baseAmount // Mất toàn bộ
            reasons.push(`Đi muộn ${lateCount} lần (mất toàn bộ)`)
          } else if (allowanceType.calculation_type === "daily") {
            // Trừ theo số ngày đi muộn vượt quá
            deductedAmount += amount * excessLate
            reasons.push(`Đi muộn ${excessLate} lần (vượt ${graceCount} lần miễn)`)
          } else {
            // Fixed: trừ theo tỷ lệ
            const deductPerLate = amount / 26
            deductedAmount += deductPerLate * excessLate
            reasons.push(`Đi muộn ${excessLate} lần`)
          }
        }
      }

      if (reasons.length > 0) {
        deductionReason = reasons.join(", ")
      }
    }

    // Đảm bảo không trừ quá base
    deductedAmount = Math.min(deductedAmount, baseAmount)
    const finalAmount = baseAmount - deductedAmount

    details.push({
      allowance_type_id: allowanceType.id,
      base_amount: baseAmount,
      deducted_amount: deductedAmount,
      final_amount: finalAmount,
      deduction_reason: deductionReason,
      late_count: lateCount,
      absent_days: absentDays,
    })

    totalAllowance += finalAmount
  }

  return { totalAllowance, details }
}
