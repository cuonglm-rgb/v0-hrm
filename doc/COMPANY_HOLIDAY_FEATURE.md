# Tính năng Ngày nghỉ công ty

## Tổng quan
Thêm loại ngày đặc biệt mới: "Ngày nghỉ công ty" - cho phép đánh dấu các ngày mà công ty nghỉ. Ngày nghỉ công ty là **nghỉ có lương**: không trừ công chuẩn, nhân viên không đi làm và không có phiếu nghỉ vẫn được cộng 1 công.

## Các thay đổi

### 1. Database Schema
**File:** `scripts/040-add-company-holiday-type.sql`
- Thêm cột `is_company_holiday` (BOOLEAN) vào bảng `special_work_days`
- Mặc định: `false`

### 2. TypeScript Types
**File:** `lib/types/database.ts`
- Cập nhật interface `SpecialWorkDay` thêm field `is_company_holiday: boolean`

### 3. UI Components

#### a. Special Work Days Panel
**File:** `components/attendance/special-work-days-panel.tsx`
- Thêm toggle "Ngày nghỉ công ty" trong form thêm/sửa ngày đặc biệt
- Khi bật "Ngày nghỉ công ty", các option "Cho phép về sớm" và "Cho phép đi muộn" sẽ bị ẩn
- Hiển thị badge màu tím "Ngày nghỉ công ty" trong danh sách

#### b. Attendance Panel
**File:** `components/attendance/attendance-panel.tsx`
- Thêm prop `specialDays?: SpecialWorkDay[]`
- Hiển thị badge "Ngày nghỉ công ty" (màu tím) cho các ngày được đánh dấu
- Tooltip hiển thị lý do khi hover

#### c. Attendance Management View
**File:** `components/attendance/attendance-management-view.tsx`
- Thêm prop `specialDays: SpecialWorkDay[]`
- Truyền `specialDays` xuống `AttendancePanel`

### 4. Server Actions
**File:** `lib/actions/special-work-day-actions.ts`
- Cập nhật `createSpecialWorkDay()` để nhận và lưu `is_company_holiday`
- Cập nhật `updateSpecialWorkDay()` để cập nhật `is_company_holiday`

### 5. Pages

#### a. Attendance Page
**File:** `app/dashboard/attendance/page.tsx`
- Import `listSpecialWorkDays`
- Fetch special days và truyền vào `AttendancePanel`

#### b. Attendance Management Page
**File:** `app/dashboard/attendance-management/page.tsx`
- Truyền `specialDays` vào `AttendanceManagementView`

### 6. Payroll Calculation
**File:** `lib/actions/payroll/working-days.ts`
- Cập nhật `calculateStandardWorkingDays()`:
  - Query các ngày có `is_company_holiday = true` trong tháng
  - Trừ số ngày nghỉ công ty khỏi công chuẩn
  - Return thêm field `companyHolidays: number`

## Cách sử dụng

### 1. Thêm ngày nghỉ công ty
1. Vào **Dashboard > Quản lý chấm công > Tab "Ngày đặc biệt"**
2. Click "Thêm ngày"
3. Chọn ngày và nhập lý do
4. Bật toggle "Ngày nghỉ công ty"
5. Click "Thêm"

### 2. Hiển thị trong chấm công
- Trong trang **Chấm công** và **Quản lý chấm công**, ngày nghỉ công ty sẽ hiển thị với badge màu tím "Ngày nghỉ công ty"
- Hover vào badge để xem lý do

### 3. Tính lương
- Ngày nghỉ công ty KHÔNG trừ công chuẩn; nhân viên không đi làm, không có phiếu nghỉ → được cộng 1 công

## Làm bù (hoán đổi ngày nghỉ)
Migration: `scripts/056-company-holiday-makeup-workday.sql` (cột `is_makeup_workday`, `makeup_for_id`).

- Khi bật "Ngày nghỉ công ty" có thêm "Có làm bù" + chọn ngày làm bù.
- Ngày làm bù phải là ngày nghỉ theo lịch mặc định (CN / T7 nghỉ), không phải ngày lễ, chưa có ngày đặc biệt khác.
- Ngày làm bù lưu thành 1 dòng riêng trong `special_work_days` (trỏ về ngày nghỉ qua `makeup_for_id`,
  cùng phạm vi nhân viên). Xóa ngày nghỉ → ngày làm bù bị xóa theo.
- Ngày làm bù là ngày công bình thường: vắng → mất công, đi muộn/về sớm → vi phạm như thường,
  được xin nghỉ phép (trừ phép), không chọn làm ngày làm bù cá nhân được.
- Công chuẩn của **tháng chứa ngày làm bù** +1. Ví dụ nghỉ 31/8, làm bù 5/9 → tháng 8 giữ nguyên, tháng 9 từ 24 → 25.
  - Làm bù chỉ cho một số nhân viên → chỉ những người đó +1.
  - T7 làm bù mà nhân viên vốn đã được phân công làm → người đó không +1.
- Bảng lương đã chốt không bị tính lại tự động.

## Migration
Chạy script SQL:
```bash
psql -U your_user -d your_database -f scripts/040-add-company-holiday-type.sql
```

## Testing
1. Thêm một ngày nghỉ công ty trong tháng hiện tại
2. Kiểm tra hiển thị trong trang chấm công
3. Tính lương và kiểm tra công chuẩn đã giảm 1 ngày
