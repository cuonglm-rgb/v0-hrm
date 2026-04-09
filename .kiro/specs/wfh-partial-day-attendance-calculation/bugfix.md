# Bugfix Requirements Document

## Introduction

When an employee has an approved WFH (Work From Home) request for part of a day (morning or afternoon shift) and physically checks in for the other part of the day, the system currently only counts the physical attendance portion (0.5 days) and fails to recognize the WFH portion. This results in incorrect working days calculation, showing 0.5 days instead of the expected 1 full working day.

**Impact**: Employees who split their day between WFH and office attendance are undercounted in payroll calculations, leading to incorrect salary payments.

**Example Case**: Employee Nguyễn Thị Thương (00149) on 2026-03-12:
- Approved WFH request: morning shift (08:00-12:00)
- Physical attendance: checked in at 13:14, checked out at 17:50 (afternoon shift)
- Current result: 0.5 days
- Expected result: 1.0 full working day

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN an employee has an approved WFH request for morning shift (e.g., 08:00-12:00) AND physically checks in for afternoon shift (e.g., 13:14-17:50) on the same date THEN the system counts only 0.5 days (physical attendance portion) instead of 1 full day

1.2 WHEN an employee has an approved WFH request for afternoon shift (e.g., 13:00-17:00) AND physically checks in for morning shift (e.g., 08:00-12:00) on the same date THEN the system counts only 0.5 days (physical attendance portion) instead of 1 full day

1.3 WHEN the WFH calculation logic checks `attendanceDayFractions` map for a date with partial WFH THEN the map does not contain that date because it only tracks dates with half-day leave requests, not WFH requests

### Expected Behavior (Correct)

2.1 WHEN an employee has an approved WFH request for morning shift AND physically checks in for afternoon shift on the same date AND the WFH time range does NOT overlap with physical attendance time THEN the system SHALL count this as 1 full working day (0.5 WFH + 0.5 physical attendance)

2.2 WHEN an employee has an approved WFH request for afternoon shift AND physically checks in for morning shift on the same date AND the WFH time range does NOT overlap with physical attendance time THEN the system SHALL count this as 1 full working day (0.5 physical attendance + 0.5 WFH)

2.3 WHEN the WFH calculation logic processes a partial-day WFH request THEN the system SHALL correctly identify the physical attendance fraction for that date and add the complementary WFH fraction to reach 1 full day

2.4 WHEN an employee has a WFH request that overlaps with physical attendance time THEN the system SHALL NOT double-count and SHALL prioritize physical attendance over WFH for the overlapping period

2.5 WHEN an employee submits a WFH request AFTER already checking in for that time period THEN the system SHALL NOT count the WFH portion to avoid double counting

### Unchanged Behavior (Regression Prevention)

3.1 WHEN an employee has a full-day WFH request (08:00-17:00) with no physical attendance THEN the system SHALL CONTINUE TO count this as 1 full working day

3.2 WHEN an employee has physical attendance for a full day with no WFH request THEN the system SHALL CONTINUE TO count this as 1 full working day

3.3 WHEN an employee has a half-day leave request (not WFH) with physical attendance for the other half THEN the system SHALL CONTINUE TO count this correctly as 1 full working day (0.5 leave + 0.5 attendance)

3.4 WHEN an employee has a full-day overtime request THEN the system SHALL CONTINUE TO exclude that date from regular working days calculation

3.5 WHEN an employee has a makeup work request (full_day_makeup) THEN the system SHALL CONTINUE TO handle consumed deficit days correctly without affecting regular working days count

3.6 WHEN calculating payroll for dates with company holidays or public holidays THEN the system SHALL CONTINUE TO apply existing holiday calculation rules correctly
