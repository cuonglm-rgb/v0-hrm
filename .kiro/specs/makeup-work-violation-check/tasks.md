# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Makeup Request Violation Not Displayed
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope the property to the concrete failing case(s) to ensure reproducibility
  - Test that when an employee has an approved `late_early_makeup` request with `to_time` = T for a date, and checks out at time C where C < T, the frontend `checkViolations` function calculates and returns an early leave violation with `earlyMinutes = T - C`
  - Test implementation details from Bug Condition in design:
    - Input: `{ date: "2026-03-20", employeeId: "00002", checkOutTime: "17:14", makeupRequest: { request_type: { code: "late_early_makeup" }, status: "approved", to_time: "18:00:00" } }`
    - Expected: `checkViolations` returns violation with `type: "early_leave"` and `minutes: 46`
  - The test assertions should match the Expected Behavior Properties from design
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Makeup Day Behavior Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Test cases to observe and capture:
    - Days without makeup requests: violation checking uses default shift end time
    - Days with makeup request where checkout >= to_time: no violation shown
    - Days with other request types (sick leave, annual leave): unaffected by makeup logic
    - Days with special day `allow_early_leave = true`: violation checking bypassed
    - Half-day work logic (`isMorningOnly`, `isAfternoonOnly`): continues to work correctly
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 3. Fix for makeup work violation check

  - [x] 3.1 Update checkViolations function signature
    - Add optional `makeupRequest` parameter to function signature (line 45)
    - Parameter type: `makeupRequest?: { to_time?: string | null } | null`
    - _Bug_Condition: isBugCondition(input) where input has approved late_early_makeup request with to_time and checkout < to_time_
    - _Expected_Behavior: Frontend SHALL calculate early leave violation by comparing checkout against makeup to_time instead of default shift end_
    - _Preservation: Non-makeup days SHALL continue using default shift end time_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2_

  - [x] 3.2 Adjust effectiveShiftEnd based on makeup request
    - After calculating base `shiftEnd` from shift and special day (around line 59), add logic to check makeup request
    - If `makeupRequest?.to_time` exists, extract time as `makeupEnd = makeupRequest.to_time.slice(0, 5)`
    - If `makeupEnd > shiftEnd`, set `effectiveShiftEnd = makeupEnd`
    - Otherwise, use `effectiveShiftEnd = shiftEnd`
    - This matches backend logic in violations.ts lines 195-199
    - _Bug_Condition: Frontend does not adjust effectiveShiftEnd for makeup requests_
    - _Expected_Behavior: Frontend SHALL adjust effectiveShiftEnd to makeup to_time when it extends beyond default shift end_
    - _Preservation: When makeup to_time <= default shift end, use default shift end_
    - _Requirements: 2.2, 2.3, 2.5, 3.2_

  - [x] 3.3 Use effectiveShiftEnd in early leave violation calculation
    - Replace `shiftEnd` with `effectiveShiftEnd` in early leave comparison (around line 95)
    - Update compareTime calculation: `const compareTime = options?.isMorningOnly ? breakStart : effectiveShiftEnd`
    - Calculate `earlyMinutes = effectiveShiftEnd - checkOutMinutes`
    - _Bug_Condition: Frontend uses default shift end instead of makeup to_time_
    - _Expected_Behavior: Frontend SHALL calculate early leave violation using effectiveShiftEnd_
    - _Preservation: Morning-only half-day logic continues to use breakStart_
    - _Requirements: 2.3, 2.4, 3.3_

  - [x] 3.4 Update checkViolations call at line 810
    - Fetch makeup request using `getLateEarlyMakeupForDate(date, employeeId, leaveRequests)`
    - Pass makeup request as 6th parameter to `checkViolations` call
    - Update call: `checkViolations(log.check_in, log.check_out, shift, { isAfternoonOnly, isMorningOnly }, specialDay, makeup)`
    - _Bug_Condition: checkViolations not receiving makeup request information_
    - _Expected_Behavior: All checkViolations calls SHALL pass makeup request parameter_
    - _Preservation: Existing parameters remain unchanged_
    - _Requirements: 2.1, 2.2, 3.1_

  - [x] 3.5 Update checkViolations call in filter logic (around line 310)
    - Fetch makeup request for the date before calling checkViolations
    - Pass makeup request as 6th parameter
    - Ensure filter logic correctly identifies violations with makeup requests
    - _Bug_Condition: Filter logic does not account for makeup request violations_
    - _Expected_Behavior: Filter by "violation" status SHALL include makeup violation cases_
    - _Preservation: Filter logic for non-makeup days unchanged_
    - _Requirements: 2.1, 2.4, 3.1_

  - [x] 3.6 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Makeup Request Violation Displayed
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify that `checkViolations` now returns early leave violation when checkout < makeup to_time
    - Verify violation minutes calculated correctly: `earlyMinutes = to_time - checkout`
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.7 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Makeup Day Behavior Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - Verify days without makeup requests use default shift end time
    - Verify special day logic takes precedence over makeup requests
    - Verify half-day work logic continues to function correctly
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - Verify frontend violation display matches backend payroll calculation
  - Test with real data: Employee 00002, date 2026-03-20, makeup to_time 18:00, checkout 17:14
  - Confirm violation displayed on `/dashboard/attendance` and `/dashboard/attendance-management`
