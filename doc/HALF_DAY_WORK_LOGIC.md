# Logic Xử Lý Làm Nửa Ngày (Half-Day Work)

## Tổng Quan
Tài liệu này mô tả logic xử lý trường hợp nhân viên làm việc nửa ngày và chấm công vào/ra trong giờ nghỉ trưa.

## Kịch Bản
**Ngày 20/12/2025**: Nhân viên làm nửa ngày, chấm công ra vào lúc 13:01 (giờ nghỉ trưa)

## Yêu Cầu
1. ✅ Hiển thị màu vàng (không phạt vì đến/về đúng giờ ca)
2. ✅ Nếu không có phiếu phép → "Nghỉ nửa ngày không phép"
3. ✅ Nếu có phiếu phép → "Nghỉ nửa ngày phép năm"
4. ✅ Tính theo giờ Việt Nam

## Các Trường Hợp Làm Nửa Ngày

### 1. Check-in và Check-out trong giờ nghỉ trưa
- **Điều kiện**: Check-in từ 12:00 đến 13:15 VÀ Check-out từ 12:00 đến 13:15
- **Ý nghĩa**: Nhân viên làm nửa ngày (ca sáng hoặc ca chiều)
- **Xử lý**: 
  - Không tính là đi muộn hoặc về sớm
  - Không áp dụng phạt
  - Tính 0.5 ngày công

### 2. Check-in trước nghỉ trưa, Check-out trong/trước nghỉ trưa
- **Điều kiện**: Check-in < 12:00 VÀ Check-out ≤ 13:00
- **Ý nghĩa**: Nhân viên chỉ làm ca sáng
- **Xử lý**:
  - Không tính là về sớm (vì đã làm đủ ca sáng)
  - Không áp dụng phạt
  - Tính 0.5 ngày công

## Hiển Thị Trên Giao Diện

### Màu Sắc
- **Màu vàng (bg-yellow-50)**: Làm nửa ngày, không vi phạm
- **Màu đỏ (bg-red-50)**: Vi phạm chấm công (đi muộn, về sớm, nghỉ không phép)
- **Màu xanh (bg-green-100)**: Hoàn thành đầy đủ

### Trạng Thái
- **"Nghỉ nửa ngày không phép"** (màu vàng): Làm nửa ngày, không có phiếu phép
- **"Nghỉ nửa ngày phép năm"** (màu vàng): Làm nửa ngày, có phiếu phép được duyệt
- **"Vi phạm"** (màu đỏ): Đi muộn/về sớm quá quy định
- **"Hoàn thành"** (màu xanh): Làm đủ ca, không vi phạm

### Giờ Chấm Công
- **Màu vàng**: Giờ vào/ra khi làm nửa ngày (không phạt)
- **Màu đỏ**: Giờ vào/ra khi vi phạm (đi muộn/về sớm)
- **Màu xanh**: Giờ vào/ra bình thường (không vi phạm)

## Tính Lương

### Ngày Công
- **Làm nửa ngày**: Tính 0.5 ngày công
- **Làm đủ ca**: Tính 1 ngày công
- **Không tính công**: Đi muộn >60 phút không có phép

### Phạt
- **Làm nửa ngày đúng giờ**: KHÔNG phạt
- **Đi muộn >30 phút**: Phạt theo quy định (nếu không có phiếu phép)
- **Về sớm >30 phút**: Phạt theo quy định (nếu không có phiếu phép)

## Ví Dụ Cụ Thể

### Ví dụ 1: Làm ca chiều
```
Ca làm việc: 08:00 - 17:00 (nghỉ trưa 12:00 - 13:00)
Check-in: 13:01
Check-out: 17:00

Kết quả:
- Màu: Vàng
- Trạng thái: "Nghỉ nửa ngày không phép" (nếu không có phiếu)
- Ngày công: 0.5
- Phạt: Không
```

### Ví dụ 2: Làm ca sáng
```
Ca làm việc: 08:00 - 17:00 (nghỉ trưa 12:00 - 13:00)
Check-in: 08:00
Check-out: 12:30

Kết quả:
- Màu: Vàng
- Trạng thái: "Nghỉ nửa ngày phép năm" (nếu có phiếu)
- Ngày công: 0.5
- Phạt: Không
```

### Ví dụ 3: Đi muộn ca chiều
```
Ca làm việc: 08:00 - 17:00 (nghỉ trưa 12:00 - 13:00)
Check-in: 14:00 (muộn hơn 13:15)
Check-out: 17:00

Kết quả:
- Màu: Đỏ
- Trạng thái: "Vi phạm" (đi muộn 60 phút)
- Ngày công: 0.5
- Phạt: Có (nếu không có phiếu)
```

## Files Đã Cập Nhật

### 1. lib/actions/payroll-actions.ts
- Cập nhật logic `getEmployeeViolations()` để xử lý trường hợp check-out trong giờ nghỉ trưa
- Không tính là về sớm khi check-out trong giờ nghỉ trưa (làm ca sáng)
- Không áp dụng phạt cho trường hợp làm nửa ngày đúng giờ

### 2. components/attendance/attendance-panel.tsx
- Thêm logic phát hiện làm nửa ngày (`isHalfDayWork`)
- Hiển thị màu vàng cho hàng làm nửa ngày
- Hiển thị trạng thái "Nghỉ nửa ngày không phép" hoặc "Nghỉ nửa ngày phép năm"
- Hiển thị giờ vào/ra màu vàng cho trường hợp làm nửa ngày

## Lưu Ý
- Logic này áp dụng cho tất cả các ca làm việc có giờ nghỉ trưa
- Nếu ca làm việc không có giờ nghỉ trưa, logic sẽ tính theo cách thông thường
- Thời gian được tính theo múi giờ Việt Nam (UTC+7)
