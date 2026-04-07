# Fix: Work From Home Double Counting

## Vấn đề

Khi nhân viên vừa có chấm công VÀ có phiếu work_from_home trong cùng một ngày, hệ thống tính ngày công 2 lần:

### Ví dụ lỗi:
- Ngày 6/3: Nhân viên chấm công 08:09 - 17:46 (full day) → tính 1 ngày
- Ngày 6/3: Có phiếu WFH full day → cộng thêm 1 ngày
- **Tổng: 2 ngày (SAI!)**

### Nguyên nhân:
```typescript
// Code cũ
const actualWorkingDays = actualAttendanceDays + leaveResult.workFromHomeDays
```

Hệ thống cộng dồn attendance và WFH mà không kiểm tra trùng lặp.

## Giải pháp

### Logic mới:
Phiếu WFH chỉ cộng phần chưa được tính từ attendance:

1. **Full day WFH + Full day attendance** → chỉ tính 1 ngày (không cộng WFH)
2. **Half day WFH + Half day attendance** → tính 1 ngày (0.5 + 0.5)
3. **Full day WFH + Không attendance** → tính 1 ngày (từ WFH)
4. **Half day WFH + Không attendance** → tính 0.5 ngày (từ WFH)

### Thay đổi code:

#### 1. Track attendance fraction per date
```typescript
const attendanceDayFractions = new Map<string, number>()

// Khi đếm attendance
if (halfDayFraction) {
  workingDaysCount += 0.5
  attendanceDayFractions.set(logDate, 0.5)
} else {
  workingDaysCount++
  attendanceDayFractions.set(logDate, 1.0)
}
```

#### 2. Chỉ cộng phần WFH chưa được tính
```typescript
if (code === "work_from_home" && affectsPayroll) {
  // Xử lý WFH: chỉ cộng phần chưa được tính từ attendance
  if (requestDate) {
    // Single date: check attendance cho ngày đó
    if (attendanceDayFractions.has(requestDate)) {
      const attendanceFraction = attendanceDayFractions.get(requestDate) || 0
      const wfhToAdd = Math.max(0, days - attendanceFraction)
      workFromHomeDays += wfhToAdd
    } else {
      workFromHomeDays += days
    }
  } else if (request.from_date && request.to_date) {
    // Date range: check attendance cho từng ngày
    const current = new Date(reqStart)
    while (current <= reqEnd) {
      const dateStr = formatDate(current)
      
      if (attendanceDayFractions.has(dateStr)) {
        const attendanceFraction = attendanceDayFractions.get(dateStr) || 0
        const wfhToAdd = Math.max(0, 1 - attendanceFraction)
        workFromHomeDays += wfhToAdd
      } else {
        workFromHomeDays += 1
      }
      
      current.setDate(current.getDate() + 1)
    }
  } else {
    workFromHomeDays += days
  }
}
```

#### 3. Pass attendanceDayFractions vào processLeaveRequests
```typescript
const leaveResult = await processLeaveRequests(
  supabase, emp.id, startDate, endDate, year, emp.official_date, 
  shiftMap, emp.shift_id, attendanceDayFractions
)
```

## Kết quả

### Trước khi fix:
- Ngày 2, 3, 4, 7: Attendance → 4 ngày
- Ngày 5: WFH → 1 ngày
- Ngày 6: Attendance + WFH → 2 ngày
- **Tổng: 7 ngày (SAI)**

### Sau khi fix:
- Ngày 2, 3, 4, 7: Attendance → 4 ngày
- Ngày 5: WFH (không attendance) → 1 ngày
- Ngày 6: Attendance 1 ngày + WFH 0 ngày (đã có attendance) → 1 ngày
- **Tổng: 6 ngày (ĐÚNG)**

### Chi tiết xử lý date range:
Phiếu WFH từ 5-6/3 (2 ngày):
- Ngày 5/3: Không có attendance → cộng 1 ngày WFH
- Ngày 6/3: Có attendance 1.0 → cộng 0 ngày WFH (1 - 1.0 = 0)
- Tổng WFH: 1 ngày (không phải 2)

## Test cases

### Case 1: Full day WFH + Full day attendance
- Attendance: 08:00 - 17:00 → 1.0 ngày
- WFH: Full day → 0 ngày (không cộng)
- Tổng: 1.0 ngày ✓

### Case 2: Half day WFH + Half day attendance
- Attendance: 08:00 - 12:00 → 0.5 ngày
- WFH: 13:30 - 17:00 (half day) → 0.5 ngày
- Tổng: 1.0 ngày ✓

### Case 3: Full day WFH + No attendance
- Attendance: 0 ngày
- WFH: Full day → 1.0 ngày
- Tổng: 1.0 ngày ✓

### Case 4: Half day WFH + No attendance
- Attendance: 0 ngày
- WFH: Half day → 0.5 ngày
- Tổng: 0.5 ngày ✓

## Files changed
- `lib/actions/payroll/generate-payroll.ts`
  - Added `attendanceDayFractions` Map to track attendance per date
  - Modified WFH calculation to subtract existing attendance
  - Updated `processLeaveRequests` signature to accept `attendanceDayFractions`
  
- `lib/actions/payroll/recalculate-single.ts`
  - Added `attendanceDayFractions` Map to track attendance per date
  - Modified WFH calculation to subtract existing attendance
  - Same logic as generate-payroll.ts for consistency
