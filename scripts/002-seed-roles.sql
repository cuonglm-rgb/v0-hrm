-- =============================================
-- SEED DEFAULT ROLES
-- =============================================

insert into roles (code, name, description) values
  ('admin', 'Administrator', 'Toàn quyền hệ thống'),
  ('hr', 'HR Manager', 'Quản lý nhân sự'),
  ('manager', 'Department Manager', 'Quản lý phòng ban'),
  ('employee', 'Employee', 'Nhân viên')
on conflict (code) do nothing;

-- =============================================
-- SEED SAMPLE DEPARTMENTS
-- =============================================

insert into departments (name, code) values
  ('Ban Giám đốc', 'BOD'),
  ('Phòng Nhân sự', 'HR'),
  ('Phòng Kỹ thuật', 'TECH'),
  ('Phòng Kinh doanh', 'SALES'),
  ('Phòng Kế toán', 'ACCOUNTING')
on conflict (code) do nothing;

-- =============================================
-- SEED SAMPLE POSITIONS
-- =============================================

insert into positions (name, level) values
  ('Giám đốc', 10),
  ('Phó Giám đốc', 9),
  ('Trưởng phòng', 7),
  ('Phó phòng', 6),
  ('Chuyên viên cao cấp', 5),
  ('Chuyên viên', 4),
  ('Nhân viên', 3),
  ('Thực tập sinh', 1);
