# Tất cả case chức năng Làm bù (Makeup Work)

## 1. Tạo / Cập nhật phiếu

### 1.1 Phiếu **Đi muộn/Về sớm làm bù** (`late_early_makeup`)

| # | Case | Dữ liệu / Điều kiện | Kết quả mong đợi |
|---|------|----------------------|-------------------|
| 1.1.1 | Thiếu ngày thiếu công gốc | `custom_data.linked_deficit_date` trống | Từ chối: "Vui lòng chọn ngày thiếu công gốc" |
| 1.1.2 | Thiếu ngày làm bù | `request_date` trống | Từ chối (required field) |
| 1.1.3 | Ngày làm bù và ngày thiếu công **cùng tháng** | VD: deficit 10/3, request 25/3 | Cho phép tạo |
| 1.1.4 | Ngày làm bù và ngày thiếu công **khác tháng** | VD: deficit 28/3, request 5/4 | Từ chối: "Phiếu đi muộn/về sớm làm bù chỉ được tạo trong cùng tháng với ngày thiếu công" |
| 1.1.5 | Thiếu giờ bắt đầu/kết thúc | `from_time` hoặc `to_time` trống | Từ chối: "Vui lòng nhập giờ bắt đầu và kết thúc làm bù" |
| 1.1.6 | Trùng khung giờ với phiếu OT đã duyệt cùng ngày | Có phiếu OT approved ngày đó, khung giờ giao nhau | Từ chối: "Khung giờ làm bù trùng với phiếu tăng ca đã duyệt..." |
| 1.1.7 | Không trùng với OT | OT khác khung giờ hoặc khác ngày | Cho phép tạo |
| 1.1.8 | Ngày làm bù là ngày làm việc bình thường | `late_early_makeup` thường làm bù **cùng ngày** đi muộn/về sớm → thường là ngày làm việc | Cho phép (không validate off-day cho late_early_makeup) |

### 1.2 Phiếu **Làm bù cả ngày** (`full_day_makeup`)

| # | Case | Dữ liệu / Điều kiện | Kết quả mong đợi |
|---|------|----------------------|-------------------|
| 1.2.1 | Thiếu ngày thiếu công gốc | `linked_deficit_date` trống | Từ chối |
| 1.2.2 | Thiếu ngày làm bù / giờ | `request_date` hoặc `from_time`/`to_time` trống | Từ chối |
| 1.2.3 | Ngày làm bù là **Chủ nhật** | `request_date` = Chủ nhật | Cho phép |
| 1.2.4 | Ngày làm bù là **Thứ 7** và theo lịch mặc định là nghỉ | Không có override T7 cho nhân viên, T7 đó nghỉ theo xen kẽ | Cho phép |
| 1.2.5 | Ngày làm bù là **Thứ 7** có override **nghỉ** | `saturday_work_schedule`: nhân viên đó, ngày đó, `is_working = false` | Cho phép |
| 1.2.6 | Ngày làm bù là **Thứ 7** có override **làm** | `saturday_work_schedule`: `is_working = true` cho ngày đó | Từ chối: "Ngày làm bù phải là ngày nghỉ của nhân viên..." |
| 1.2.7 | Ngày làm bù là **ngày lễ** (holidays) | `request_date` nằm trong bảng `holidays` | Cho phép |
| 1.2.8 | Ngày làm bù là **ngày thường** (Thứ 2–6, không phải lễ) | VD: Thứ 3 bất kỳ | Từ chối: "Ngày làm bù phải là ngày nghỉ của nhân viên..." |
| 1.2.9 | Làm bù **cùng tháng** với ngày thiếu công | Deficit 10/3, makeup 21/3 (T7) | Cho phép; ghi nhận công tháng 3 |
| 1.2.10 | Làm bù **tháng sau** so với ngày thiếu công | Deficit 28/3, makeup 5/4 (CN) | Cho phép; ghi nhận công **tháng 4**, không hồi tố tháng 3 |
| 1.2.11 | Trùng khung giờ với phiếu OT đã duyệt cùng ngày | Có OT approved cùng ngày, khung giờ giao với from_time–to_time | Từ chối (overlap OT) |
| 1.2.12 | Ngày làm việc đặc biệt (special_work_days) | Bão, sự kiện, được về sớm… | **Không** dùng để mở rộng quyền chọn ngày làm bù; chỉ xét CN / T7 override / holidays |

