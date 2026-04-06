# Bugfix Requirements Document

## Introduction

Backend hiện tại KHÔNG áp dụng phạt cho vi phạm về sớm trong ngày làm bù khi nhân viên checkout trước giờ `to_time` đã cam kết. Mặc dù backend ĐÃ phát hiện vi phạm (tính đúng số phút thiếu) và ĐÃ nâng `effectiveShiftEnd` lên `to_time`, nhưng logic penalty trong `lib/actions/payroll/generate-payroll.ts` miễn phạt cho TẤT CẢ các ngày có phiếu `late_early_makeup`, bất kể nhân viên có hoàn thành giờ làm bù hay không.

**Phát hiện từ code review:**

Backend violations (`lib/actions/payroll/violations.ts`) ĐÃ ĐÚNG:
- Dòng 101-109: Lưu `to_time` từ phiếu `late_early_makeup` vào `makeupShiftEndByDate`
- Dòng 195-199: Nâng `effectiveShiftEnd` lên theo `to_time` trong phiếu
- Dòng 280-285: Tính `earlyMinutes = effectiveShiftEnd - checkOutMinutes`
- Kết quả: Vi phạm được phát hiện ĐÚNG (ví dụ: 46 phút về sớm)

Backend penalty (`lib/actions/payroll/generate-payroll.ts`) SAI:
- Dòng 1611-1621: Miễn phạt nếu `v.approvedRequestTypes` chứa `late_early_makeup`
- Logic hiện tại: `if (hasExemptRequest) { isExempted = true }`
- Kết quả: Nhân viên về sớm trong ngày làm bù KHÔNG bị phạt

**Ví dụ cụ thể:**
- Nhân viên: Hoàng Phan Tuấn (00002)
- Phiếu làm bù: Ngày 20/03/2026 (08:00-18:00) để bù cho ngày thiếu công 25/03/2026
- Chấm công thực tế ngày 20/03/2026: Vào 07:47 | Ra 17:14
- Backend violations tính: `earlyMinutes = 18:00 - 17:14 = 46 phút` (ĐÚNG)
- Backend penalty: Miễn phạt vì có phiếu `late_early_makeup` (SAI)
- Log hiển thị: "Đều về không đúng giờ làm bù nhưng không bị phạt"

**Root cause:** Logic penalty hiện tại (dòng 1611-1621) chỉ kiểm tra XEM CÓ PHIẾU `late_early_makeup` HAY KHÔNG, mà không kiểm tra XEM NHÂN VIÊN CÓ HOÀN THÀNH GIỜ LÀM BÙ HAY KHÔNG.

**Hành vi mong muốn:**
- Nếu `checkout >= to_time` → Miễn phạt (đã hoàn thành làm bù)
- Nếu `checkout < to_time` → Phạt bình thường (chưa hoàn thành làm bù)

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN nhân viên có phiếu "Đi muộn/về sớm làm bù" đã duyệt với `to_time` = 18:00 AND checkout thực tế = 17:14 (thiếu 46 phút) THEN backend KHÔNG áp dụng phạt cho vi phạm về sớm

1.2 WHEN logic penalty kiểm tra miễn phạt (dòng 1611-1621 trong `generate-payroll.ts`) THEN logic chỉ kiểm tra `v.approvedRequestTypes.includes("late_early_makeup")` mà KHÔNG kiểm tra xem nhân viên có hoàn thành giờ `to_time` hay không

1.3 WHEN nhân viên có phiếu làm bù nhưng về sớm trước `to_time` THEN backend tính đúng `earlyMinutes` trong violations nhưng miễn phạt trong penalty calculation

1.4 WHEN log payroll hiển thị THEN log ghi "Đều về không đúng giờ làm bù nhưng không bị phạt" - xác nhận bug

### Expected Behavior (Correct)

2.1 WHEN nhân viên có phiếu "Đi muộn/về sớm làm bù" với `to_time` = T AND checkout thực tế < T THEN backend SHALL áp dụng phạt về sớm với `earlyMinutes = T - checkout_time`

2.2 WHEN logic penalty kiểm tra miễn phạt cho phiếu `late_early_makeup` THEN logic SHALL kiểm tra xem `checkout_time >= to_time` trước khi miễn phạt

2.3 WHEN nhân viên có phiếu làm bù với `to_time` = T AND checkout thực tế >= T THEN backend SHALL miễn phạt (đã hoàn thành cam kết làm bù)

2.4 WHEN nhân viên có phiếu làm bù với `to_time` = T AND checkout thực tế < T AND `earlyMinutes > thresholdMinutes` THEN backend SHALL thêm penalty vào `globalPenaltyByDate` với lý do "Về sớm X phút"

2.5 WHEN có nhiều phiếu "Đi muộn/về sớm làm bù" cùng ngày với `to_time` khác nhau THEN backend SHALL sử dụng `to_time` muộn nhất để kiểm tra hoàn thành (giống logic violations dòng 104-107)

### Unchanged Behavior (Regression Prevention)

3.1 WHEN nhân viên có phiếu "Đi muộn/về sớm làm bù" với `to_time` = T AND checkout thực tế >= T THEN backend SHALL CONTINUE TO miễn phạt (đã hoàn thành làm bù)

3.2 WHEN nhân viên có phiếu "Đi muộn/về sớm làm bù" với `to_time` = T AND checkout thực tế < T AND `earlyMinutes <= thresholdMinutes` THEN backend SHALL CONTINUE TO không phạt (dưới ngưỡng)

3.3 WHEN nhân viên có phiếu loại khác (`late_arrival`, `early_leave`, v.v.) THEN backend SHALL CONTINUE TO miễn phạt theo logic hiện tại (không ảnh hưởng)

3.4 WHEN backend tính violations trong `lib/actions/payroll/violations.ts` THEN backend SHALL CONTINUE TO hoạt động đúng như hiện tại (không cần sửa)

3.5 WHEN nhân viên có phiếu làm bù cho ngày thiếu công gốc (linked_deficit_date) THEN backend SHALL CONTINUE TO miễn phạt cho ngày thiếu công gốc đó (dòng 1623-1627)

3.6 WHEN có special day với `allow_early_leave = true` THEN backend SHALL CONTINUE TO miễn phạt về sớm (ưu tiên special day)

3.7 WHEN nhân viên đi muộn trong ngày làm bù THEN backend SHALL CONTINUE TO áp dụng phạt đi muộn bình thường (phiếu làm bù chỉ ảnh hưởng đến giờ tan ca, không ảnh hưởng đến giờ vào ca)

3.8 WHEN tính toán payroll cho các thành phần khác (allowance, deduction, OT, v.v.) THEN backend SHALL CONTINUE TO hoạt động đúng như hiện tại
