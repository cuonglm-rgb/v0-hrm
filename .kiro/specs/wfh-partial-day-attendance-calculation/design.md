# WFH Partial-Day Attendance Calculation Bugfix Design

## Overview

This bugfix addresses an issue where employees who have an approved WFH (Work From Home) request for part of a day (morning or afternoon shift) and physically check in for the other part of the day are only credited with 0.5 working days instead of the expected 1 full working day. The root cause is that the WFH calculation logic checks the `attendanceDayFractions` map to determine if there's partial attendance on a date, but this map only tracks dates with half-day leave requests, not dates with partial-day WFH requests. The fix will ensure that partial-day WFH requests are properly combined with physical attendance to count as a full working day.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when an employee has a partial-day WFH request and physical attendance for the complementary time period on the same date
- **Property (P)**: The desired behavior - the system should count partial WFH + partial attendance as 1 full working day
- **Preservation**: Existing full-day WFH, full-day attendance, and half-day leave calculations that must remain unchanged by the fix
- **processLeaveRequests**: The function in `lib/actions/payroll/generate-payroll.ts` that processes leave and WFH requests and calculates working days
- **attendanceDayFractions**: A Map<string, number> that tracks the fraction of a day (0.5 or 1.0) that an employee physically attended, used to avoid double-counting when combining attendance with WFH
- **workFromHomeDays**: The accumulated count of WFH days that should be added to working days calculation

## Bug Details

### Bug Condition

The bug manifests when an employee has an approved partial-day WFH request (morning or afternoon shift) and physical attendance for the complementary time period on the same date. The `processLeaveRequests` function checks `attendanceDayFractions` to determine if there's partial attendance, but this map is only populated with dates that have half-day leave requests, not dates with partial-day WFH requests.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { wfhRequest: Request, attendanceLog: AttendanceLog, date: string }
  OUTPUT: boolean
  
  RETURN input.wfhRequest.type == "work_from_home"
         AND input.wfhRequest.dayFraction == 0.5
         AND input.attendanceLog.exists(input.date)
         AND NOT timeRangesOverlap(input.wfhRequest.timeRange, input.attendanceLog.timeRange)
         AND NOT attendanceDayFractions.has(input.date)
