# Sửa lỗi tính lương - Tháng 1/2026

## Các vấn đề đã sửa

### 1. Số công làm việc tính sai
**Vấn đề:** 22 bản ghi chấm công nhưng hệ thống tính 21 ngày công

**Nguyên nhân:** Code đang dùng `fullWorkDays + (halfDays * 0.5)` từ violations thay vì đếm trực tiếp số bản ghi chấm công

**Giải pháp:** Thay đổi logic tính ngày công:
```typescript
// CŨ: Dùng violations để tính
const fullWorkDays = violationsWithoutOT.filter((v) => !v.isHalfDay && !v.isAbsent).length
const actualAttendanceDays = fullWorkDays + (halfDays * 0.5)

// MỚI: Dùng số bản ghi chấm công trực tiếp
const actualAttendanceDays = workingDaysCount - (halfDays * 0.5)
```

### 2. Nghỉ không lương bị trừ tiền
**Vấn đề:** Nhân viên nghỉ không lương (unpaid_leave) bị trừ 200.000đ

**Nguyên nhân:** Code đang tính `totalDeduction = dailySalary * unpaidLeaveDays + ...`

**Giải pháp:** Bỏ phần trừ lương cho nghỉ không lương:
```typescript
// CŨ:
const totalDeduction = dailySalary * unpaidLeaveDays + totalDeductions + totalPenalties

// MỚI:
const totalDeduction = totalDeductions + totalPenalties
```

**Lý do:** Nghỉ không lương nghĩa là không được trả lương cho những ngày đó, nhưng không phải là "trừ tiền" từ lương đã tính. Nhân viên chỉ được trả lương cho số ngày thực tế đi làm.

**Thay đổi UI:** Đã xóa hiển thị khoản trừ "Nghỉ không lương" trong các component:
- `payroll-breakdown-dialog.tsx`
- `payroll-detail-panel.tsx`
- `payslip-panel.tsx`

### 3. Phạt duplicate cho cùng 1 ngày
**Vấn đề:** Ngày 2025-12-03 bị phạt 4 lần:
- Đi muộn 212 phút (>=30 phút): -100.000đ
- Về sớm 87 phút (>=30 phút): -100.000đ  
- Đi muộn 212 phút (>=120 phút): -200.000đ
- Quên chấm công về: -100.000đ

**Nguyên nhân:** 
1. Mỗi loại phạt (adjustment type) đang tạo Map riêng
2. Các penalty rules khác nhau (late_threshold 30 phút, 120 phút) đều được áp dụng độc lập

**Giải pháp:** Dùng Map GLOBAL cho tất cả các loại phạt, chỉ giữ phạt nặng nhất cho mỗi ngày:
```typescript
// CŨ: Mỗi adjustment type có Map riêng
for (const adjType of adjustmentTypes) {
  const penaltyByDate = new Map() // Map riêng cho từng loại phạt
  // ... xử lý phạt
}

// MỚI: Dùng Map chung cho TẤT CẢ các loại phạt
const globalPenaltyByDate = new Map()
for (const adjType of adjustmentTypes) {
  // Tất cả các loại phạt đều dùng chung globalPenaltyByDate
  // Chỉ giữ phạt nặng nhất cho mỗi ngày
  const existing = globalPenaltyByDate.get(date)
  if (!existing || amount > existing.amount) {
    globalPenaltyByDate.set(date, { date, reason, amount, adjustmentTypeId })
  }
}
```

### 4. Logic phạt sai: Tính đi muộn khi quên chấm công
**Vấn đề:** Ngày 2025-12-03 nhân viên quên chấm công về (không có check_out) nhưng vẫn bị phạt "Đi muộn 212 phút"

**Nguyên nhân:** Code đang tính `lateMinutes` dựa trên `check_in` mà không kiểm tra xem có đủ dữ liệu chấm công không

**Giải pháp:** CHỈ tính đi muộn/về sớm khi có ĐỦ cả `check_in` VÀ `check_out`:
```typescript
// CŨ: Tính đi muộn ngay cả khi thiếu check_out
lateMinutes = Math.max(0, checkInMinutes - shiftStartMinutes)

// MỚI: Kiểm tra có đủ dữ liệu không
if (!hasCheckOut) {
  // Thiếu check_out → quên chấm công về, KHÔNG tính đi muộn/về sớm
  lateMinutes = 0
  earlyMinutes = 0
  isHalfDay = false
  isAbsent = false
} else {
  // Có đủ check_in và check_out → mới tính đi muộn/về sớm
  lateMinutes = Math.max(0, checkInMinutes - shiftStartMinutes)
  // ...
}
```

