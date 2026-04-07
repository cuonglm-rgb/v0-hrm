# Feature: Resignation Date (Ngày nghỉ việc)

## Mục đích
Cho phép ghi nhận ngày nghỉ việc của nhân viên và tự động điều chỉnh tính lương chỉ đến ngày đó.

## Thay đổi Database

### Migration: scripts/044-add-resignation-date.sql
```sql
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS resignation_date DATE;

CREATE INDEX IF NOT EXISTS idx_employees_resignation_date 
ON employees(resignation_date);
```

## Thay đổi UI

### components/employees/employee-detail.tsx
Thêm trường "Ngày nghỉ việc" trong tab "Công việc" với validation:

```tsx
<div className="space-y-2">
  <Label htmlFor="resignation_date">
    Ngày nghỉ việc
    {formData.status === 'resigned' && (
      <span className="text-red-500 ml-1">*</span>
    )}
  </Label>
  <Input
    id="resignation_date"
    type="date"
    value={formData.resignation_date}
    onChange={(e) => setFormData({ ...formData, resignation_date: e.target.value })}
    disabled={!isHROrAdmin}
    className={formData.status === 'resigned' && !formData.resignation_date ? 'border-red-500' : ''}
  />
  {formData.resignation_date && (
    <p className="text-xs text-amber-600">
      Lương sẽ chỉ được tính đến ngày này
    </p>
  )}
  {formData.status === 'resigned' && !formData.resignation_date && (
    <p className="text-xs text-red-500">
      Bắt buộc nhập ngày nghỉ việc khi trạng thái là "Đã nghỉ việc"
    </p>
  )}
</div>
```

### Validation (Client-side)
```typescript
const handleSave = async () => {
  // Validation: Nếu status = resigned thì phải có resignation_date
  if (formData.status === 'resigned' && !formData.resignation_date) {
    toast.error("Vui lòng nhập ngày nghỉ việc khi chuyển sang trạng thái 'Đã nghỉ việc'")
    return
  }
  // ... rest of save logic
}
```

## Thay đổi Backend

### lib/actions/employee-actions.ts
Thêm validation server-side:

```typescript
export async function updateEmployee(
  id: string,
  data: Partial<Pick<Employee, "..." | "resignation_date">>,
) {
  // Validation: Nếu status = resigned thì phải có resignation_date
  if (data.status === 'resigned' && !data.resignation_date) {
    return { 
      success: false, 
      error: "Vui lòng nhập ngày nghỉ việc khi chuyển sang trạng thái 'Đã nghỉ việc'" 
    }
  }
  // ... rest of update logic
}
```

### lib/types/database.ts
Thêm trường vào interface:

```typescript
export interface Employee {
  // ... existing fields
  resignation_date: string | null
  // ... rest
}
```

## Logic tính lương

### lib/actions/payroll/generate-payroll.ts

#### 1. Kiểm tra ngày nghỉ việc
```typescript
let effectiveEndDate = endDate
if (emp.resignation_date) {
  const resignDate = emp.resignation_date
  if (resignDate < startDate) {
    logger.log(`⚠️  Nhân viên đã nghỉ việc trước kỳ lương (${resignDate}) - Bỏ qua`)
    return false
  }
  if (resignDate < endDate) {
    effectiveEndDate = resignDate
    logger.log(`📅 Nhân viên nghỉ việc ngày ${resignDate} - Chỉ tính lương đến ngày này`)
  }
}
```

#### 2. Sử dụng effectiveEndDate thay vì endDate
Tất cả các query và tính toán sử dụng `effectiveEndDate`:
- Attendance logs
- Employee requests (phiếu nghỉ, OT, WFH)
- Holidays và company holidays
- Violations
- Adjustments
- Overtime calculation

## Ví dụ

### Case 1: Nhân viên nghỉ giữa tháng
- Kỳ lương: 01/03/2026 - 31/03/2026
- Ngày nghỉ việc: 15/03/2026
- Kết quả: Chỉ tính lương từ 01/03 đến 15/03

### Case 2: Nhân viên nghỉ trước kỳ lương
- Kỳ lương: 01/03/2026 - 31/03/2026
- Ngày nghỉ việc: 28/02/2026
- Kết quả: Bỏ qua, không tính lương tháng 3

### Case 3: Nhân viên chưa nghỉ
- Kỳ lương: 01/03/2026 - 31/03/2026
- Ngày nghỉ việc: null
- Kết quả: Tính lương full tháng 3

## Lưu ý

1. Ngày nghỉ việc chỉ ảnh hưởng đến tính lương, không tự động thay đổi status
2. HR/Admin cần tự set status = 'resigned' nếu muốn
3. Attendance logs sau ngày nghỉ việc sẽ bị bỏ qua
4. Phiếu nghỉ/OT sau ngày nghỉ việc sẽ bị bỏ qua
5. Công chuẩn vẫn giữ nguyên (24 ngày), chỉ có ngày công thực tế bị giới hạn

## Files changed
- `scripts/044-add-resignation-date.sql` - Migration thêm trường resignation_date
- `components/employees/employee-detail.tsx` - UI với validation bắt buộc khi status = resigned
- `lib/actions/employee-actions.ts` - Server-side validation
- `lib/types/database.ts` - Thêm resignation_date vào Employee interface
- `lib/actions/payroll/generate-payroll.ts` - Logic tính lương hàng loạt với resignation_date
- `lib/actions/payroll/recalculate-single.ts` - Logic tính lương cá nhân với resignation_date
