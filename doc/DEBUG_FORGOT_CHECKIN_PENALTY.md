# Debug Phạt Quên Chấm Công

## Vấn đề

Cấu hình phạt:
- `penalty_type: "half_day_salary"` (trừ nửa ngày lương)
- Lương cơ bản: 10,000,000đ
- Công chuẩn: 25 ngày
- Lương ngày: 400,000đ
- **Phạt mong đợi: 200,000đ** (nửa ngày)

Nhưng kết quả: **Phạt 0đ** ❌

## Console Logs để kiểm tra

Khi chạy tính lương, hệ thống sẽ in ra các log sau:

### 1. Log bắt đầu xử lý phạt

```
[Payroll] NV2025125342: Xử lý phạt "Quên chấm công" (trigger: attendance)
[Payroll] NV2025125342: Penalty conditions: ["forgot_checkin","forgot_checkout"]
[Payroll] NV2025125342: Penalty type: half_day_salary, Daily salary: 400000
```

→ Kiểm tra xem có log này không. Nếu không có → Phạt không được xử lý.

### 2. Log kiểm tra quên chấm công về

```
[Payroll] NV2025125342: Kiểm tra phạt quên chấm công về...
[Payroll] NV2025125342: Tìm thấy X attendance logs
```

→ Kiểm tra số lượng attendance logs. Nếu = 0 → Không có dữ liệu chấm công.

### 3. Log chi tiết từng ngày

```
[Payroll] NV2025125342: Ngày 2025-12-09 - check_in: 2025-12-09T07:56:00, check_out: THIẾU
```

→ Kiểm tra xem ngày 09/12 có thiếu check_out không.

### 4. Log kiểm tra phiếu approved

```
[Payroll] NV2025125342: Có phiếu forgot_checkout approved cho ngày 2025-12-09
[Payroll] NV2025125342: Miễn phạt quên chấm công về ngày 2025-12-09 (có phiếu approved)
```

→ Nếu có log này → Phiếu đã được duyệt nên miễn phạt.

### 5. Log phạt

```
[Payroll] NV2025125342: Phạt quên chấm công về ngày 2025-12-09 (thiếu check_out, không có phiếu approved) - 200000đ
[Payroll] NV2025125342: Tổng số vi phạm phạt: 1
[Payroll] NV2025125342: Thêm phạt: Quên chấm công về - 200000đ
```

→ Nếu có log này → Phạt đã được tính đúng.

## Các trường hợp có thể xảy ra

### Trường hợp 1: Không có log "Xử lý phạt"

**Nguyên nhân:**
- Loại phạt không active (`is_active = false`)
- Loại phạt không bật tự động (`is_auto_applied = false`)
- Trigger không đúng (không phải "attendance")

**Giải pháp:**
```sql
-- Kiểm tra cấu hình
SELECT id, name, is_active, is_auto_applied, auto_rules->>'trigger' as trigger
FROM payroll_adjustment_types
WHERE code = 'FORGOT_CHECKIN';

-- Cập nhật nếu cần
UPDATE payroll_adjustment_types
SET is_active = true, is_auto_applied = true
WHERE code = 'FORGOT_CHECKIN';
```

### Trường hợp 2: Không có attendance logs

**Nguyên nhân:**
- Nhân viên không có dữ liệu chấm công trong tháng
- Dữ liệu chấm công bị xóa

**Giải pháp:**
```sql
-- Kiểm tra attendance logs
SELECT check_in, check_out
FROM attendance_logs
WHERE employee_id = (SELECT id FROM employees WHERE employee_code = 'NV2025125342')
  AND check_in >= '2025-12-01'
  AND check_in <= '2025-12-31T23:59:59'
ORDER BY check_in;
```

### Trường hợp 3: Có check_out đầy đủ

**Nguyên nhân:**
- Dữ liệu chấm công đã được cập nhật (có check_out)
- Không thực sự quên chấm công

**Log:**
```
[Payroll] NV2025125342: Ngày 2025-12-09 có check_out → không phạt
```

**Giải pháp:**
- Kiểm tra lại dữ liệu attendance_logs
- Nếu thực sự quên chấm công, xóa check_out để test

### Trường hợp 4: Có phiếu approved

**Nguyên nhân:**
- Phiếu "forgot_checkout" đã được duyệt (status = "approved")
- Cấu hình `exempt_with_request: true` nên miễn phạt

**Log:**
```
[Payroll] NV2025125342: Có phiếu forgot_checkout approved cho ngày 2025-12-09
[Payroll] NV2025125342: Miễn phạt quên chấm công về ngày 2025-12-09 (có phiếu approved)
```

**Giải pháp:**
- Nếu muốn phạt dù có phiếu → Set `exempt_with_request: false`
- Nếu muốn test phạt → Đổi status phiếu thành "pending" hoặc "rejected"

