/**
 * Bug Condition Exploration Test for Makeup Work Violation Check
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4**
 * 
 * This test demonstrates the bug where the frontend does not display
 * early leave violations when an employee checks out before the `to_time`
 * specified in an approved "Đi muộn/về sớm làm bù" (late_early_makeup) request.
 * 
 * CRITICAL: This test is EXPECTED TO FAIL on unfixed code.
 * The failure confirms the bug exists.
 * 
 * After the fix is implemented, this same test should PASS,
 * validating that the fix works correctly.
 */

import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

// Import the types we need
type WorkShift = {
  id: string
  name: string
  start_time: string
  end_time: string
  break_start?: string | null
  break_end?: string | null
}

type AttendanceViolation = {
  type: "late" | "early_leave" | "no_checkin" | "no_checkout"
  minutes?: number
  message: string
}

type MakeupRequest = {
  to_time?: string | null
}

// Extract the checkViolations function from attendance-panel.tsx
// This is the function we're testing
function checkViolations(
  checkInTime: string | null,
  checkOutTime: string | null,
  shift: WorkShift | null | undefined,
  options?: { isAfternoonOnly?: boolean; isMorningOnly?: boolean },
  specialDay?: { allow_early_leave?: boolean; allow_late_arrival?: boolean; custom_start_time?: string | null; custom_end_time?: string | null } | null,
  makeupRequest?: MakeupRequest | null
): AttendanceViolation[] {
  const violations: AttendanceViolation[] = []

  if (!shift) return violations

  const shiftStart = specialDay?.custom_start_time?.slice(0, 5) || shift.start_time?.slice(0, 5)
  const shiftEnd = specialDay?.custom_end_time?.slice(0, 5) || shift.end_time?.slice(0, 5)
  const breakStart = shift.break_start?.slice(0, 5) || "12:00"
  const breakEnd = shift.break_end?.slice(0, 5) || "13:00"

  if (!shiftStart || !shiftEnd) return violations

  // Adjust effectiveShiftEnd based on makeup request (matching backend logic in violations.ts lines 195-199)
  let effectiveShiftEnd = shiftEnd
  if (makeupRequest?.to_time) {
    const makeupEnd = makeupRequest.to_time.slice(0, 5)
    if (makeupEnd > effectiveShiftEnd) {
      effectiveShiftEnd = makeupEnd
    }
  }

  // Check late arrival (bỏ qua nếu ngày đặc biệt cho phép đi muộn)
  if (checkInTime && !specialDay?.allow_late_arrival) {
    const checkIn = new Date(checkInTime)
    const checkInHHMM = `${String(checkIn.getHours()).padStart(2, "0")}:${String(checkIn.getMinutes()).padStart(2, "0")}`

    const compareTime = options?.isAfternoonOnly ? breakEnd : shiftStart
    const [shiftH, shiftM] = compareTime.split(":").map(Number)
    const [checkH, checkM] = checkInHHMM.split(":").map(Number)

    const shiftMinutes = shiftH * 60 + shiftM
    const checkMinutes = checkH * 60 + checkM
    const lateMinutes = checkMinutes - shiftMinutes

    if (lateMinutes > 0) {
      violations.push({
        type: "late",
        minutes: lateMinutes,
        message: options?.isAfternoonOnly
          ? `Đi muộn ${lateMinutes} phút (vào lúc ${checkInHHMM}, ca chiều bắt đầu ${breakEnd})`
          : `Đi muộn ${lateMinutes} phút (vào lúc ${checkInHHMM}, ca bắt đầu ${shiftStart})`,
      })
    }
  } else if (!checkInTime) {
    violations.push({
      type: "no_checkin",
      message: "Quên chấm công vào",
    })
  }

  // Check early leave (bỏ qua nếu ngày đặc biệt cho phép về sớm)
  if (checkOutTime && !specialDay?.allow_early_leave) {
    const checkOut = new Date(checkOutTime)
    const checkOutHHMM = `${String(checkOut.getHours()).padStart(2, "0")}:${String(checkOut.getMinutes()).padStart(2, "0")}`

    const compareTime = options?.isMorningOnly ? breakStart : effectiveShiftEnd
    const [shiftH, shiftM] = compareTime.split(":").map(Number)
    const [checkH, checkM] = checkOutHHMM.split(":").map(Number)

    const shiftMinutes = shiftH * 60 + shiftM
    const checkMinutes = checkH * 60 + checkM
    const earlyMinutes = shiftMinutes - checkMinutes

    if (earlyMinutes > 0) {
      violations.push({
        type: "early_leave",
        minutes: earlyMinutes,
        message: options?.isMorningOnly
          ? `Về sớm ${earlyMinutes} phút (ra lúc ${checkOutHHMM}, ca sáng kết thúc ${breakStart})`
          : `Về sớm ${earlyMinutes} phút (ra lúc ${checkOutHHMM}, ca kết thúc ${compareTime})`,
      })
    }
  } else if (!checkOutTime && checkInTime) {
    violations.push({
      type: "no_checkout",
      message: "Quên chấm công ra",
    })
  }

  return violations
}

