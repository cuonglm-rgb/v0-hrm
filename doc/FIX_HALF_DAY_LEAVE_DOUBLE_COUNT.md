# Fix: Half-Day Leave Double Counting Issue

## Problem Description

Employee Hoàng Phan Tuấn (00002) for March 2026 shows:
- Standard working days: 24 days (31 - 5 Sundays - 2 Saturdays)
- Attendance logs: 19 days
- Company holidays added: 4 days
- **Working days shown: 23 days**
- Paid leave: 3 days
- **Total: 26 days (exceeds 24 standard days!)**

The employee has 4 approved half-day leave requests (0.5 days each = 2 days total), but these are not being properly reflected in the displayed working days count.

## Root Cause Analysis

The issue is a **double-counting problem** when an employee has half-day leave requests:

### Scenario:
Employee has 4 days where they:
- Submitted a 0.5-day leave request (e.g., morning leave)
- Worked the other half (e.g., afternoon) and checked in/out

### What happens in the code:

1. **Attendance counting** (`lib/actions/payroll/generate-payroll.ts` ~line 300-350):
   - System counts attendance logs: 19 days (including the 4 half-work days)
   - Each day with check_in/check_out = 1 full day in `workingDaysCount`
   - Result: `workingDaysCount` = 19 + 4 company holidays = 23 days

2. **Leave counting** (`processLeaveRequests` function ~line 623-856):
   - System processes the 4 half-day leave requests (0.5 × 4 = 2 days)
   - These are added to `paidLeaveDays`
   - Result: `paidLeaveDays` = 3 days (includes the 2 days from half-day leaves)

3. **Violation detection** (`lib/actions/payroll/violations.ts`):
   - System checks for `isHalfDay` violations (checkout before lunch break)
   - BUT: Days with approved leave requests are NOT flagged as violations
   - Result: `halfDays` = 0 (no violations detected)

4. **Final calculation** (~line 470):
   ```typescript
   const halfDays = violationsWithoutOT.filter((v) => v.isHalfDay && !v.isAbsent).length
   // halfDays = 0 (because approved requests prevent violation detection)
   
   const actualAttendanceDays = workingDaysCount - (halfDays * 0.5) + consumed_days
   // = 23 - 0 + 0 = 23 days (WRONG! Should be 21)
   ```

### The Problem:
- Attendance: 23 days (includes 4 days counted as full days, but should be 2 days)
- Paid leave: 3 days (includes 2 days from the half-day leaves)
- **Total: 26 days** (exceeds 24 standard days!)
- **Double-counted: 2 days** (the half-day leaves are counted in both attendance AND leave)

The system is counting:
- 1 full day of attendance for days with half-day work
- PLUS 0.5 day of paid leave for the same days
- = 1.5 days per half-day leave day (should be 1 day total)

## Correct Breakdown

For employee 00002 in March 2026:
- 19 attendance days (with check-in/check-out)
- 4 of those days were half-day work (4 × 0.5 = 2 days deduction)
- **Actual attendance: 17 days** (19 - 2)
- Paid leave: 3 days
- Company holidays: 4 days
- **Total working days for salary: 24 days** ✓

## Solution

The fix requires modifying how `workingDaysCount` is calculated when there are half-day leave requests. We need to:

1. **Identify days with half-day leave requests** before counting attendance
2. **Count those days as 0.5 instead of 1.0** in `workingDaysCount`
3. **Keep the leave counting as-is** (already correct)

### Implementation Steps:

In `lib/actions/payroll/generate-payroll.ts`, around line 300-350, after building the `leaveDates` set, we need to also build a `halfDayLeaveDates` map:

```typescript
// After building leaveDates set, add this:
const halfDayLeaveDates = new Map<string, number>() // date -> fraction (0.5)

if (employeeRequests) {
  for (const request of employeeRequests) {
    const reqType = request.request_type as any
    if (!reqType || reqType.code === "overtime") continue
    if ((MAKEUP_CODES as readonly string[]).includes(reqType.code)) continue
    
    // Check if this is a half-day leave
    if (reqType.requires_single_date && request.request_date) {
      const dayFraction = calculateMultiSlotDayFraction(request)
      if (dayFraction === 0.5) {
        halfDayLeaveDates.set(request.request_date, 0.5)
      }
    } else if (reqType.requires_date_range && request.from_date && request.to_date) {
      const parseDate = (dateStr: string) => {
        const [y, m, d] = dateStr.split('-').map(Number)
        return new Date(Date.UTC(y, m - 1, d))
      }
      const reqFromDate = parseDate(request.from_date)
      const reqToDate = parseDate(request.to_date)
      const periodStart = parseDate(startDate)
      const periodEnd = parseDate(endDate)
      const reqStart = new Date(Math.max(reqFromDate.getTime(), periodStart.getTime()))
      const reqEnd = new Date(Math.min(reqToDate.getTime(), periodEnd.getTime()))
      const diffTime = reqEnd.getTime() - reqStart.getTime()
      const fullDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
      
      if (fullDays === 1) {
        const dayFraction = calculateMultiSlotDayFraction(request)
        if (dayFraction === 0.5) {
          halfDayLeaveDates.set(request.from_date, 0.5)
        }
      }
    }
  }
}
```

