# Makeup Work Violation Check Bugfix Design

## Overview

This bugfix addresses a frontend display issue where violation warnings are not shown when an employee checks out earlier than the `to_time` specified in an approved "Đi muộn/về sớm làm bù" (late_early_makeup) request. The backend already calculates these violations correctly in payroll processing, but the frontend attendance display does not reflect them.

The fix involves synchronizing the frontend's `checkViolations` function logic with the backend's violation calculation logic by:
1. Passing makeup request information to the `checkViolations` function
2. Adjusting `effectiveShiftEnd` based on the makeup request's `to_time`
3. Calculating and displaying early leave violations when `checkout < to_time`

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when an employee has an approved `late_early_makeup` request with `to_time` = T and checks out at time < T, but the frontend does not display an early leave violation
- **Property (P)**: The desired behavior - the frontend should calculate and display early leave violations by comparing checkout time against the makeup request's `to_time` instead of the default shift end time
- **Preservation**: Existing violation checking behavior for non-makeup days and other request types must remain unchanged
- **checkViolations**: The function in `components/attendance/attendance-panel.tsx` (line 45) that calculates attendance violations based on check-in/check-out times
- **effectiveShiftEnd**: The actual end time used for violation calculation, which can be adjusted by special days or makeup requests
- **makeupShiftEndByDate**: Backend map (violations.ts line 101-109) that stores the `to_time` from approved `late_early_makeup` requests, used to adjust `effectiveShiftEnd`
- **late_early_makeup**: Request type code for "Đi muộn/về sớm làm bù" requests that allow employees to make up for late arrival or early leave by working extended hours

## Bug Details

### Bug Condition

The bug manifests when an employee has an approved `late_early_makeup` request for a specific date with a `to_time` field, and the employee checks out before that `to_time`. The frontend's `checkViolations` function does not receive information about the makeup request and therefore uses the default shift end time instead of the makeup request's `to_time` for violation calculation.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { date: string, employeeId: string, checkOutTime: string, makeupRequest: MakeupRequest | null }
  OUTPUT: boolean
  
  RETURN makeupRequest EXISTS
         AND makeupRequest.request_type.code === "late_early_makeup"
         AND makeupRequest.status === "approved"
         AND makeupRequest.to_time EXISTS
         AND checkOutTime < makeupRequest.to_time
         AND frontend does NOT display early leave violation
