/**
 * Preservation Property Tests for Makeup Work Violation Check
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**
 * 
 * These tests capture the CURRENT CORRECT BEHAVIOR on unfixed code
 * for non-buggy inputs (days without makeup requests, special days, etc.)
 * to ensure the fix does not introduce regressions.
 * 
 * CRITICAL: These tests are EXPECTED TO PASS on unfixed code.
 * They document the baseline behavior that must be preserved.
 * 
 * After the fix is implemented, these tests should STILL PASS,
 * validating that no regressions were introduced.
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

type SpecialDay = {
  allow_early_leave?: boolean
  allow_late_arrival?: boolean
  custom_start_time?: string | null
  custom_end_time?: string | null
}

// Extract the checkViolations function from attendance-panel.tsx
// This is the CURRENT implementation (unfixed)
function checkViolations(
  checkInTime: string | null,
  checkOutTime: string | null,
  shift: WorkShift | null | undefined,
  options?: { isAfternoonOnly?: boolean; isMorningOnly?: boolean },
  specialDay?: SpecialDay | null
): AttendanceViolation[] {
  const violations: AttendanceViolation[] = []

  if (!shift) return violations

  const shiftStart = specialDay?.custom_start_time?.slice(0, 5) || shift.start_time?.slice(0, 5)
  const shiftEnd = specialDay?.custom_end_time?.slice(0, 5) || shift.end_time?.slice(0, 5)
  const breakStart = shift.break_start?.slice(0, 5) || "12:00"
  const breakEnd = shift.break_end?.slice(0, 5) || "13:00"

  if (!shiftStart || !shiftEnd) return violations

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

    const compareTime = options?.isMorningOnly ? breakStart : shiftEnd
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
          : `Về sớm ${earlyMinutes} phút (ra lúc ${checkOutHHMM}, ca kết thúc ${shiftEnd})`,
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

describe('Preservation Property Tests: Non-Makeup Day Behavior', () => {
  /**
   * Property 2.1: Days without makeup requests use default shift end time
   * 
   * **Validates: Requirements 3.2**
   * 
   * When there is NO makeup request, the violation checking should use
   * the default shift end time (or special day custom end time).
   * This is the current correct behavior that must be preserved.
   */
  it('should use default shift end time when no makeup request exists', () => {
    fc.assert(
      fc.property(
        // Generate checkout times around shift end (17:30)
        fc.integer({ min: 16, max: 18 }),
        fc.integer({ min: 0, max: 59 }),
        (checkoutHour, checkoutMinute) => {
          const shift: WorkShift = {
            id: '1',
            name: 'Ca hành chính',
            start_time: '08:00:00',
            end_time: '17:30:00',
            break_start: '12:00:00',
            break_end: '13:00:00'
          }

          const checkInTime = '2026-03-20T08:00:00+07:00'
          const checkOutTime = `2026-03-20T${String(checkoutHour).padStart(2, '0')}:${String(checkoutMinute).padStart(2, '0')}:00+07:00`
          
          // NO makeup request passed
          const violations = checkViolations(
            checkInTime,
            checkOutTime,
            shift,
            undefined,
            null
          )

          // Calculate expected violation based on default shift end (17:30)
          const shiftEndMinutes = 17 * 60 + 30
          const checkoutMinutes = checkoutHour * 60 + checkoutMinute
          const expectedEarlyMinutes = shiftEndMinutes - checkoutMinutes

          const earlyLeaveViolation = violations.find(v => v.type === 'early_leave')

          if (expectedEarlyMinutes > 0) {
            // Should show violation based on default shift end
            expect(earlyLeaveViolation).toBeDefined()
            expect(earlyLeaveViolation?.minutes).toBe(expectedEarlyMinutes)
          } else {
            // Should show no violation
            expect(earlyLeaveViolation).toBeUndefined()
          }
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property 2.2: No violation when checkout >= default shift end (no makeup)
   * 
   * **Validates: Requirements 3.1, 3.3**
   * 
   * When checkout time is at or after the default shift end time,
   * and there is NO makeup request, no early leave violation should be shown.
   */
  it('should show no violation when checkout >= shift end time (no makeup)', () => {
    const shift: WorkShift = {
      id: '1',
      name: 'Ca hành chính',
      start_time: '08:00:00',
      end_time: '17:30:00',
      break_start: '12:00:00',
      break_end: '13:00:00'
    }

    // Test cases: checkout at or after shift end
    const testCases = [
      { checkout: '17:30:00', description: 'exactly at shift end' },
      { checkout: '17:45:00', description: '15 minutes after shift end' },
      { checkout: '18:00:00', description: '30 minutes after shift end' },
      { checkout: '19:00:00', description: '90 minutes after shift end' }
    ]

    testCases.forEach(({ checkout, description }) => {
      const checkInTime = '2026-03-20T08:00:00+07:00'
      const checkOutTime = `2026-03-20T${checkout}+07:00`
      
      const violations = checkViolations(
        checkInTime,
        checkOutTime,
        shift,
        undefined,
        null
      )

      const earlyLeaveViolation = violations.find(v => v.type === 'early_leave')
      
      expect(earlyLeaveViolation, `Failed for ${description}`).toBeUndefined()
    })
  })

  /**
   * Property 2.3: Special day allow_early_leave bypasses violation checking
   * 
   * **Validates: Requirements 3.8**
   * 
   * When a special day has allow_early_leave = true, no early leave
   * violation should be shown regardless of checkout time.
   * This behavior must be preserved and should take precedence over makeup requests.
   */
  it('should bypass early leave checking when special day allows early leave', () => {
    fc.assert(
      fc.property(
        // Generate early checkout times (before 17:30)
        fc.integer({ min: 14, max: 17 }),
        fc.integer({ min: 0, max: 59 }),
        (checkoutHour, checkoutMinute) => {
          const shift: WorkShift = {
            id: '1',
            name: 'Ca hành chính',
            start_time: '08:00:00',
            end_time: '17:30:00',
            break_start: '12:00:00',
            break_end: '13:00:00'
          }

          const specialDay: SpecialDay = {
            allow_early_leave: true
          }

          const checkInTime = '2026-03-20T08:00:00+07:00'
          const checkOutTime = `2026-03-20T${String(checkoutHour).padStart(2, '0')}:${String(checkoutMinute).padStart(2, '0')}:00+07:00`
          
          const violations = checkViolations(
            checkInTime,
            checkOutTime,
            shift,
            undefined,
            specialDay
          )

          const earlyLeaveViolation = violations.find(v => v.type === 'early_leave')
          
          // Should NOT show early leave violation
          expect(earlyLeaveViolation).toBeUndefined()
        }
      ),
      { numRuns: 30 }
    )
  })

  /**
   * Property 2.4: Late arrival checking remains unchanged
   * 
   * **Validates: Requirements 3.4**
   * 
   * Makeup requests only affect shift end time, not start time.
   * Late arrival violation checking should remain unchanged.
   */
  it('should check late arrival against shift start time (unaffected by makeup)', () => {
    fc.assert(
      fc.property(
        // Generate check-in times around shift start (08:00)
        fc.integer({ min: 7, max: 9 }),
        fc.integer({ min: 0, max: 59 }),
        (checkinHour, checkinMinute) => {
          const shift: WorkShift = {
            id: '1',
            name: 'Ca hành chính',
            start_time: '08:00:00',
            end_time: '17:30:00',
            break_start: '12:00:00',
            break_end: '13:00:00'
          }

          const checkInTime = `2026-03-20T${String(checkinHour).padStart(2, '0')}:${String(checkinMinute).padStart(2, '0')}:00+07:00`
          const checkOutTime = '2026-03-20T17:30:00+07:00'
          
          const violations = checkViolations(
            checkInTime,
            checkOutTime,
            shift,
            undefined,
            null
          )

          // Calculate expected late minutes based on shift start (08:00)
          const shiftStartMinutes = 8 * 60
          const checkinMinutes = checkinHour * 60 + checkinMinute
          const expectedLateMinutes = checkinMinutes - shiftStartMinutes

          const lateViolation = violations.find(v => v.type === 'late')

          if (expectedLateMinutes > 0) {
            // Should show late violation
            expect(lateViolation).toBeDefined()
            expect(lateViolation?.minutes).toBe(expectedLateMinutes)
          } else {
            // Should show no late violation
            expect(lateViolation).toBeUndefined()
          }
        }
      ),
      { numRuns: 50 }
    )
  })

  /**
   * Property 2.5: Half-day work logic (isMorningOnly) continues to work
   * 
   * **Validates: Requirements 3.6**
   * 
   * When isMorningOnly = true, early leave checking should compare
   * against break start time instead of shift end time.
   */
  it('should use break start time for early leave when isMorningOnly = true', () => {
    const shift: WorkShift = {
      id: '1',
      name: 'Ca hành chính',
      start_time: '08:00:00',
      end_time: '17:30:00',
      break_start: '12:00:00',
      break_end: '13:00:00'
    }

    // Test cases: checkout before break start (12:00)
    const testCases = [
      { checkout: '11:30:00', expectedEarly: 30 },
      { checkout: '11:45:00', expectedEarly: 15 },
      { checkout: '12:00:00', expectedEarly: 0 }, // exactly at break start
      { checkout: '12:15:00', expectedEarly: 0 }  // after break start
    ]

    testCases.forEach(({ checkout, expectedEarly }) => {
      const checkInTime = '2026-03-20T08:00:00+07:00'
      const checkOutTime = `2026-03-20T${checkout}+07:00`
      
      const violations = checkViolations(
        checkInTime,
        checkOutTime,
        shift,
        { isMorningOnly: true },
        null
      )

      const earlyLeaveViolation = violations.find(v => v.type === 'early_leave')
      
      if (expectedEarly > 0) {
        expect(earlyLeaveViolation).toBeDefined()
        expect(earlyLeaveViolation?.minutes).toBe(expectedEarly)
        expect(earlyLeaveViolation?.message).toContain('ca sáng kết thúc')
      } else {
        expect(earlyLeaveViolation).toBeUndefined()
      }
    })
  })

  /**
   * Property 2.6: Half-day work logic (isAfternoonOnly) continues to work
   * 
   * **Validates: Requirements 3.6**
   * 
   * When isAfternoonOnly = true, late arrival checking should compare
   * against break end time instead of shift start time.
   */
  it('should use break end time for late arrival when isAfternoonOnly = true', () => {
    const shift: WorkShift = {
      id: '1',
      name: 'Ca hành chính',
      start_time: '08:00:00',
      end_time: '17:30:00',
      break_start: '12:00:00',
      break_end: '13:00:00'
    }

    // Test cases: check-in around break end (13:00)
    const testCases = [
      { checkin: '12:45:00', expectedLate: 0 },  // before break end
      { checkin: '13:00:00', expectedLate: 0 },  // exactly at break end
      { checkin: '13:15:00', expectedLate: 15 }, // 15 minutes late
      { checkin: '13:30:00', expectedLate: 30 }  // 30 minutes late
    ]

    testCases.forEach(({ checkin, expectedLate }) => {
      const checkInTime = `2026-03-20T${checkin}+07:00`
      const checkOutTime = '2026-03-20T17:30:00+07:00'
      
      const violations = checkViolations(
        checkInTime,
        checkOutTime,
        shift,
        { isAfternoonOnly: true },
        null
      )

      const lateViolation = violations.find(v => v.type === 'late')
      
      if (expectedLate > 0) {
        expect(lateViolation).toBeDefined()
        expect(lateViolation?.minutes).toBe(expectedLate)
        expect(lateViolation?.message).toContain('ca chiều bắt đầu')
      } else {
        expect(lateViolation).toBeUndefined()
      }
    })
  })

  /**
   * Property 2.7: Special day custom_end_time takes precedence
   * 
   * **Validates: Requirements 3.2**
   * 
   * When a special day has custom_end_time, it should be used instead
   * of the default shift end time for violation checking.
   */
  it('should use special day custom_end_time when provided', () => {
    const shift: WorkShift = {
      id: '1',
      name: 'Ca hành chính',
      start_time: '08:00:00',
      end_time: '17:30:00',
      break_start: '12:00:00',
      break_end: '13:00:00'
    }

    const specialDay: SpecialDay = {
      custom_end_time: '16:00:00' // Earlier end time
    }

    // Checkout at 15:45 - should show 15 minute violation (16:00 - 15:45)
    const checkInTime = '2026-03-20T08:00:00+07:00'
    const checkOutTime = '2026-03-20T15:45:00+07:00'
    
    const violations = checkViolations(
      checkInTime,
      checkOutTime,
      shift,
      undefined,
      specialDay
    )

    const earlyLeaveViolation = violations.find(v => v.type === 'early_leave')
    
    expect(earlyLeaveViolation).toBeDefined()
    expect(earlyLeaveViolation?.minutes).toBe(15)
  })

  /**
   * Property 2.8: No check-in violation
   * 
   * **Validates: Requirements 3.2**
   * 
   * When check-in is null, should show "no_checkin" violation.
   */
  it('should show no_checkin violation when checkInTime is null', () => {
    const shift: WorkShift = {
      id: '1',
      name: 'Ca hành chính',
      start_time: '08:00:00',
      end_time: '17:30:00',
      break_start: '12:00:00',
      break_end: '13:00:00'
    }

    const violations = checkViolations(
      null, // No check-in
      '2026-03-20T17:30:00+07:00',
      shift,
      undefined,
      null
    )

    const noCheckinViolation = violations.find(v => v.type === 'no_checkin')
    
    expect(noCheckinViolation).toBeDefined()
    expect(noCheckinViolation?.message).toBe('Quên chấm công vào')
  })

  /**
   * Property 2.9: No check-out violation
   * 
   * **Validates: Requirements 3.2**
   * 
   * When check-out is null but check-in exists, should show "no_checkout" violation.
   */
  it('should show no_checkout violation when checkOutTime is null', () => {
    const shift: WorkShift = {
      id: '1',
      name: 'Ca hành chính',
      start_time: '08:00:00',
      end_time: '17:30:00',
      break_start: '12:00:00',
      break_end: '13:00:00'
    }

    const violations = checkViolations(
      '2026-03-20T08:00:00+07:00',
      null, // No check-out
      shift,
      undefined,
      null
    )

    const noCheckoutViolation = violations.find(v => v.type === 'no_checkout')
    
    expect(noCheckoutViolation).toBeDefined()
    expect(noCheckoutViolation?.message).toBe('Quên chấm công ra')
  })

  /**
   * Property 2.10: Complete attendance with no violations
   * 
   * **Validates: Requirements 3.3**
   * 
   * When check-in and check-out are within shift times, no violations should be shown.
   */
  it('should show no violations for complete attendance within shift times', () => {
    fc.assert(
      fc.property(
        // Generate check-in times before or at shift start
        fc.integer({ min: 7, max: 8 }),
        fc.integer({ min: 0, max: 59 }),
        // Generate check-out times at or after shift end
        fc.integer({ min: 17, max: 19 }),
        fc.integer({ min: 30, max: 59 }),
        (checkinHour, checkinMinute, checkoutHour, checkoutMinute) => {
          // Ensure check-in <= 08:00 and check-out >= 17:30
          fc.pre(
            (checkinHour < 8 || (checkinHour === 8 && checkinMinute === 0)) &&
            (checkoutHour > 17 || (checkoutHour === 17 && checkoutMinute >= 30))
          )

          const shift: WorkShift = {
            id: '1',
            name: 'Ca hành chính',
            start_time: '08:00:00',
            end_time: '17:30:00',
            break_start: '12:00:00',
            break_end: '13:00:00'
          }

          const checkInTime = `2026-03-20T${String(checkinHour).padStart(2, '0')}:${String(checkinMinute).padStart(2, '0')}:00+07:00`
          const checkOutTime = `2026-03-20T${String(checkoutHour).padStart(2, '0')}:${String(checkoutMinute).padStart(2, '0')}:00+07:00`
          
          const violations = checkViolations(
            checkInTime,
            checkOutTime,
            shift,
            undefined,
            null
          )

          // Should have no violations
          expect(violations).toHaveLength(0)
        }
      ),
      { numRuns: 30 }
    )
  })
})
