# Makeup Work Penalty Calculation Bugfix Design

## Overview

Backend hiện tại miễn phạt cho TẤT CẢ các ngày có phiếu "Đi muộn/về sớm làm bù" (`late_early_makeup`), bất kể nhân viên có hoàn thành giờ làm bù (`to_time`) hay không. Mặc dù backend violations đã tính đúng số phút về sớm (`earlyMinutes = to_time - checkout_time`), nhưng logic penalty trong `generate-payroll.ts` (dòng 1611-1621) chỉ kiểm tra XEM CÓ PHIẾU hay không, mà không kiểm tra XEM NHÂN VIÊN CÓ HOÀN THÀNH CAM KẾT hay không.

Fix này sẽ thêm điều kiện kiểm tra `checkout_time >= to_time` trước khi miễn phạt, đảm bảo chỉ miễn phạt khi nhân viên ĐÃ hoàn thành giờ làm bù.

## Glossary

- **Bug_Condition (C)**: Nhân viên có phiếu `late_early_makeup` với `to_time` = T AND checkout thực tế < T (chưa hoàn thành cam kết)
- **Property (P)**: Backend SHALL áp dụng phạt về sớm với `earlyMinutes = T - checkout_time`
- **Preservation**: Các trường hợp đã hoàn thành làm bù (`checkout >= to_time`) hoặc các loại phiếu khác vẫn được miễn phạt như cũ
- **late_early_makeup**: Loại phiếu "Đi muộn/về sớm làm bù" - nhân viên cam kết làm việc đến giờ `to_time` để bù cho vi phạm trước đó
- **to_time**: Giờ kết thúc ca làm bù mà nhân viên cam kết (ví dụ: 18:00)
- **checkout_time**: Giờ chấm công về thực tế của nhân viên (lấy từ `attendance_logs.check_out`)
- **earlyMinutes**: Số phút về sớm = `to_time - checkout_time` (đã được tính đúng trong `violations.ts`)
- **effectiveShiftEnd**: Giờ tan ca hiệu lực - đã được nâng lên theo `to_time` trong violations (dòng 195-199)
- **globalPenaltyByDate**: Map lưu các penalty theo ngày trong `processAdjustments` function

## Bug Details

### Bug Condition

Bug xảy ra khi nhân viên có phiếu "Đi muộn/về sớm làm bù" nhưng checkout trước giờ `to_time` đã cam kết. Backend violations ĐÃ phát hiện vi phạm đúng (tính `earlyMinutes`), nhưng logic penalty miễn phạt sai.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { date: string, checkout_time: string, to_time: string, request_type: string }
  OUTPUT: boolean
  
  RETURN input.request_type == "late_early_makeup"
         AND input.to_time IS NOT NULL
         AND input.checkout_time < input.to_time
         AND earlyMinutes > thresholdMinutes
