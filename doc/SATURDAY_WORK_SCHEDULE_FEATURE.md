# Tính năng Lịch làm thứ 7

## Tổng quan
Cho phép leader (level >= 3) phân công lịch làm thứ 7 tùy chỉnh cho nhân viên, override lịch mặc định xen kẽ của công ty.

## Phân quyền

### Level 3 (Team Leader)
- Chỉ thấy và quản lý nhân viên trong phòng ban của mình
- Có thể phân công lịch thứ 7 cho nhân viên trong team

### Level > 3 (Manager, Director)
- Thấy và quản lý tất cả nhân viên trong công ty
- Có thể phân công lịch thứ 7 cho bất kỳ nhân viên nào

### Level < 3
- Không có quyền truy cập tab "Lịch làm thứ 7"
- Chỉ thấy lịch của mình trong trang Attendance

## Cách hoạt động

### Lịch mặc định (Xen kẽ)
- Công ty có lịch thứ 7 xen kẽ: Tuần 1 nghỉ, Tuần 2 làm, Tuần 3 nghỉ...
- Tham chiếu: Tuần có ngày 6/1/2026 là tuần nghỉ
- Logic: `isSaturdayOff(date)` trong `attendance-panel.tsx`

### Lịch tùy chỉnh (Override)
- Leader phân công cụ thể: Nhân viên X làm/nghỉ vào thứ 7 ngày Y
- Lưu vào bảng `saturday_work_schedule`
- Ưu tiên cao hơn lịch mặc định

### Ưu tiên
1. **Lịch tùy chỉnh** (nếu có) → Theo phân công của leader
2. **Lịch mặc định** (nếu không có lịch tùy chỉnh) → Theo quy luật xen kẽ

## Cấu trúc Database

### Bảng: `saturday_work_schedule`
```sql
- id: UUID (PK)
- employee_id: UUID (FK -> employees)
- work_date: DATE (phải là thứ 7)
- is_working: BOOLEAN (true = làm, false = nghỉ)
- note: TEXT (lý do phân công)
- created_by: UUID (leader phân công)
- created_at, updated_at: TIMESTAMPTZ
- UNIQUE(employee_id, work_date)
```

### Constraint
- `work_date` phải là thứ 7 (DOW = 6)
- Không cho phép duplicate (employee_id, work_date)

## Các thay đổi

### 1. Migration Script (scripts/041-saturday-work-schedule.sql)
- Tạo bảng `saturday_work_schedule`
- RLS policies cho phân quyền theo level
- Trigger update timestamp
- Constraint check thứ 7

### 2. Actions (lib/actions/saturday-schedule-actions.ts)
- `checkSaturdaySchedulePermission()`: Check level >= 3
- `listSaturdaySchedules()`: Lấy danh sách lịch
- `getSaturdaySchedule()`: Lấy lịch của 1 nhân viên vào 1 ngày
- `setSaturdaySchedule()`: Set lịch cho 1 nhân viên
- `bulkSetSaturdaySchedule()`: Set lịch cho nhiều nhân viên cùng lúc
- `deleteSaturdaySchedule()`: Xóa lịch
- `getSaturdaysInMonth()`: Lấy danh sách thứ 7 trong tháng

### 3. UI Component (components/attendance/saturday-schedule-panel.tsx)
- Hiển thị lịch theo tháng/năm
- Group theo ngày thứ 7
- Hiển thị lịch mặc định vs lịch tùy chỉnh
- Dialog phân công (chọn nhiều nhân viên)
- Xóa lịch tùy chỉnh

### 4. Page Update (app/dashboard/attendance-management/page.tsx)
- Thêm tab "Lịch làm thứ 7"
- Check permission level >= 3
- Filter employees theo level (3 = department, >3 = all)
- Load saturday schedules

### 5. Database Types (lib/types/database.ts)
- Thêm interface `SaturdaySchedule`

## Cách sử dụng

### Phân công lịch thứ 7

1. Vào **Dashboard > Quản lý chấm công**
2. Chọn tab **Lịch làm thứ 7** (chỉ hiện nếu level >= 3)
3. Chọn tháng/năm để xem
4. Click **Phân công**
5. Chọn:
   - **Nhân viên**: Chọn 1 hoặc nhiều nhân viên
   - **Ngày thứ 7**: Chọn ngày cần phân công
   - **Trạng thái**: Bật = Làm việc, Tắt = Nghỉ
   - **Ghi chú**: Lý do phân công (tùy chọn)
6. Click **Phân công**

### Xem lịch

- Mỗi thứ 7 hiển thị:
  - Lịch mặc định (Làm việc / Nghỉ)
  - Số nhân viên có lịch riêng
  - Danh sách nhân viên và trạng thái

### Xóa lịch tùy chỉnh

- Click icon Trash ở dòng nhân viên
- Sau khi xóa, nhân viên sẽ theo lịch mặc định

## Ví dụ

### Tình huống 1: Phân công làm thêm
- Thứ 7 ngày 10/1/2026: Lịch mặc định = Nghỉ
- Leader phân công: Nhân viên A, B phải làm
- Kết quả: A, B làm việc, các nhân viên khác nghỉ

### Tình huống 2: Cho nghỉ đặc biệt
- Thứ 7 ngày 17/1/2026: Lịch mặc định = Làm
- Leader phân công: Nhân viên C được nghỉ
- Kết quả: C nghỉ, các nhân viên khác làm việc

## Tích hợp với Payroll

**TODO**: Cần cập nhật logic tính lương để:
1. Check `saturday_work_schedule` trước khi dùng `isSaturdayOff()`
2. Tính OT cho thứ 7 làm việc (nếu không phải lịch mặc định)
3. Không trừ lương cho thứ 7 nghỉ (nếu theo lịch mặc định)

## Lưu ý kỹ thuật

1. **Validation**: Chỉ cho phép chọn ngày thứ 7
2. **Bulk operation**: Có thể phân công cho nhiều nhân viên cùng lúc
3. **Upsert**: Nếu đã có lịch, sẽ update thay vì tạo mới
4. **RLS**: Database tự động filter theo level và department
5. **Cascade delete**: Xóa nhân viên sẽ xóa luôn lịch của họ

## Testing

### Test permission
1. Login với user level 3 → Chỉ thấy nhân viên cùng phòng ban
2. Login với user level 4 → Thấy tất cả nhân viên
3. Login với user level 2 → Không thấy tab "Lịch làm thứ 7"

### Test phân công
1. Phân công 1 nhân viên làm thứ 7 (lịch mặc định = nghỉ)
2. Phân công nhiều nhân viên cùng lúc
3. Phân công trùng ngày → Phải update, không duplicate
4. Xóa lịch → Nhân viên theo lịch mặc định

### Test validation
1. Chọn ngày không phải thứ 7 → Báo lỗi
2. Không chọn nhân viên → Báo lỗi
3. Không chọn ngày → Báo lỗi
