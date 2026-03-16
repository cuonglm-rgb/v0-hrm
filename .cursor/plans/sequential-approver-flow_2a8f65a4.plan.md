---
name: sequential-approver-flow
overview: Thêm chế độ duyệt tuần tự cho trường hợp cần tất cả người duyệt đồng ý, với danh sách approver có thứ tự rõ ràng và logic chuyển tiếp khi người trước đã duyệt hoặc bị bỏ qua.
todos:
  - id: schema-approval-steps
    content: "Thiết kế/cập nhật schema lưu thứ tự duyệt: ApprovalFlow, ApprovalStep, ApprovalRequest."
    status: completed
  - id: service-build-requests
    content: Tạo service Approval::BuildRequests để sinh các ApprovalRequest theo thứ tự khi tạo phiếu.
    status: completed
  - id: service-process-action
    content: Tạo service Approval::ProcessAction để xử lý approve/reject/skip và chuyển sang bước tiếp theo.
    status: completed
  - id: controller-update
    content: Cập nhật controller duyệt phiếu để chỉ cho phép duyệt ở step hiện tại và gọi service.
    status: completed
  - id: ui-config-approvers
    content: Cập nhật UI cấu hình approver để nhập và lưu danh sách theo thứ tự (1, 2, 3...).
    status: completed
  - id: ui-request-status
    content: Cập nhật UI chi tiết phiếu để hiển thị tiến trình duyệt tuần tự và ẩn nút duyệt với người chưa đến lượt.
    status: completed
  - id: tests
    content: Viết RSpec + test frontend cho các case duyệt tuần tự, reject, skip.
    status: completed
isProject: false
---

### Mục tiêu

- **Hiển thị danh sách người duyệt theo thứ tự** (1, 2, 3, ...) khi chọn chế độ "Cần tất cả người duyệt đồng ý".
- **Áp dụng cho tất cả các loại phiếu** dùng chế độ này.
- **Luồng duyệt tuần tự**: chỉ khi người thứ N duyệt xong (hoặc bị bỏ qua theo quy tắc) thì người thứ N+1 mới thấy phiếu để duyệt.
- **Fallback**: nếu người duyệt hiện tại bị bỏ qua (ví dụ do admin/HR thao tác hoặc logic timeout sau này), thì hệ thống chuyển sang người tiếp theo.

### Phân tích hiện trạng (dựa trên UI bạn gửi)

- Màn hình cấu hình phê duyệt hiện có:
  - Chế độ duyệt: **"Cần tất cả người duyệt đồng ý"** (select box).
  - Cấu hình theo **Level tối thiểu / Level tối đa** hoặc danh sách cụ thể người duyệt (ví dụ form `Approvers` với các ô 1, 2, 3).
- Chưa có khái niệm **thứ tự phê duyệt bắt buộc** – tất cả người trong danh sách đều có quyền duyệt song song.

### Phạm vi thay đổi

- **Backend** (Rails API / services):
  - Thêm thông tin **thứ tự duyệt** cho từng approver trong cấu hình duyệt.
  - Cập nhật logic tạo yêu cầu duyệt và xác định **người đang có quyền duyệt hiện tại**.
  - Đảm bảo chỉ người ở bước hiện tại mới thấy và thao tác được nút duyệt.
- **Frontend** (React/NextJS – ví dụ `leave-request-panel.tsx`):
  - Cập nhật UI cấu hình để nhập danh sách approver theo thứ tự rõ ràng.
  - Cập nhật phần hiển thị trạng thái duyệt để thể hiện thứ tự (ví dụ Step 1 → Step 2 → Step 3).

### Thiết kế dữ liệu

- **Bảng / model cấu hình phê duyệt** (ví dụ `ApprovalFlow` hoặc tương đương):
  - Thêm hoặc sử dụng quan hệ con `ApprovalStep` (nếu chưa có thì tạo):
    - `approval_flow_id`
    - `position` (integer, 1, 2, 3...)
    - `approver_id` hoặc `approver_role/level`
  - Đảm bảo scope theo loại phiếu (leave, OT, v.v.).
- **Bảng / model trạng thái duyệt từng phiếu** (ví dụ `ApprovalRequest` hoặc tương đương):
  - Mỗi phiếu có nhiều bản ghi trạng thái duyệt, một cho mỗi step.
  - Thuộc tính chính:
    - `request_id` (ID phiếu)
    - `position` (bước thứ mấy)
    - `approver_id`
    - `status` (pending/approved/rejected/skipped)
    - `approved_at`, `skipped_at`.

### Luồng nghiệp vụ duyệt tuần tự

- **Khi tạo phiếu**:
  - Từ cấu hình `ApprovalFlow` sinh ra danh sách `ApprovalRequest` theo thứ tự `position`.
  - Đặt `status = 'pending'` **chỉ** cho bước 1; các bước sau để `status = 'waiting'`.
- **Khi người duyệt hiện tại hành động**:
  - Nếu **approve**: đổi `status` bước hiện tại thành `approved`.
  - Tìm bước kế tiếp (`position + 1`):
    - Nếu có, đổi `status` của bước đó từ `waiting` sang `pending` để mở quyền duyệt.
    - Nếu không có, đánh dấu phiếu là **được duyệt hoàn toàn**.
  - Nếu **reject**: đánh dấu phiếu là **rejected** và không mở bước kế tiếp.
  - Nếu **skip** (sau này hoặc do admin): đổi `status` hiện tại thành `skipped` rồi mở bước tiếp theo tương tự như approve.
