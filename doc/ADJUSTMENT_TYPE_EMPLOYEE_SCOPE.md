# Chức năng Phạm vi áp dụng Phụ cấp/Khấu trừ

## Tổng quan

Tính năng này cho phép HR/Admin chọn phạm vi áp dụng cho các loại phụ cấp/khấu trừ tự động:
- **Toàn công ty**: Áp dụng cho tất cả nhân viên (mặc định)
- **Nhân viên cụ thể**: Chỉ áp dụng cho các nhân viên được chọn

## Cài đặt

### 1. Chạy Migration SQL

Chạy script sau để tạo bảng `adjustment_type_employees`:

```bash
psql -U your_username -d your_database -f scripts/042-adjustment-type-employees.sql
```

Hoặc copy nội dung file `scripts/042-adjustment-type-employees.sql` và chạy trong Supabase SQL Editor.

### 2. Cấu trúc Database

**Bảng mới: `adjustment_type_employees`**
- `id`: UUID (Primary Key)
- `adjustment_type_id`: UUID (Foreign Key → payroll_adjustment_types)
- `employee_id`: UUID (Foreign Key → employees)
- `created_at`: Timestamp

**Quy tắc:**
- Nếu KHÔNG CÓ bản ghi nào trong bảng này cho một adjustment_type_id → Áp dụng cho TOÀN CÔNG TY
- Nếu CÓ bản ghi → Chỉ áp dụng cho NHỮNG NHÂN VIÊN ĐƯỢC CHỌN

## Cách sử dụng

### Tạo mới Phụ cấp/Khấu trừ

1. Vào trang **Quản lý phụ cấp & khấu trừ**
2. Nhấn nút **Thêm** ở tab tương ứng (Phụ cấp/Khấu trừ/Phạt)
3. Điền thông tin cơ bản (Tên, Mã, Số tiền, Cách tính)
4. Bật **Tự động áp dụng**
5. Chọn **Phạm vi áp dụng**:
   - **Toàn công ty**: Áp dụng cho tất cả nhân viên
   - **Nhân viên cụ thể**: Chọn danh sách nhân viên từ dropdown
6. Cấu hình các quy tắc tự động khác (nếu cần)
7. Nhấn **Lưu**

### Chỉnh sửa Phụ cấp/Khấu trừ

1. Nhấn nút **Sửa** (biểu tượng bút chì) ở hàng tương ứng
2. Thay đổi **Phạm vi áp dụng** nếu cần
3. Nhấn **Lưu**

### Xem Phạm vi áp dụng

Trong bảng danh sách, cột **Phạm vi** sẽ hiển thị:
- **Toàn công ty**: Badge màu xanh lá
- **X NV**: Badge màu xanh dương với số lượng nhân viên được chọn
- **-**: Nếu không phải tự động áp dụng

## Ví dụ

### Ví dụ 1: Phụ cấp ăn trưa cho toàn công ty

```
Tên: Phụ cấp ăn trưa
Mã: LUNCH
Số tiền: 35,000 VND
Cách tính: Theo ngày công
Tự động áp dụng: Bật
Phạm vi: Toàn công ty
```

→ Tất cả nhân viên sẽ nhận phụ cấp này

### Ví dụ 2: Phụ cấp xăng xe chỉ cho nhân viên kinh doanh

```
Tên: Phụ cấp xăng xe
Mã: FUEL
Số tiền: 1,000,000 VND
Cách tính: Cố định/tháng
Tự động áp dụng: Bật
Phạm vi: Nhân viên cụ thể
Nhân viên được chọn: 
  - Nguyễn Văn A (NV001)
  - Trần Thị B (NV002)
  - Lê Văn C (NV003)
```

→ Chỉ 3 nhân viên này nhận phụ cấp

## Lưu ý

1. **Thay đổi phạm vi áp dụng**: Khi thay đổi từ "Toàn công ty" sang "Nhân viên cụ thể" hoặc ngược lại, hệ thống sẽ tự động cập nhật và áp dụng cho kỳ lương tiếp theo.

2. **Xóa nhân viên khỏi danh sách**: Nếu xóa nhân viên khỏi danh sách được chọn, họ sẽ không còn nhận phụ cấp/khấu trừ này từ kỳ lương tiếp theo.

3. **Nhân viên mới**: Nếu chọn "Toàn công ty", nhân viên mới sẽ tự động nhận phụ cấp/khấu trừ này. Nếu chọn "Nhân viên cụ thể", cần thêm nhân viên mới vào danh sách thủ công.

4. **Tương thích với Payroll**: Logic tính lương đã được cập nhật để kiểm tra phạm vi áp dụng khi tính toán phụ cấp/khấu trừ tự động.

## Troubleshooting

### Lỗi: "Vui lòng chọn ít nhất 1 nhân viên"

→ Khi chọn "Nhân viên cụ thể", bạn phải chọn ít nhất 1 nhân viên từ danh sách.

### Nhân viên không nhận được phụ cấp

1. Kiểm tra phạm vi áp dụng của phụ cấp
2. Nếu là "Nhân viên cụ thể", kiểm tra xem nhân viên có trong danh sách không
3. Kiểm tra các quy tắc tự động khác (trừ khi nghỉ làm, đi muộn, v.v.)

### Không thấy dropdown chọn nhân viên

→ Đảm bảo đã bật "Tự động áp dụng" và chọn "Nhân viên cụ thể"

## Tham khảo

Tính năng này được thiết kế tương tự như "Ngày làm việc đặc biệt" với phạm vi áp dụng linh hoạt.

Xem thêm:
- `scripts/042-adjustment-type-employees.sql` - Migration SQL
- `components/allowances/allowance-list.tsx` - UI Component
- `lib/actions/allowance-actions.ts` - Server Actions
- `lib/types/database.ts` - Type Definitions