END FUNCTION
```

### Examples

- **Ví dụ 1 (Bug)**: Nhân viên Hoàng Phan Tuấn (00002)
  - Phiếu làm bù: Ngày 20/03/2026 (08:00-18:00)
  - Chấm công: Vào 07:47 | Ra 17:14
  - Backend violations: `earlyMinutes = 18:00 - 17:14 = 46 phút` ✅ ĐÚNG
  - Backend penalty: Miễn phạt vì có phiếu `late_early_makeup` ❌ SAI
  - Hành vi mong muốn: Phạt về sớm 46 phút

- **Ví dụ 2 (Bug)**: Nhân viên có phiếu làm bù đến 19:00
  - Phiếu làm bù: Ngày 15/03/2026 (08:00-19:00)
  - Chấm công: Vào 08:05 | Ra 18:30
  - Backend violations: `earlyMinutes = 19:00 - 18:30 = 30 phút` ✅ ĐÚNG
  - Backend penalty: Miễn phạt ❌ SAI
  - Hành vi mong muốn: Phạt về sớm 30 phút

- **Ví dụ 3 (Correct)**: Nhân viên hoàn thành làm bù
  - Phiếu làm bù: Ngày 10/03/2026 (08:00-18:00)
  - Chấm công: Vào 07:55 | Ra 18:05
  - Backend violations: `earlyMinutes = 0` ✅ ĐÚNG
  - Backend penalty: Miễn phạt ✅ ĐÚNG
  - Hành vi mong muốn: Không phạt (đã hoàn thành)

- **Edge case**: Nhiều phiếu làm bù cùng ngày
  - Phiếu 1: 08:00-18:00
  - Phiếu 2: 08:00-19:00
  - Chấm công: Ra 18:30
  - Backend violations: Sử dụng `to_time` muộn nhất (19:00) → `earlyMinutes = 30 phút` ✅ ĐÚNG
  - Hành vi mong muốn: Phạt về sớm 30 phút

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Nhân viên có phiếu làm bù với `checkout >= to_time` → CONTINUE TO miễn phạt (đã hoàn thành)
- Nhân viên có phiếu làm bù với `checkout < to_time` nhưng `earlyMinutes <= thresholdMinutes` → CONTINUE TO không phạt (dưới ngưỡng)
- Nhân viên có phiếu loại khác (`late_arrival`, `early_leave`, `forgot_checkin`, v.v.) → CONTINUE TO miễn phạt theo logic hiện tại
- Ngày thiếu công gốc có phiếu làm bù (linked_deficit_date) → CONTINUE TO miễn phạt (dòng 1623-1627)
- Special day với `allow_early_leave = true` → CONTINUE TO miễn phạt về sớm
- Phạt đi muộn trong ngày làm bù → CONTINUE TO áp dụng bình thường (phiếu làm bù chỉ ảnh hưởng giờ tan ca)
- Tính toán violations trong `violations.ts` → CONTINUE TO hoạt động đúng (không cần sửa)
- Tính toán payroll cho các thành phần khác (allowance, deduction, OT) → CONTINUE TO hoạt động đúng

**Scope:**
Tất cả các ngày KHÔNG có phiếu `late_early_makeup` hoặc có phiếu nhưng đã hoàn thành (`checkout >= to_time`) sẽ hoàn toàn không bị ảnh hưởng. Fix này chỉ ảnh hưởng đến:
- Ngày có phiếu `late_early_makeup`
- Nhân viên checkout trước `to_time`
- Vi phạm vượt ngưỡng (`earlyMinutes > thresholdMinutes`)

## Hypothesized Root Cause

Dựa trên code review, root cause rõ ràng là:

1. **Logic Penalty Không Đầy Đủ**: Logic penalty (dòng 1611-1621 trong `generate-payroll.ts`) chỉ kiểm tra:
   ```typescript
   const hasExemptRequest = v.approvedRequestTypes.some((t: string) => exemptRequestTypes.includes(t))
   if (hasExemptRequest) {
     isExempted = true
   }
   ```
   - Chỉ kiểm tra XEM CÓ PHIẾU `late_early_makeup` hay không
   - KHÔNG kiểm tra xem nhân viên có hoàn thành `to_time` hay không

2. **Thiếu Dữ Liệu `to_time`**: Logic penalty không có quyền truy cập vào `to_time` từ phiếu `late_early_makeup`
   - `violations.ts` có `makeupShiftEndByDate` map (dòng 63, 105) nhưng không trả về trong violation object
   - `generate-payroll.ts` có `employeeRequests` (dòng 211) nhưng không được truyền vào `processAdjustments`

3. **Thiếu Dữ Liệu `checkout_time`**: Logic penalty chỉ có `v.earlyMinutes` nhưng không có giờ checkout thực tế
   - Cần `checkout_time` để so sánh với `to_time`
   - Hoặc cần flag từ violations để biết nhân viên đã hoàn thành làm bù chưa

## Correctness Properties

Property 1: Bug Condition - Penalty for Incomplete Makeup Work

_For any_ day where a `late_early_makeup` request exists with `to_time` = T AND employee checkout time < T AND `earlyMinutes > thresholdMinutes`, the fixed penalty logic SHALL apply early leave penalty with amount calculated based on `earlyMinutes`, NOT exempt the penalty.

**Validates: Requirements 2.1, 2.2, 2.4**

Property 2: Preservation - Completed Makeup Work Exemption

_For any_ day where a `late_early_makeup` request exists with `to_time` = T AND employee checkout time >= T, the fixed penalty logic SHALL continue to exempt the penalty, preserving the existing behavior for employees who complete their makeup work commitment.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**

## Fix Implementation

### Changes Required

**File**: `lib/actions/payroll/generate-payroll.ts`

**Function**: `processAdjustments` (penalty calculation section, dòng 1611-1621)

**Approach**: Có 2 cách tiếp cận, chọn cách nào tùy vào độ phức tạp và maintainability:

### Option 1: Thêm Flag vào Violations (Recommended)

**Ưu điểm**: 
- Tách biệt logic detection (violations.ts) và penalty (generate-payroll.ts)
- Dễ test và maintain
- Không cần query thêm data trong generate-payroll.ts

**Changes**:

1. **File**: `lib/actions/payroll/violations.ts`
   - Thêm field `completedMakeupWork: boolean` vào `AttendanceViolation` type
   - Trong vòng lặp xử lý logs (dòng 178-199), sau khi nâng `effectiveShiftEnd`:
     ```typescript
     const makeupEnd = makeupShiftEndByDate.get(dateStr)
     let completedMakeupWork = false
     if (makeupEnd && makeupEnd > effectiveShiftEnd) {
       effectiveShiftEnd = makeupEnd
       // Kiểm tra xem nhân viên có hoàn thành giờ làm bù không
       if (hasCheckOut && checkOutMinutes >= parseTime(makeupEnd)) {
         completedMakeupWork = true
       }
     }
     ```
   - Thêm `completedMakeupWork` vào violation object (dòng 320)

2. **File**: `lib/actions/payroll/types.ts`
   - Thêm field vào interface:
     ```typescript
     export interface AttendanceViolation {
       // ... existing fields
       completedMakeupWork: boolean  // true nếu có phiếu làm bù và đã hoàn thành
     }
     ```

3. **File**: `lib/actions/payroll/generate-payroll.ts`
   - Sửa logic penalty (dòng 1611-1621):
     ```typescript
     if (exemptWithRequest && v.hasApprovedRequest) {
       const hasExemptRequest = v.approvedRequestTypes.some((t: string) => exemptRequestTypes.includes(t))
       if (hasExemptRequest) {
         // Kiểm tra thêm: nếu là late_early_makeup, chỉ miễn phạt khi đã hoàn thành
         const isLateEarlyMakeup = v.approvedRequestTypes.includes("late_early_makeup")
         if (isLateEarlyMakeup && !v.completedMakeupWork) {
           // Không miễn phạt - nhân viên chưa hoàn thành làm bù
           isExempted = false
         } else {
           isExempted = true
           const requestTypeNames = v.approvedRequestTypes
             .map((code: string) => requestTypeNameMap.get(code) || code)
             .join(', ')
           exemptedDays.push(`${v.date} (có phiếu: ${requestTypeNames})`)
         }
       }
     }
     ```

### Option 2: Query `to_time` trong Generate Payroll

**Ưu điểm**: 
- Không cần sửa violations.ts
- Tất cả logic penalty tập trung ở một chỗ

**Nhược điểm**:
- Phải query lại data đã có trong violations
- Logic phức tạp hơn, khó maintain

**Changes**:

1. **File**: `lib/actions/payroll/generate-payroll.ts`
   - Trong `processAdjustments`, thêm parameter `employeeRequests`
   - Tạo map `makeupToTimeByDate` từ `employeeRequests`:
     ```typescript
     const makeupToTimeByDate = new Map<string, string>()
     for (const req of employeeRequests || []) {
       const reqType = req.request_type as any
       if (reqType?.code === "late_early_makeup" && req.request_date && req.to_time) {
         const toTime = req.to_time.slice(0, 5)
         const existing = makeupToTimeByDate.get(req.request_date)
         if (!existing || toTime > existing) {
           makeupToTimeByDate.set(req.request_date, toTime)
         }
       }
     }
     ```
   - Sửa logic penalty (dòng 1611-1621):
     ```typescript
     if (exemptWithRequest && v.hasApprovedRequest) {
       const hasExemptRequest = v.approvedRequestTypes.some((t: string) => exemptRequestTypes.includes(t))
       if (hasExemptRequest) {
         const isLateEarlyMakeup = v.approvedRequestTypes.includes("late_early_makeup")
         if (isLateEarlyMakeup) {
           // Kiểm tra xem nhân viên có hoàn thành to_time không
           const toTime = makeupToTimeByDate.get(v.date)
           if (toTime && v.hasCheckOut) {
             // Lấy checkout time từ attendance logs (cần thêm vào violation hoặc query lại)
             // Nếu checkout < toTime → không miễn phạt
             // Logic này phức tạp vì cần checkout time
           }
         }
         isExempted = true
         // ...
       }
     }
     ```

**Recommendation**: Chọn Option 1 vì:
- Violations.ts đã có tất cả dữ liệu cần thiết (`makeupEnd`, `checkOutMinutes`)
- Logic tách biệt rõ ràng: violations detect, penalty decide
- Dễ test: có thể test violations.completedMakeupWork độc lập
- Không cần query thêm data hoặc truyền thêm parameter

### Detailed Implementation Steps (Option 1)

1. **Update Type Definition**:
   - File: `lib/actions/payroll/types.ts`
   - Add `completedMakeupWork: boolean` to `AttendanceViolation` interface

2. **Update Violations Detection**:
   - File: `lib/actions/payroll/violations.ts`
   - After line 199 (where `effectiveShiftEnd` is updated with `makeupEnd`):
     - Calculate `completedMakeupWork = hasCheckOut && checkOutMinutes >= parseTime(makeupEnd)`
   - At line 320 (where violation object is created):
     - Add `completedMakeupWork` field

3. **Update Penalty Logic**:
   - File: `lib/actions/payroll/generate-payroll.ts`
   - At line 1611-1621 (penalty exemption logic):
     - Add check: if `late_early_makeup` AND NOT `completedMakeupWork` → do NOT exempt
     - Keep existing exemption for other request types

4. **Add Logging**:
   - Log when penalty is applied despite having `late_early_makeup` request
   - Log format: `"Ngày ${v.date}: Có phiếu làm bù nhưng chưa hoàn thành (checkout < to_time) → Phạt về sớm ${v.earlyMinutes} phút"`

## Testing Strategy

### Validation Approach

Testing theo 2 giai đoạn:
1. **Exploratory Bug Condition Checking**: Chạy test trên code CHƯA FIX để xác nhận bug tồn tại
2. **Fix Checking + Preservation Checking**: Chạy test trên code ĐÃ FIX để verify fix đúng và không ảnh hưởng logic khác

### Exploratory Bug Condition Checking

**Goal**: Xác nhận bug tồn tại trên code CHƯA FIX - nhân viên có phiếu làm bù nhưng về sớm vẫn được miễn phạt.

**Test Plan**: 
1. Tạo test data: nhân viên có phiếu `late_early_makeup` với `to_time` = 18:00
2. Tạo attendance log: checkout = 17:14 (thiếu 46 phút)
3. Chạy `generatePayroll` trên code CHƯA FIX
4. Assert: `globalPenaltyByDate` KHÔNG chứa penalty cho ngày này (bug confirmed)

**Test Cases**:
1. **Basic Incomplete Makeup**: Phiếu làm bù 18:00, checkout 17:14 → Expect: Không bị phạt (bug)
2. **Multiple Makeup Requests**: 2 phiếu làm bù (18:00, 19:00), checkout 18:30 → Expect: Không bị phạt (bug, thiếu 30 phút so với 19:00)
3. **Threshold Edge Case**: Phiếu làm bù 18:00, checkout 17:50 (thiếu 10 phút, dưới threshold) → Expect: Không bị phạt (correct, dưới ngưỡng)

**Expected Counterexamples**:
- Nhân viên về sớm trong ngày làm bù nhưng không bị phạt
- Log hiển thị: "Đều về không đúng giờ làm bù nhưng không bị phạt"
- Root cause confirmed: Logic chỉ check `hasExemptRequest`, không check `completedMakeupWork`

### Fix Checking

**Goal**: Verify rằng sau khi fix, nhân viên chưa hoàn thành làm bù SẼ bị phạt.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := generatePayroll_fixed(input)
  ASSERT result.globalPenaltyByDate.has(input.date)
  ASSERT result.penalty.reason.includes("Về sớm")
END FOR
```

