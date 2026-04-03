# Tính năng Log Quy trình Tính Lương

## Mô tả
Tính năng này cho phép xem log chi tiết quy trình tính lương của từng nhân viên, bao gồm:
- Thông tin công chuẩn
- Chi tiết chấm công với giờ check-in/check-out thực tế
- Phiếu nghỉ, làm bù
- Vi phạm (đi muộn, quên chấm công, v.v.)
- Phụ cấp, tăng ca, KPI
- Tổng thu nhập và khấu trừ

## Cách sử dụng

### 1. Chạy Migration
Trước tiên, cần chạy migration để thêm cột `calculation_log` vào bảng `payroll_items`:

```bash
# Nếu dùng Supabase CLI
supabase db push

# Hoặc chạy trực tiếp SQL trong Supabase Dashboard
# Copy nội dung file: supabase/migrations/add_calculation_log_to_payroll_items.sql
```

### 2. Tính lại lương để tạo log
Sau khi chạy migration, cần tính lại lương cho nhân viên để tạo log:

1. Vào trang `/dashboard/payroll/[id]`
2. Click vào icon "Tính lại" (RefreshCw) ở cột "Thao tác" của nhân viên
3. Hệ thống sẽ tính lại lương và lưu log vào database

### 3. Xem log tính lương
1. Vào trang `/dashboard/payroll/[id]`
2. Click vào icon "Log" (FileText) ở cột "Log" của nhân viên
3. Dialog sẽ hiển thị log chi tiết quy trình tính lương

## Cấu trúc Log

Log được hiển thị theo format đầy đủ:

```
============================================================
TÍNH LƯƠNG: Lê Quang Minh (00003) - Tháng 3/2026
============================================================
Công chuẩn: 24 ngày (31 ngày - 5 CN - 2 T7)

📋 LÀM BÙ (full_day_makeup) — Lê Quang Minh (00003):
  Không có phiếu full_day_makeup đã duyệt trong kỳ.

📊 Attendance logs: 19 bản ghi
📊 Ngày công từ chấm công (trừ ngày làm bù):
   - Full days: 18 ngày
   - Half days: 1 ngày (= 0.5 ngày công)
   - Tổng: 18.5 ngày
📊 Consumed deficit: 0 ngày
📊 OT full day: 0 ngày, OT trong ca: 0 ngày

🎉 Ngày lễ trong tháng: 13 ngày
  - 2026-03-01: Tết Nguyên Đán
  - 2026-03-02: Tết Nguyên Đán
  - 2026-03-03: Tết Nguyên Đán
  - 2026-03-04: Tết Nguyên Đán
  - 2026-03-05: Tết Nguyên Đán
  - 2026-03-06: Tết Nguyên Đán
  - 2026-03-07: Tết Nguyên Đán
  - 2026-03-08: Tết Nguyên Đán
  - 2026-03-09: Tết Nguyên Đán
  - 2026-03-10: Tết Nguyên Đán
  - 2026-03-11: Tết Nguyên Đán
  - 2026-03-12: Tết Nguyên Đán
  - 2026-03-13: Tết Nguyên Đán

🏢 Ngày nghỉ công ty: 3 ngày
  - 2026-03-14: Nghỉ bù Tết
  - 2026-03-15: Nghỉ bù Tết
  - 2026-03-16: Nghỉ bù Tết

🎁 Ngày lễ được cộng (ngày làm việc, không đi & không nghỉ): 0 ngày
🎁 Ngày nghỉ công ty được cộng: 3 ngày
📊 Tổng working days sau cộng: 21.5 ngày

[Violations] Tìm thấy 3 phiếu đã duyệt
[Violations] Phiếu date range: ngày=2026-03-10, loại=unpaid_leave
[Violations] Phiếu date range: ngày=2026-03-11, loại=annual_leave
[Violations] Phiếu date range: ngày=2026-03-23, loại=unpaid_leave
[Violations] Xử lý 19 attendance logs
[Violations] Ngày 2026-03-09: check_in=có, check_out=có, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-05: check_in=có, check_out=có, phiếu_checkin=false, phiếu_checkout=false
... (các log từ violations.ts)

[Violations] Chi tiết chấm công:
[Violations] Ngày 2026-03-09: check_in=08:00, check_out=17:00, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-05: check_in=07:59, check_out=17:05, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-16: check_in=08:00, check_out=17:26, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-17: check_in=07:57, check_out=17:57, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-18: check_in=08:00, check_out=17:33, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-19: check_in=08:05, check_out=17:07, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-20: check_in=08:02, check_out=17:16, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-21: check_in=08:11, check_out=17:18, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-24: check_in=08:05, check_out=18:32, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-04: check_in=08:06, check_out=18:19, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-07: check_in=08:04, check_out=17:08, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-13: check_in=07:58, check_out=18:11, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-12: check_in=07:54, check_out=18:36, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-25: check_in=07:59, check_out=17:18, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-26: check_in=08:03, check_out=17:01, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-02: check_in=07:58, check_out=17:07, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-10: check_in=07:58, check_out=11:58, phiếu_checkin=false, phiếu_checkout=false (chỉ làm ca sáng)
[Violations] Ngày 2026-03-06: check_in=07:57, check_out=18:00, phiếu_checkin=false, phiếu_checkout=false
[Violations] Ngày 2026-03-03: check_in=08:03, check_out=18:18, phiếu_checkin=false, phiếu_checkout=false

[Debug] Tổng violations: 19
[Debug] Violations without OT: 19
[Debug] Violations có forgotCheckIn: 
[Debug] Violations có forgotCheckOut: 

📝 PHIẾU NGHỈ:
  - Nghỉ phép có lương: 1 ngày
  - Nghỉ không lương: 1.5 ngày
  - Work from home: 0 ngày

⚠️  VI PHẠM:
  - Vắng mặt: 0 ngày
  - Làm nửa ngày: 1 lần
  - Đi muộn: 8 lần
  - Quên chấm công đến: 0 lần
  - Quên chấm công về: 0 lần
  - Actual attendance: 21 ngày (21.5 - 0.5 + consumed 0)

[Penalty] Đang xử lý phạt đi muộn:
[Penalty] - exemptWithRequest: true
[Penalty] - exemptRequestTypes: ["late_early_makeup","annual_leave","unpaid_leave"]
[Penalty] - thresholdMinutes: 120

[Adjustment] Bỏ qua Trực nhật - không áp dụng cho nhân viên này
[Adjustment] Bỏ qua Quỹ VP - Leader/ Seller - không áp dụng cho nhân viên này
[Adjustment] Bỏ qua Phụ cấp chức vụ - không áp dụng cho nhân viên này

[Allowance] Tính phụ cấp: Phụ cấp ăn trưa (LUNCH)
[Allowance] - Ngưỡng đi muộn: 0 phút
[Allowance] - Miễn trừ nếu có phiếu: Có
[Allowance] - Loại phiếu được miễn: late_early_makeup
[Allowance] - Số ngày có phiếu miễn trừ: 0 ngày
[Allowance] - Ngày đủ điều kiện (chấm công đầy đủ, không vi phạm): 10 ngày
[Allowance] - Ngày vi phạm nhưng được miễn do có phiếu: 0 ngày
[Allowance] - Ngày vi phạm (không được miễn): 9 ngày
[Allowance] - Ngày đủ điều kiện ban đầu: 10 ngày (10 + 0)
[Allowance] - Số lần vi phạm được miễn (grace): 4 ngày (tối đa 4)
[Allowance] - Trừ ngày nghỉ không phép: 1.5 ngày
[Allowance] - Tổng ngày được tính phụ cấp: 12 ngày
[Allowance] - Số tiền phụ cấp: 12 x 35,000đ = 420,000đ

[Penalty] Đang xử lý phạt đi muộn:
[Penalty] - exemptWithRequest: true
[Penalty] - exemptRequestTypes: ["late_early_makeup","annual_leave","unpaid_leave"]
[Penalty] - thresholdMinutes: 30

[OT] Calculating OT for employee 5403ba5a-8fc2-4df5-ac61-929787673b5b from 2026-03-01 to 2026-03-31
[OT] Found 0 approved OT requests from employee_requests
[OT] Found 0 approved OT records from overtime_records
[OT] Total: 0h, 0 VND

💰 TÍNH LƯƠNG:
  - Lương cơ bản: 7,500,000 VNĐ
  - Lương ngày: 312,500 VNĐ
  - Ngày công tính lương: 21 ngày
  - Phép có lương: 1 ngày
  - Lương theo công: 6,875,000 VNĐ
  - Phụ cấp: 420,000 VNĐ
  - OT: 0 VNĐ (0 lần)
  - KPI Bonus: 375,000 VNĐ
  - Tổng thu nhập: 7,670,000 VNĐ
  - Khấu trừ: 818,500 VNĐ
  - Phạt: 0 VNĐ
  - Thực lĩnh: 6,851,500 VNĐ

============================================================
KẾT THÚC TÍNH LƯƠNG: Lê Quang Minh
============================================================
```