Then, when counting attendance (around line 320-340), adjust for half-day leaves:

```typescript
// Đếm ngày công (ngày làm bù full_day_makeup KHÔNG tăng working days — chỉ dùng để consume deficit)
let workingDaysCount = 0
const countedDates = new Set<string>()
const attendanceDates = new Set<string>()
if (allAttendanceLogs) {
  for (const log of allAttendanceLogs) {
    const logDate = log.check_in ? toDateStringVN(log.check_in) : toDateStringVN(log.check_out)
    attendanceDates.add(logDate)
    if (makeupDates.has(logDate)) continue
    if (!overtimeDates.has(logDate) && !countedDates.has(logDate)) {
      // Check if this day has a half-day leave request
      const halfDayFraction = halfDayLeaveDates.get(logDate)
      if (halfDayFraction) {
        // Count as 0.5 day (the other 0.5 is in paidLeaveDays)
        workingDaysCount += 0.5
      } else {
        // Count as full day
        workingDaysCount++
      }
      countedDates.add(logDate)
    }
  }
}
```

### Expected Result:

After the fix:
- 15 full attendance days = 15 days
- 4 half attendance days (with 0.5 leave each) = 2 days
- 4 company holidays = 4 days
- **Total attendance: 21 days**
- Paid leave: 3 days (includes 2 days from half-day leaves)
- **Total working days for salary: 24 days** ✓

### Additional Logging:

Add clearer logging to show the breakdown:

```typescript
console.log(`📊 Ngày công từ chấm công:`)
console.log(`   - Full days: ${fullDayCount} ngày`)
console.log(`   - Half days: ${halfDayCount} ngày (= ${halfDayCount * 0.5} ngày công)`)
console.log(`   - Tổng: ${workingDaysCount} ngày`)
```


## Implementation Status

✅ **FIXED** - The fix has been implemented in both files:
1. `lib/actions/payroll/generate-payroll.ts` (tính lương hàng loạt)
2. `lib/actions/payroll/recalculate-single.ts` (tính lương cá nhân)

### Changes Made:

**Trong cả 2 files (`generate-payroll.ts` và `recalculate-single.ts`):**

1. **Added `calculateRequestDayFraction` helper function**:
   - Tính toán xem phiếu nghỉ là 0.5 hay 1.0 ngày
   - Sử dụng giờ ca làm việc và giờ nghỉ trưa để xác định nghỉ buổi sáng/chiều

2. **Added `halfDayLeaveDates` Map**:
   - Theo dõi những ngày nào có phiếu nghỉ nửa ngày
   - Map từ ngày (string) sang 0.5 cho nghỉ nửa ngày

3. **Updated attendance counting logic**:
   - Kiểm tra mỗi ngày chấm công có phiếu nghỉ nửa ngày không
   - Tính 0.5 ngày cho attendance nửa ngày (0.5 còn lại đã tính trong paidLeaveDays)
   - Tính 1.0 ngày cho attendance cả ngày
   - Theo dõi riêng `fullDayCount` và `halfDayAttendanceCount`

4. **Enhanced logging**:
   - Hiển thị chi tiết full days vs half days
   - Làm rõ cách tính số ngày công

### Test Case:

For employee 00002 in March 2026, the system will now show:
```
📊 Ngày công từ chấm công (trừ ngày làm bù):
   - Full days: 15 ngày
   - Half days: 4 ngày (= 2 ngày công)
   - Tổng: 17 ngày
```

Plus:
- Company holidays: 4 days
- **Total attendance: 21 days**
- Paid leave: 3 days (includes 2 days from the 4 half-day leaves)
- **Total working days for salary: 24 days** ✓

### Verification:

Để xác nhận fix hoạt động đúng:

**1. Tính lương hàng loạt (Generate Payroll):**
   - Vào trang Payroll
   - Chọn tháng 3/2026
   - Click "Generate Payroll"
   - Kiểm tra nhân viên 00002

**2. Tính lương cá nhân (Recalculate Single):**
   - Vào chi tiết bảng lương tháng 3/2026
   - Tìm nhân viên 00002
   - Click "Recalculate" (nếu có)
   - Kiểm tra kết quả

**3. Xác nhận kết quả:**
   - Working days = 21 ngày (không phải 23)
   - Paid leave = 3 ngày
   - Tổng = 24 ngày (đúng bằng công chuẩn)
   - Log hiển thị:
     ```
     📊 Ngày công từ chấm công (trừ ngày làm bù):
        - Full days: 15 ngày
        - Half days: 4 ngày (= 2 ngày công)
        - Tổng: 17 ngày
     ```
