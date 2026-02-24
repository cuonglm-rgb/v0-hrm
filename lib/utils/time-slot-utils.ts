import { RequestTimeSlot } from "@/lib/types/database"

// =============================================
// TIME SLOT UTILITIES
// Các hàm tiện ích cho tính năng nhiều khung giờ
// =============================================

interface TimeSlotInput {
  from_time: string
  to_time: string
}

interface ValidationResult {
  valid: boolean
  error?: string
}

interface ToggleCouplingResult {
  allows_multiple_time_slots: boolean
  requires_time_range: boolean
}

/**
 * Kiểm tra tính hợp lệ của một khung giờ: from_time phải trước to_time
 * Time format: "HH:mm" (ví dụ: "06:00", "17:00")
 */
export function validateTimeSlot(from_time: string, to_time: string): ValidationResult {
  if (from_time >= to_time) {
    return { valid: false, error: "Giờ bắt đầu phải trước giờ kết thúc" }
  }
  return { valid: true }
}

/**
 * Kiểm tra danh sách khung giờ không có chồng chéo
 * Hai khung giờ chồng chéo khi: A.from_time < B.to_time AND B.from_time < A.to_time
 */
export function validateNoOverlap(slots: TimeSlotInput[]): ValidationResult {
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i]
      const b = slots[j]
      if (a.from_time < b.to_time && b.from_time < a.to_time) {
        return { valid: false, error: "Các khung giờ không được chồng chéo" }
      }
    }
  }
  return { valid: true }
}

/**
 * Format danh sách khung giờ thành chuỗi hiển thị
 * Ví dụ: "06:00-08:00, 17:00-20:00"
 */
export function formatTimeSlots(slots: TimeSlotInput[]): string {
  return slots.map(s => `${s.from_time}-${s.to_time}`).join(", ")
}

/**
 * Lấy danh sách khung giờ với fallback về trường legacy
 * Nếu có timeSlots → trả về timeSlots
 * Nếu không có timeSlots nhưng có legacyFromTime/legacyToTime → trả về 1 phần tử
 * Nếu không có gì → trả về mảng rỗng
 */
export function getTimeSlotsWithFallback(
  timeSlots: RequestTimeSlot[] | undefined | null,
  legacyFromTime: string | null,
  legacyToTime: string | null
): TimeSlotInput[] {
  if (timeSlots && timeSlots.length > 0) {
    return timeSlots.map(s => ({ from_time: s.from_time, to_time: s.to_time }))
  }
  if (legacyFromTime && legacyToTime) {
    return [{ from_time: legacyFromTime, to_time: legacyToTime }]
  }
  return []
}

/**
 * Logic liên kết toggle giữa allows_multiple_time_slots và requires_time_range
 * - Nếu allows_multiple bật → requires_time_range phải bật
 * - Nếu requires_time_range tắt → allows_multiple phải tắt
 */
export function applyToggleCoupling(
  allows_multiple: boolean,
  requires_time_range: boolean
): ToggleCouplingResult {
  if (allows_multiple && !requires_time_range) {
    return { allows_multiple_time_slots: allows_multiple, requires_time_range: true }
  }
  if (!requires_time_range) {
    return { allows_multiple_time_slots: false, requires_time_range: false }
  }
  return { allows_multiple_time_slots: allows_multiple, requires_time_range }
}

/**
 * Thêm một khung giờ trống vào danh sách
 */
export function addTimeSlot(slots: TimeSlotInput[]): TimeSlotInput[] {
  return [...slots, { from_time: "", to_time: "" }]
}

/**
 * Xóa khung giờ tại vị trí index khỏi danh sách
 */
export function removeTimeSlot(slots: TimeSlotInput[], index: number): TimeSlotInput[] {
  return slots.filter((_, i) => i !== index)
}
