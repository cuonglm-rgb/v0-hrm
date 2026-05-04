# Fix: Trùng lặp tính công khi có cả chấm công và phiếu nghỉ

## Vấn đề

Khi nhân viên có cả chấm công và phiếu nghỉ (paid leave hoặc unpaid leave) trong cùng một ngày, hệ thống tính cả hai vào tổng ngày công, dẫn đến vượt công chuẩn.

### Ví dụ cụ thể

**Nhân viên:** Trịnh Thanh Hiền (00026)  
**Tháng:** 04/2026  
**Công chuẩn:** 24 ngày

**Trường hợp lỗi:**

1. **Ngày 2026-04-01:**
   - Có chấm công: 13:02 - 18:33 (0.5 ngày - chỉ làm ca chiều)
   - Có phiếu `unpaid_leave` (0.5 ngày)
   - **Kết quả:** Cả 2 đều được cộng → 1 ngày (SAI!)

2. **Ngày 2026-04-15:**
   - Có chấm công: 13:24 - 17:07 (0.5 ngày - chỉ làm ca chiều)
   - Có phiếu `annual_leave` (0.5 ngày)
   - **Kết quả:** Cả 2 đều được cộng → 1 ngày (SAI!)

**Tổng kết:**
```
Công thức: actualWorkingDays + consumed_days + paidLeaveDays + unpaidLeaveDays
         = 24 + 0 + 0.5 + 0.5
         = 25 ngày

⚠️ Vượt 1 ngày so với công chuẩn (24 ngày)
```

## Nguyên nhân

Trong hàm `processLeaveRequests`, logic xử lý phiếu nghỉ không kiểm tra xem ngày đó đã có attendance hay chưa trước khi cộng vào `paidLeaveDays` hoặc `unpaidLeaveDays`.

**Code cũ (SAI):**
```typescript
if (code === "unpaid_leave") {
  unpaidLeaveDays += days  // ❌ Không kiểm tra attendance
} else if (affectsPayroll) {
  paidLeaveDays += days    // ❌ Không kiểm tra attendance
}
```

Chỉ có `work_from_home` mới có logic kiểm tra `attendanceDayFractions` để tránh trùng lặp.

## Giải pháp

Áp dụng logic tương tự như `work_from_home` cho tất cả các loại phiếu nghỉ:

1. **Kiểm tra attendance trước khi cộng leave days**
2. **Chỉ cộng phần chưa được tính từ attendance**

**Code mới (ĐÚNG):**
```typescript
const addLeaveDaysWithAttendanceCheck = (
  daysToAdd: number,
  dateStr: string | null,
  fromDate: string | null,
  toDate: string | null,
  leaveType: 'paid' | 'unpaid'
) => {
  if (dateStr) {
    // Single date: check attendance cho ngày đó
    if (attendanceDayFractions.has(dateStr)) {
      const attendanceFraction = attendanceDayFractions.get(dateStr) || 0
      // Leave to add = requested days - attendance fraction
      const leaveToAdd = Math.max(0, daysToAdd - attendanceFraction)
      if (leaveType === 'paid') {
        paidLeaveDays += leaveToAdd
      } else {
        unpaidLeaveDays += leaveToAdd
      }
    } else {
      // No attendance, add full leave days
      if (leaveType === 'paid') {
        paidLeaveDays += daysToAdd
      } else {
        unpaidLeaveDays += daysToAdd
      }
    }
  } else if (fromDate && toDate) {
    // Date range: check attendance cho từng ngày
    // ... (xử lý từng ngày trong range)
  }
}

if (code === "unpaid_leave") {
  addLeaveDaysWithAttendanceCheck(days, requestDate, request.from_date, request.to_date, 'unpaid')
} else if (affectsPayroll) {
  addLeaveDaysWithAttendanceCheck(days, requestDate, request.from_date, request.to_date, 'paid')
}
```

## Kết quả sau khi sửa

**Ngày 2026-04-01:**
- Attendance: 0.5 ngày
- Unpaid leave request: 0.5 ngày
- **Tính:** 0.5 (attendance) + max(0, 0.5 - 0.5) = 0.5 ngày ✅

**Ngày 2026-04-15:**
- Attendance: 0.5 ngày
- Paid leave request: 0.5 ngày
- **Tính:** 0.5 (attendance) + max(0, 0.5 - 0.5) = 0.5 ngày ✅

**Tổng kết:**
```
Công thức: 22 + 0 + 0 + 0
         = 22 ngày

✅ Đúng công chuẩn (24 ngày) - sau khi cộng ngày lễ và ngày nghỉ công ty
```

## Files đã sửa

1. `lib/actions/payroll/generate-payroll.ts` - Hàm `processLeaveRequests`
2. `lib/actions/payroll/recalculate-single.ts` - Logic xử lý leave tương tự

## Quy tắc mới

**Ưu tiên attendance trước phiếu nghỉ:**
- Nếu có chấm công → tính attendance, chỉ cộng phần còn lại từ phiếu nghỉ
- Nếu không có chấm công → tính toàn bộ phiếu nghỉ

**Áp dụng cho:**
- ✅ Paid leave (annual_leave, sick_leave, etc.)
- ✅ Unpaid leave
- ✅ Work from home (đã có từ trước)

## Testing

Cần test các trường hợp:

1. ✅ Có attendance + có leave cùng ngày (half-day mỗi loại)
2. ✅ Có attendance full day + có leave request → chỉ tính attendance
3. ✅ Không có attendance + có leave request → tính leave
4. ✅ Có attendance half-day + có leave half-day → tổng = 1 ngày
5. ✅ Date range leave với một số ngày có attendance

## Ngày sửa

2026-05-04