**Logic đúng:**
- Nếu KHÔNG có `check_in` → Quên chấm công đến (không tính đi muộn/về sớm)
- Nếu KHÔNG có `check_out` → Quên chấm công về (không tính đi muộn/về sớm)
- Chỉ tính đi muộn/về sớm khi CÓ ĐỦ cả `check_in` VÀ `check_out`

### 5. Tích hợp "Ngày đặc biệt" vào tính lương
**Vấn đề:** Ngày 2025-12-31 nhân viên về sớm 87 phút bị phạt, nhưng đây có thể là ngày đặc biệt (được phép về sớm)

**Giải pháp:** Tích hợp bảng `special_work_days` vào logic tính lương:

```typescript
// Lấy danh sách ngày đặc biệt
const { data: specialWorkDays } = await supabase
  .from("special_work_days")
  .select("*")
  .gte("work_date", startDate)
  .lte("work_date", endDate)

// Áp dụng ngày đặc biệt
if (isSpecialDay) {
  if (allowLateArrival) {
    lateMinutes = 0 // Không tính đi muộn
  }
  if (allowEarlyLeave) {
    earlyMinutes = 0 // Không tính về sớm
  }
}
```

**Các trường trong `special_work_days`:**
- `allow_early_leave`: Cho phép về sớm (không phạt về sớm)
- `allow_late_arrival`: Cho phép đến muộn (không phạt đi muộn)
- `custom_start_time`: Giờ vào ca tùy chỉnh
- `custom_end_time`: Giờ tan ca tùy chỉnh
- `reason`: Lý do (bão, sự kiện, ...)

**Ví dụ sử dụng:**
- Ngày bão: `allow_early_leave = true` → Nhân viên về sớm không bị phạt
- Ngày sự kiện công ty: `custom_start_time = "09:00"`, `custom_end_time = "15:00"` → Làm việc theo giờ đặc biệt
- Ngày nghỉ lễ bù: Có thể set giờ làm việc linh hoạt

## Các file đã thay đổi

### Backend (Logic tính lương)
- `lib/actions/payroll-actions.ts`: 
  - Sửa logic tính ngày công trong `generatePayroll()`, `recalculateSingleEmployee()`, `recalculatePayrollItemTotals()`
  - Sửa logic phạt để tránh duplicate (dùng global Map)
  - Sửa `getEmployeeViolations()` để:
    - Chỉ tính đi muộn/về sớm khi có đủ dữ liệu chấm công
    - Tích hợp ngày đặc biệt (special_work_days)

### Frontend (UI hiển thị)
- `components/payroll/payroll-breakdown-dialog.tsx`: Xóa hiển thị "Nghỉ không lương"
- `components/payroll/payroll-detail-panel.tsx`: Xóa hiển thị "Nghỉ không lương"
- `components/payroll/payslip-panel.tsx`: Xóa hiển thị "Nghỉ không lương"

## Kết quả mong đợi

Sau khi sửa, với nhân viên Phuong Hoang Thu:
- ✅ Số công: 22 ngày (đúng với số bản ghi chấm công)
- ✅ Nghỉ không lương: Không trừ tiền, không hiển thị khoản trừ
- ✅ Phạt ngày 2025-12-03: Chỉ 1 khoản "Quên chấm công về" (không phạt đi muộn vì thiếu check_out)
- ✅ Phạt ngày 2025-12-31: Nếu là ngày đặc biệt với `allow_early_leave = true` thì không phạt về sớm
- ✅ Không có phạt duplicate

## Cách test

1. **Tạo ngày đặc biệt** (nếu cần):
   - Vào `/dashboard/attendance-management`
   - Thêm ngày 2025-12-31 với `allow_early_leave = true`

2. **Tính lại bảng lương**:
   - Xóa bảng lương tháng 12/2025 (nếu có)
   - Tạo lại bảng lương tháng 12/2025

3. **Kiểm tra payslip**:
   - Số công = 22 ngày
   - Không có khoản trừ "Nghỉ không lương"
   - Ngày 2025-12-03 chỉ có 1 khoản phạt "Quên chấm công về"
   - Ngày 2025-12-31 không có phạt "Về sớm" (nếu đã tạo ngày đặc biệt)

## Ghi chú

- Thay đổi này ảnh hưởng đến tất cả nhân viên, không chỉ riêng Phuong Hoang Thu
- Cần tính lại tất cả bảng lương đang ở trạng thái "draft" hoặc "review"
- Bảng lương đã "locked" hoặc "paid" không bị ảnh hưởng
- Logic mới: Quên chấm công và đi muộn/về sớm là 2 loại vi phạm riêng biệt, không tính chồng lên nhau
- Ngày đặc biệt được ưu tiên cao nhất, miễn phạt đi muộn/về sớm theo cấu hình
