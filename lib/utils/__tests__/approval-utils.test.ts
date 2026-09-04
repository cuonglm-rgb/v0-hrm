import { describe, it, expect } from "vitest"
import { getCurrentSequentialStep, isApproverAtCurrentStep, getSatisfiedStepsWithPending } from "@/lib/utils/approval-utils"

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

describe("approval-utils - getSatisfiedStepsWithPending (mỗi bước chỉ cần 1 người đồng ý)", () => {
  it("trả về bước có 1 người approved nhưng vẫn còn người pending", () => {
    // Bước 2 có 2 người: 1 đã duyệt, 1 đang chờ → bước 2 coi như xong
    const approvers = [
      { display_order: 1, status: "approved" },
      { display_order: 2, status: "pending" },
      { display_order: 2, status: "approved" },
    ]
    expect(getSatisfiedStepsWithPending(approvers)).toEqual([2])
  })

  it("không trả về bước chưa có ai approved", () => {
    const approvers = [
      { display_order: 1, status: "approved" },
      { display_order: 2, status: "pending" },
      { display_order: 2, status: "pending" },
    ]
    expect(getSatisfiedStepsWithPending(approvers)).toEqual([])
  })

  it("không trả về bước đã xong hết (không còn pending)", () => {
    const approvers = [
      { display_order: 1, status: "approved" },
      { display_order: 2, status: "approved" },
    ]
    expect(getSatisfiedStepsWithPending(approvers)).toEqual([])
  })

  it("trả về nhiều bước, sắp xếp tăng dần", () => {
    const approvers = [
      { display_order: 3, status: "pending" },
      { display_order: 3, status: "approved" },
      { display_order: 1, status: "approved" },
      { display_order: 1, status: "pending" },
      { display_order: 2, status: "pending" },
    ]
    expect(getSatisfiedStepsWithPending(approvers)).toEqual([1, 3])
  })

  it("bỏ qua bản ghi không có display_order và trạng thái rejected", () => {
    const approvers = [
      { display_order: null, status: "approved" },
      { display_order: 1, status: "rejected" },
      { display_order: 1, status: "pending" },
    ]
    expect(getSatisfiedStepsWithPending(approvers)).toEqual([])
  })
})