```sql
-- Kiểm tra phiếu
SELECT er.request_date, er.status, rt.code, rt.name
FROM employee_requests er
JOIN request_types rt ON er.request_type_id = rt.id
WHERE er.employee_id = (SELECT id FROM employees WHERE employee_code = 'NV2025125342')
  AND rt.code = 'forgot_checkout'
  AND er.request_date = '2025-12-09';

-- Đổi status để test (nếu cần)
UPDATE employee_requests
SET status = 'pending'
WHERE employee_id = (SELECT id FROM employees WHERE employee_code = 'NV2025125342')
  AND request_date = '2025-12-09'
  AND request_type_id = (SELECT id FROM request_types WHERE code = 'forgot_checkout');
```

### Trường hợp 5: penalty_type không đúng

**Nguyên nhân:**
- `penalty_type` không phải "half_day_salary"
- Hoặc bị null

**Giải pháp:**
```sql
-- Kiểm tra penalty_type
SELECT auto_rules->>'penalty_type' as penalty_type
FROM payroll_adjustment_types
WHERE code = 'FORGOT_CHECKIN';

-- Cập nhật nếu cần
UPDATE payroll_adjustment_types
SET auto_rules = jsonb_set(
  auto_rules,
  '{penalty_type}',
  '"half_day_salary"'::jsonb
)
WHERE code = 'FORGOT_CHECKIN';
```

## Cách kiểm tra từng bước

### Bước 1: Kiểm tra cấu hình phạt

```sql
SELECT 
  id,
  name,
  code,
  amount,
  is_active,
  is_auto_applied,
  auto_rules->>'trigger' as trigger,
  auto_rules->>'penalty_type' as penalty_type,
  auto_rules->'penalty_conditions' as penalty_conditions,
  auto_rules->>'exempt_with_request' as exempt_with_request
FROM payroll_adjustment_types
WHERE code = 'FORGOT_CHECKIN';
```

**Kết quả mong đợi:**
- `is_active = true`
- `is_auto_applied = true`
- `trigger = "attendance"`
- `penalty_type = "half_day_salary"`
- `penalty_conditions = ["forgot_checkin","forgot_checkout"]`

### Bước 2: Kiểm tra attendance logs

```sql
SELECT 
  check_in,
  check_out,
  CASE WHEN check_out IS NULL THEN 'THIẾU' ELSE 'CÓ' END as status
FROM attendance_logs
WHERE employee_id = (SELECT id FROM employees WHERE employee_code = 'NV2025125342')
  AND check_in >= '2025-12-01'
  AND check_in <= '2025-12-31T23:59:59'
ORDER BY check_in;
```

**Kết quả mong đợi:**
- Ngày 09/12: `check_out = NULL` (thiếu)

### Bước 3: Kiểm tra phiếu xin phép

```sql
SELECT 
  er.request_date,
  er.status,
  rt.code,
  rt.name
FROM employee_requests er
JOIN request_types rt ON er.request_type_id = rt.id
WHERE er.employee_id = (SELECT id FROM employees WHERE employee_code = 'NV2025125342')
  AND rt.code IN ('forgot_checkin', 'forgot_checkout')
  AND er.request_date >= '2025-12-01'
  AND er.request_date <= '2025-12-31'
ORDER BY er.request_date;
```

**Kết quả mong đợi:**
- Ngày 09/12: `status = "pending"` hoặc không có phiếu

### Bước 4: Chạy tính lương và xem console log

1. Mở Developer Console (F12)
2. Chạy tính lương tháng 12/2025
3. Xem console log để debug

### Bước 5: Kiểm tra kết quả

```sql
-- Kiểm tra payroll item
SELECT 
  pi.working_days,
  pi.base_salary,
  pi.total_income,
  pi.total_deduction,
  pi.net_salary,
  pi.note
FROM payroll_items pi
JOIN employees e ON pi.employee_id = e.id
WHERE e.employee_code = 'NV2025125342'
  AND pi.payroll_run_id = (
    SELECT id FROM payroll_runs 
    WHERE month = 12 AND year = 2025 
    ORDER BY created_at DESC LIMIT 1
  );

-- Kiểm tra chi tiết phạt
SELECT 
  pad.category,
  pad.reason,
  pad.final_amount,
  pat.name
FROM payroll_adjustment_details pad
JOIN payroll_adjustment_types pat ON pad.adjustment_type_id = pat.id
JOIN payroll_items pi ON pad.payroll_item_id = pi.id
JOIN employees e ON pi.employee_id = e.id
WHERE e.employee_code = 'NV2025125342'
  AND pi.payroll_run_id = (
    SELECT id FROM payroll_runs 
    WHERE month = 12 AND year = 2025 
    ORDER BY created_at DESC LIMIT 1
  )
  AND pad.category = 'penalty';
```

## Tóm tắt

Để phạt được áp dụng đúng, cần đảm bảo:

1. ✅ Loại phạt active và auto_applied
2. ✅ Trigger = "attendance"
3. ✅ penalty_type = "half_day_salary"
4. ✅ penalty_conditions có "forgot_checkout"
5. ✅ Có attendance log thiếu check_out
6. ✅ KHÔNG có phiếu approved (hoặc exempt_with_request = false)

Nếu vẫn phạt 0đ, hãy xem console log để tìm nguyên nhân chính xác!
