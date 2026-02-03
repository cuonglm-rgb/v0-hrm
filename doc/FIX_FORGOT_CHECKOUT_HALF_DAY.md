# Sửa Logic: Quên Chấm Công Về Lúc 12h - Tính Nửa Ngày

## Vấn đề

Khi nhân viên:
1. Quên chấm công về lúc 12:00 (giờ nghỉ trưa)
2. Nghỉ ca chiều
3. Tạo phiếu "Quên chấm công về" với giờ 12:00:00 và được duyệt

**Lỗi**: Hệ thống vẫn tính lương cho cả ngày thay vì chỉ nửa ngày (buổi sáng)

## Ví dụ thực tế

- Nhân viên: Thuy Dao Thi (00220)
- Ngày: 12/01/2026
- Giờ trong phiếu: 12:00:00
- Phiếu đã duyệt: Có
- **Kỳ vọng**: Tính 0.5 ngày công
- **Thực tế**: Hệ thống tính 1 ngày công (sai)

## Nguyên nhân

Logic cũ trong `getEmployeeViolations()`:
- Chỉ dùng phiếu đã duyệt để **miễn phạt** (exempt from penalty)
- KHÔNG dùng `request_time` trong phiếu để **bổ sung giờ check_in/check_out** thiếu
- Khi không có check_out → đánh dấu `forgotCheckOut = true` và không tính vi phạm
- Nhưng không tính là làm nửa ngày → tính lương full day

## Giải pháp

### 1. Lấy thêm `request_time` từ phiếu đã duyệt

```typescript
const { data: approvedRequests } = await supabase
  .from("employee_requests")
  .select(`
    request_date,
    request_time,           // ← MỚI: lấy giờ trong phiếu
    request_type:request_types!request_type_id(code)
  `)
  .eq("employee_id", employeeId)
  .eq("status", "approved")
  .gte("request_date", startDate)
  .lte("request_date", endDate)
```

### 2. Lưu giờ quên chấm công vào Map

```typescript
const forgotCheckinTimeByDate = new Map<string, string>()
const forgotCheckoutTimeByDate = new Map<string, string>()

for (const req of approvedRequests || []) {
  const reqType = req.request_type as any
  if (reqType?.code) {
    // Lưu giờ trong phiếu quên chấm công
    if (reqType.code === "forgot_checkin" && req.request_time) {
      forgotCheckinTimeByDate.set(req.request_date, req.request_time)
    }
    if (reqType.code === "forgot_checkout" && req.request_time) {
      forgotCheckoutTimeByDate.set(req.request_date, req.request_time)
    }
  }
}
```

### 3. Lấy attendance logs bao gồm cả trường hợp chỉ có check_out

```typescript
// CŨ - chỉ lấy logs có check_in
.gte("check_in", startDate)
.lte("check_in", endDate + "T23:59:59")

// MỚI - lấy cả logs có check_in HOẶC check_out
.or(`and(check_in.gte.${startDate},check_in.lte.${endDate}T23:59:59),and(check_out.gte.${startDate},check_out.lte.${endDate}T23:59:59)`)
```

### 4. Xử lý cả 3 trường hợp

```typescript
// Trường hợp 1: Có check_in (bình thường)
if (log.check_in) {
  checkInDate = new Date(log.check_in)
  dateStr = toDateStringVN(checkInDate)
  const { hours: checkInHour, minutes: checkInMin } = getTimePartsVN(checkInDate)
  checkInMinutes = checkInHour * 60 + checkInMin
  hasCheckIn = true
}
// Trường hợp 2: Không có check_in nhưng có check_out (quên check_in)
else if (log.check_out) {
  const checkOutDate = new Date(log.check_out)
  dateStr = toDateStringVN(checkOutDate)
  
  // Dùng giờ trong phiếu quên chấm công đến (nếu có)
  const forgotCheckinTime = forgotCheckinTimeByDate.get(dateStr)
  if (forgotCheckinTime) {
    const [hour, minute] = forgotCheckinTime.split(":").map(Number)
    checkInMinutes = hour * 60 + minute
    hasCheckIn = true
  }
}
```

### 5. Bổ sung check_out từ phiếu nếu thiếu

```typescript
if (log.check_out) {
  const checkOutDate = new Date(log.check_out)
  const { hours: checkOutHour, minutes: checkOutMin } = getTimePartsVN(checkOutDate)
  checkOutMinutes = checkOutHour * 60 + checkOutMin
  hasCheckOut = true
} else {
  // Nếu không có check_out nhưng có phiếu quên chấm công về đã duyệt
  // thì dùng giờ trong phiếu làm check_out
  const forgotCheckoutTime = forgotCheckoutTimeByDate.get(dateStr)
  if (forgotCheckoutTime) {
    const [hour, minute] = forgotCheckoutTime.split(":").map(Number)
    checkOutMinutes = hour * 60 + minute
    hasCheckOut = true  // ← Quan trọng: đánh dấu là có check_out
  }
}
```

### 6. Logic tính nửa ngày sẽ hoạt động tự động

Khi `hasCheckOut = true` và `checkOutMinutes = 720` (12:00):
- Nếu `breakStartMinutes = 720` và `breakEndMinutes = 780` (12:00 - 13:00)
- Thì logic hiện tại sẽ tự động nhận diện:

```typescript
if (checkOutMinutes <= breakEndMinutes) {
  isHalfDay = true     // ← Tự động tính là nửa ngày
  earlyMinutes = 0     // Không tính về sớm
}
```

## Kết quả

Sau khi sửa:
1. ✅ Khi có phiếu "Quên chấm công về" lúc 12:00 đã duyệt
2. ✅ Hệ thống dùng 12:00 làm giờ check_out
3. ✅ Logic half-day nhận diện checkout lúc 12:00 → `isHalfDay = true`
4. ✅ Tính lương = 0.5 ngày công (đúng)
5. ✅ Không bị phạt (vì có phiếu đã duyệt)

Tương tự cho phiếu "Quên chấm công đến":
1. ✅ Dùng `request_time` làm giờ check_in
2. ✅ Tính toán vi phạm dựa trên giờ này
3. ✅ Tính half-day nếu check_in sau giờ nghỉ trưa

## Files đã sửa

- [lib/actions/payroll/violations.ts](../lib/actions/payroll/violations.ts)
  - Lấy thêm `request_time` từ employee_requests
  - Lưu giờ quên chấm công vào Map
  - Bổ sung check_in/check_out từ phiếu đã duyệt
  - Tính toán vi phạm chính xác dựa trên giờ thực tế

## Test Cases

### Case 1: Quên chấm công về lúc 12h
- **Input**: 
  - Check in: 07:30
  - Check out: null (quên chấm)
  - Phiếu forgot_checkout đã duyệt với request_time = 12:00
- **Expected**:
  - `hasCheckOut = true`
  - `checkOutMinutes = 720` (12:00)
  - `isHalfDay = true`
  - `earlyMinutes = 0`
  - Tính 0.5 ngày công

### Case 2: Quên chấm công đến, về lúc 17:00
- **Input**:
  - Check in: null (quên chấm)
  - Check out: 17:00
  - Phiếu forgot_checkin đã duyệt với request_time = 08:00
- **Expected**:
  - `hasCheckIn = true`
  - `checkInMinutes = 480` (08:00)
  - `lateMinutes = 0` (nếu ca bắt đầu 08:00)
  - Tính 1 ngày công đầy đủ

### Case 3: Quên cả 2 (không khả thi)
- Nếu không có cả check_in và check_out trong attendance_logs
- Thì không có record → không xử lý
