# Tài liệu Yêu cầu

## Giới thiệu

Tính năng cho phép cấu hình loại phiếu (request type) hỗ trợ nhiều khung giờ trong cùng một phiếu yêu cầu. Hiện tại, mỗi phiếu chỉ lưu được một cặp `from_time`/`to_time`, khiến nhân viên phải tạo nhiều phiếu riêng biệt khi cần đăng ký nhiều khung giờ trong cùng một ngày (ví dụ: tăng ca sáng 6:00-8:00 và tăng ca chiều 17:00-20:00). Tính năng này sẽ thêm tùy chọn cấu hình cho phép nhập nhiều khung giờ trong một phiếu duy nhất.

## Thuật ngữ

- **Hệ_thống**: Ứng dụng HRM (Next.js + Supabase) bao gồm cả frontend và backend
- **Loại_phiếu**: Bản ghi cấu hình trong bảng `request_types`, định nghĩa các trường nhập cho một loại yêu cầu
- **Phiếu_yêu_cầu**: Bản ghi trong bảng `employee_requests`, là phiếu mà nhân viên tạo
- **Khung_giờ**: Một cặp thời gian bắt đầu (`from_time`) và kết thúc (`to_time`)
- **Danh_sách_khung_giờ**: Mảng các Khung_giờ được lưu trong bảng con `request_time_slots`
- **Quản_trị_viên**: Người dùng có quyền cấu hình Loại_phiếu
- **Nhân_viên**: Người dùng tạo Phiếu_yêu_cầu
- **Form_tạo_phiếu**: Giao diện dialog để Nhân_viên tạo hoặc sửa Phiếu_yêu_cầu
- **Form_cấu_hình**: Giao diện quản lý Loại_phiếu dành cho Quản_trị_viên

## Yêu cầu

### Yêu cầu 1: Cấu hình loại phiếu hỗ trợ nhiều khung giờ

**User Story:** Là Quản_trị_viên, tôi muốn bật tùy chọn nhiều khung giờ cho một Loại_phiếu, để Nhân_viên có thể nhập nhiều khung giờ trong cùng một phiếu.

#### Tiêu chí chấp nhận

1. WHEN Quản_trị_viên bật tùy chọn `allows_multiple_time_slots` trên một Loại_phiếu, THE Hệ_thống SHALL lưu giá trị cấu hình này vào bảng `request_types`
2. WHEN tùy chọn `allows_multiple_time_slots` được bật, THE Hệ_thống SHALL tự động bật `requires_time_range` nếu chưa bật
3. WHEN tùy chọn `requires_time_range` bị tắt, THE Hệ_thống SHALL tự động tắt `allows_multiple_time_slots`
4. THE Form_cấu_hình SHALL hiển thị toggle `allows_multiple_time_slots` trong phần "Cấu hình trường nhập" ngay dưới toggle `requires_time_range`

### Yêu cầu 2: Nhập nhiều khung giờ khi tạo phiếu

**User Story:** Là Nhân_viên, tôi muốn nhập nhiều khung giờ trong một phiếu yêu cầu, để tôi không phải tạo nhiều phiếu riêng biệt cho cùng một ngày.

#### Tiêu chí chấp nhận

1. WHEN Nhân_viên tạo phiếu cho Loại_phiếu có `allows_multiple_time_slots` bật, THE Form_tạo_phiếu SHALL hiển thị nút "Thêm khung giờ" bên dưới khung giờ đầu tiên
2. WHEN Nhân_viên nhấn nút "Thêm khung giờ", THE Form_tạo_phiếu SHALL thêm một cặp trường `from_time`/`to_time` mới vào form
3. WHEN Nhân_viên nhấn nút xóa trên một khung giờ, THE Form_tạo_phiếu SHALL xóa khung giờ đó khỏi form
4. THE Form_tạo_phiếu SHALL yêu cầu ít nhất một Khung_giờ hợp lệ trước khi cho phép gửi phiếu
5. WHEN Nhân_viên gửi phiếu có nhiều khung giờ, THE Hệ_thống SHALL lưu tất cả các Khung_giờ vào bảng `request_time_slots` liên kết với Phiếu_yêu_cầu

