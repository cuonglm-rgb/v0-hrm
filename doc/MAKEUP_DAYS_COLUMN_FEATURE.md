# Thêm Cột "Ngày Công Bù" (Makeup Days Column)

## Tổng quan
Thêm cột "Ngày công bù" vào bảng lương để phân biệt rõ ràng giữa:
- Ngày công thường (từ chấm công)
- Ngày công bù (từ làm bù deficit)

## Công thức kiểm tra
```
Ngày công + Ngày công bù + Nghỉ phép + Nghỉ không lương = Công chuẩn
```

## Thay đổi Database

### Migration File
`supabase/migrations/add_makeup_days_to_payroll_items.sql`

```sql
ALTER TABLE payroll_items 
ADD COLUMN IF NOT EXISTS makeup_days NUMERIC DEFAULT 0;
```

## Thay đổi Backend

### 1. TypeScript Interface
File: `lib/types/database.ts`

Thêm field mới vào `PayrollItem`:
```typescript
export interface PayrollItem {
  // ... existing fields
  working_days: number
  makeup_days: number  // NEW: Ngày công bù
  leave_days: number
  // ... rest of fields
}
```

### 2. Payroll Calculation Logic

#### File: `lib/actions/payroll/recalculate-single.ts`
- Lưu `consumed_days` vào cột `makeup_days`
- Thêm log hiển thị ngày công bù
- Thêm công thức kiểm tra trong log

```typescript
await supabase
  .from("payroll_items")
  .update({
    working_days: actualWorkingDays,
    makeup_days: consumed_days,  // NEW
    // ... other fields
  })
```

#### File: `lib/actions/payroll/generate-payroll.ts`
- Tương tự như recalculate-single.ts
- Lưu `consumed_days` vào `makeup_days`

### 3. Enhanced Logging

Thêm vào phần tổng kết:
```
📊 TỔNG KẾT:
- Công chuẩn: 24 ngày
- Ngày công thực tế: 20 ngày
- Ngày công bù: 2 ngày          ← NEW
- Nghỉ phép có lương: 1 ngày
- Nghỉ không lương (tổng): 1 ngày

✓ Kiểm tra công thức: 20 (công) + 2 (bù) + 1 (phép) + 1 (KL) = 24 ngày
✅ Đúng công chuẩn (24 ngày)
```

## Thay đổi Frontend

### 1. Payroll List Table
File: `components/payroll/payroll-detail-panel.tsx`

Thêm cột "Công bù" sau cột "Ngày công":

| Nhân viên | Ngày công | Công bù | Nghỉ phép | Nghỉ KL |
|-----------|-----------|---------|-----------|---------|
| Lê Quang Minh | 21 | 2 | 1 | 1.5 |

### 2. Payroll Detail Dialog
File: `components/payroll/payroll-detail-panel.tsx`

Thêm dòng hiển thị lương ngày công bù:
```
Thu nhập:
  Lương theo ngày công (20 ngày)      +4,166,667đ
  Lương ngày công bù (2 ngày)         +416,667đ    ← NEW
  Lương nghỉ phép có lương (1 ngày)   +208,333đ
```

### 3. Payslip Panel
File: `components/payroll/payslip-panel.tsx`

Thêm card "Công bù" vào overview:
```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Ngày    │ │ Công    │ │ Nghỉ    │ │ Nghỉ KL │ │ Thực    │
│ công    │ │ bù      │ │ phép    │ │         │ │ lĩnh    │
│   20    │ │   2     │ │   1     │ │   1     │ │ 5.2M    │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

### 4. Payroll Breakdown Dialog
File: `components/payroll/payroll-breakdown-dialog.tsx`

Thêm dòng lương công bù trong breakdown chi tiết.

## Lợi ích

### 1. Minh bạch hơn
- Phân biệt rõ ngày công thường vs ngày công bù
- Dễ dàng kiểm tra số ngày làm bù đã được tính lương

### 2. Kiểm tra chính xác
- Công thức: `Ngày công + Công bù + Nghỉ phép + Nghỉ KL = Công chuẩn`
- Tự động validate trong log
- Phát hiện lỗi tính toán dễ dàng

### 3. Audit tốt hơn
- Theo dõi được chính xác số ngày bù đã consume
- Đối chiếu với `consumed_deficit_days` và `consumed_deficit_detail`

## Ví dụ

### Trường hợp 1: Nhân viên làm bù 2 ngày
```
Công chuẩn: 24 ngày
- Chấm công: 20 ngày → working_days = 20
- Làm bù: 2 ngày → makeup_days = 2
- Nghỉ phép: 1 ngày → leave_days = 1
- Nghỉ KL: 1 ngày → unpaid_leave_days = 1

Kiểm tra: 20 + 2 + 1 + 1 = 24 ✅
```

### Trường hợp 2: Không có làm bù
```
Công chuẩn: 24 ngày
- Chấm công: 22 ngày → working_days = 22
- Làm bù: 0 ngày → makeup_days = 0
- Nghỉ phép: 1 ngày → leave_days = 1
- Nghỉ KL: 1 ngày → unpaid_leave_days = 1

Kiểm tra: 22 + 0 + 1 + 1 = 24 ✅
```

## Files Modified

### Backend
1. `supabase/migrations/add_makeup_days_to_payroll_items.sql` - Migration
2. `lib/types/database.ts` - TypeScript interface
3. `lib/actions/payroll/recalculate-single.ts` - Calculation logic
4. `lib/actions/payroll/generate-payroll.ts` - Calculation logic

### Frontend
5. `components/payroll/payroll-detail-panel.tsx` - Table & detail dialog
6. `components/payroll/payslip-panel.tsx` - Payslip overview
7. `components/payroll/payroll-breakdown-dialog.tsx` - Breakdown dialog

## Testing Checklist

- [ ] Migration chạy thành công
- [ ] Cột `makeup_days` xuất hiện trong database
- [ ] Tính lương hiển thị đúng ngày công bù
- [ ] Bảng lương hiển thị cột "Công bù"
- [ ] Chi tiết lương hiển thị lương công bù
- [ ] Phiếu lương hiển thị số ngày công bù
- [ ] Công thức kiểm tra trong log đúng
- [ ] Không có TypeScript errors