END FUNCTION
```

### Examples

- **Example 1**: Employee 00002 (Hoàng Phan Tuấn) has an approved makeup request for 2026-03-20 with `to_time` = "18:00:00". Employee checks in at 07:47 and checks out at 17:14. Backend calculates `earlyMinutes = 46` (18:00 - 17:14), but frontend displays "Hoàn thành" (Complete) with no violation warning.

- **Example 2**: Employee has makeup request with `to_time` = "19:30:00" and default shift end is "17:30:00". Employee checks out at 19:00. Frontend should show 30-minute early leave violation, but currently shows no violation because it compares against 17:30 instead of 19:30.

- **Example 3**: Employee has makeup request with `to_time` = "20:00:00". Employee checks out at 20:15. Frontend should show no violation (worked past required time), and this case currently works correctly because checkout > default shift end.

- **Edge case**: Employee has two approved makeup requests for the same date with `to_time` = "18:00" and "19:00". Frontend should use the later time (19:00) as the effective shift end, matching backend behavior (violations.ts lines 104-107).

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Violation checking for days without makeup requests must continue to work exactly as before
- Late arrival (check-in) violation checking must remain unchanged (makeup requests only affect shift end time, not start time)
- Special day handling (`allow_early_leave`, `allow_late_arrival`, `custom_start_time`, `custom_end_time`) must continue to take precedence over makeup requests
- Full day makeup requests (`full_day_makeup`) must continue to be handled by their existing logic
- Overtime request handling must remain unchanged
- Half-day work logic (`isMorningOnly`, `isAfternoonOnly`) must continue to work correctly
- Backend violation calculation in `lib/actions/payroll/violations.ts` must remain unchanged (already correct)

**Scope:**
All inputs that do NOT involve approved `late_early_makeup` requests should be completely unaffected by this fix. This includes:
- Days without any leave requests
- Days with other request types (sick leave, annual leave, forgot_checkin, forgot_checkout, etc.)
- Days where the employee checks out at or after the makeup request's `to_time`
- Mouse clicks, UI interactions, and data fetching logic

## Hypothesized Root Cause

Based on the bug description and code review, the root cause is clear:

1. **Missing Parameter**: The `checkViolations` function (attendance-panel.tsx line 45) does not accept a makeup request parameter, so it has no way to know about the adjusted shift end time.

2. **Hardcoded Shift End**: The function uses `shift.end_time` or `specialDay.custom_end_time` directly (line 59) without considering makeup requests that extend the required work hours.

3. **Backend-Frontend Mismatch**: The backend correctly implements the logic (violations.ts lines 195-199) to adjust `effectiveShiftEnd` based on makeup requests, but this logic was never implemented in the frontend.

4. **Incomplete Feature Implementation**: When the makeup work feature was originally implemented, the violation display logic in the frontend was not updated to match the backend's calculation logic.

## Correctness Properties

Property 1: Bug Condition - Makeup Request Violation Display

_For any_ attendance record where an employee has an approved `late_early_makeup` request with `to_time` = T for that date, and the employee checks out at time C where C < T, the frontend SHALL calculate and display an early leave violation with `earlyMinutes = T - C`, matching the backend's calculation logic.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - Non-Makeup Day Behavior

_For any_ attendance record where the employee does NOT have an approved `late_early_makeup` request for that date, the frontend SHALL produce exactly the same violation checking results as the original code, using the default shift end time or special day custom end time for early leave calculation.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**

## Fix Implementation

### Changes Required

**File**: `components/attendance/attendance-panel.tsx`

**Function**: `checkViolations` (line 45)

**Specific Changes**:

1. **Add Makeup Request Parameter**: Extend the function signature to accept an optional makeup request parameter:
   ```typescript
   function checkViolations(
     checkInTime: string | null,
     checkOutTime: string | null,
     shift: WorkShift | null | undefined,
     options?: { isAfternoonOnly?: boolean; isMorningOnly?: boolean },
     specialDay?: { ... } | null,
     makeupRequest?: { to_time?: string | null } | null  // NEW PARAMETER
   ): AttendanceViolation[]
   ```

2. **Adjust Effective Shift End**: After calculating the base `shiftEnd` from shift and special day (line 59), check if there's a makeup request with `to_time` and adjust accordingly:
   ```typescript
   let effectiveShiftEnd = shiftEnd
   if (makeupRequest?.to_time) {
     const makeupEnd = makeupRequest.to_time.slice(0, 5)
     if (makeupEnd > effectiveShiftEnd) {
       effectiveShiftEnd = makeupEnd
     }
   }
   ```

3. **Use Effective Shift End in Violation Calculation**: Replace `shiftEnd` with `effectiveShiftEnd` in the early leave violation calculation (around line 95):
   ```typescript
   const compareTime = options?.isMorningOnly ? breakStart : effectiveShiftEnd
   ```

4. **Update All Function Calls**: Update all 4 calls to `checkViolations` in the file to pass the makeup request:
   - Line 310: Pass makeup request for the date
   - Line 483: Pass makeup request for the date
   - Line 493: Pass makeup request for the date
   - Line 807: Pass makeup request for the date

5. **Reuse Existing Helper Function**: Use the existing `getMakeupRequestForDate` function (line 214) to fetch the makeup request for each date before calling `checkViolations`.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm that the frontend does not display violations when checkout < to_time in makeup requests.

**Test Plan**: Write tests that create attendance records with approved makeup requests and checkout times earlier than the `to_time`. Run these tests on the UNFIXED code to observe that violations are not displayed, then verify they appear after the fix.

**Test Cases**:
1. **Basic Makeup Violation**: Employee has makeup request with `to_time` = "18:00", checks out at "17:14" (will fail on unfixed code - no violation shown)
2. **Multiple Makeup Requests**: Employee has two makeup requests for same date with `to_time` = "18:00" and "19:00", checks out at "18:30" (will fail on unfixed code - should use later time)
3. **Makeup Beyond Shift**: Employee has makeup request with `to_time` = "20:00" (shift ends at "17:30"), checks out at "19:00" (will fail on unfixed code - 60 minute violation not shown)
4. **Edge Case - Exact Time**: Employee checks out exactly at `to_time` (should pass - no violation expected)

**Expected Counterexamples**:
- Frontend displays "Hoàn thành" or no violation when checkout < to_time
- Violation calculation uses default shift end time instead of makeup to_time
- Backend payroll shows penalties but frontend shows no warnings

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := checkViolations_fixed(input.checkIn, input.checkOut, input.shift, input.options, input.specialDay, input.makeupRequest)
  ASSERT result contains early_leave violation
  ASSERT violation.minutes = (input.makeupRequest.to_time - input.checkOut)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT checkViolations_original(input) = checkViolations_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for days without makeup requests, then write property-based tests capturing that behavior.

**Test Cases**:
1. **No Makeup Request**: Observe that violation checking works correctly for days without makeup requests on unfixed code, then verify this continues after fix
2. **Other Request Types**: Observe that other request types (sick leave, annual leave, forgot_checkin) are unaffected on unfixed code, then verify this continues after fix
3. **Special Day Priority**: Observe that `allow_early_leave` on special days bypasses violation checking on unfixed code, then verify this continues after fix
4. **Checkout After To_Time**: Observe that no violation is shown when checkout >= to_time on unfixed code, then verify this continues after fix

### Unit Tests

- Test `checkViolations` with makeup request where checkout < to_time (should show violation)
- Test `checkViolations` with makeup request where checkout >= to_time (should show no violation)
- Test `checkViolations` without makeup request (should use default shift end)
- Test `checkViolations` with multiple makeup requests same date (should use latest to_time)
- Test `checkViolations` with special day + makeup request (special day should take precedence if allow_early_leave = true)
- Test edge case: makeup to_time earlier than default shift end (should use default shift end)

### Property-Based Tests

- Generate random attendance records with and without makeup requests, verify violations are calculated correctly
- Generate random combinations of special days, makeup requests, and half-day options, verify no regressions
- Generate random checkout times around the to_time boundary, verify violation calculation is accurate

### Integration Tests

- Test full attendance panel rendering with makeup requests and violations displayed
- Test filtering by "violation" status includes makeup violation cases
- Test filtering by "complete" status excludes makeup violation cases
- Test that violation tooltips display correct information for makeup violations
- Test that backend payroll penalties match frontend violation displays
