export interface SequentialAssignedApprover {
  display_order: number | null
  status: string
}

/**
 * Tính bước duyệt hiện tại theo display_order nhỏ nhất còn pending.
 * Nếu không còn ai pending => trả về null.
 */
export function getCurrentSequentialStep(approvers: SequentialAssignedApprover[]): number | null {
  const pending = approvers.filter((a) => a.status === "pending" && a.display_order != null)
  if (pending.length === 0) return null
  return Math.min(...pending.map((a) => a.display_order as number))
}

/**
 * Kiểm tra 1 approver (display_order) có đang ở đúng bước duyệt hiện tại không.
 */
export function isApproverAtCurrentStep(
  approverDisplayOrder: number | null,
  approvers: SequentialAssignedApprover[]
): boolean {
  if (approverDisplayOrder == null) return false
  const currentStep = getCurrentSequentialStep(approvers)
  if (currentStep == null) return false
  return approverDisplayOrder === currentStep
}

