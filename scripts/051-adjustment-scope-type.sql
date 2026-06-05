-- =============================================
-- MỞ RỘNG PHẠM VI ÁP DỤNG CHO PHỤ CẤP/KHẤU TRỪ/PHẠT
-- =============================================
-- Trước đây chỉ có 2 lựa chọn: toàn công ty / nhân viên cụ thể (junction rỗng = toàn công ty)
-- Nay mở rộng thành 4 lựa chọn qua cột scope_type:
--   - 'all_company'           : áp dụng toàn công ty
--   - 'by_department_position': áp dụng theo phòng ban và/hoặc chức vụ (NV mới vào tự động được áp)
--   - 'specific_employees'    : áp dụng cho danh sách nhân viên cụ thể (include)
--   - 'all_except'            : áp dụng cho toàn công ty TRỪ danh sách nhân viên (exclude)

-- 1) Thêm cột scope_type
ALTER TABLE payroll_adjustment_types
  ADD COLUMN IF NOT EXISTS scope_type TEXT NOT NULL DEFAULT 'all_company'
  CHECK (scope_type IN ('all_company', 'by_department_position', 'specific_employees', 'all_except'));

COMMENT ON COLUMN payroll_adjustment_types.scope_type IS
  'Phạm vi áp dụng: all_company | by_department_position | specific_employees | all_except';

-- 2) Migrate dữ liệu cũ: nếu đã có bản ghi trong adjustment_type_employees -> specific_employees
UPDATE payroll_adjustment_types t
SET scope_type = 'specific_employees'
WHERE EXISTS (
  SELECT 1 FROM adjustment_type_employees ae WHERE ae.adjustment_type_id = t.id
)
AND scope_type = 'all_company';

-- 3) Junction table cho phòng ban
CREATE TABLE IF NOT EXISTS adjustment_type_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adjustment_type_id UUID NOT NULL REFERENCES payroll_adjustment_types(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(adjustment_type_id, department_id)
);

CREATE INDEX IF NOT EXISTS idx_adjustment_type_departments_type ON adjustment_type_departments(adjustment_type_id);
CREATE INDEX IF NOT EXISTS idx_adjustment_type_departments_dept ON adjustment_type_departments(department_id);

-- 4) Junction table cho chức vụ
CREATE TABLE IF NOT EXISTS adjustment_type_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adjustment_type_id UUID NOT NULL REFERENCES payroll_adjustment_types(id) ON DELETE CASCADE,
  position_id UUID NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(adjustment_type_id, position_id)
);

CREATE INDEX IF NOT EXISTS idx_adjustment_type_positions_type ON adjustment_type_positions(adjustment_type_id);
CREATE INDEX IF NOT EXISTS idx_adjustment_type_positions_pos ON adjustment_type_positions(position_id);

-- 5) RLS policies (giống pattern bảng adjustment_type_employees)
ALTER TABLE adjustment_type_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE adjustment_type_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view adjustment type departments"
  ON adjustment_type_departments FOR SELECT TO authenticated USING (true);

CREATE POLICY "HR/Admin can manage adjustment type departments"
  ON adjustment_type_departments FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.code IN ('hr', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.code IN ('hr', 'admin')
    )
  );

CREATE POLICY "Employees can view adjustment type positions"
  ON adjustment_type_positions FOR SELECT TO authenticated USING (true);

CREATE POLICY "HR/Admin can manage adjustment type positions"
  ON adjustment_type_positions FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.code IN ('hr', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.code IN ('hr', 'admin')
    )
  );

COMMENT ON TABLE adjustment_type_departments IS 'Phòng ban áp dụng (khi scope_type = by_department_position)';
COMMENT ON TABLE adjustment_type_positions IS 'Chức vụ áp dụng (khi scope_type = by_department_position)';
