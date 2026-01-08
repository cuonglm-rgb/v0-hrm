# Sửa Logic Phạt Quên Chấm Công

## Vấn đề

Phạt "Quên chấm công" đã được cấu hình trong database với:
- `trigger: "attendance"`
- `penalty_conditions: ["forgot_checkin", "forgot_checkout"]`

Nhưng **KHÔNG được áp dụng vào lương** vì:
1. Logic tính lương chỉ xử lý phạt có `trigger: "late"`
2. Logic cũ chỉ phạt khi **có phiếu approved**, trong khi phải phạt khi **KHÔNG có phiếu approved**

## Nguyên nhân

### Vấn đề 1: Trigger không được xử lý

Trong file `lib/actions/payroll-actions.ts`, logic phạt tự động chỉ kiểm tra:

```typescript
if (adjType.category === "penalty" && rules?.trigger === "late") {
  // Xử lý phạt
}
```

→ Phạt có `trigger: "attendance"` bị bỏ qua!

### Vấn đề 2: Logic phạt ngược

Logic cũ:
```typescript
// Lấy phiếu đã approved
const { data: forgotCheckoutRequests } = await supabase
  .from("employee_requests")
  .select("...")
  .eq("status", "approved") // ❌ SAI: Chỉ lấy phiếu đã duyệt

// Phạt những ngày có phiếu approved
for (const req of forgotCheckoutRequests) {
  penaltyViolations.push(...) // ❌ SAI: Phạt khi có phiếu approved
}
```

Logic đúng phải là:
- **Phạt khi KHÔNG có phiếu approved** (phiếu pending/rejected hoặc không có phiếu)
- **Miễn phạt khi có phiếu approved** (nếu cấu hình `exempt_with_request: true`)

## Giải pháp

### 1. Cập nhật logic tính lương

Sửa điều kiện để hỗ trợ cả 2 loại trigger:

```typescript
if (adjType.category === "penalty" && (rules?.trigger === "late" || rules?.trigger === "attendance")) {
  // Xử lý phạt
}
```

### 2. Sửa logic phạt quên chấm công

#### Logic mới cho "Quên chấm công về":

```typescript
// 1. Lấy tất cả attendance logs
const { data: allLogs } = await supabase
  .from("attendance_logs")
  .select("check_in, check_out")
  .eq("employee_id", emp.id)

// 2. Lấy danh sách phiếu forgot_checkout đã approved (để miễn phạt)
const { data: approvedForgotCheckout } = await supabase
  .from("employee_requests")
  .select("...")
  .eq("status", "approved")

const approvedDates = new Set(approvedForgotCheckout.map(r => r.request_date))

// 3. Kiểm tra từng ngày
for (const log of allLogs) {
  const logDate = new Date(log.check_in).toISOString().split("T")[0]
  
  // Nếu có check_out → không phạt
  if (log.check_out) continue
  
  // Nếu có phiếu approved và cấu hình miễn phạt → bỏ qua
  if (exemptWithRequest && approvedDates.has(logDate)) {
    console.log("Miễn phạt (có phiếu approved)")
    continue
  }
  
  // Nếu KHÔNG có phiếu approved → Phạt
  console.log("Phạt quên chấm công về (thiếu check_out, không có phiếu approved)")
  penaltyViolations.push({
    date: logDate,
    reason: "Quên chấm công về",
    amount: penaltyAmount,
  })
}
```

### 3. Thêm console.log để debug

Tất cả các bước quan trọng đều có log:
- `[Payroll] Miễn phạt quên chấm công về ngày X (có phiếu approved)`
- `[Payroll] Phạt quên chấm công về ngày X (thiếu check_out, không có phiếu approved) - XXXđ`

## Cách hoạt động

### Phạt đi muộn/về sớm (trigger: "late")
- Kiểm tra từ `attendance_logs` (check_in, check_out)
- So sánh với `late_threshold_minutes`
- Áp dụng nếu `lateMinutes > threshold` hoặc `earlyMinutes > threshold`