### Yêu cầu 3: Validation khung giờ

**User Story:** Là Nhân_viên, tôi muốn hệ thống kiểm tra tính hợp lệ của các khung giờ, để tôi không nhập sai dữ liệu.

#### Tiêu chí chấp nhận

1. WHEN Nhân_viên nhập một Khung_giờ có `from_time` lớn hơn hoặc bằng `to_time`, THE Hệ_thống SHALL hiển thị lỗi "Giờ bắt đầu phải trước giờ kết thúc"
2. WHEN Nhân_viên nhập hai Khung_giờ có khoảng thời gian chồng chéo nhau, THE Hệ_thống SHALL hiển thị lỗi "Các khung giờ không được chồng chéo"
3. WHEN Nhân_viên gửi phiếu với Khung_giờ có `from_time` hoặc `to_time` trống, THE Hệ_thống SHALL hiển thị lỗi và ngăn gửi phiếu

### Yêu cầu 4: Hiển thị nhiều khung giờ trong danh sách và chi tiết phiếu

**User Story:** Là Nhân_viên, tôi muốn xem tất cả các khung giờ đã nhập khi xem lại phiếu, để tôi biết chính xác các khung giờ đã đăng ký.

#### Tiêu chí chấp nhận

1. WHEN hiển thị Phiếu_yêu_cầu có nhiều khung giờ trong danh sách, THE Hệ_thống SHALL hiển thị tất cả các Khung_giờ dưới dạng danh sách (ví dụ: "06:00-08:00, 17:00-20:00")
2. WHEN hiển thị chi tiết Phiếu_yêu_cầu có nhiều khung giờ, THE Hệ_thống SHALL hiển thị từng Khung_giờ trên một dòng riêng biệt
3. WHEN Nhân_viên sửa Phiếu_yêu_cầu có nhiều khung giờ (trạng thái pending), THE Form_tạo_phiếu SHALL load lại tất cả các Khung_giờ đã lưu để chỉnh sửa

### Yêu cầu 5: Tương thích ngược với phiếu khung giờ đơn

**User Story:** Là Quản_trị_viên, tôi muốn tính năng mới tương thích ngược với các phiếu đã tồn tại, để dữ liệu cũ không bị ảnh hưởng.

#### Tiêu chí chấp nhận

1. WHEN Loại_phiếu có `allows_multiple_time_slots` tắt, THE Hệ_thống SHALL tiếp tục sử dụng trường `from_time`/`to_time` trực tiếp trên bảng `employee_requests` như hiện tại
2. WHEN Phiếu_yêu_cầu cũ (trước khi có tính năng) được hiển thị, THE Hệ_thống SHALL đọc `from_time`/`to_time` từ bảng `employee_requests` nếu không có bản ghi nào trong `request_time_slots`
3. THE Hệ_thống SHALL không yêu cầu migration dữ liệu cho các Phiếu_yêu_cầu đã tồn tại

### Yêu cầu 6: Lưu trữ dữ liệu nhiều khung giờ

**User Story:** Là Quản_trị_viên, tôi muốn dữ liệu nhiều khung giờ được lưu trữ có cấu trúc, để dễ truy vấn và tích hợp với các module khác.

#### Tiêu chí chấp nhận

1. THE Hệ_thống SHALL lưu các Khung_giờ trong bảng `request_time_slots` với các cột: `id`, `request_id`, `from_time`, `to_time`, `slot_order`, `created_at`
2. WHEN một Phiếu_yêu_cầu bị hủy hoặc xóa, THE Hệ_thống SHALL xóa tất cả các bản ghi Khung_giờ liên quan trong `request_time_slots`
3. WHEN truy vấn Phiếu_yêu_cầu có nhiều khung giờ, THE Hệ_thống SHALL trả về Danh_sách_khung_giờ được sắp xếp theo `slot_order` tăng dần