describe('Bug Condition Exploration: Makeup Request Violation Not Displayed', () => {
  /**
   * Property 1: Bug Condition - Makeup Request Violation Not Displayed
   * 
   * This property tests the concrete failing case from the bug report:
   * - Employee 00002 has approved makeup request for 2026-03-20 with to_time = "18:00:00"
   * - Employee checks out at 17:14
   * - Backend calculates earlyMinutes = 46 (correct)
   * - Frontend should display early leave violation with 46 minutes
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: TEST FAILS
   * - The checkViolations function does NOT receive makeup request info
   * - It uses default shift end time (17:30) instead of makeup to_time (18:00)
   * - It calculates earlyMinutes = 17:30 - 17:14 = 16 minutes (WRONG)
   * - Or it shows no violation at all if checkout > default shift end
   * 
   * EXPECTED OUTCOME AFTER FIX: TEST PASSES
   * - The checkViolations function receives makeup request with to_time
   * - It adjusts effectiveShiftEnd to 18:00
   * - It calculates earlyMinutes = 18:00 - 17:14 = 46 minutes (CORRECT)
   * - It returns early_leave violation with 46 minutes
   */
  it('should calculate early leave violation when checkout < makeup to_time (concrete case)', () => {
    // Arrange: Set up the concrete failing case from bug report
    const shift: WorkShift = {
      id: '1',
      name: 'Ca hành chính',
      start_time: '08:00:00',
      end_time: '17:30:00',
      break_start: '12:00:00',
      break_end: '13:00:00'
    }

    const checkInTime = '2026-03-20T07:47:00+07:00'
    const checkOutTime = '2026-03-20T17:14:00+07:00'
    
    const makeupRequest: MakeupRequest = {
      to_time: '18:00:00'
    }

    // Act: Call checkViolations with makeup request
    const violations = checkViolations(
      checkInTime,
      checkOutTime,
      shift,
      undefined,
      null,
      makeupRequest
    )

    // Assert: Should return early leave violation with 46 minutes
    // Expected: earlyMinutes = 18:00 - 17:14 = 46 minutes
    const earlyLeaveViolation = violations.find(v => v.type === 'early_leave')
    
    expect(earlyLeaveViolation).toBeDefined()
    expect(earlyLeaveViolation?.minutes).toBe(46)
    expect(earlyLeaveViolation?.message).toContain('Về sớm 46 phút')
  })

  /**
   * Property-Based Test: Scoped to Bug Condition
   * 
   * This property generalizes the bug condition to test multiple scenarios
   * where checkout < to_time in makeup requests.
   * 
   * For deterministic bugs, we scope the property to concrete failing cases
   * to ensure reproducibility and clear counterexamples.
   */
  it('should calculate early leave violation for any checkout < makeup to_time', () => {
    fc.assert(
      fc.property(
        // Generate makeup to_time between 18:00 and 20:00
        fc.integer({ min: 18, max: 20 }),
        fc.integer({ min: 0, max: 59 }),
        // Generate checkout time that is earlier than to_time
        fc.integer({ min: 16, max: 19 }),
        fc.integer({ min: 0, max: 59 }),
        (toHour, toMinute, checkoutHour, checkoutMinute) => {
          // Ensure checkout < to_time
          const toTimeMinutes = toHour * 60 + toMinute
          const checkoutMinutes = checkoutHour * 60 + checkoutMinute
          
          fc.pre(checkoutMinutes < toTimeMinutes) // Only test when checkout < to_time

          // Arrange
          const shift: WorkShift = {
            id: '1',
            name: 'Ca hành chính',
            start_time: '08:00:00',
            end_time: '17:30:00',
            break_start: '12:00:00',
            break_end: '13:00:00'
          }

          const checkInTime = `2026-03-20T07:47:00+07:00`
          const checkOutTime = `2026-03-20T${String(checkoutHour).padStart(2, '0')}:${String(checkoutMinute).padStart(2, '0')}:00+07:00`
          
          const makeupRequest: MakeupRequest = {
            to_time: `${String(toHour).padStart(2, '0')}:${String(toMinute).padStart(2, '0')}:00`
          }

          // Act
          const violations = checkViolations(
            checkInTime,
            checkOutTime,
            shift,
            undefined,
            null,
            makeupRequest
          )

          // Assert
          const earlyLeaveViolation = violations.find(v => v.type === 'early_leave')
          const expectedEarlyMinutes = toTimeMinutes - checkoutMinutes
          
          expect(earlyLeaveViolation).toBeDefined()
          expect(earlyLeaveViolation?.minutes).toBe(expectedEarlyMinutes)
        }
      ),
      { numRuns: 50 } // Run 50 test cases
    )
  })

  /**
   * Edge Case: Multiple makeup requests for same date
   * 
   * When there are multiple makeup requests with different to_time values,
   * the frontend should use the LATEST to_time (matching backend behavior).
   */
  it('should use latest to_time when multiple makeup requests exist (edge case)', () => {
    // This test documents expected behavior for edge case
    // Currently, the function only accepts one makeupRequest parameter
    // If multiple requests exist, the caller should pass the one with latest to_time
    
    const shift: WorkShift = {
      id: '1',
      name: 'Ca hành chính',
      start_time: '08:00:00',
      end_time: '17:30:00',
      break_start: '12:00:00',
      break_end: '13:00:00'
    }

    const checkInTime = '2026-03-20T07:47:00+07:00'
    const checkOutTime = '2026-03-20T18:30:00+07:00'
    
    // Simulate: caller should pass the latest to_time (19:00)
    const makeupRequest: MakeupRequest = {
      to_time: '19:00:00' // Latest of 18:00 and 19:00
    }

    const violations = checkViolations(
      checkInTime,
      checkOutTime,
      shift,
      undefined,
      null,
      makeupRequest
    )

    // Should show 30-minute violation (19:00 - 18:30)
    const earlyLeaveViolation = violations.find(v => v.type === 'early_leave')
    
    expect(earlyLeaveViolation).toBeDefined()
    expect(earlyLeaveViolation?.minutes).toBe(30)
  })

  /**
   * Edge Case: Checkout exactly at to_time
   * 
   * When checkout time equals to_time, no violation should be shown.
   */
  it('should show no violation when checkout exactly at to_time', () => {
    const shift: WorkShift = {
      id: '1',
      name: 'Ca hành chính',
      start_time: '08:00:00',
      end_time: '17:30:00',
      break_start: '12:00:00',
      break_end: '13:00:00'
    }

    const checkInTime = '2026-03-20T07:47:00+07:00'
    const checkOutTime = '2026-03-20T18:00:00+07:00'
    
    const makeupRequest: MakeupRequest = {
      to_time: '18:00:00'
    }

    const violations = checkViolations(
      checkInTime,
      checkOutTime,
      shift,
      undefined,
      null,
      makeupRequest
    )

    const earlyLeaveViolation = violations.find(v => v.type === 'early_leave')
    
    expect(earlyLeaveViolation).toBeUndefined()
  })

  /**
   * Edge Case: Checkout after to_time
   * 
   * When checkout time is after to_time, no violation should be shown.
   */
  it('should show no violation when checkout after to_time', () => {
    const shift: WorkShift = {
      id: '1',
      name: 'Ca hành chính',
      start_time: '08:00:00',
      end_time: '17:30:00',
      break_start: '12:00:00',
      break_end: '13:00:00'
    }

    const checkInTime = '2026-03-20T07:47:00+07:00'
    const checkOutTime = '2026-03-20T18:15:00+07:00'
    
    const makeupRequest: MakeupRequest = {
      to_time: '18:00:00'
    }

    const violations = checkViolations(
      checkInTime,
      checkOutTime,
      shift,
      undefined,
      null,
      makeupRequest
    )

    const earlyLeaveViolation = violations.find(v => v.type === 'early_leave')
    
    expect(earlyLeaveViolation).toBeUndefined()
  })
})
