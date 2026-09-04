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

/**
 * Quy tắc "mỗi bước chỉ cần 1 người đồng ý":
 * trả về các display_order mà bước đó đã có ít nhất 1 người approved
 * nhưng vẫn còn người pending — những người pending này được coi là đã duyệt.
 */
export function getSatisfiedStepsWithPending(approvers: SequentialAssignedApprover[]): number[] {
  const approvedSteps = new Set<number>()
  const pendingSteps = new Set<number>()
  for (const a of approvers) {
    if (a.display_order == null) continue
    if (a.status === "approved") approvedSteps.add(a.display_order)
    else if (a.status === "pending") pendingSteps.add(a.display_order)
  }
  return [...approvedSteps].filter((step) => pendingSteps.has(step)).sort((a, b) => a - b)
}