---

## 2. Vi phạm chấm công (Violations)

### 2.1 Ảnh hưởng của phiếu **late_early_makeup** đã duyệt

| # | Case | Điều kiện | Kết quả |
|---|------|-----------|---------|
| 2.1.1 | Có phiếu làm bù đã duyệt, checkout **trước** giờ kết thúc phiếu | VD: phiếu to_time 17:25, checkout 17:10 | **Có vi phạm** về sớm (15 phút) |
| 2.1.2 | Có phiếu làm bù đã duyệt, checkout **đúng** giờ kết thúc phiếu | Checkout 17:25 | **Không** vi phạm về sớm |
| 2.1.3 | Có phiếu làm bù đã duyệt, checkout **sau** giờ kết thúc phiếu | Checkout 17:30 | **Không** vi phạm về sớm |
| 2.1.4 | Nhiều phiếu late_early_makeup cùng ngày | Nhiều phiếu, to_time khác nhau | Dùng **to_time muộn nhất** làm effectiveShiftEnd |
| 2.1.5 | Không có phiếu làm bù | Ngày không có late_early_makeup approved | effectiveShiftEnd = giờ tan ca (hoặc special day) như cũ |

### 2.2 Đi sớm – Về sớm (bù trừ)

| # | Case | Điều kiện | Kết quả |
|---|------|-----------|---------|
| 2.2.1 | Đi sớm 30 phút, về sớm 30 phút | Check-in 7:30, check-out 16:30 (ca 8:00–17:00) | **Không** vi phạm về sớm (bù trừ hết) |
| 2.2.2 | Đi sớm 20 phút, về sớm 30 phút | Check-in 7:40, check-out 16:30 | Vi phạm về sớm **10 phút** |
| 2.2.3 | Đi đúng giờ, về sớm 30 phút | Check-in 8:00, check-out 16:30 | Vi phạm về sớm **30 phút** |
| 2.2.4 | Đi sớm 45 phút, về sớm 30 phút | Check-in 7:15, check-out 16:30 | **Không** vi phạm về sớm (đi sớm > về sớm) |

---

## 3. Payroll (Tính công / Lương)

### Mô hình Consume deficit (áp dụng)

- **Ngày làm bù** không tăng `working_days`; chỉ dùng để **consume** deficit từ `linked_deficit_date`.
- **Mỗi deficit** chỉ được consume **tối đa 1 lần** (nhiều phiếu bù cùng 1 ngày gốc vẫn chỉ +1).
- Công thức: `actual_salary_days = working_days - (nửa ngày) + consumed_days`, với `consumed_days` = số ngày deficit được consume trong tháng (có phiếu full_day_makeup approved + có chấm công ngày làm bù).
- **Trạng thái consume theo tháng:** Mỗi lần chạy payroll (generate hoặc recalculate), lưu vào `payroll_items`:
  - `consumed_deficit_days`: số ngày consume trong tháng run.
  - `consumed_deficit_detail`: danh sách `linked_deficit_date` đã consume (VD: `2026-02-28,2026-03-10`) để audit. Khi xem bảng lương tháng 3 → biết consume thuộc tháng 3 và bù những ngày gốc nào.

### 3.1 Phiếu làm bù **không** tính là nghỉ phép

| # | Case | Mô tả | Kết quả |
|---|------|--------|---------|
| 3.1.1 | Có phiếu late_early_makeup / full_day_makeup approved | Trong process leave | **Không** cộng vào paidLeaveDays / unpaidLeaveDays; bỏ qua trong leave logic |
| 3.1.2 | Ngày có makeup | Khi build set leaveDates | Ngày đó **không** đưa vào leaveDates (tránh ảnh hưởng ngày lễ/công ty) |

