-- =============================================
-- ADD COMPANY HOLIDAY TYPE TO SPECIAL WORK DAYS
-- =============================================
-- Thêm loại "Ngày nghỉ công ty" - ngày này sẽ trừ 1 ngày công chuẩn trong payroll
-- Có thể áp dụng cho toàn công ty hoặc chọn riêng từng nhân viên

-- Thêm cột is_company_holiday
ALTER TABLE special_work_days 
ADD COLUMN IF NOT EXISTS is_company_holiday BOOLEAN DEFAULT false;

-- Comment
COMMENT ON COLUMN special_work_days.is_company_holiday IS 'Ngày nghỉ công ty - trừ 1 ngày công chuẩn trong payroll';

-- =============================================
-- BẢNG QUẢN LÝ NHÂN VIÊN ÁP DỤNG NGÀY ĐẶC BIỆT
-- =============================================
-- Bảng junction để lưu danh sách nhân viên được chọn cho từng ngày đặc biệt
-- Quy tắc:
--   - Nếu KHÔNG CÓ bản ghi nào: áp dụng cho TOÀN CÔNG TY
--   - Nếu CÓ bản ghi: chỉ áp dụng cho NHỮNG NHÂN VIÊN ĐƯỢC CHỌN

CREATE TABLE IF NOT EXISTS special_work_day_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  special_work_day_id UUID NOT NULL REFERENCES special_work_days(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(special_work_day_id, employee_id)
);

-- Index
CREATE INDEX idx_special_day_employees_day ON special_work_day_employees(special_work_day_id);
CREATE INDEX idx_special_day_employees_emp ON special_work_day_employees(employee_id);

-- RLS Policies
ALTER TABLE special_work_day_employees ENABLE ROW LEVEL SECURITY;

-- Tất cả nhân viên đều có thể xem
CREATE POLICY "Employees can view special work day employees"
  ON special_work_day_employees
  FOR SELECT
  TO authenticated
  USING (true);

-- Chỉ HR/Admin có thể thêm/sửa/xóa
CREATE POLICY "HR/Admin can manage special work day employees"
  ON special_work_day_employees
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.code IN ('hr', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.code IN ('hr', 'admin')
    )
  );

COMMENT ON TABLE special_work_day_employees IS 'Danh sách nhân viên áp dụng cho ngày đặc biệt. Nếu rỗng = áp dụng toàn công ty';
COMMENT ON COLUMN special_work_day_employees.special_work_day_id IS 'ID ngày làm việc đặc biệt';
COMMENT ON COLUMN special_work_day_employees.employee_id IS 'ID nhân viên được áp dụng';
