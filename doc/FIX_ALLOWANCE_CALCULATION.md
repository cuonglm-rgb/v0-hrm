# SỬA LOGIC TÍNH PHỤ CẤP ĂN TRƯA

## 📋 YÊU CẦU

Phụ cấp ăn trưa chỉ tính khi:
1. **Đủ giờ chấm công đến VÀ chấm công về** (không có vi phạm)
2. **Được miễn 4 lần vi phạm** (quên chấm công đến/về, đến muộn/về sớm, nghỉ nửa ngày)
3. **Trừ từ lần thứ 5 vi phạm trở đi**
4. **Không liên quan tới phiếu phép**

## ❌ LỖI SAI TRONG LOGIC CŨ

### 1. Dùng `actualAttendanceDays` (cho phép số thập phân)
```typescript
// CŨ - SAI
let eligibleDays = actualAttendanceDays // 15.5, 16.5...
```

**Vấn đề:** 
- `actualAttendanceDays = workingDaysCount - (halfDays * 0.5)` → Cho phép 15.5, 16.5...
- Phụ cấp ăn trưa chỉ tính ngày làm ĐỦ → chỉ có số nguyên

### 2. Chỉ trừ `lateCount` (đi muộn), không trừ các vi phạm khác
```typescript
// CŨ - SAI
const excessLateDays = Math.max(0, lateCount - rules.late_grace_count)
eligibleDays -= excessLateDays
```

**Vấn đề:**
- Chỉ đếm đi muộn
- Không đếm: về sớm, quên chấm công, nghỉ nửa ngày

### 3. Không phát hiện "quên chấm công"
```typescript
// CŨ - SAI
if (!hasCheckOut) {
  lateMinutes = 0
  earlyMinutes = 0
  isHalfDay = false
  // KHÔNG đánh dấu là vi phạm
}
```

**Vấn đề:** Không có cách nào đếm số lần quên chấm công

## ✅ GIẢI PHÁP

### Bước 1: Thêm field phát hiện quên chấm công

```typescript
interface AttendanceViolation {
  date: string
  lateMinutes: number
  earlyMinutes: number
  isHalfDay: boolean
  isAbsent: boolean
  hasApprovedRequest: boolean
  approvedRequestTypes: string[]
  forgotCheckOut: boolean  // ← MỚI
  hasCheckIn: boolean      // ← MỚI
  hasCheckOut: boolean     // ← MỚI
}
```

### Bước 2: Cập nhật logic phát hiện vi phạm

```typescript
let forgotCheckOut = false

if (!hasCheckOut) {
  forgotCheckOut = true  // ← Đánh dấu quên chấm công về
  lateMinutes = 0
  earlyMinutes = 0
  isHalfDay = false
}

violations.push({
  date: dateStr,
  lateMinutes,
  earlyMinutes,
  isHalfDay,
  isAbsent: finalIsAbsent,
  hasApprovedRequest,
  approvedRequestTypes,
  forgotCheckOut,        // ← MỚI
  hasCheckIn: true,      // ← MỚI
  hasCheckOut,           // ← MỚI
})
```

### Bước 3: Tính ngày đủ giờ và tổng vi phạm

```typescript
// Ngày đủ giờ = có check_in VÀ check_out, không có vi phạm gì
const fullAttendanceDays = violationsWithoutOT.filter((v) => 
  v.hasCheckIn && 
  v.hasCheckOut && 
  !v.isHalfDay && 
  !v.isAbsent &&
  v.lateMinutes === 0 && 
  v.earlyMinutes === 0
).length

// Đếm tổng số vi phạm
const totalViolations = violationsWithoutOT.filter((v) => 
  v.lateMinutes > 0 ||        // Đi muộn
  v.earlyMinutes > 0 ||       // Về sớm
  v.forgotCheckOut ||         // Quên chấm công về
  v.isHalfDay ||              // Nghỉ nửa ngày
  v.isAbsent                  // Không tính công
).length
```

### Bước 4: Sửa logic tính phụ cấp

