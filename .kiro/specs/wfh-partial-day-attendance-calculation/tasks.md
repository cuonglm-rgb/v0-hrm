# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Partial-Day WFH Combined with Physical Attendance
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Test concrete failing cases - employees with partial-day WFH (0.5 days) and complementary physical attendance (0.5 days) on the same date
  - Test that for dates where `isBugCondition(input)` is true (partial-day WFH + complementary attendance, no overlap), the payroll calculation counts 1 full working day
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found (e.g., "Employee with morning WFH (08:00-12:00) + afternoon attendance (13:14-17:50) shows 0.5 days instead of 1.0 day")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Partial-Day-WFH Behavior
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (full-day WFH, full-day attendance, half-day leave, overtime, makeup work, holidays)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Test cases to observe and encode:
    - Full-day WFH (08:00-17:00) with no attendance → observe working days count
    - Full-day physical attendance with no WFH → observe working days count
    - Half-day leave + half-day attendance → observe working days count
    - Full-day overtime → observe that date is excluded from working days
    - Makeup work (full_day_makeup) → observe consumed deficit handling
    - Company holidays and public holidays → observe holiday calculation
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 3. Fix for WFH partial-day attendance calculation

  - [x] 3.1 Implement the fix in generate-payroll.ts
    - Query approved WFH requests before attendance counting to identify dates with partial-day WFH
    - Update attendance counting logic to populate `attendanceDayFractions` map with awareness of partial-day WFH requests
    - When building `attendanceDayFractions` during attendance log processing, check if each date has a partial-day WFH request
    - If date has partial-day WFH and physical attendance, calculate attendance fraction based on WFH time range
    - Ensure WFH time range and physical attendance time range do not overlap to prevent double-counting
    - Update `processLeaveRequests` to correctly use `attendanceDayFractions` for partial-day WFH calculation
    - _Bug_Condition: isBugCondition(input) where input.wfhRequest.type == "work_from_home" AND input.wfhRequest.dayFraction == 0.5 AND input.attendanceLog.exists(input.date) AND NOT timeRangesOverlap(input.wfhRequest.timeRange, input.attendanceLog.timeRange) AND NOT attendanceDayFractions.has(input.date)_
    - _Expected_Behavior: For any date where an employee has an approved partial-day WFH request (0.5 days) and physical attendance for the complementary time period (0.5 days) with no time overlap, the payroll calculation SHALL count this as 1 full working day (0.5 WFH + 0.5 physical attendance)_
    - _Preservation: Full-day WFH, full-day attendance, half-day leave, overtime, makeup work, and holiday calculations must remain unchanged_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 3.2 Apply the same fix to recalculate-single.ts
    - Replicate the fix from generate-payroll.ts to maintain consistency
    - Ensure recalculation produces same result as initial generation
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 3.3 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Partial-Day WFH Combined with Physical Attendance
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.4 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Partial-Day-WFH Behavior
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
