// Phân quyền hiển thị widget "Lịch làm việc" trên dashboard.
// - HR/Admin: xem toàn công ty (all)
// - Leader (role 'manager' hoặc chức vụ level >= 3): chỉ xem phòng ban của mình (dept)
// - Nhân viên thường: chỉ xem trạng thái của chính họ (self)
// - none: không xác định được (không có hồ sơ nhân viên) → ẩn

export type ScheduleScope =
  | { mode: "all" }
  | { mode: "dept"; deptIds: string[] }
  | { mode: "self"; employeeId: string }
  | { mode: "none" }

export function resolveScheduleScope(input: {
  roleCodes: string[]
  positionLevel: number
  managerDeptIds: string[] // department_id gắn với role 'manager' trên user_roles
  ownDeptId: string | null // phòng ban của chính leader (fallback)
  ownEmployeeId: string | null // employee.id của user hiện tại
}): ScheduleScope {
  const { roleCodes, positionLevel, managerDeptIds, ownDeptId, ownEmployeeId } = input

  if (roleCodes.includes("admin") || roleCodes.includes("hr")) {
    return { mode: "all" }
  }

  const isLeader = roleCodes.includes("manager") || positionLevel >= 3
  if (isLeader) {
    const deptIds = managerDeptIds.length > 0 ? managerDeptIds : ownDeptId ? [ownDeptId] : []
    if (deptIds.length > 0) return { mode: "dept", deptIds }
    // Leader nhưng không xác định được phòng ban → ít nhất cho xem của chính họ
  }

  return ownEmployeeId ? { mode: "self", employeeId: ownEmployeeId } : { mode: "none" }
}
