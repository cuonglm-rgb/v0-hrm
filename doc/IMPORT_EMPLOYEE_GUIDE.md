# Hướng dẫn Import Nhân viên

## Các trường được hỗ trợ

File Excel/CSV cần có các cột sau (tên cột phải khớp chính xác):

| Tên cột | Bắt buộc | Mô tả | Ví dụ |
|---------|----------|-------|-------|
| MÃ NHÂN VIÊN | Không | Mã nhân viên (tự động tạo nếu để trống) | 2, NV001 |
| HỌ TÊN | **Có** | Họ và tên đầy đủ | Hoàng Phan Tuấn |
| EMAIL | **Có** | Email (dùng để đăng nhập) | tuanhp@pamoteam.com |
| SỐ ĐIỆN THOẠI | Không | Số điện thoại | 0901234567 |
| PHÒNG BAN | Không | Tên phòng ban hoặc mã phòng ban (phải tồn tại trong hệ thống) | SUPPORT, Phòng Support |
| CHỨC VỤ PHÒNG BAN | Không | Tên chức vụ (phải tồn tại trong hệ thống) | Support |
| NGÀY VÀO LÀM | Không | Ngày bắt đầu làm việc | 1/12/2018 |
| NGÀY CHÍNH THỨC VÀO LÀM | Không | Ngày chính thức | 1/12/2018 |
| **MỨC LƯƠNG THÁNG** | Không | Lương cơ bản (VNĐ) | 5000000 |
| CA LÀM VIỆC | Không | Tên ca làm việc (phải tồn tại trong hệ thống) | Ca 8h |

## Quy tắc Import

### ✅ Nhân viên luôn được tạo nếu:
- Có **HỌ TÊN** và **EMAIL** hợp lệ
- Email chưa tồn tại trong hệ thống (hoặc đã tồn tại thì sẽ cập nhật)

### 📝 Các trường không bắt buộc:
- **Phòng ban, Chức vụ, Ca làm việc:** Nếu không tìm thấy → để `null` (bỏ trống)
- **Lương:** Nếu = 0 hoặc trống → không tạo bản ghi lương
- **Ngày vào làm, Ngày chính thức:** Nếu trống → để `null`

### 🔄 Khi email đã tồn tại:
- Hệ thống sẽ **cập nhật** thông tin nhân viên (không tạo mới)
- Cập nhật: phòng ban, chức vụ, ca làm việc, ngày vào làm, số điện thoại
- Lương: tạo mới hoặc cập nhật tùy theo `effective_date`

## Xử lý trường Phòng ban

### Cách tìm kiếm phòng ban:
Hệ thống sẽ tìm phòng ban theo thứ tự ưu tiên:

1. **So sánh với mã phòng ban (code)** - Ưu tiên cao nhất
   - Ví dụ: "SUPPORT" → tìm phòng ban có code = "SUPPORT"
   - Ví dụ: "IT" → tìm phòng ban có code = "IT"

2. **So sánh với tên phòng ban (name)** - Ưu tiên thứ hai
   - Ví dụ: "Phòng Support" → tìm phòng ban có name = "Phòng Support"
   - Ví dụ: "Phòng Kế toán" → tìm phòng ban có name = "Phòng Kế toán"

3. **So sánh một phần (partial match)** - Ưu tiên thấp nhất
   - Ví dụ: "Support" → có thể khớp với "Phòng Support"
   - Ví dụ: "Kế toán" → có thể khớp với "Phòng Kế toán"

### Lưu ý:
- ⚠️ So sánh không phân biệt chữ hoa/thường
- ✅ **Nếu không tìm thấy phòng ban, nhân viên vẫn được tạo nhưng `department_id` = null (bỏ trống)**
- ✅ Bạn có thể cập nhật phòng ban sau khi import

## Xử lý trường Chức vụ và Ca làm việc

### Cách tìm kiếm:
- **Chức vụ (Position):** So sánh với tên chức vụ trong database (không phân biệt hoa/thường)
- **Ca làm việc (Shift):** So sánh với tên ca làm việc trong database (không phân biệt hoa/thường)

### Lưu ý:
- ✅ **Nếu không tìm thấy, nhân viên vẫn được tạo nhưng trường đó = null (bỏ trống)**
- ✅ Bạn có thể cập nhật sau khi import
- ⚠️ Chức vụ và ca làm việc phải khớp chính xác với tên trong database

## Xử lý trường Lương

### Cách hoạt động:
1. **Khi import nhân viên mới:**
   - Nếu có `MỨC LƯƠNG THÁNG` > 0, hệ thống sẽ tự động tạo bản ghi lương trong bảng `salary_structure`
   - `effective_date` = `NGÀY CHÍNH THỨC VÀO LÀM` hoặc `NGÀY VÀO LÀM` hoặc ngày hiện tại
   - `allowance` = 0 (mặc định)

