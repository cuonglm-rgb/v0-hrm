"use server"

import { createClient } from "@/lib/supabase/server"
import type { PayrollAdjustmentType } from "@/lib/types/database"
import { isEmployeeInScope, resolveScopeType } from "@/lib/utils/adjustment-scope"

/**
 * Lấy danh sách phụ cấp/khấu trừ tự động áp dụng cho nhân viên.
 * Phạm vi áp dụng bám theo scope_type của từng loại (giống hệt lúc tính lương):
 *   - all_company            : áp dụng cho tất cả
 *   - by_department_position : NV thuộc phòng ban HOẶC chức vụ được chọn
 *   - specific_employees     : chỉ NV trong danh sách
 *   - all_except             : tất cả TRỪ NV trong danh sách
 * Ngoài ra kèm các employee_adjustments được gán thủ công cho nhân viên.
 */
export async function getEmployeeAppliedAdjustments(employeeId: string): Promise<{
  autoAdjustments: PayrollAdjustmentType[]
  manualAdjustments: any[]
}> {
  const supabase = await createClient()

  // 0. Phòng ban / chức vụ của nhân viên - cần cho scope by_department_position
  const { data: employee } = await supabase
    .from("employees")
    .select("id, department_id, position_id")
    .eq("id", employeeId)
    .single()

  // 1. Lấy tất cả adjustment types tự động đang active kèm 3 bảng phạm vi
  const { data: allAutoTypes } = await supabase
    .from("payroll_adjustment_types")
    .select(`
      *,
      assigned_employees:adjustment_type_employees(employee_id),
      assigned_departments:adjustment_type_departments(department_id),
      assigned_positions:adjustment_type_positions(position_id)
    `)
    .eq("is_auto_applied", true)
    .eq("is_active", true)

  const emp = {
    id: employeeId,
    department_id: employee?.department_id ?? null,
    position_id: employee?.position_id ?? null,
  }

  // Lọc ra các adjustment types thực sự áp dụng cho nhân viên này
  const autoAdjustments = (allAutoTypes || []).filter((type: any) => {
    const employee_ids = (type.assigned_employees || []).map((x: any) => x.employee_id)
    const department_ids = (type.assigned_departments || []).map((x: any) => x.department_id)
    const position_ids = (type.assigned_positions || []).map((x: any) => x.position_id)

    // Fallback cho dữ liệu cũ chưa có scope_type
    const scopeType = resolveScopeType(type.scope_type, employee_ids)

    return isEmployeeInScope(scopeType, { employee_ids, department_ids, position_ids }, emp)
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
      const { assigned_employees, assigned_departments, assigned_positions, ...rest } = type
      return rest
    }),
    manualAdjustments: manualAdjustments || []
  }
}
