import { describe, it, expect } from "vitest"
import { getCurrentSequentialStep, isApproverAtCurrentStep } from "@/lib/utils/approval-utils"

describe("approval-utils - sequential steps", () => {
  it("returns null when there is no pending approver", () => {
    const approvers = [
      { display_order: 1, status: "approved" },
      { display_order: 2, status: "approved" },
    ]
    expect(getCurrentSequentialStep(approvers)).toBeNull()
  })

  it("returns the smallest display_order with pending status", () => {
    const approvers = [
      { display_order: 1, status: "approved" },
      { display_order: 2, status: "pending" },
      { display_order: 3, status: "pending" },
    ]
    expect(getCurrentSequentialStep(approvers)).toBe(2)
  })

  it("ignores records without display_order", () => {
    const approvers = [
      { display_order: null, status: "pending" },
      { display_order: 3, status: "pending" },
    ]
    expect(getCurrentSequentialStep(approvers)).toBe(3)
  })

  it("checks if approver is at current step", () => {
    const approvers = [
      { display_order: 1, status: "approved" },
      { display_order: 2, status: "pending" },
      { display_order: 3, status: "pending" },
    ]
    expect(isApproverAtCurrentStep(2, approvers)).toBe(true)
    expect(isApproverAtCurrentStep(3, approvers)).toBe(false)
  })

  it("returns false for null display_order", () => {
    const approvers = [{ display_order: 1, status: "pending" }]
    expect(isApproverAtCurrentStep(null, approvers)).toBe(false)
  })
})