2. **Khi cập nhật nhân viên đã tồn tại:**
   - Hệ thống kiểm tra xem đã có bản ghi lương cho ngày `effective_date` chưa
   - Nếu có: **cập nhật** lương hiện tại
   - Nếu chưa: **tạo mới** bản ghi lương

### Format số được hỗ trợ:
- `5000000` ✅
- `5,000,000` ✅
- `5.000.000` ✅
- Số trong Excel (number) ✅

### Lưu ý quan trọng:
- ⚠️ Nếu `MỨC LƯƠNG THÁNG` = 0 hoặc để trống, hệ thống **KHÔNG** tạo bản ghi lương
- ⚠️ Phải có quyền RLS để insert/update bảng `salary_structure`
- ✅ **Phòng ban, chức vụ, ca làm việc không bắt buộc** - nếu không tìm thấy sẽ để trống (null)
- ✅ Bạn có thể cập nhật các thông tin này sau khi import

## Kết quả Import

Sau khi import, hệ thống sẽ hiển thị:
- ✅ Số nhân viên đã import thành công
- 💰 Số bản ghi lương đã tạo mới
- 🔄 Số bản ghi lương đã cập nhật
- ❌ Danh sách lỗi (nếu có)

## Kiểm tra sau khi Import

1. **Kiểm tra nhân viên:**
   ```sql
   SELECT * FROM employees WHERE email = 'tuanhp@pamoteam.com';
   ```

2. **Kiểm tra lương:**
   ```sql
   SELECT ss.*, e.full_name, e.email
   FROM salary_structure ss
   JOIN employees e ON e.id = ss.employee_id
   WHERE e.email = 'tuanhp@pamoteam.com'
   ORDER BY ss.effective_date DESC;
   ```

3. **Kiểm tra lương chưa được tạo:**
   ```sql
   SELECT e.full_name, e.email, e.join_date, e.official_date
   FROM employees e
   LEFT JOIN salary_structure ss ON ss.employee_id = e.id
   WHERE ss.id IS NULL;
   ```

## Troubleshooting

### Lương không được tạo?

1. **Kiểm tra giá trị lương trong file:**
   - Đảm bảo cột `MỨC LƯƠNG THÁNG` có giá trị > 0
   - Kiểm tra format số (không có ký tự đặc biệt)

2. **Kiểm tra quyền RLS:**
   ```sql
   -- Kiểm tra policies cho salary_structure
   SELECT * FROM pg_policies WHERE tablename = 'salary_structure';
   ```

3. **Kiểm tra log lỗi:**
   - Xem phần "Lỗi" trong kết quả import
   - Tìm dòng có chứa "Lỗi tạo lương" hoặc "Lỗi cập nhật lương"

### Nhân viên đã tồn tại?

- Hệ thống sẽ **cập nhật** thông tin nhân viên (phòng ban, chức vụ, ca làm việc, ngày vào làm)
- Lương sẽ được **tạo mới** hoặc **cập nhật** tùy theo `effective_date`

## File mẫu

Xem file: `doc/IMPORT NHÂN VIÊN.xlsx` hoặc `doc/IMPORT NHÂN VIÊN.csv`

## Ví dụ mapping phòng ban

Giả sử trong database có các phòng ban sau:

| Tên phòng ban | Mã |
|---------------|-----|
| IT | IT |
| Phòng Kế toán | ACCOUNTING |
| Phòng Nhân sự | HR |
| Phòng Support | SUPPORT |
| Phòng Thiết kế | DESIGN |

Các giá trị trong file Excel sẽ được map như sau:

| Giá trị trong Excel | Kết quả mapping | Ghi chú |
|---------------------|-----------------|---------|
| SUPPORT | ✅ Phòng Support (khớp code) | Gán department_id |
| Support | ✅ Phòng Support (khớp partial) | Gán department_id |
| Phòng Support | ✅ Phòng Support (khớp name) | Gán department_id |
| IT | ✅ IT (khớp code) | Gán department_id |
| ACCOUNTING | ✅ Phòng Kế toán (khớp code) | Gán department_id |
| Kế toán | ✅ Phòng Kế toán (khớp partial) | Gán department_id |
| Phòng Kế toán | ✅ Phòng Kế toán (khớp name) | Gán department_id |
| ABC | ✅ Nhân viên được tạo | **department_id = null** |
| (để trống) | ✅ Nhân viên được tạo | **department_id = null** |

**Kết luận:** Nhân viên luôn được tạo thành công, chỉ khác là có hoặc không có phòng ban.
