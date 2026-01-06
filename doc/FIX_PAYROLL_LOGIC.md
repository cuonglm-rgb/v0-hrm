# Sửa Logic Tính Lương - Xử Lý Phiếu

## Vấn đề đã phát hiện

1. **Nghỉ phép năm** (`annual_leave`) - `affects_payroll=true` nhưng KHÔNG được tính vào lương
2. **Làm việc từ xa** (`work_from_home`) - KHÔNG được tính như ngày làm việc bình thường
3. **Đi muộn** - Có phiếu giải trình đã approved nhưng VẪN bị phạt
4. **Tăng ca** - Đã hoạt động đúng ✓

## Nguyên nhân

Code cũ chỉ xử lý bảng `leave_requests` (bảng cũ) nhưng KHÔNG xử lý `employee_requests` (bảng mới chứa TẤT CẢ các loại phiếu)

## Giải pháp đã áp dụng

### 1. Xử lý các phiếu từ `employee_requests`

```typescript
// Lấy tất cả phiếu đã approved từ employee_requests
const { data: employeeRequests } = await supabase
  .from("employee_requests")
  .select(`
    *,
    request_type:request_types!request_type_id(
      code, 
      name, 
      affects_payroll, 
      deduct_leave_balance,
      requires_date_range,
      requires_single_date
    )
  `)
  .eq("employee_id", emp.id)
  .eq("status", "approved")
```

### 2. Phân loại phiếu theo logic nghiệp vụ

| Loại phiếu | Code | Xử lý |
|------------|------|-------|
| Nghỉ phép năm | `annual_leave` | Tính như ngày làm việc có lương, trừ phép |
| Nghỉ ốm | `sick_leave` | Tính như ngày làm việc có lương, không trừ phép |
| Nghỉ thai sản | `maternity_leave` | Tính như ngày làm việc có lương, không trừ phép |
| Làm việc từ xa | `work_from_home` | Tính như ngày làm việc bình thường |
| Nghỉ không lương | `unpaid_leave` | Trừ lương |
| Tăng ca | `overtime` | Cộng tiền OT (đã xử lý riêng) |
| Đi muộn | `late_arrival` | Miễn phạt nếu có phiếu approved |
| Về sớm | `early_leave` | Miễn phạt nếu có phiếu approved |
| Công tác | `business_trip` | Không ảnh hưởng ngày công |
| Quên chấm công | `forgot_checkin` | Không ảnh hưởng ngày công |

### 3. Công thức tính lương mới

```typescript
// Ngày công thực tế = ngày đi làm + WFH + nghỉ phép có lương
const actualWorkingDays = fullWorkDays + (halfDays * 0.5) + workFromHomeDays + paidLeaveDays

// Lương gốp = lương theo ngày công + phụ cấp + OT
const grossSalary = dailySalary * actualWorkingDays + totalAllowances + totalOTPay

// Khấu trừ = nghỉ không lương + quỹ + phạt
const totalDeduction = dailySalary * unpaidLeaveDays + totalDeductions + totalPenalties

// Lương thực nhận
const netSalary = grossSalary - totalDeduction
```

### 4. Xử lý phạt đi muộn thông minh

```typescript
// Kiểm tra phiếu từ employee_requests
const approvedByDate = new Map<string, string[]>()

for (const req of approvedRequests || []) {
  const reqType = req.request_type as any
  if (reqType?.code) {
    const types = approvedByDate.get(req.request_date) || []
    types.push(reqType.code)
    approvedByDate.set(req.request_date, types)
  }
}

// Khi tính phạt, kiểm tra xem có phiếu miễn phạt không
if (exemptWithRequest && v.hasApprovedRequest) {
  const hasExemptRequest = v.approvedRequestTypes.some(
    (type) => exemptRequestTypes.includes(type as any)
  )
  if (hasExemptRequest) return false // Không phạt
}
```

## Kết quả

✅ **Nghỉ phép năm** - Được tính vào lương (như ngày làm việc)
✅ **Làm việc từ xa** - Được tính như ngày làm việc bình thường
✅ **Đi muộn có phiếu** - KHÔNG bị phạt nếu có phiếu `late_arrival` approved
✅ **Tăng ca** - Vẫn hoạt động đúng như cũ
✅ **Hiển thị riêng biệt** - Thu nhập được tách thành:
  - Lương theo ngày công (chấm công thực tế)
  - Làm việc từ xa (WFH)
  - Lương nghỉ phép có lương
  - Tiền tăng ca (OT)

## Ghi chú trong phiếu lương

Phiếu lương sẽ hiển thị chi tiết:
- `Chấm công: X ngày` ← MỚI (ngày đi làm thực tế)
- `WFH: X ngày` ← MỚI
- `Nghỉ phép: X ngày` ← MỚI
- `Đi muộn: X lần`
- `Nửa ngày: X`
- `Không tính công: X`
- `Phạt: X lần`
- `OT: Xh`

## Hiển thị trong breakdown dialog

**Thu nhập:**
- Lương theo ngày công (0 ngày) → +0đ (nếu không đi làm)
- Làm việc từ xa (X ngày) → +XXXđ (nếu có WFH)
- Lương nghỉ phép có lương (1 ngày) → +384.615đ (hiển thị riêng)
- Tiền tăng ca → +XXXđ (giữ nguyên)

**Trước đây (bị duplicate):**
- Lương theo ngày công (1 ngày) → +384.615đ
- Lương nghỉ phép có lương (1 ngày) → +384.615đ ❌ DUPLICATE

**Bây giờ (rõ ràng):**
- Lương theo ngày công (0 ngày) → +0đ
- Lương nghỉ phép có lương (1 ngày) → +384.615đ ✅ ĐÚNG

## Cách kiểm tra

1. Tạo phiếu nghỉ phép năm → Duyệt → Chạy tính lương → Kiểm tra `working_days` có tăng không
2. Tạo phiếu làm việc từ xa → Duyệt → Chạy tính lương → Kiểm tra note có "WFH: X ngày"
3. Tạo phiếu đi muộn → Duyệt → Chạy tính lương → Kiểm tra KHÔNG bị phạt
4. Đi muộn KHÔNG có phiếu → Chạy tính lương → Kiểm tra VẪN bị phạt

## File đã sửa

- `lib/actions/payroll-actions.ts`
  - Hàm `generatePayroll()` - Thêm xử lý `employee_requests`, loại bỏ logic cũ
  - Hàm `getEmployeeViolations()` - Chỉ kiểm tra phiếu từ `employee_requests`

## Thay đổi so với code cũ

- ❌ Loại bỏ xử lý `leave_requests` (bảng cũ)
- ❌ Loại bỏ xử lý `time_adjustment_requests` (bảng cũ)
- ✅ Chỉ xử lý `employee_requests` (bảng mới - single source of truth)

