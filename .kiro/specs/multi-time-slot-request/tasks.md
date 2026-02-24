# Kế hoạch Triển khai: Nhiều khung giờ trong 1 phiếu

## Tổng quan

Triển khai tính năng cho phép cấu hình và nhập nhiều khung giờ trong cùng một phiếu yêu cầu. Bao gồm migration DB, cập nhật types, server actions, UI form cấu hình, UI form tạo phiếu, và hiển thị.

## Tasks

- [x] 1. Database migration và TypeScript types
  - [x] 1.1 Tạo file SQL migration thêm cột `allows_multiple_time_slots` vào `request_types` và tạo bảng `request_time_slots`
    - Thêm cột `allows_multiple_time_slots BOOLEAN DEFAULT false` vào `request_types`
    - Tạo bảng `request_time_slots` với các cột: id, request_id, from_time, to_time, slot_order, created_at
    - Thêm constraint CHECK (from_time < to_time), foreign key ON DELETE CASCADE, index trên request_id
    - _Requirements: 6.1, 6.2_

  - [x] 1.2 Cập nhật TypeScript types trong `lib/types/database.ts`
    - Thêm `allows_multiple_time_slots: boolean` vào interface `RequestType`
    - Tạo interface `RequestTimeSlot` với các trường: id, request_id, from_time, to_time, slot_order, created_at
    - Thêm `time_slots?: RequestTimeSlot[]` vào `EmployeeRequestWithRelations`
    - _Requirements: 6.1_

- [x] 2. Utility functions: validation và format
  - [x] 2.1 Tạo file `lib/utils/time-slot-utils.ts` với các hàm tiện ích
    - `validateTimeSlot(from_time, to_time)`: kiểm tra from_time < to_time
    - `validateNoOverlap(slots)`: kiểm tra không có khung giờ chồng chéo
    - `formatTimeSlots(slots)`: format danh sách khung giờ thành chuỗi hiển thị
    - `getTimeSlotsWithFallback(timeSlots, legacyFromTime, legacyToTime)`: fallback logic
    - `applyToggleCoupling(allows_multiple, requires_time_range)`: logic liên kết toggle
    - _Requirements: 1.2, 1.3, 3.1, 3.2, 4.1, 5.2_

  - [ ]* 2.2 Viết property test cho hàm validation khung giờ (Property 4)
    - **Property 4: Phát hiện khung giờ không hợp lệ**
    - Dùng fast-check generate random time pairs với from_time >= to_time, verify validation trả về lỗi
    - **Validates: Requirements 3.1**

  - [ ]* 2.3 Viết property test cho hàm phát hiện chồng chéo (Property 5)
    - **Property 5: Phát hiện khung giờ chồng chéo**
    - Dùng fast-check generate random overlapping time slot pairs, verify detection
    - **Validates: Requirements 3.2**

  - [ ]* 2.4 Viết property test cho hàm format hiển thị (Property 6)
    - **Property 6: Hàm format hiển thị đầy đủ khung giờ**
    - Dùng fast-check generate random time slot arrays, verify formatted string chứa tất cả slots
    - **Validates: Requirements 4.1**

  - [ ]* 2.5 Viết property test cho toggle coupling logic (Property 1)
    - **Property 1: Bất biến liên kết cấu hình toggle**
    - Dùng fast-check generate random boolean pairs, apply toggle logic, verify invariant
    - **Validates: Requirements 1.2, 1.3**

  - [ ]* 2.6 Viết property test cho fallback logic (Property 7)
    - **Property 7: Fallback về trường legacy**
    - Dùng fast-check generate random from_time/to_time, verify fallback trả về đúng 1 slot
    - **Validates: Requirements 5.2**

  - [ ]* 2.7 Viết property test cho thao tác thêm/xóa khung giờ (Property 2)
    - **Property 2: Thao tác thêm/xóa khung giờ trên danh sách**
    - Dùng fast-check generate random slot lists, apply add/remove, verify length changes
    - **Validates: Requirements 2.2, 2.3**