### 3.2 Làm bù cả ngày – Mô hình **consume deficit**

**Nguyên tắc:** Ngày làm bù **không** tăng working days; chỉ dùng để **giảm (consume)** deficit từ `linked_deficit_date`. Mỗi deficit chỉ được consume tối đa **1 lần**.

- `working_days` = đếm attendance, **trừ** các ngày là ngày làm bù (request_date của full_day_makeup).
- `consumed_days` = số **unique** `linked_deficit_date` có ít nhất 1 phiếu full_day_makeup đã duyệt trong tháng **và** có chấm công đủ trên ngày làm bù.
- `actual_salary_days` = working_days − (nửa ngày) **+ consumed_days**.

| # | Case | Mô tả | Kết quả |
|---|------|--------|---------|
| 3.2.1 | full_day_makeup trong tháng, deficit cùng tháng | Deficit 10/3, makeup 21/3, có attendance 21/3 | Ngày 21/3 **không** cộng vào working_days; deficit 10/3 được consume → +1 consumed_days → đúng 1 công |
| 3.2.2 | full_day_makeup trong tháng, deficit tháng trước | Deficit 28/2, makeup 7/3, có attendance 7/3 | Ngày 7/3 không cộng working_days; deficit 28/2 được consume → +1 consumed_days (ghi tháng 3) |
| 3.2.3 | Không double penalty | Tháng 3 vắng 1 ngày; có 1 phiếu full_day_makeup đã duyệt + attendance OK | deficit_days = 1, consumed_days = 1 → chỉ trừ (deficit − consumed) = 0; không trừ hai lần |
| 3.2.4 | **2 phiếu makeup cho cùng 1 deficit** | 2 phiếu full_day_makeup cùng linked_deficit_date 10/3, 2 ngày làm bù khác nhau, đều có attendance | consumed_days = **1** (mỗi deficit chỉ count 1 lần) → tránh +2 công sai |
| 3.2.5 | Makeup không có chấm công | Phiếu full_day_makeup đã duyệt nhưng ngày làm bù không có log | Ngày đó không count; deficit **không** được consume → consumed_days không tăng |
| 3.2.6 | Ghi chú payroll | Có consumed | Note: "Consume deficit: X ngày" |

### 3.3 late_early_makeup và công trong tháng

| # | Case | Mô tả | Kết quả |
|---|------|--------|---------|
| 3.3.1 | Làm bù cùng ngày đi muộn/về sớm | Ngày đó vẫn đi làm, có phiếu làm bù giờ | Ngày vẫn tính **1 ngày công** (attendance có); vi phạm tính theo effectiveShiftEnd (makeup to_time) |
| 3.3.2 | Không tạo late_early_makeup tháng sau | Đã validate ở tạo phiếu | Payroll không phải xử lý late_early_makeup cross-month |

---

## 4. Conflict Làm bù vs OT (1 phút = 1 loại công)

### 4.1 Khi tạo phiếu

| # | Case | Mô tả | Kết quả |
|---|------|--------|---------|
| 4.1.1 | Tạo makeup khi đã có OT approved cùng ngày, khung giờ giao nhau | VD: OT 17:00–19:00, makeup 17:00–17:25 | Từ chối (overlap) |
| 4.1.2 | Tạo makeup khi OT cùng ngày nhưng khung giờ **không** giao | OT 18:00–20:00, makeup 17:00–17:25 | Cho phép (sau này tính OT sẽ trừ overlap nếu có) |

### 4.2 Khi tính lương OT

