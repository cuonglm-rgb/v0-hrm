# Tính năng Hủy Phiếu Đã Duyệt

## Tổng quan
Tính năng cho phép Administrator và HR Manager hủy các phiếu nghỉ/yêu cầu đã được duyệt.

## Quyền hạn
- Chỉ có **Administrator** hoặc **HR Manager** mới có quyền hủy phiếu đã duyệt
- Người dùng thường không thể hủy phiếu đã duyệt

## Cách sử dụng

### 1. Truy cập trang Duyệt phiếu
- Vào `/dashboard/leave-approval`
- Lọc theo trạng thái "Đã duyệt" để xem các phiếu đã được duyệt

### 2. Hủy phiếu
- Tìm phiếu cần hủy trong danh sách
- Nhấn nút **"Hủy"** (màu cam) ở cột "Thao tác"
- Nhập lý do hủy (không bắt buộc)
- Xác nhận hành động

### 3. Kết quả
- Phiếu sẽ chuyển sang trạng thái **"Đã hủy"** (cancelled)
- Lý do hủy và thời gian hủy sẽ được lưu lại
- Trạng thái người duyệt cũng được cập nhật thành "cancelled"

## Thống kê
- Số phiếu đã hủy được hiển thị trong phần thống kê (card màu cam)
- Có thể lọc theo trạng thái "Đã hủy" để xem danh sách các phiếu đã bị hủy

## Chi tiết kỹ thuật

### Database Changes
File migration: `scripts/050-add-request-cancellation-fields.sql`

Các cột mới được thêm vào bảng `employee_requests`:
- `cancelled_at`: Thời gian hủy phiếu
- `cancelled_by`: ID của người hủy phiếu
- `cancellation_reason`: Lý do hủy phiếu

### API
Function: `cancelApprovedRequest(id: string, cancellation_reason?: string)`
- File: `lib/actions/request-type-actions.ts`
- Kiểm tra quyền HR/Admin
- Chỉ cho phép hủy phiếu có status = "approved"
- Cập nhật status thành "cancelled"
- Lưu thông tin người hủy và lý do

### UI Components
File: `components/leave/leave-approval-panel.tsx`
- Thêm nút "Hủy" cho phiếu đã duyệt (chỉ hiển thị với HR/Admin)
- Hiển thị badge "Đã hủy" cho phiếu bị hủy
- Thêm card thống kê số phiếu đã hủy
- Hiển thị lý do hủy trong dialog chi tiết phiếu

### Type Definitions
File: `lib/types/database.ts`
- Cập nhật `RequestStatus` type: thêm "cancelled"
- Cập nhật `EmployeeRequest` interface: thêm các trường cancelled_at, cancelled_by, cancellation_reason

## Lưu ý
- Hành động hủy phiếu không thể hoàn tác
- Nên nhập lý do hủy để dễ theo dõi và kiểm tra sau này
- Phiếu đã hủy vẫn được giữ trong database, không bị xóa
