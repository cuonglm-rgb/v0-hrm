# Auto Unpaid Leave Calculation Feature

## Overview
Automatically calculate unpaid leave days for employees who have missing attendance without leave requests.

## Business Logic

### Three Scenarios:
1. **No attendance, no unpaid leave request** → Auto unpaid leave
2. **Has unpaid leave request** → Count as unpaid leave (from request)
3. **Both no attendance AND unpaid leave request** → Count once (avoid duplicate)

### Formula:
```
totalAccountedDays = actualWorkingDays + paidLeaveDays + unpaidLeaveDays + absentDays
autoUnpaidLeaveDays = max(0, STANDARD_WORKING_DAYS - totalAccountedDays)
finalUnpaidLeaveDays = unpaidLeaveDays + autoUnpaidLeaveDays
```

### Example:
- Standard working days: 24 days
- Employee has 0 attendance
- Employee has 0 leave requests
- Result: Auto unpaid leave = 24 days

## Implementation

### Files Modified:
1. `lib/actions/payroll/recalculate-single.ts`
2. `lib/actions/payroll/generate-payroll.ts`

### Changes:

#### 1. Auto Calculation Logic
Added calculation for auto unpaid leave days based on missing days:
```typescript
const totalAccountedDays = actualWorkingDays + paidLeaveDays + unpaidLeaveDays + absentDays
const autoUnpaidLeaveDays = Math.max(0, STANDARD_WORKING_DAYS - totalAccountedDays)
const finalUnpaidLeaveDays = unpaidLeaveDays + autoUnpaidLeaveDays
```

#### 2. Enhanced Logging
Added detailed logging to show breakdown:
- Nghỉ không lương (có phiếu): Manual unpaid leave from requests
- Nghỉ không lương (tự động): Auto-calculated unpaid leave
- Nghỉ không lương (tổng): Total unpaid leave

#### 3. Database Save
Changed from saving `unpaidLeaveDays + absentDays` to just `finalUnpaidLeaveDays`:
```typescript
unpaid_leave_days: finalUnpaidLeaveDays  // Instead of finalUnpaidLeaveDays + absentDays
```

#### 4. Summary Section
Added comprehensive summary showing:
- Công chuẩn (standard days)
- Ngày công thực tế (actual working days)
- Nghỉ phép có lương (paid leave)
- Nghỉ không lương breakdown (manual + auto)
- Vắng mặt (absent days)
- Tổng và so sánh với công chuẩn

## Bug Fixes

### 1. Build Error - Duplicate Variable Declaration
**Issue**: `originalConsoleLog` was declared multiple times
**Fix**: Removed duplicate declaration at line 641 in `recalculate-single.ts`

### 2. Variable Name Error
**Issue**: Used `totalDays` instead of `totalAllDays` in logging section
**Fix**: Changed all instances to use correct variable name `totalAllDays`

### 3. Incorrect Database Save
**Issue**: Saved `finalUnpaidLeaveDays + absentDays` which double-counted absent days
**Fix**: Changed to save only `finalUnpaidLeaveDays`

## Testing Scenarios

### Scenario 1: No Attendance, No Request
- Input: 0 attendance, 0 requests
- Expected: Unpaid leave = 24 days (all standard days)

### Scenario 2: Has Unpaid Leave Request
- Input: 0 attendance, 5 days unpaid leave request
- Expected: Unpaid leave = 24 days (5 manual + 19 auto)

### Scenario 3: Partial Attendance
- Input: 10 days attendance, 0 requests
- Expected: Unpaid leave = 14 days (24 - 10)

### Scenario 4: Attendance + Paid Leave
- Input: 10 days attendance, 5 days paid leave, 0 unpaid requests
- Expected: Unpaid leave = 9 days (24 - 10 - 5)

## Log Output Example

```
📊 TỔNG KẾT:
- Công chuẩn: 24 ngày
- Ngày công thực tế: 0 ngày
- Nghỉ phép có lương: 0 ngày
- Nghỉ không lương (có phiếu): 0 ngày
- Nghỉ không lương (tự động): 24 ngày
- Nghỉ không lương (tổng): 24 ngày
- Vắng mặt: 0 ngày
- Tổng: 24 ngày
✅ Đủ công chuẩn
```

## Notes

- Auto unpaid leave only fills the gap between accounted days and standard days
- If employee has unpaid leave request for specific days, those are counted first
- Auto calculation prevents duplicate counting
- Absent days are tracked separately and not added to unpaid leave