| # | Case | Mô tả | Kết quả |
|---|------|--------|---------|
| 4.2.1 | Cùng ngày có cả OT và late_early_makeup (khung không overlap đã validate) | OT 17:25–19:00, makeup 17:00–17:25 | OT chỉ tính từ 17:25; 17:00–17:25 tính makeup, **không** tính OT |
| 4.2.2 | Cùng ngày có full_day_makeup và OT | Giờ chuẩn 1 ngày = makeup, giờ vượt = OT | Trong calculateOvertimePay: trừ interval làm bù khỏi giờ OT (overlap deduction) |
| 4.2.3 | Chỉ có OT, không có makeup | Bình thường | Tính OT toàn bộ khung giờ như cũ |

---

## 5. UI / Hiển thị

| # | Case | Mô tả | Kết quả |
|---|------|--------|---------|
| 5.1 | Form tạo phiếu – chọn loại làm bù | Chọn late_early_makeup hoặc full_day_makeup | Hiện field **Ngày thiếu công gốc** bắt buộc; label "Ngày làm bù" cho request_date |
| 5.2 | Form – late_early_makeup | Đã chọn loại | Cảnh báo: "Phải cùng tháng... Checkout trước giờ phiếu là vi phạm" |
| 5.3 | Form – full_day_makeup | Đã chọn loại | Cảnh báo: "Ngày làm bù phải là ngày nghỉ (Chủ nhật hoặc Thứ 7 theo lịch)" |
| 5.4 | Chi tiết phiếu (nhân viên / duyệt) | Xem phiếu làm bù | Hiển thị **Ngày thiếu công gốc** (từ custom_data) |

---

## 6. Luồng duyệt và dữ liệu

| # | Case | Mô tả | Kết quả |
|---|------|--------|---------|
| 6.1 | Duyệt phiếu | Dùng luồng duyệt hiện tại (request_assigned_approvers) | Không đổi; duyệt như các loại phiếu khác |
| 6.2 | Từ chối phiếu | Approver reject | Phiếu không ảnh hưởng violations / payroll |
| 6.3 | Chỉ phiếu **approved** | Violations & payroll | Chỉ đọc makeup **status = approved** |

---

## 7. Edge / Biên

| # | Case | Mô tả | Kết quả |
|---|------|--------|---------|
| 7.1 | Quên chấm công đến + có phiếu làm bù giờ | Ngày đó có forgot_checkin và late_early_makeup | Xử lý theo thứ tự ưu tiên quên chấm công (forgot check-in vẫn tính vi phạm) |
| 7.2 | Nhiều phiếu full_day_makeup cùng ngày | Cùng 1 ngày 2 phiếu làm bù cả ngày (khác deficit) | Về logic có thể 2 phiếu; attendance 1 ngày vẫn tính 1 ngày công; cần tránh double count note |
| 7.3 | Nhân viên không có override Thứ 7 | full_day_makeup chọn T7 | Dùng rule mặc định T7 (xen kẽ) để xác định nghỉ hay làm |
| 7.4 | Ngày lễ nhưng nhân viên đi làm (không OT) | Theo logic payroll hiện tại | Đi làm ngày lễ không OT có thể bị trừ working day; makeup không thay đổi rule ngày lễ |
| 7.5 | Special work day | Bão, sự kiện, về sớm hợp lệ | **Không** dùng để mở rộng danh sách ngày được chọn làm bù; chỉ CN / T7 override / holidays |

---

## Tóm tắt nhóm case

- **Tạo/cập nhật:** Bắt buộc linked_deficit_date, cùng tháng (late_early), ngày nghỉ (full_day), giờ, không overlap OT.
- **Vi phạm:** effectiveShiftEnd = max(shiftEnd, makeup to_time); checkout trước = vi phạm; đi sớm bù về sớm.
- **Payroll:** Makeup không tính leave; full_day ghi nhận tháng thực tế; không double penalty; note làm bù/bù kỳ trước.
- **OT:** 1 phút chỉ thuộc 1 loại; validate overlap khi tạo; khi tính OT trừ interval làm bù.
- **UI:** Hiện ngày thiếu công gốc, cảnh báo theo loại phiếu, chi tiết phiếu hiển thị ngày gốc.
