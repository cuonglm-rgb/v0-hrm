# Hướng dẫn kiểm tra phạt quên chấm công

## Chuẩn bị

1. Đảm bảo đã có loại phạt "Quên chấm công" với cấu hình:
   - Code: `FORGOT_CHECKIN`
   - Category: `penalty`
   - Tự động áp dụng: `true`
   - Điều kiện phạt: `["forgot_checkin", "forgot_checkout"]`
   - Trigger: `attendance` (tự động set)

2. Đảm bảo đã có loại phiếu:
   - `forgot_checkin` (Quên chấm công đến)
   - `forgot_checkout` (Quên chấm công về)

## Các bước kiểm tra

### Bước 1: Tạo phiếu quên chấm công

1. Đăng nhập với tài khoản nhân viên
2. Vào trang **Phiếu xin phép**
3. Tạo phiếu mới:
   - Loại phiếu: **Quên chấm công đến** hoặc **Quên chấm công về**
   - Ngày: Chọn ngày trong tháng cần tính lương
   - Lý do: Ghi rõ lý do
4. Gửi phiếu

### Bước 2: Duyệt phiếu

1. Đăng nhập với tài khoản HR/Manager
2. Vào trang **Duyệt phiếu**
3. Tìm phiếu vừa tạo
4. Click **Duyệt**

### Bước 3: Tính lương

1. Đăng nhập với tài khoản HR
2. Vào trang **Bảng lương**
3. Chọn tháng/năm tương ứng
4. Click **Tính lương**

### Bước 4: Kiểm tra kết quả

1. Mở phiếu lương của nhân viên
2. Kiểm tra phần **Phạt**:
   - Phải có dòng: "Quên chấm công đến ngày YYYY-MM-DD" hoặc "Quên chấm công về ngày YYYY-MM-DD"
   - Số tiền phạt phải được trừ vào lương

3. Kiểm tra phần **Chi tiết điều chỉnh** (nếu có):
   - Category: `penalty`
   - Reason: "Quên chấm công đến ngày YYYY-MM-DD"
   - Final amount: Số tiền phạt

## Kịch bản kiểm tra

### Kịch bản 1: Quên chấm công đến (1 lần)

**Dữ liệu:**
- Nhân viên: Nguyễn Văn A
- Lương cơ bản: 10,000,000đ
- Công chuẩn: 26 ngày
- Lương ngày: 384,615đ
- Phạt: Nửa ngày lương (192,308đ)

**Kết quả mong đợi:**
- Phạt: 192,308đ
- Lương thực nhận: Giảm 192,308đ

### Kịch bản 2: Quên chấm công cả đến và về (2 lần)

**Dữ liệu:**
- Nhân viên: Nguyễn Văn A
- Lương cơ bản: 10,000,000đ
- Công chuẩn: 26 ngày
- Lương ngày: 384,615đ
- Phạt: Nửa ngày lương x 2 = 384,616đ

**Kết quả mong đợi:**
- Phạt: 384,616đ (2 lần)
- Lương thực nhận: Giảm 384,616đ

### Kịch bản 3: Quên chấm công + Đi muộn

**Dữ liệu:**
- Nhân viên: Nguyễn Văn A
- Quên chấm công đến: 1 lần (ngày 09/12)
- Đi muộn: 1 lần (ngày 10/12, 45 phút)
- Phạt quên chấm công: Nửa ngày lương (192,308đ)
- Phạt đi muộn: Nửa ngày lương (192,308đ)

**Kết quả mong đợi:**
- Tổng phạt: 384,616đ (2 lần)
- Lương thực nhận: Giảm 384,616đ

### Kịch bản 4: Có phiếu nhưng chưa duyệt

**Dữ liệu:**
- Nhân viên: Nguyễn Văn A
- Phiếu quên chấm công: Chưa duyệt (status = "pending")

**Kết quả mong đợi:**
- KHÔNG bị phạt (vì phiếu chưa approved)

## Lưu ý

1. **Phạt chỉ áp dụng cho phiếu đã duyệt** (status = "approved")
2. **Không miễn phạt** nếu cấu hình `exempt_with_request: false`
3. **Có thể kết hợp nhiều điều kiện phạt** trong cùng 1 loại phạt
4. **Trigger tự động được set** dựa trên penalty_conditions:
   - Có `forgot_checkin` hoặc `forgot_checkout` → trigger = "attendance"
   - Chỉ có `late_arrival` hoặc `early_leave` → trigger = "late"

## Troubleshooting

### Vấn đề: Không bị phạt

**Nguyên nhân có thể:**
1. Phiếu chưa được duyệt (status ≠ "approved")
2. Loại phạt chưa bật "Tự động áp dụng"
3. Loại phạt không active (is_active = false)
4. Trigger không đúng (phải là "attendance")
5. Penalty_conditions không có "forgot_checkin" hoặc "forgot_checkout"

**Cách khắc phục:**
1. Kiểm tra status của phiếu trong database
2. Kiểm tra cấu hình loại phạt trong trang **Phụ cấp & Phạt**
3. Chạy SQL script để cập nhật trigger:
   ```bash
   psql -d your_database -f scripts/026-fix-forgot-checkin-penalty-trigger.sql
   ```
4. Tính lại lương (Refresh payroll)

### Vấn đề: Bị phạt 2 lần cho cùng 1 ngày

**Nguyên nhân:**
- Có 2 phiếu cho cùng 1 ngày (forgot_checkin + forgot_checkout)

**Giải pháp:**
- Đây là hành vi đúng nếu cấu hình penalty_conditions có cả 2 loại
- Nếu muốn chỉ phạt 1 lần, tạo 2 loại phạt riêng:
  - Phạt quên chấm công đến: `["forgot_checkin"]`
  - Phạt quên chấm công về: `["forgot_checkout"]`

## Tham khảo

- [FIX_FORGOT_CHECKIN_PENALTY.md](./FIX_FORGOT_CHECKIN_PENALTY.md) - Chi tiết kỹ thuật
- [PENALTY_CONDITIONS_UPDATE.md](./PENALTY_CONDITIONS_UPDATE.md) - Cập nhật điều kiện phạt