```typescript
if (adjType.calculation_type === "daily") {
  // Bắt đầu từ số ngày đủ giờ
  let eligibleDays = fullAttendanceDays

  if (rules) {
    // Áp dụng quy tắc miễn vi phạm (grace count)
    if (rules.late_grace_count !== undefined) {
      // Tính số vi phạm vượt quá số lần được miễn
      const excessViolations = Math.max(0, totalViolations - rules.late_grace_count)
      
      // Trừ số ngày bị vi phạm vượt quá
      eligibleDays = Math.max(0, eligibleDays - excessViolations)
    }

    // Trừ ngày nghỉ không lương (nếu có rule)
    if (rules.deduct_on_absent) {
      eligibleDays -= unpaidLeaveDays
      eligibleDays = Math.max(0, eligibleDays)
    }
  }

  eligibleDays = Math.max(0, Math.floor(eligibleDays)) // Đảm bảo là số nguyên
  const amount = eligibleDays * adjType.amount
}
```

## 📊 VÍ DỤ TÍNH TOÁN

### Trường hợp 1: Nhân viên tốt
```
- Tổng ngày chấm công: 20 ngày
- Ngày đủ giờ: 18 ngày
- Vi phạm: 2 lần (đi muộn 1 lần, quên chấm công về 1 lần)
- Grace count: 4 lần

Tính toán:
- fullAttendanceDays = 18
- totalViolations = 2
- excessViolations = max(0, 2 - 4) = 0
- eligibleDays = 18 - 0 = 18
- Phụ cấp = 18 × 35,000đ = 630,000đ ✓
```

### Trường hợp 2: Nhân viên có nhiều vi phạm
```
- Tổng ngày chấm công: 20 ngày
- Ngày đủ giờ: 14 ngày
- Vi phạm: 6 lần (đi muộn 2 lần, về sớm 1 lần, quên chấm công 2 lần, nghỉ nửa ngày 1 lần)
- Grace count: 4 lần

Tính toán:
- fullAttendanceDays = 14
- totalViolations = 6
- excessViolations = max(0, 6 - 4) = 2
- eligibleDays = 14 - 2 = 12
- Phụ cấp = 12 × 35,000đ = 420,000đ ✓
```

### Trường hợp 3: Nhân viên có nửa ngày
```
- Tổng ngày chấm công: 20 ngày
- Ngày đủ giờ: 15 ngày
- Ngày nửa ca: 1 ngày
- Vi phạm: 1 lần (nghỉ nửa ngày)
- Grace count: 4 lần

Tính toán:
- fullAttendanceDays = 15 (không tính nửa ngày)
- totalViolations = 1
- excessViolations = max(0, 1 - 4) = 0
- eligibleDays = 15 - 0 = 15
- Phụ cấp = 15 × 35,000đ = 525,000đ ✓ (KHÔNG PHẢI 15.5 × 35,000đ)
```

## 🎯 KẾT QUẢ

✅ Phụ cấp ăn trưa chỉ tính số nguyên (15, 16, 17...), không có số thập phân
✅ Đếm đầy đủ TẤT CẢ vi phạm (đi muộn, về sớm, quên chấm công, nghỉ nửa ngày)
✅ Áp dụng đúng quy tắc "miễn 4 lần, trừ từ lần thứ 5"
✅ Không liên quan tới phiếu phép (chỉ dựa vào dữ liệu chấm công)

## 📝 GHI CHÚ

- `fullAttendanceDays`: Số ngày có đủ check_in VÀ check_out, không vi phạm gì
- `totalViolations`: Tổng số lần vi phạm (đi muộn + về sớm + quên chấm công + nghỉ nửa ngày)
- `late_grace_count`: Số lần vi phạm được miễn (mặc định 4 lần)
- `excessViolations`: Số lần vi phạm vượt quá số lần được miễn
- `eligibleDays`: Số ngày được hưởng phụ cấp = fullAttendanceDays - excessViolations

## 🔍 KIỂM TRA

Để kiểm tra logic mới:
1. Tạo payroll cho tháng có dữ liệu chấm công
2. Xem log console để kiểm tra:
   - `Full attendance days`: Số ngày đủ giờ
   - `Total violations`: Tổng số vi phạm
   - `Grace`: Số lần được miễn
   - `Excess`: Số lần vi phạm vượt quá
   - `Final eligible`: Số ngày được hưởng phụ cấp
3. Kiểm tra phụ cấp ăn trưa trong payslip có đúng không

Ngày: 29/01/2026
