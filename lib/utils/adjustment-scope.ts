import type { AdjustmentScopeType } from "@/lib/types/database"

/**
 * Danh sách đối tượng được gán cho 1 loại phụ cấp/khấu trừ/phạt (đọc từ 3 bảng junction).
 */
export interface AdjustmentScopeAssignments {
  employee_ids?: string[]
  department_ids?: string[]
  position_ids?: string[]
}

export interface ScopedEmployee {
  id: string
  department_id?: string | null
  position_id?: string | null
}

/**
 * Suy ra scope_type khi dữ liệu cũ chưa có cột scope_type:
 * có bản ghi trong adjustment_type_employees -> specific_employees, ngược lại -> all_company.
 */
export function resolveScopeType(
  rawScopeType: string | null | undefined,
  employeeIds: string[]
): AdjustmentScopeType {
  if (rawScopeType) return rawScopeType as AdjustmentScopeType
  return employeeIds.length > 0 ? "specific_employees" : "all_company"
}

/**
 * Nguồn sự thật duy nhất cho câu hỏi "nhân viên này có nằm trong phạm vi áp dụng không?".
 * Dùng chung cho cả lúc tính lương lẫn lúc hiển thị trên hồ sơ nhân viên
 * để hai nơi không lệch nhau.
 */
export function isEmployeeInScope(
  scopeType: AdjustmentScopeType,
  assignments: AdjustmentScopeAssignments,
  emp: ScopedEmployee
): boolean {
  const empIds = assignments.employee_ids || []

  if (scopeType === "specific_employees") {
    return empIds.includes(emp.id)
  }

  if (scopeType === "all_except") {
    return !empIds.includes(emp.id)
  }

  if (scopeType === "by_department_position") {
    const deptIds = assignments.department_ids || []
    const posIds = assignments.position_ids || []
    // Chưa chọn phòng ban/chức vụ nào -> không áp dụng cho ai
    if (deptIds.length === 0 && posIds.length === 0) return false
    // OR logic: thuộc phòng ban được chọn HOẶC giữ chức vụ được chọn
    if (emp.department_id && deptIds.includes(emp.department_id)) return true
    if (emp.position_id && posIds.includes(emp.position_id)) return true
    return false
  }

  // all_company
  return true
}
