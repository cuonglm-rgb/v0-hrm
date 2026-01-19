# Cập nhật: Thêm điều kiện phạt

## Tổng quan
Đã thêm 4 điều kiện phạt mới vào hệ thống:
1. **Đi làm muộn** (late_arrival)
2. **Đi về sớm** (early_leave)
3. **Quên chấm công đến** (forgot_checkin)
4. **Quên chấm công về** (forgot_checkout)

## Thay đổi kỹ thuật

### 1. Type Definition (lib/types/database.ts)
- Thêm type `PenaltyCondition` với 4 giá trị
- Thêm field `penalty_conditions?: PenaltyCondition[]` vào `AdjustmentAutoRules`

### 2. UI Component (components/allowances/allowance-list.tsx)
- Thêm 4 checkbox để chọn điều kiện phạt khi tạo/sửa loại phạt
- Hiển thị trong phần "Quy tắc tự động" khi category = "penalty"

### 3. Payroll Logic (lib/actions/payroll-actions.ts)
- Cập nhật logic tính phạt tự động để xử lý 4 điều kiện:
  - **late_arrival**: Kiểm tra `lateMinutes > threshold` từ attendance violations
  - **early_leave**: Kiểm tra `earlyMinutes > threshold` từ attendance violations
  - **forgot_checkin**: Lấy từ employee_requests với code = "forgot_checkin"
  - **forgot_checkout**: Lấy từ employee_requests với code = "forgot_checkout"
- Cải thiện logic tính `earlyMinutes` trong `getEmployeeViolations()`

## Cách sử dụng

### Tạo loại phạt mới
1. Vào trang **Phụ cấp & Phạt** → Tab **Phạt**
2. Click **Thêm phạt**
3. Điền thông tin cơ bản (tên, mã, số tiền)
4. Bật **Tự động áp dụng**
5. Chọn **Điều kiện phạt** (có thể chọn nhiều):
   - ☑ Đi làm muộn
   - ☑ Đi về sớm
   - ☑ Quên chấm công đến
   - ☑ Quên chấm công về
6. Cấu hình:
   - **Muộn từ (phút)**: Ngưỡng phút để tính phạt (áp dụng cho đi muộn/về sớm)
   - **Loại phạt**: Nửa ngày lương / Một ngày lương / Số tiền cố định
   - **Miễn nếu có phiếu xin phép**: Bật/tắt và chọn loại phiếu được miễn

### Ví dụ cấu hình

**Phạt đi muộn/về sớm:**
\`\`\`
Tên: Phạt đi muộn hoặc về sớm
Điều kiện: ☑ Đi làm muộn, ☑ Đi về sớm
Muộn từ: 30 phút
Loại phạt: Nửa ngày lương
Miễn phép: Bật (chọn late_arrival, early_leave)
\`\`\`

**Phạt quên chấm công:**
\`\`\`
Tên: Phạt quên chấm công
Điều kiện: ☑ Quên chấm công đến, ☑ Quên chấm công về
Loại phạt: Số tiền cố định (50,000đ)
Miễn phép: Tắt
\`\`\`

## Lưu ý
- Các điều kiện phạt có thể kết hợp (chọn nhiều cùng lúc)
- Ngưỡng phút chỉ áp dụng cho "đi muộn" và "về sớm"
- Quên chấm công được lấy từ phiếu xin phép (employee_requests)
- Có thể miễn phạt nếu nhân viên có phiếu xin phép được duyệt
