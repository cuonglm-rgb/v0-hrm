# Test Scenarios - Điều kiện phạt

## Kịch bản 1: Đi làm muộn
**Setup:**
- Loại phạt: "Phạt đi muộn"
- Điều kiện: `["late_arrival"]`
- Ngưỡng: 30 phút
- Loại phạt: Nửa ngày lương
- Miễn phép: Bật (late_arrival)

**Test cases:**
1. Nhân viên đi muộn 45 phút, không có phiếu
   - ✅ Phạt nửa ngày lương
   
2. Nhân viên đi muộn 45 phút, có phiếu late_arrival đã duyệt
   - ✅ Không phạt (được miễn)
   
3. Nhân viên đi muộn 20 phút
   - ✅ Không phạt (dưới ngưỡng 30 phút)

## Kịch bản 2: Đi về sớm
**Setup:**
- Loại phạt: "Phạt về sớm"
- Điều kiện: `["early_leave"]`
- Ngưỡng: 30 phút
- Loại phạt: Nửa ngày lương
- Miễn phép: Bật (early_leave)

**Test cases:**
1. Nhân viên về sớm 40 phút (check out 16:20, ca tan 17:00)
   - ✅ Phạt nửa ngày lương
   
2. Nhân viên về sớm 40 phút, có phiếu early_leave đã duyệt
   - ✅ Không phạt (được miễn)
   
3. Nhân viên về sớm 15 phút
   - ✅ Không phạt (dưới ngưỡng 30 phút)

## Kịch bản 3: Quên chấm công đến
**Setup:**
- Loại phạt: "Phạt quên chấm công đến"
- Điều kiện: `["forgot_checkin"]`
- Loại phạt: Số tiền cố định (50,000đ)
- Miễn phép: Tắt

**Test cases:**
1. Nhân viên có phiếu "forgot_checkin" đã duyệt ngày 15/11
   - ✅ Phạt 50,000đ
   
2. Nhân viên không có phiếu forgot_checkin
   - ✅ Không phạt (không có vi phạm)

## Kịch bản 4: Quên chấm công về
**Setup:**
- Loại phạt: "Phạt quên chấm công về"
- Điều kiện: `["forgot_checkout"]`
- Loại phạt: Số tiền cố định (50,000đ)
- Miễn phép: Tắt

**Test cases:**
1. Nhân viên có phiếu "forgot_checkout" đã duyệt ngày 20/11
   - ✅ Phạt 50,000đ
   
2. Nhân viên không có phiếu forgot_checkout
   - ✅ Không phạt (không có vi phạm)

## Kịch bản 5: Kết hợp nhiều điều kiện
**Setup:**
- Loại phạt: "Phạt vi phạm chấm công"
- Điều kiện: `["late_arrival", "early_leave", "forgot_checkin", "forgot_checkout"]`
- Ngưỡng: 15 phút
- Loại phạt: Nửa ngày lương
- Miễn phép: Bật (tất cả loại)

**Test cases:**
1. Nhân viên trong tháng:
   - Đi muộn 20 phút ngày 5/11 (không phiếu)
   - Về sớm 30 phút ngày 10/11 (không phiếu)
   - Quên chấm công đến ngày 15/11 (có phiếu)
   - Quên chấm công về ngày 20/11 (có phiếu)
   
   **Kết quả:**
   - ✅ Phạt ngày 5/11: Nửa ngày lương (đi muộn >15p)
   - ✅ Phạt ngày 10/11: Nửa ngày lương (về sớm >15p)
   - ✅ Phạt ngày 15/11: Nửa ngày lương (quên chấm công đến)
   - ✅ Phạt ngày 20/11: Nửa ngày lương (quên chấm công về)
   - **Tổng phạt: 2 ngày lương**

2. Nhân viên có phiếu xin phép cho tất cả vi phạm
   - ✅ Không phạt (tất cả được miễn)

## Kịch bản 6: Một ngày có nhiều vi phạm
**Setup:**
- Loại phạt: "Phạt vi phạm chấm công"
- Điều kiện: `["late_arrival", "early_leave"]`
- Ngưỡng: 30 phút
- Loại phạt: Nửa ngày lương

**Test case:**
Nhân viên ngày 15/11:
- Đi muộn 45 phút
- Về sớm 40 phút

**Kết quả:**
- ✅ Phạt 2 lần: 1 ngày lương (nửa ngày cho đi muộn + nửa ngày cho về sớm)

## Kiểm tra trong Payroll
Sau khi generate payroll, kiểm tra:
1. Bảng `payroll_adjustment_details`:
   - `category = 'penalty'`
   - `reason` chứa thông tin chi tiết (ngày, số phút)
   - `final_amount` đúng với cấu hình
   
2. Bảng `payroll_items`:
   - `total_deduction` bao gồm tổng phạt
   - `net_salary` = `total_income` - `total_deduction`
   - `note` hiển thị số lần phạt

## SQL Query để kiểm tra
```sql
-- Xem chi tiết phạt của một nhân viên trong tháng
SELECT 
  e.full_name,
  pi.month,
  pi.year,
  pad.reason,
  pad.final_amount,
  pat.name as penalty_type
FROM payroll_adjustment_details pad
JOIN payroll_items pi ON pad.payroll_item_id = pi.id
JOIN employees e ON pi.employee_id = e.id
JOIN payroll_adjustment_types pat ON pad.adjustment_type_id = pat.id
WHERE pad.category = 'penalty'
  AND pi.month = 11
  AND pi.year = 2025
  AND e.employee_code = 'EMP001'
ORDER BY pad.created_at;
```