## Cải tiến so với trước

### Trước đây:
- Log chỉ hiển thị trong console
- Không lưu lại được
- Khó tra cứu sau này
- Format: `check_in=có` (không rõ giờ cụ thể)

### Bây giờ:
- Log được lưu vào database
- Có thể xem lại bất cứ lúc nào
- Hiển thị giờ chấm công thực tế: `check_in=08:15, check_out=17:30`
- Bao gồm TẤT CẢ log từ violations.ts, processAdjustments, calculateOvertimePay
- Chi tiết các ngày lễ và ngày nghỉ công ty
- Giao diện đẹp với dialog terminal-style
- Dễ dàng debug và kiểm tra lại quy trình tính lương

## Files thay đổi

1. **Database**:
   - `supabase/migrations/add_calculation_log_to_payroll_items.sql` - Migration thêm cột

2. **Backend**:
   - `lib/utils/payroll-logger.ts` - Utility class để capture log
   - `lib/actions/payroll/get-calculation-log.ts` - API lấy log
   - `lib/actions/payroll/recalculate-single.ts` - Cập nhật để sử dụng logger
   - `lib/actions/payroll-actions.ts` - Export action mới
   - `lib/types/database.ts` - Thêm field calculation_log

3. **Frontend**:
   - `components/payroll/payroll-detail-panel.tsx` - Thêm icon và dialog hiển thị log

## Lưu ý

- Log chỉ được tạo khi tính lại lương (recalculate)
- Các bảng lương cũ sẽ không có log (cần tính lại)
- Log hiển thị với font monospace và màu terminal-style để dễ đọc
- Giờ chấm công được format theo múi giờ Việt Nam (Asia/Ho_Chi_Minh)
