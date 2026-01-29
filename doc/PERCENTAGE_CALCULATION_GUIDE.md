# Hướng dẫn tính theo % lương

## Tổng quan

Hệ thống đã được cập nhật để hỗ trợ tính phụ cấp/khấu trừ theo phần trăm (%) lương cơ bản hoặc lương BHXH của nhân viên.

## Cách sử dụng

### 1. Thiết lập lương BHXH cho nhân viên

1. Vào **Dashboard > Nhân viên**
2. Chọn nhân viên cần thiết lập
3. Tab **Lương & Phụ cấp**
4. Nhấn **Thêm mức lương mới**
5. Điền thông tin:
   - **Lương cơ bản**: VD: 15,000,000đ
   - **Lương BHXH**: VD: 10,000,000đ (để trống nếu dùng lương cơ bản)
   - **Phụ cấp**: VD: 2,000,000đ
   - **Ngày hiệu lực**: Chọn ngày bắt đầu

### 2. Tạo khấu trừ/phụ cấp theo % lương

1. Vào **Dashboard > Phụ cấp & Khấu trừ**
2. Chọn tab **Phụ cấp** hoặc **Khấu trừ**
3. Nhấn nút **Thêm**
4. Điền thông tin:
   - **Tên**: VD: "Bảo hiểm xã hội"
   - **Mã**: VD: "SOCIAL_INSURANCE"
   - **Cách tính**: Chọn **"Theo % lương"**
   - **Phần trăm lương (%)**: Nhập số % (VD: 8 = 8%)
   - **Tính từ**: Chọn **"Lương BHXH"** hoặc **"Lương cơ bản"**
   - **Mô tả**: Mô tả chi tiết

### 3. Ví dụ cụ thể

#### Bảo hiểm xã hội 8% lương BHXH
- **Tên**: Bảo hiểm xã hội
- **Mã**: SOCIAL_INSURANCE
- **Loại**: Khấu trừ
- **Cách tính**: Theo % lương
- **Phần trăm**: 8
- **Tính từ**: Lương BHXH
- **Mô tả**: BHXH 8% lương BHXH

**Cách tính:**
- Lương cơ bản: 15,000,000đ
- Lương BHXH: 10,000,000đ
- Khấu trừ BHXH: 10,000,000 × 8% = 800,000đ

#### Bảo hiểm y tế 1.5% lương BHXH
- **Tên**: Bảo hiểm y tế
- **Mã**: HEALTH_INSURANCE
- **Loại**: Khấu trừ
- **Cách tính**: Theo % lương
- **Phần trăm**: 1.5
- **Tính từ**: Lương BHXH
- **Mô tả**: BHYT 1.5% lương BHXH

**Cách tính:**
- Lương BHXH: 10,000,000đ
- Khấu trừ BHYT: 10,000,000 × 1.5% = 150,000đ

#### Phụ cấp trách nhiệm 15% lương cơ bản
- **Tên**: Phụ cấp trách nhiệm
- **Mã**: RESPONSIBILITY_ALLOWANCE
- **Loại**: Phụ cấp
- **Cách tính**: Theo % lương
- **Phần trăm**: 15
- **Tính từ**: Lương cơ bản
- **Mô tả**: Phụ cấp trách nhiệm 15% lương cơ bản

**Cách tính:**
- Lương cơ bản: 15,000,000đ
- Phụ cấp: 15,000,000 × 15% = 2,250,000đ

### 4. Áp dụng cho nhân viên

Có 2 cách:

#### Cách 1: Tự động áp dụng
- Bật **"Tự động áp dụng"** khi tạo khấu trừ/phụ cấp
- Hệ thống sẽ tự động tính cho tất cả nhân viên khi chạy bảng lương

#### Cách 2: Gán thủ công
1. Vào **Dashboard > Nhân viên**
2. Chọn nhân viên cần gán
3. Tab **Lương & Phụ cấp**
4. Nhấn **Thêm phụ cấp/khấu trừ**
5. Chọn loại đã tạo

### 5. Xem kết quả trong bảng lương

Khi chạy bảng lương, hệ thống sẽ:
1. Lấy lương cơ bản hoặc lương BHXH của nhân viên (tùy cấu hình)
2. Tính số tiền = Lương × % / 100
3. Cộng vào phụ cấp hoặc trừ vào khấu trừ
4. Hiển thị trong chi tiết bảng lương với lý do: "X% lương BHXH" hoặc "X% lương cơ bản"

## Các loại tính toán khác

Hệ thống hỗ trợ 4 loại tính toán:

1. **Cố định/tháng**: Số tiền cố định mỗi tháng (VD: 500,000đ)
2. **Theo ngày công**: Số tiền × số ngày làm việc (VD: 35,000đ/ngày)
3. **Theo lần vi phạm**: Số tiền × số lần vi phạm (VD: 50,000đ/lần)
4. **Theo % lương**: % × lương (VD: 8% lương BHXH = 800,000đ nếu lương BHXH 10tr)

## Lưu ý

- % lương có thể tính từ **lương cơ bản** hoặc **lương BHXH**
- **Quan trọng:** Nếu nhân viên không có lương BHXH (null hoặc = 0) và khấu trừ được set "Tính từ: Lương BHXH", hệ thống sẽ **BỎ QUA** không tính cho nhân viên đó
  - Điều này phù hợp với thực tế: nhân viên chưa đóng BHXH thì không bị khấu trừ BHXH
  - Trong log tính lương sẽ hiển thị: "Bỏ qua [Tên khấu trừ] - Chưa có lương BHXH"
- Nếu nhân viên không có lương BHXH riêng nhưng khấu trừ set "Tính từ: Lương cơ bản", hệ thống vẫn tính bình thường
- Có thể nhập số thập phân (VD: 8.5 = 8.5%, 10.5 = 10.5%)
- Giá trị % nên từ 0-100
- Khi sửa %, hệ thống sẽ tính lại trong lần chạy bảng lương tiếp theo

## Cập nhật kỹ thuật

### Database
- Chạy script: `scripts/038-add-percentage-calculation-type.sql`
- Chạy script: `scripts/039-add-insurance-salary.sql`
- Thêm cột `insurance_salary` vào bảng `salary_structure`
- Thêm giá trị "percentage" vào `calculation_type`

### Code
- `lib/types/database.ts`: 
  - Thêm "percentage" vào `AdjustmentCalculationType`
  - Thêm "insurance_salary" vào `AdjustmentAutoRules.calculate_from`
  - Thêm `insurance_salary` vào `SalaryStructure`
- `lib/actions/allowance-actions.ts`: Cập nhật type cho create/update
- `lib/actions/payroll-actions.ts`: 
  - Thêm logic tính toán % lương
  - Hỗ trợ tính từ lương BHXH
  - Cập nhật `createSalaryStructure` để lưu insurance_salary
- `components/allowances/allowance-list.tsx`: 
  - Thêm UI cho % lương
  - Thêm dropdown chọn "Tính từ"
- `components/employees/employee-salary-tab.tsx`:
  - Thêm field "Lương BHXH"
  - Hiển thị lương BHXH trong bảng lịch sử