END FUNCTION
```

### Examples

- **Example 1**: Employee Nguyễn Thị Thương (00149) on 2026-03-12
  - Approved WFH request: morning shift (08:00-12:00) = 0.5 days
  - Physical attendance: checked in at 13:14, checked out at 17:50 (afternoon shift) = 0.5 days
  - Current result: 0.5 days (only physical attendance counted)
  - Expected result: 1.0 full working day (0.5 WFH + 0.5 attendance)

- **Example 2**: Employee with afternoon WFH
  - Approved WFH request: afternoon shift (13:00-17:00) = 0.5 days
  - Physical attendance: checked in at 08:00, checked out at 12:00 (morning shift) = 0.5 days
  - Current result: 0.5 days (only physical attendance counted)
  - Expected result: 1.0 full working day (0.5 attendance + 0.5 WFH)

- **Example 3**: Employee with full-day WFH (no bug)
  - Approved WFH request: full day (08:00-17:00) = 1.0 day
  - No physical attendance
  - Current result: 1.0 day (correct)
  - Expected result: 1.0 day (unchanged)

- **Edge Case**: Employee with overlapping WFH and attendance
  - Approved WFH request: morning shift (08:00-12:00)
  - Physical attendance: checked in at 10:00, checked out at 17:00 (overlaps with WFH)
  - Expected behavior: Should not double-count the overlapping period (10:00-12:00)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Full-day WFH requests (08:00-17:00) with no physical attendance must continue to count as 1 full working day
- Full-day physical attendance with no WFH request must continue to count as 1 full working day
- Half-day leave requests (not WFH) with physical attendance for the other half must continue to count correctly as 1 full working day (0.5 leave + 0.5 attendance)
- Full-day overtime requests must continue to exclude that date from regular working days calculation
- Makeup work requests (full_day_makeup) must continue to handle consumed deficit days correctly without affecting regular working days count
- Company holidays and public holidays must continue to apply existing holiday calculation rules correctly

**Scope:**
All inputs that do NOT involve partial-day WFH combined with physical attendance should be completely unaffected by this fix. This includes:
- Full-day WFH requests
- Full-day physical attendance
- Half-day leave requests (annual leave, sick leave, etc.)
- Overtime requests
- Makeup work requests
- Holiday calculations

## Hypothesized Root Cause

Based on the bug description and code analysis, the root cause is:

1. **Incomplete attendanceDayFractions Map**: The `attendanceDayFractions` map is only populated when processing attendance logs in combination with half-day leave requests. It does not account for dates where there might be partial-day WFH requests.

2. **WFH Calculation Logic Dependency**: In `processLeaveRequests`, the WFH calculation checks `attendanceDayFractions.has(requestDate)` to determine if there's partial attendance. If the date is not in the map, it assumes no attendance and adds the full WFH day fraction. However, for partial-day WFH, the date should be in the map but isn't.

3. **Timing Issue**: The `attendanceDayFractions` map is built during attendance log processing (before `processLeaveRequests` is called), but at that point, the system only knows about half-day leave requests, not about WFH requests that will be processed later.

4. **Missing WFH-Aware Attendance Tracking**: The attendance counting logic needs to be aware of partial-day WFH requests when building the `attendanceDayFractions` map, or the WFH calculation needs an alternative way to detect partial attendance.

## Correctness Properties

Property 1: Bug Condition - Partial-Day WFH Combined with Physical Attendance

_For any_ date where an employee has an approved partial-day WFH request (0.5 days) and physical attendance for the complementary time period (0.5 days) with no time overlap, the fixed payroll calculation SHALL count this as 1 full working day (0.5 WFH + 0.5 physical attendance).

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Non-Partial-Day-WFH Behavior

_For any_ payroll calculation that does NOT involve partial-day WFH combined with physical attendance (full-day WFH, full-day attendance, half-day leave, overtime, makeup work, holidays), the fixed code SHALL produce exactly the same working days count as the original code, preserving all existing calculation logic.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `lib/actions/payroll/generate-payroll.ts`

**Function**: `processEmployeePayroll` (attendance counting section) and `processLeaveRequests`

**Specific Changes**:

1. **Pass WFH Request Information to Attendance Counting**: Before counting attendance, query approved WFH requests for the period and identify dates with partial-day WFH requests.

2. **Update attendanceDayFractions Map**: When building the `attendanceDayFractions` map during attendance log processing, check if each date has a partial-day WFH request. If it does, and there's physical attendance, calculate the attendance fraction based on the WFH time range.

3. **Alternative Approach - Pass WFH Dates to processLeaveRequests**: Instead of modifying attendance counting, pass a set of dates with partial-day WFH requests to `processLeaveRequests`, and use this information when calculating `wfhToAdd`.

4. **Validate Non-Overlap**: Ensure that the WFH time range and physical attendance time range do not overlap to prevent double-counting.

5. **Update recalculate-single.ts**: Apply the same fix to `lib/actions/payroll/recalculate-single.ts` to maintain consistency between initial payroll generation and recalculation.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Create test scenarios with partial-day WFH requests combined with physical attendance. Run payroll calculation on the UNFIXED code and verify that working days count is incorrect (0.5 instead of 1.0). Examine the `attendanceDayFractions` map and `workFromHomeDays` calculation to confirm the root cause.

**Test Cases**:
1. **Morning WFH + Afternoon Attendance**: Employee has morning WFH (08:00-12:00) and afternoon attendance (13:14-17:50) - will show 0.5 days on unfixed code
2. **Afternoon WFH + Morning Attendance**: Employee has afternoon WFH (13:00-17:00) and morning attendance (08:00-12:00) - will show 0.5 days on unfixed code
3. **Partial WFH + Full Day Attendance**: Employee has morning WFH (08:00-12:00) but also full-day attendance (08:00-17:00) - should not double-count, may show incorrect result on unfixed code
4. **Multiple Employees Same Day**: Multiple employees with different partial-day WFH patterns on the same date - will show 0.5 days for each on unfixed code

**Expected Counterexamples**:
- Working days count is 0.5 instead of 1.0 for dates with partial-day WFH + complementary attendance
- `attendanceDayFractions` map does not contain dates with partial-day WFH (only contains dates with half-day leave)
- `workFromHomeDays` calculation adds 0 days instead of 0.5 days for partial-day WFH with attendance

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := calculatePayroll_fixed(input)
  ASSERT result.workingDays == 1.0
  ASSERT result.workFromHomeDays + result.attendanceDays == 1.0
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT calculatePayroll_original(input).workingDays = calculatePayroll_fixed(input).workingDays
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for full-day WFH, full-day attendance, half-day leave, and other scenarios, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Full-Day WFH Preservation**: Observe that full-day WFH (08:00-17:00) counts as 1.0 day on unfixed code, then verify this continues after fix
2. **Full-Day Attendance Preservation**: Observe that full-day attendance counts as 1.0 day on unfixed code, then verify this continues after fix
3. **Half-Day Leave Preservation**: Observe that half-day leave + half-day attendance counts as 1.0 day on unfixed code, then verify this continues after fix
4. **Overtime Exclusion Preservation**: Observe that full-day overtime excludes the date from working days on unfixed code, then verify this continues after fix
5. **Makeup Work Preservation**: Observe that makeup work requests handle consumed deficit days correctly on unfixed code, then verify this continues after fix
6. **Holiday Calculation Preservation**: Observe that company holidays and public holidays are calculated correctly on unfixed code, then verify this continues after fix

### Unit Tests

- Test partial-day WFH (morning) + afternoon attendance = 1.0 working day
- Test partial-day WFH (afternoon) + morning attendance = 1.0 working day
- Test full-day WFH + no attendance = 1.0 working day (preservation)
- Test no WFH + full-day attendance = 1.0 working day (preservation)
- Test half-day leave + half-day attendance = 1.0 working day (preservation)
- Test edge case: overlapping WFH and attendance time ranges (should not double-count)
- Test edge case: WFH request submitted after attendance (should not double-count)

### Property-Based Tests

- Generate random combinations of WFH requests and attendance logs across multiple dates and verify working days count is correct
- Generate random full-day scenarios (full-day WFH, full-day attendance, full-day leave) and verify preservation of existing behavior
- Generate random half-day leave scenarios and verify preservation of existing behavior
- Test that total working days never exceeds standard working days for the month

### Integration Tests

- Test full payroll generation for a month with multiple employees having various partial-day WFH patterns
- Test payroll recalculation (recalculate-single.ts) produces same result as initial generation
- Test that payroll breakdown dialog displays correct working days breakdown (attendance + WFH)
- Test that payroll logs show correct calculation details for partial-day WFH scenarios