- [x] 3. Checkpoint - Đảm bảo tất cả tests pass
  - Đảm bảo tất cả tests pass, hỏi user nếu có thắc mắc.

- [x] 4. Server actions
  - [x] 4.1 Cập nhật `createRequestType` và `updateRequestType` trong `lib/actions/request-type-actions.ts`
    - Thêm trường `allows_multiple_time_slots` vào input và logic insert/update
    - _Requirements: 1.1_

  - [x] 4.2 Cập nhật `createEmployeeRequest` trong `lib/actions/request-type-actions.ts`
    - Thêm param `time_slots?: { from_time: string; to_time: string }[]`
    - Khi loại phiếu có `allows_multiple_time_slots`, lưu vào `request_time_slots` thay vì `from_time`/`to_time` trên `employee_requests`
    - Validate time slots trước khi lưu (dùng hàm từ time-slot-utils)
    - Rollback nếu lưu time slots thất bại
    - _Requirements: 2.5, 3.1, 3.2, 3.3_

  - [x] 4.3 Cập nhật `updateEmployeeRequest` trong `lib/actions/request-type-actions.ts`
    - Hỗ trợ cập nhật time slots: xóa slots cũ, insert slots mới
    - _Requirements: 4.3_

  - [x] 4.4 Cập nhật các hàm query (`getMyEmployeeRequests`, `listEmployeeRequests`, `listEmployeeRequestsWithMyApprovalStatus`)
    - Join thêm `request_time_slots` khi query employee_requests
    - Sắp xếp time slots theo slot_order
    - _Requirements: 6.3_

- [x] 5. UI: Form cấu hình loại phiếu
  - [x] 5.1 Cập nhật `components/leave/request-type-management.tsx`
    - Thêm toggle `allows_multiple_time_slots` trong phần "Cấu hình trường nhập"
    - Đặt ngay dưới toggle `requires_time_range`
    - Implement logic coupling: bật multi → bật time_range, tắt time_range → tắt multi
    - Thêm trường vào formData state và resetForm
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 6. UI: Form tạo/sửa phiếu với nhiều khung giờ
  - [x] 6.1 Cập nhật `components/leave/leave-request-panel.tsx` - phần tạo phiếu
    - Thêm state `timeSlots` là array of { from_time, to_time }
    - Khi loại phiếu có `allows_multiple_time_slots`, render danh sách khung giờ thay vì 1 cặp input
    - Thêm nút "Thêm khung giờ" và nút xóa cho mỗi khung giờ
    - Validate trước khi submit: from < to, không chồng chéo, ít nhất 1 slot
    - Gửi time_slots array trong requestData
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_

  - [x] 6.2 Cập nhật `components/leave/leave-request-panel.tsx` - phần sửa phiếu
    - Khi edit phiếu có time_slots, load danh sách khung giờ vào state
    - Fallback: nếu không có time_slots, load from_time/to_time từ phiếu gốc
    - _Requirements: 4.3, 5.1, 5.2_

- [x] 7. UI: Hiển thị nhiều khung giờ
  - [x] 7.1 Cập nhật hiển thị trong danh sách phiếu và chi tiết phiếu
    - Trong danh sách: hiển thị tất cả khung giờ dạng "06:00-08:00, 17:00-20:00"
    - Trong chi tiết: hiển thị từng khung giờ trên dòng riêng
    - Sử dụng hàm `formatTimeSlots` và `getTimeSlotsWithFallback`
    - _Requirements: 4.1, 4.2, 5.2_

- [x] 8. Final checkpoint - Đảm bảo tất cả tests pass
  - Đảm bảo tất cả tests pass, hỏi user nếu có thắc mắc.

## Ghi chú

- Tasks đánh dấu `*` là optional, có thể bỏ qua để tập trung vào core features trước
- Mỗi task tham chiếu đến requirements cụ thể để đảm bảo traceability
- Checkpoints đảm bảo kiểm tra tăng dần
- Property tests dùng thư viện `fast-check` cho TypeScript
