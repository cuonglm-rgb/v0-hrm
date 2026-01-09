# Sửa UI Form Phạt - Loại bỏ nhầm lẫn về Số tiền

## Vấn đề

UI cũ có 2 field gây nhầm lẫn:

1. **"Số tiền (VND)"** - Hiển thị ở đầu form
2. **"Loại phạt"** - Hiển thị trong phần "Quy tắc tự động"
   - Nửa ngày lương
   - Một ngày lương
   - Số tiền cố định

**Vấn đề:**
- Khi chọn "Nửa ngày lương" hoặc "Một ngày lương", field "Số tiền" vẫn hiển thị nhưng không được sử dụng
- Người dùng nhập số tiền nhưng không có tác dụng → Gây nhầm lẫn
- Không rõ field nào được ưu tiên

## Giải pháp

### 1. Ẩn field "Số tiền" ở đầu form khi category = "penalty"

\`\`\`tsx
{/* Chỉ hiển thị field Số tiền nếu KHÔNG phải penalty HOẶC penalty_type = fixed_amount */}
{(formData.category !== "penalty" || formData.auto_rules.penalty_type === "fixed_amount") && (
  <div className="space-y-2">
    <Label htmlFor="amount">Số tiền (VND)</Label>
    <Input ... />
  </div>
)}
\`\`\`

### 2. Thêm field "Số tiền phạt" sau "Loại phạt"

Chỉ hiển thị khi chọn "Số tiền cố định":

\`\`\`tsx
{/* Chỉ hiển thị field Số tiền khi chọn "Số tiền cố định" */}
{formData.auto_rules.penalty_type === "fixed_amount" && (
  <div className="space-y-2 pl-4 border-l-2 border-blue-300">
    <Label htmlFor="penalty_amount">Số tiền phạt (VND) *</Label>
    <Input
      id="penalty_amount"
      value={formData.amount}
      onChange={(e) => setFormData({ ...formData, amount: formatInputCurrency(e.target.value) })}
      placeholder="50,000"
    />
    <p className="text-xs text-muted-foreground">Số tiền phạt cố định cho mỗi lần vi phạm</p>
  </div>
)}
\`\`\`

## Luồng UI mới

### Khi tạo/sửa Phụ cấp hoặc Khấu trừ

\`\`\`
┌─────────────────────────────────┐
│ Tên: Phụ cấp ăn trưa           │
│ Mã: LUNCH                       │
├─────────────────────────────────┤
│ Số tiền (VND): 35,000          │ ← Hiển thị bình thường
│ Cách tính: Theo ngày công       │
└─────────────────────────────────┘
\`\`\`

### Khi tạo/sửa Phạt - Chọn "Nửa ngày lương"

\`\`\`
┌─────────────────────────────────┐
│ Tên: Quên chấm công            │
│ Mã: FORGOT_CHECKIN              │
├─────────────────────────────────┤
│ [KHÔNG hiển thị field Số tiền] │ ← Ẩn vì không cần
│ Cách tính: Theo lần vi phạm     │
├─────────────────────────────────┤
│ Quy tắc tự động                 │
│ ☑ Quên chấm công đến           │
│ ☑ Quên chấm công về            │
│ Loại phạt: Nửa ngày lương      │ ← Chọn này
│ [KHÔNG hiển thị field Số tiền] │ ← Không cần nhập
└─────────────────────────────────┘
\`\`\`

### Khi tạo/sửa Phạt - Chọn "Số tiền cố định"

\`\`\`
┌─────────────────────────────────┐
│ Tên: Quên chấm công            │
│ Mã: FORGOT_CHECKIN              │
├─────────────────────────────────┤
│ [KHÔNG hiển thị field Số tiền] │ ← Ẩn vì sẽ nhập ở dưới
│ Cách tính: Theo lần vi phạm     │
├─────────────────────────────────┤
│ Quy tắc tự động                 │
│ ☑ Quên chấm công đến           │
│ ☑ Quên chấm công về            │
│ Loại phạt: Số tiền cố định     │ ← Chọn này
│   ┌───────────────────────────┐ │
│   │ Số tiền phạt: 50,000 *   │ │ ← Hiển thị field mới
│   └───────────────────────────┘ │
└─────────────────────────────────┘
\`\`\`

## Lợi ích

1. ✅ **Rõ ràng hơn**: Chỉ hiển thị field cần thiết
2. ✅ **Không nhầm lẫn**: Không có 2 field "Số tiền" cùng lúc
3. ✅ **Trực quan**: Field "Số tiền phạt" xuất hiện ngay sau khi chọn "Số tiền cố định"
4. ✅ **Validation tốt hơn**: Có thể bắt buộc nhập khi chọn "Số tiền cố định"

## Cách hoạt động

### Loại phạt: Nửa ngày lương

- **Không cần nhập số tiền**
- Hệ thống tự tính: `dailySalary / 2`
- Ví dụ: Lương ngày 400,000đ → Phạt 200,000đ

### Loại phạt: Một ngày lương

- **Không cần nhập số tiền**
- Hệ thống tự tính: `dailySalary`
- Ví dụ: Lương ngày 400,000đ → Phạt 400,000đ

### Loại phạt: Số tiền cố định

- **Bắt buộc nhập số tiền**
- Phạt số tiền cố định cho mỗi lần vi phạm
- Ví dụ: Nhập 50,000đ → Phạt 50,000đ/lần

## Migration

Không cần migration database vì:
- Field `amount` vẫn tồn tại
- Chỉ thay đổi UI hiển thị
- Logic backend không đổi

## Testing

### Test case 1: Tạo phạt "Nửa ngày lương"

1. Vào trang Phụ cấp & Phạt → Tab Phạt
2. Click "Thêm phạt"
3. Nhập tên: "Quên chấm công"
4. Bật "Tự động áp dụng"
5. Chọn điều kiện: "Quên chấm công đến", "Quên chấm công về"
6. Chọn "Loại phạt": **Nửa ngày lương**
7. **Kiểm tra**: KHÔNG có field "Số tiền phạt" hiển thị
8. Click "Lưu"
9. Tính lương → Phạt = dailySalary / 2

### Test case 2: Tạo phạt "Số tiền cố định"

1. Vào trang Phụ cấp & Phạt → Tab Phạt
2. Click "Thêm phạt"
3. Nhập tên: "Phạt vi phạm nội quy"
4. Bật "Tự động áp dụng"
5. Chọn "Loại phạt": **Số tiền cố định**
6. **Kiểm tra**: Có field "Số tiền phạt (VND) *" hiển thị
7. Nhập số tiền: 100,000
8. Click "Lưu"
9. Tính lương → Phạt = 100,000đ/lần

### Test case 3: Sửa phạt từ "Nửa ngày lương" sang "Số tiền cố định"

1. Mở phạt "Quên chấm công" (đang là "Nửa ngày lương")
2. **Kiểm tra**: KHÔNG có field "Số tiền phạt"
3. Đổi "Loại phạt" thành "Số tiền cố định"
4. **Kiểm tra**: Field "Số tiền phạt" xuất hiện ngay lập tức
5. Nhập số tiền: 50,000
6. Click "Lưu"

## File đã sửa

- `components/allowances/allowance-list.tsx`
  - Ẩn field "Số tiền" ở đầu form khi category = "penalty"
  - Thêm field "Số tiền phạt" sau "Loại phạt" (chỉ hiển thị khi penalty_type = "fixed_amount")
