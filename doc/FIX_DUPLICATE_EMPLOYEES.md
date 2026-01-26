# Fix Duplicate Employees Issue

## Vấn đề

Khi import nhân viên trước khi họ đăng nhập, hệ thống tạo bản ghi `employees` với `user_id = null`. Sau đó khi user đăng nhập lần đầu, trigger tự động tạo thêm một bản ghi `employees` mới, dẫn đến trùng lặp.

### Ví dụ:
```
Email: bigdaddy@pamoteam.com
- Employee 1: id=xxx, user_id=null, employee_code=23 (từ import)
- Employee 2: id=yyy, user_id=abc, employee_code=NV202601xxxx (từ trigger khi login)
```

## Nguyên nhân

Script `003-trigger-auto-employee.sql` tạo trigger cũ luôn tạo mới employee. Script `037-update-trigger-link-existing-employee.sql` cập nhật function nhưng **không tạo lại trigger**, nên trigger vẫn dùng logic cũ.

## Giải pháp

### ⚠️ Nếu gặp lỗi "Authentication Error" khi chạy script 037

Trigger có thể đang gây lỗi. Làm theo các bước sau:

#### Bước 1: Tạm thời disable trigger

```sql
-- Chạy file này để tắt trigger
\i scripts/037a-disable-trigger-temporarily.sql
```

Hoặc chạy trực tiếp:
```sql
alter table auth.users disable trigger on_auth_user_created;
```

#### Bước 2: Test login

Thử đăng nhập lại. Nếu thành công, vấn đề là do trigger.

#### Bước 3: Chạy lại script 037 (đã được cập nhật với error handling)

```sql
\i scripts/037-update-trigger-link-existing-employee.sql
```

Script mới có:
- ✅ Error handling tốt hơn (try-catch)
- ✅ Luôn return `new` để không block authentication
- ✅ Log warnings thay vì throw errors
- ✅ Case-insensitive email comparison

#### Bước 4: Enable lại trigger

```sql
\i scripts/037b-enable-trigger.sql
```

Hoặc:
```sql
alter table auth.users enable trigger on_auth_user_created;
```

### Quy trình chuẩn (không có lỗi)

### Bước 1: Chạy lại script 037 (đã được cập nhật)

Script này sẽ:
- Cập nhật function `handle_new_user()` với logic mới
- **Tạo lại trigger** để đảm bảo dùng function mới
- Thêm `on conflict do nothing` để tránh lỗi khi assign role

```sql
-- Chạy file này trong Supabase SQL Editor
\i scripts/037-update-trigger-link-existing-employee.sql
```

### Bước 2: Fix dữ liệu hiện tại (merge duplicates)

Chạy script 038 để merge các employee trùng lặp:

```sql
-- Chạy file này trong Supabase SQL Editor
\i scripts/038-fix-duplicate-employees.sql
```

Script này sẽ:
1. Tìm tất cả email có nhiều hơn 1 employee
2. Giữ lại employee có `user_id` (đã login)
3. Merge dữ liệu từ employee cũ (import) sang employee mới
4. Cập nhật tất cả foreign key references
5. Xóa employee trùng lặp

### Bước 3: Kiểm tra kết quả

```sql
-- Kiểm tra không còn duplicate
select 
  email,
  count(*) as count
from employees
group by email
having count(*) > 1;

-- Kiểm tra employee của bigdaddy
select 
  id,
  employee_code,
  full_name,
  email,
  user_id,
  department_id,
  position_id,
  status,
  created_at
from employees
where email = 'bigdaddy@pamoteam.com';
```

## Logic mới của trigger

Sau khi chạy script 037, trigger sẽ hoạt động như sau:

```
Khi user đăng nhập lần đầu:
1. Tìm employee có email trùng và user_id = null
2. Nếu tìm thấy:
   → Cập nhật user_id cho employee đó (link)
   → KHÔNG tạo mới
3. Nếu không tìm thấy:
   → Tạo employee mới (user chưa được import)
```

## Quy trình import đúng

Để tránh vấn đề này trong tương lai:

1. **Import nhân viên trước** (với email chính xác)
2. **Chạy script 037** để đảm bảo trigger đúng
3. **User đăng nhập** → Tự động link với employee đã import

## Kiểm tra trigger hiện tại

```sql
-- Xem trigger có tồn tại không
select 
  tgname as trigger_name,
  tgenabled as enabled,
  proname as function_name
from pg_trigger t
join pg_proc p on p.oid = t.tgfoid
where tgname = 'on_auth_user_created';

-- Xem source code của function
select pg_get_functiondef(oid)
from pg_proc
where proname = 'handle_new_user';
```

## Lưu ý

- ⚠️ Script 038 sẽ **xóa** employee trùng lặp sau khi merge dữ liệu
- ⚠️ Backup database trước khi chạy script 038
- ✅ Script 038 an toàn - chỉ merge và xóa duplicate, không ảnh hưởng employee khác
- ✅ Sau khi fix, import mới sẽ không bị duplicate nữa
