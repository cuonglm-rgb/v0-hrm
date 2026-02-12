"use server"

import { createClient } from "@/lib/supabase/server"
import type { PayrollAdjustmentType } from "@/lib/types/database"

/**
 * Lấy danh sách phụ cấp/khấu trừ tự động áp dụng cho nhân viên
 * Bao gồm:
 * 1. Các adjustment type có is_auto_applied = true và không có employee assignment (toàn công ty)
 * 2. Các adjustment type có is_auto_applied = true và có employee assignment cho nhân viên này
 * 3. Các employee_adjustments được gán thủ công cho nhân viên
 */
export async function getEmployeeAppliedAdjustments(employeeId: string): Promise<{
  autoAdjustments: PayrollAdjustmentType[]
  manualAdjustments: any[]
}> {
  const supabase = await createClient()

  // 1. Lấy tất cả adjustment types tự động đang active
  const { data: allAutoTypes } = await supabase
    .from("payroll_adjustment_types")
    .select(`
      *,
      assigned_employees:adjustment_type_employees(employee_id)
    `)
    .eq("is_auto_applied", true)
    .eq("is_active", true)

  // Lọc ra các adjustment types áp dụng cho nhân viên này
  const autoAdjustments = (allAutoTypes || []).filter((type: any) => {
    const assignedEmployees = type.assigned_employees || []
    // Nếu không có assignment nào = áp dụng toàn công ty
    if (assignedEmployees.length === 0) return true
    // Nếu có assignment, kiểm tra xem nhân viên này có trong danh sách không
    return assignedEmployees.some((ae: any) => ae.employee_id === employeeId)
  })

  // 2. Lấy các adjustment được gán thủ công
  const { data: manualAdjustments } = await supabase
    .from("employee_adjustments")
    .select(`
      *,
      adjustment_type:payroll_adjustment_types(*)
    `)
    .eq("employee_id", employeeId)
    .order("effective_date", { ascending: false })

  return {
    autoAdjustments: autoAdjustments.map((type: any) => {
      const { assigned_employees, ...rest } = type
      return rest
    }),
    manualAdjustments: manualAdjustments || []
  }
}
