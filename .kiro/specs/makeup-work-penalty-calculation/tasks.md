# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Incomplete Makeup Work Penalty
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases: employees with `late_early_makeup` request where `checkout < to_time` and `earlyMinutes > threshold`
  - Test that employees with `late_early_makeup` request (to_time = 18:00) who checkout early (17:14) are NOT penalized on UNFIXED code
  - Generate test cases: various `to_time` values (17:00-20:00) with `checkout < to_time` where `earlyMinutes > threshold`
  - The test assertions should match Expected Behavior: penalty SHALL be applied with `earlyMinutes = to_time - checkout_time`
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists: employees are exempted when they should be penalized)
  - Document counterexamples found (e.g., "Employee with makeup request to 18:00, checkout 17:14 → no penalty applied (bug)")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Completed Makeup Work and Other Cases
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs:
    - Employees who complete makeup work (`checkout >= to_time`) → no penalty
    - Employees with `earlyMinutes <= threshold` → no penalty
    - Employees with other request types (`late_arrival`, `early_leave`, etc.) → no penalty
    - Linked deficit dates with makeup work → no penalty
    - Special days with `allow_early_leave = true` → no penalty
    - Late arrival penalties in makeup days → penalty applied normally
  - Write property-based tests capturing observed behavior patterns:
    - Property: For all employees with `late_early_makeup` where `checkout >= to_time`, no penalty is applied
    - Property: For all employees with `earlyMinutes <= threshold`, no penalty is applied
    - Property: For all employees with non-`late_early_makeup` request types, exemption behavior is unchanged
    - Property: For all special days with `allow_early_leave = true`, no early leave penalty is applied
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 3. Fix for incomplete makeup work penalty calculation

  - [x] 3.1 Update type definition for completedMakeupWork flag
    - Add `completedMakeupWork: boolean` field to `AttendanceViolation` interface in `lib/actions/payroll/types.ts`
    - Field indicates whether employee completed their makeup work commitment (checkout >= to_time)
    - _Bug_Condition: isBugCondition(input) where input.request_type == "late_early_makeup" AND input.checkout_time < input.to_time AND earlyMinutes > threshold_
    - _Expected_Behavior: Backend SHALL apply penalty when completedMakeupWork = false_
    - _Preservation: Employees with completedMakeupWork = true SHALL continue to be exempted_
    - _Requirements: 2.1, 2.2, 2.4, 3.1_

  - [x] 3.2 Update violations detection to calculate completedMakeupWork flag
    - In `lib/actions/payroll/violations.ts`, after line 199 where `effectiveShiftEnd` is updated with `makeupEnd`
    - Calculate `completedMakeupWork = hasCheckOut && checkOutMinutes >= parseTime(makeupEnd)` when makeup request exists
    - Set `completedMakeupWork = false` when no makeup request or no checkout
    - Add `completedMakeupWork` field to violation object at line 320
    - Handle edge case: multiple makeup requests on same day → use latest `to_time` (already handled by existing logic)
    - _Bug_Condition: Detection logic SHALL identify when checkout < to_time_
    - _Expected_Behavior: completedMakeupWork flag SHALL accurately reflect whether employee met their commitment_
    - _Preservation: Existing violation detection logic SHALL remain unchanged_
    - _Requirements: 2.1, 2.2, 2.5, 3.4_

  - [x] 3.3 Update penalty exemption logic to check completedMakeupWork
    - In `lib/actions/payroll/generate-payroll.ts`, modify penalty exemption logic at lines 1611-1621
    - Add check: if request type is `late_early_makeup` AND `completedMakeupWork = false` → do NOT exempt penalty
    - Keep existing exemption for `late_early_makeup` when `completedMakeupWork = true`
    - Keep existing exemption for all other request types unchanged
    - Add logging when penalty is applied despite having makeup request: "Ngày ${v.date}: Có phiếu làm bù nhưng chưa hoàn thành (checkout < to_time) → Phạt về sớm ${v.earlyMinutes} phút"
    - _Bug_Condition: Penalty logic SHALL NOT exempt when late_early_makeup AND NOT completedMakeupWork_
    - _Expected_Behavior: Penalty SHALL be applied with earlyMinutes from violations_
    - _Preservation: Other request types and completed makeup work SHALL continue to be exempted_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.5, 3.6, 3.7_

  - [x] 3.4 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Incomplete Makeup Work Penalty Applied
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed - employees with incomplete makeup work are now penalized)
    - Verify counterexamples from task 1 now result in penalties being applied
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 3.5 Verify preservation tests still pass
    - **Property 2: Preservation** - Completed Makeup Work and Other Cases Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all preservation properties still hold:
      - Completed makeup work → no penalty
      - Below threshold → no penalty
      - Other request types → exempted as before
      - Special days → exempted as before
      - Late arrival in makeup days → penalized as before
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise
  - Verify bug condition test passes (incomplete makeup work is penalized)
  - Verify preservation tests pass (no regressions in other behaviors)
  - Review logs to confirm penalty reasons are displayed correctly
  - Confirm no "Đều về không đúng giờ làm bù nhưng không bị phạt" messages appear