### Phạt quên chấm công về (trigger: "attendance")
1. Lấy tất cả `attendance_logs` có `check_in` nhưng **thiếu `check_out`**
2. Kiểm tra xem có phiếu "forgot_checkout" đã approved không
3. Nếu **KHÔNG có phiếu approved** → Phạt
4. Nếu **có phiếu approved** và `exempt_with_request: true` → Miễn phạt

### Phạt quên chấm công đến (trigger: "attendance")
1. Kiểm tra các phiếu "forgot_checkin" có status = "pending" hoặc "rejected"
2. Nếu có phiếu nhưng chưa duyệt → Phạt
3. Nếu có phiếu đã approved và `exempt_with_request: true` → Miễn phạt

## Ví dụ cấu hình

```json
{
  "name": "Quên chấm công",
  "code": "FORGOT_CHECKIN",
  "category": "penalty",
  "amount": 0,
  "calculation_type": "per_occurrence",
  "is_auto_applied": true,
  "auto_rules": {
    "trigger": "attendance",
    "penalty_conditions": ["forgot_checkin", "forgot_checkout"],
    "penalty_type": "half_day_salary",
    "exempt_with_request": true
  }
}
```

## Kịch bản kiểm tra

### Kịch bản 1: Quên chấm công về, KHÔNG có phiếu

**Dữ liệu:**
- Ngày 09/12/2025: Có check_in, KHÔNG có check_out
- Không có phiếu "forgot_checkout"

**Kết quả:**
- ✅ Bị phạt
- Log: `Phạt quên chấm công về ngày 2025-12-09 (thiếu check_out, không có phiếu approved)`

### Kịch bản 2: Quên chấm công về, có phiếu PENDING

**Dữ liệu:**
- Ngày 09/12/2025: Có check_in, KHÔNG có check_out
- Có phiếu "forgot_checkout" nhưng status = "pending"

**Kết quả:**
- ✅ Bị phạt (vì phiếu chưa approved)
- Log: `Phạt quên chấm công về ngày 2025-12-09 (thiếu check_out, không có phiếu approved)`

### Kịch bản 3: Quên chấm công về, có phiếu APPROVED

**Dữ liệu:**
- Ngày 09/12/2025: Có check_in, KHÔNG có check_out
- Có phiếu "forgot_checkout" với status = "approved"
- Cấu hình: `exempt_with_request: true`

**Kết quả:**
- ✅ KHÔNG bị phạt (miễn phạt)
- Log: `Miễn phạt quên chấm công về ngày 2025-12-09 (có phiếu approved)`

### Kịch bản 4: Có check_out đầy đủ

**Dữ liệu:**
- Ngày 09/12/2025: Có check_in VÀ check_out

**Kết quả:**
- ✅ KHÔNG bị phạt (không quên chấm công)

## Kiểm tra

1. Tạo phiếu "Quên chấm công về" cho ngày 09/12/2025
2. **KHÔNG duyệt phiếu** (để status = "pending")
3. Chạy tính lương tháng 12/2025
4. Kiểm tra console log:
   ```
   [Payroll] NV2025125342: Phạt quên chấm công về ngày 2025-12-09 (thiếu check_out, không có phiếu approved) - 192308đ
   ```
5. Kiểm tra phiếu lương → Phải có phạt "Quên chấm công về ngày 2025-12-09"

## Lưu ý

- Phạt chỉ áp dụng khi **thiếu check_out** (hoặc check_in)
- **Phiếu pending/rejected** vẫn bị phạt
- **Phiếu approved** được miễn phạt (nếu `exempt_with_request: true`)
- Console log giúp debug dễ dàng

## File đã sửa

- `lib/actions/payroll-actions.ts` - Sửa logic phạt quên chấm công
- `scripts/026-fix-forgot-checkin-penalty-trigger.sql` - Script cập nhật database (nếu cần)