- **Quyền truy cập**:
  - Endpoint lấy danh sách phiếu chờ duyệt chỉ trả về những phiếu mà:
    - Tồn tại `ApprovalRequest` với `status = 'pending'` và `approver_id` bằng user hiện tại.

### Cho phép người tạo sửa trường tùy chỉnh khi đang duyệt

- **Cấu hình trên trường tùy chỉnh**:
  - Mỗi trường tùy chỉnh trong cấu hình loại phiếu có thêm toggle: `Cho phép người tạo sửa khi phiếu đang duyệt` (mặc định OFF).
- **Điều kiện được sửa**:
  - Chỉ người tạo phiếu mới được sửa.
  - Chỉ những trường tùy chỉnh nào **bật toggle trên** mới được phép sửa khi phiếu đang duyệt.
  - Phiếu phải thỏa đồng thời các điều kiện:
    - Chưa bị từ chối (status không phải rejected).
    - Chưa duyệt xong bước cuối cùng (vẫn còn bước pending/waiting).
- **Ảnh hưởng tới luồng duyệt**:
  - Việc chỉnh sửa các trường tùy chỉnh được phép **không reset luồng duyệt**:
    - Các bước đã duyệt giữ nguyên trạng thái.
    - Phiếu tiếp tục duyệt từ bước hiện tại trở đi, không quay lại bước 1.

### Thay đổi giao diện cấu hình

- **Form cấu hình approver** (ví dụ màn hình bạn gửi có 1, 2, 3):
  - Giữ nguyên 3 ô nhưng coi đó là **Step 1, Step 2, Step 3**.
  - Mỗi ô cho phép chọn **một hoặc nhiều người** (tuỳ hệ thống hiện tại):
    - Nếu một step có nhiều người, có hai lựa chọn triển khai (chọn một trong code):
      - (A) Chỉ cần **1 trong các người ở Step N duyệt là xong Step N**.
      - (B) Cần **tất cả trong Step N** duyệt xong rồi mới qua Step N+1.
  - Thêm mô tả/bubble text: "Người ở Step 1 duyệt trước, sau khi xong mới đến Step 2...".
- **Hiển thị trạng thái** trên phiếu:
  - Danh sách theo thứ tự: `1. A (Đã duyệt) → 2. B (Đang chờ) → 3. C (Chưa mở)`.
  - Nhấn mạnh người đang chờ duyệt (step hiện tại).

### Thay đổi backend chi tiết (Rails)

- **Model**:
  - Tạo hoặc mở rộng model `ApprovalFlow` và `ApprovalStep` trong `app/models/`.
  - Tạo hoặc mở rộng model `ApprovalRequest` để lưu trạng thái duyệt từng step cho từng phiếu.
  - Thêm scope tiện dụng:
    - `ApprovalRequest.pending_for(user)`
    - `ApprovalRequest.for_request(request).ordered`.
- **Service object** trong `app/services/`:
  - `Approval::BuildRequests.call(request)`
    - Input: phiếu vừa tạo + flow cấu hình.
    - Output: tạo danh sách `ApprovalRequest` theo thứ tự.
  - `Approval::ProcessAction.call(approval_request, action:, actor:)`
    - Xử lý logic approve/reject/skip bước hiện tại.
- **Controller**:
  - Controller duyệt phiếu (ví dụ `ApprovalsController` hoặc `LeaveApprovalsController`):
    - Action `update` hoặc `approve/reject` gọi service `Approval::ProcessAction`.
    - Đảm bảo chỉ cho phép thao tác trên `ApprovalRequest` có `status = 'pending'` và `approver_id` là current_user.

### Thay đổi frontend chi tiết

- **Cấu hình loại phiếu** (ví dụ component `request-type-settings` hoặc tương đương):
  - Gắn label rõ ràng cho các input `Approver 1`, `Approver 2`, `Approver 3`.
  - Đảm bảo gửi lên API dữ liệu với field `position` tương ứng 1, 2, 3.
- **Màn hình phiếu chờ duyệt** (ví dụ `leave-request-panel.tsx`):
  - Khi fetch chi tiết phiếu, backend trả về danh sách `approval_requests` đã sắp xếp và step hiện tại.
  - Chỉ hiển thị nút duyệt nếu user là approver của step hiện tại (`pending`).
  - Hiển thị list trạng thái theo thứ tự cho người xem.

### Kiểm thử

- **Case 1**: 3 người A, B, C; chế độ "Cần tất cả người duyệt đồng ý", thứ tự A → B → C.
  - Tạo phiếu: chỉ A thấy phiếu trong "Cần duyệt".
  - A approve: B bắt đầu thấy; C chưa thấy.
  - B approve: C bắt đầu thấy.
  - C approve: phiếu chuyển sang trạng thái "Được duyệt".
- **Case 2**: A, B, C; A approve, B reject.
  - Phiếu dừng lại ở trạng thái rejected, C không bao giờ thấy.
- **Case 3**: A, B, C; A bị skip.
  - B trở thành người duyệt hiện tại; luồng tiếp tục B → C.

### Todo triển khai

- Thiết kế/điều chỉnh schema `ApprovalFlow`, `ApprovalStep`, `ApprovalRequest` để lưu thứ tự.
- Viết service `Approval::BuildRequests` và `Approval::ProcessAction` theo luồng tuần tự.
- Cập nhật controller duyệt phiếu để dùng service và giới hạn quyền theo step hiện tại.
- Cập nhật UI cấu hình approver để lưu và hiển thị thứ tự rõ ràng.
- Cập nhật UI chi tiết phiếu để chỉ mở nút duyệt cho approver ở step hiện tại và hiển thị tiến trình duyệt.
- Viết test (RSpec + test frontend nếu có) cho các case chính trên.

