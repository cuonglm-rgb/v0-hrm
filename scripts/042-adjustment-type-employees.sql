-- =============================================
-- BẢNG QUẢN LÝ NHÂN VIÊN ÁP DỤNG PHỤ CẤP/KHẤU TRỪ
-- =============================================
-- Bảng junction để lưu danh sách nhân viên được chọn cho từng loại phụ cấp/khấu trừ tự động
-- Quy tắc:
--   - Nếu KHÔNG CÓ bản ghi nào: áp dụng cho TOÀN CÔNG TY
--   - Nếu CÓ bản ghi: chỉ áp dụng cho NHỮNG NHÂN VIÊN ĐƯỢC CHỌN

CREATE TABLE IF NOT EXISTS adjustment_type_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adjustment_type_id UUID NOT NULL REFERENCES payroll_adjustment_types(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(adjustment_type_id, employee_id)
);

-- Index
CREATE INDEX idx_adjustment_type_employees_type ON adjustment_type_employees(adjustment_type_id);
CREATE INDEX idx_adjustment_type_employees_emp ON adjustment_type_employees(employee_id);

-- RLS Policies
ALTER TABLE adjustment_type_employees ENABLE ROW LEVEL SECURITY;

-- Tất cả nhân viên đều có thể xem
CREATE POLICY "Employees can view adjustment type employees"
  ON adjustment_type_employees
  FOR SELECT
  TO authenticated
  USING (true);

-- Chỉ HR/Admin có thể thêm/sửa/xóa
CREATE POLICY "HR/Admin can manage adjustment type employees"
  ON adjustment_type_employees
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

COMMENT ON TABLE adjustment_type_employees IS 'Danh sách nhân viên áp dụng cho phụ cấp/khấu trừ tự động. Nếu rỗng = áp dụng toàn công ty';
COMMENT ON COLUMN adjustment_type_employees.adjustment_type_id IS 'ID loại phụ cấp/khấu trừ';
COMMENT ON COLUMN adjustment_type_employees.employee_id IS 'ID nhân viên được áp dụng';