**Test Cases**:
1. **Basic Incomplete Makeup**: Phiếu làm bù 18:00, checkout 17:14 → Expect: Bị phạt về sớm 46 phút
2. **Multiple Makeup Requests**: 2 phiếu làm bù (18:00, 19:00), checkout 18:30 → Expect: Bị phạt về sớm 30 phút (so với 19:00)
3. **Late Arrival + Early Leave**: Phiếu làm bù 18:00, checkin 08:30 (muộn 30 phút), checkout 17:30 (sớm 30 phút) → Expect: Bị phạt cả đi muộn VÀ về sớm

### Preservation Checking

**Goal**: Verify rằng các trường hợp KHÔNG thuộc bug condition vẫn hoạt động đúng như cũ.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT generatePayroll_original(input) = generatePayroll_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing được khuyến nghị vì:
- Tự động generate nhiều test case với các tổ hợp khác nhau
- Catch edge case mà unit test có thể bỏ sót
- Đảm bảo mạnh mẽ rằng behavior không thay đổi cho non-buggy inputs

**Test Plan**: 
1. Observe behavior trên code CHƯA FIX cho các trường hợp preservation
2. Write property-based tests để capture behavior đó
3. Run tests trên code ĐÃ FIX để verify không có regression

**Test Cases**:

1. **Completed Makeup Work**: 
   - Setup: Phiếu làm bù 18:00, checkout 18:05
   - Unfixed behavior: Không bị phạt (miễn phạt)
   - Fixed behavior: Không bị phạt (miễn phạt vì đã hoàn thành)
   - Assert: Same behavior

2. **Below Threshold**:
   - Setup: Phiếu làm bù 18:00, checkout 17:50 (thiếu 10 phút < threshold 15 phút)
   - Unfixed behavior: Không bị phạt (dưới ngưỡng)
   - Fixed behavior: Không bị phạt (dưới ngưỡng)
   - Assert: Same behavior

3. **Other Request Types**:
   - Setup: Phiếu `late_arrival`, checkout 17:00 (sớm 60 phút)
   - Unfixed behavior: Không bị phạt (miễn phạt vì có phiếu)
   - Fixed behavior: Không bị phạt (miễn phạt vì có phiếu)
   - Assert: Same behavior

4. **Linked Deficit Date**:
   - Setup: Ngày thiếu công 25/03 có phiếu làm bù ngày 20/03
   - Unfixed behavior: Ngày 25/03 không bị phạt (miễn phạt vì có phiếu làm bù)
   - Fixed behavior: Ngày 25/03 không bị phạt (miễn phạt vì có phiếu làm bù)
   - Assert: Same behavior

