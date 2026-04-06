# Bugfix Requirements Document

## Introduction

Phiếu "Đi muộn/về sớm làm bù" (`late_early_makeup`) hiện tại không hiển thị vi phạm chấm công trên frontend khi nhân viên checkout sớm hơn giờ `to_time` trong phiếu.

**Phát hiện từ code review:**

Backend (`lib/actions/payroll/violations.ts`) ĐÃ CÓ logic đúng:
- Dòng 101-109: Lưu `to_time` từ phiếu `late_early_makeup` vào `makeupShiftEndByDate`
- Dòng 195-199: Nâng `effectiveShiftEnd` lên theo `to_time` trong phiếu
- Dòng 280-285: Tính `earlyMinutes = effectiveShiftEnd - checkOutMinutes`
- Kết quả: Vi phạm được tính đúng trong payroll

Frontend (`components/attendance/attendance-panel.tsx`) CHƯA CÓ logic này:
- Hàm `checkViolations` (dòng 48-127): KHÔNG nhận thông tin về phiếu làm bù
- Dòng 850-862: Chỉ kiểm tra `madeUp = true/false`, KHÔNG tính vi phạm khi `checkout < to_time`
- Kết quả: Vi phạm KHÔNG được hiển thị trên `/dashboard/attendance` và `/dashboard/attendance-management`

**Ví dụ cụ thể:**
- Nhân viên: Hoàng Phan Tuấn (00002)
- Phiếu làm bù: Ngày 20/03/2026 (08:00-18:00) để bù cho ngày thiếu công 25/03/2026
- Chấm công thực tế ngày 20/03/2026: Vào 07:47 | Ra 17:14
- Backend tính: `earlyMinutes = 18:00 - 17:14 = 46 phút` (ĐÚNG)
- Frontend hiển thị: "Hoàn thành" (SAI - phải hiển thị vi phạm)
- Payroll: Phạt sẽ được áp dụng (vì backend đúng)

**Phạm vi bug:** CHỈ Ở FRONTEND - cần đồng bộ logic từ backend sang frontend

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN nhân viên có phiếu "Đi muộn/về sớm làm bù" đã duyệt với `to_time` = 18:00 AND checkout thực tế = 17:14 THEN frontend không hiển thị vi phạm về sớm trên `/dashboard/attendance` và `/dashboard/attendance-management`

1.2 WHEN hàm `checkViolations` trong `attendance-panel.tsx` được gọi THEN hàm không nhận thông tin về phiếu `late_early_makeup` và `to_time` của phiếu

1.3 WHEN frontend tính `effectiveShiftEnd` cho ngày có phiếu làm bù THEN frontend sử dụng giờ tan ca mặc định thay vì `to_time` từ phiếu

1.4 WHEN frontend hiển thị trạng thái chấm công cho ngày có phiếu làm bù THEN frontend chỉ kiểm tra `madeUp = true/false` mà không tính vi phạm khi `checkout < to_time`

### Expected Behavior (Correct)

2.1 WHEN hàm `checkViolations` trong `attendance-panel.tsx` được gọi cho ngày có phiếu `late_early_makeup` THEN hàm SHALL nhận thông tin về `to_time` từ phiếu làm bù

2.2 WHEN frontend tính `effectiveShiftEnd` cho ngày có phiếu làm bù với `to_time` = T THEN frontend SHALL điều chỉnh `effectiveShiftEnd = T` (giống logic backend dòng 195-199)

2.3 WHEN frontend kiểm tra vi phạm về sớm cho ngày có phiếu làm bù THEN frontend SHALL so sánh `checkout_time` với `to_time` trong phiếu thay vì giờ tan ca mặc định

2.4 WHEN nhân viên có phiếu làm bù với `to_time` = T AND checkout thực tế < T THEN frontend SHALL tính và hiển thị vi phạm về sớm với `earlyMinutes = T - checkout_time`

2.5 WHEN có nhiều phiếu "Đi muộn/về sớm làm bù" cùng ngày với `to_time` khác nhau THEN frontend SHALL sử dụng `to_time` muộn nhất làm giờ tan ca hiệu lực (giống logic backend dòng 104-107)

2.6 WHEN frontend hiển thị vi phạm về sớm cho ngày làm bù THEN frontend SHALL hiển thị cảnh báo vi phạm màu đỏ với số phút về sớm

### Unchanged Behavior (Regression Prevention)

3.1 WHEN nhân viên có phiếu "Đi muộn/về sớm làm bù" đã duyệt với `to_time` = T AND checkout thực tế >= T THEN frontend SHALL CONTINUE TO không hiển thị vi phạm về sớm

3.2 WHEN nhân viên không có phiếu "Đi muộn/về sớm làm bù" cho ngày đó THEN frontend SHALL CONTINUE TO sử dụng giờ tan ca mặc định (hoặc `special_day.custom_end_time`) để kiểm tra vi phạm

3.3 WHEN nhân viên có phiếu "Đi muộn/về sớm làm bù" đã duyệt AND checkout đúng hoặc sau giờ `to_time` THEN frontend SHALL CONTINUE TO hiển thị trạng thái "Hoàn thành hợp lệ"

3.4 WHEN kiểm tra vi phạm đi muộn (check-in) THEN frontend SHALL CONTINUE TO so sánh với giờ vào ca mặc định, không bị ảnh hưởng bởi phiếu làm bù

3.5 WHEN nhân viên có phiếu "Làm bù cả ngày" (`full_day_makeup`) THEN frontend SHALL CONTINUE TO xử lý theo logic riêng của `full_day_makeup` (không ảnh hưởng đến vi phạm)

3.6 WHEN backend tính vi phạm trong payroll (`lib/actions/payroll/violations.ts`) THEN backend SHALL CONTINUE TO hoạt động đúng như hiện tại (không cần sửa)

3.7 WHEN có phiếu tăng ca (overtime) cùng ngày với phiếu làm bù THEN frontend SHALL CONTINUE TO xử lý theo logic hiện tại (không overlap, đã validate khi tạo phiếu)

3.8 WHEN ngày có `special_day.allow_early_leave = true` THEN frontend SHALL CONTINUE TO bỏ qua kiểm tra vi phạm về sớm (ưu tiên `special_day` hơn phiếu làm bù)
