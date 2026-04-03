# Fix: Trừ 2 lần ngày nghỉ không lương trong tính phụ cấp

## Vấn đề

Khi tính phụ cấp ăn trưa (hoặc các phụ cấp khác có `calculation_type = "daily"`), hệ thống đang trừ 2 lần ngày nghỉ không lương:

1. **Lần 1**: Ngày có phiếu `unpaid_leave` vẫn được đếm vào `allowanceFullDays` hoặc `allowanceViolations` nếu nhân viên có chấm công trong ngày đó
2. **Lần 2**: Sau đó lại trừ `unpaidLeaveDays` ở cuối logic tính toán

### Ví dụ thực tế

Nhân viên Đào Thị Thúy (00220) - Tháng 3/2026:
- Có 22 ngày chấm công
- Trong đó ngày 2026-03-20: có attendance log (check_in 07:49, check_out 11:59) VÀ có phiếu unpaid_leave
- Ngày 2026-03-12: có phiếu unpaid_leave (không có attendance log)

**Kết quả sai:**
```
- Ngày đủ điều kiện: 15 ngày (bao gồm ngày 2026-03-20)
- Ngày vi phạm: 7 ngày
- Grace: 4 ngày
- Trừ unpaid_leave: 1.5 ngày
→ Tổng: 15 + 4 - 1.5 = 17.5 → 17 ngày
```

**Kết quả đúng:**
```
- Ngày đủ điều kiện: 14 ngày (loại bỏ ngày 2026-03-20)
- Ngày vi phạm: 7 ngày
- Grace: 4 ngày
→ Tổng: 14 + 4 = 18 ngày
```

## Nguyên nhân

Hàm `getEmployeeViolations()` trả về TẤT CẢ các ngày có attendance log, bao gồm cả ngày có phiếu nghỉ không lương. Logic tính phụ cấp không loại bỏ những ngày này trước khi tính toán.

## Giải pháp

### 1. Loại bỏ ngày nghỉ không lương từ đầu

Thêm logic lấy danh sách ngày có phiếu `unpaid_leave` và loại bỏ khỏi tất cả các filter:

```typescript
// Lấy danh sách ngày có phiếu unpaid_leave
const unpaidLeaveDates = new Set<string>()
const { data: unpaidLeaveRequests } = await supabase
  .from("employee_requests")
  .select(`request_date, from_date, to_date, request_type:request_types!request_type_id(code)`)
  .eq("employee_id", emp.id)
  .eq("status", "approved")
  .or(`and(request_date.gte.${startDate},request_date.lte.${endDate}),and(from_date.lte.${endDate},to_date.gte.${startDate})`)

for (const req of unpaidLeaveRequests || []) {
  const reqType = req.request_type as any
  if (reqType?.code === "unpaid_leave") {
    // Xử lý date range hoặc single date
    // Thêm vào unpaidLeaveDates
  }
}
```

### 2. Loại bỏ khỏi tính toán

```typescript
// Loại bỏ ngày nghỉ không lương khỏi allowanceFullDays
const allowanceFullDays = violationsWithoutOT.filter((v) => 
  v.hasCheckIn && v.hasCheckOut && !v.isHalfDay && !v.isAbsent &&
  v.lateMinutes <= lateThresholdMinutes && v.earlyMinutes === 0 &&
  !v.forgotCheckIn && !v.forgotCheckOut &&
  !unpaidLeaveDates.has(v.date)  // ← Thêm điều kiện này
).length

// Loại bỏ ngày nghỉ không lương khỏi violationDaysWithExempt
const violationDaysWithExempt = violationsWithoutOT.filter((v) => {
  if (unpaidLeaveDates.has(v.date)) return false  // ← Thêm điều kiện này
  // ... logic khác
}).length

// Loại bỏ ngày nghỉ không lương khỏi allowanceViolations
const allowanceViolations = violationsWithoutOT.filter((v) => 
  !unpaidLeaveDates.has(v.date) &&  // ← Thêm điều kiện này
  (v.lateMinutes > lateThresholdMinutes || ...)
).length - violationDaysWithExempt
```

### 3. Bỏ logic trừ unpaidLeaveDays ở cuối

```typescript
if (rules) {
  if (rules.late_grace_count !== undefined && allowanceViolations > 0) {
    const gracedViolationDays = Math.min(allowanceViolations, rules.late_grace_count)
    eligibleDays += gracedViolationDays
  }
  // BỎ logic này vì đã loại bỏ từ đầu
  // if (rules.deduct_on_absent && unpaidLeaveDays > 0) {
  //   eligibleDays -= unpaidLeaveDays
  // }
}
```

## Files thay đổi

- `lib/actions/payroll/generate-payroll.ts`: Hàm `processAdjustments()`
- `lib/actions/payroll/recalculate-single.ts`: Sử dụng hàm `processAdjustments()` từ file trên nên tự động được fix

## Testing

Sau khi fix, với nhân viên Đào Thị Thúy (00220) - Tháng 3/2026:
- Ngày đủ điều kiện: 14 ngày (không bao gồm ngày 2026-03-20)
- Ngày vi phạm: 7 ngày
- Grace: 4 ngày
- Tổng phụ cấp: 18 ngày (thay vì 17 ngày)

## Ngày fix

2026-04-03