5. **Special Day Early Leave**:
   - Setup: Special day với `allow_early_leave = true`, checkout 16:00
   - Unfixed behavior: Không bị phạt (special day exemption)
   - Fixed behavior: Không bị phạt (special day exemption)
   - Assert: Same behavior

6. **Late Arrival in Makeup Day**:
   - Setup: Phiếu làm bù 18:00, checkin 08:30 (muộn 30 phút), checkout 18:05 (hoàn thành)
   - Unfixed behavior: Bị phạt đi muộn, không bị phạt về sớm
   - Fixed behavior: Bị phạt đi muộn, không bị phạt về sớm
   - Assert: Same behavior

7. **No Makeup Request**:
   - Setup: Không có phiếu làm bù, checkout 17:00 (sớm 60 phút)
   - Unfixed behavior: Bị phạt về sớm
   - Fixed behavior: Bị phạt về sớm
   - Assert: Same behavior

### Unit Tests

- Test `completedMakeupWork` flag calculation trong violations.ts:
  - Có phiếu làm bù + checkout >= to_time → `completedMakeupWork = true`
  - Có phiếu làm bù + checkout < to_time → `completedMakeupWork = false`
  - Không có phiếu làm bù → `completedMakeupWork = false`
  - Nhiều phiếu làm bù cùng ngày → sử dụng `to_time` muộn nhất

- Test penalty exemption logic trong generate-payroll.ts:
  - `late_early_makeup` + `completedMakeupWork = true` → miễn phạt
  - `late_early_makeup` + `completedMakeupWork = false` → KHÔNG miễn phạt
  - Other request types → miễn phạt (không ảnh hưởng)

- Test edge cases:
  - Checkout đúng bằng `to_time` → miễn phạt
  - Checkout thiếu 1 phút so với `to_time` nhưng dưới threshold → không phạt
  - Checkout thiếu nhiều phút vượt threshold → phạt

### Property-Based Tests

- **Property 1**: _For any_ employee with `late_early_makeup` request where `checkout >= to_time`, penalty SHALL be exempted
  - Generate: Random `to_time` (17:00-20:00), random `checkout >= to_time`
  - Assert: No penalty in `globalPenaltyByDate`

- **Property 2**: _For any_ employee with `late_early_makeup` request where `checkout < to_time` AND `earlyMinutes > threshold`, penalty SHALL be applied
  - Generate: Random `to_time`, random `checkout < to_time` with `earlyMinutes > threshold`
  - Assert: Penalty exists in `globalPenaltyByDate`

- **Property 3**: _For any_ employee with non-`late_early_makeup` request, penalty exemption behavior SHALL remain unchanged
  - Generate: Random request types (excluding `late_early_makeup`), random checkout times
  - Assert: Behavior matches unfixed code

### Integration Tests

- Test full payroll generation flow với nhiều nhân viên:
  - Nhân viên A: Hoàn thành làm bù → không phạt
  - Nhân viên B: Chưa hoàn thành làm bù → phạt
  - Nhân viên C: Không có phiếu làm bù → phạt bình thường
  - Nhân viên D: Có phiếu loại khác → miễn phạt

- Test với nhiều ngày trong tháng:
  - Ngày 1: Hoàn thành làm bù → không phạt
  - Ngày 2: Chưa hoàn thành làm bù → phạt
  - Ngày 3: Không có phiếu → phạt
  - Verify: Tổng penalty đúng

- Test log output:
  - Verify log hiển thị đúng lý do phạt/miễn phạt
  - Verify log không còn hiển thị "Đều về không đúng giờ làm bù nhưng không bị phạt"
