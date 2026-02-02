-- =============================================
-- SATURDAY WORK SCHEDULE (Lịch làm thứ 7)
-- =============================================
-- Cho phép leader phân công lịch làm thứ 7 cho nhân viên
-- Override lịch mặc định xen kẽ của công ty

CREATE TABLE IF NOT EXISTS saturday_work_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  work_date DATE NOT NULL,
  is_working BOOLEAN NOT NULL DEFAULT true,
  note TEXT,
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, work_date),
  -- Constraint: work_date phải là thứ 7
  CONSTRAINT check_saturday CHECK (EXTRACT(DOW FROM work_date) = 6)
);

-- Index
CREATE INDEX idx_saturday_schedule_employee ON saturday_work_schedule(employee_id);
CREATE INDEX idx_saturday_schedule_date ON saturday_work_schedule(work_date);
CREATE INDEX idx_saturday_schedule_employee_date ON saturday_work_schedule(employee_id, work_date);

-- RLS Policies
ALTER TABLE saturday_work_schedule ENABLE ROW LEVEL SECURITY;

-- Nhân viên có thể xem lịch của mình
CREATE POLICY "Employees can view their own saturday schedule"
  ON saturday_work_schedule
  FOR SELECT
  TO authenticated
  USING (
    employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    )
  );

-- Leader (level >= 3) có thể xem lịch nhân viên trong phòng ban
CREATE POLICY "Leaders can view department saturday schedule"
  ON saturday_work_schedule
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      JOIN positions p ON e.position_id = p.id
      WHERE e.user_id = auth.uid()
      AND p.level >= 3
      AND (
        -- Level 3: Chỉ thấy nhân viên cùng phòng ban
        (p.level = 3 AND employee_id IN (
          SELECT e2.id FROM employees e2
          WHERE e2.department_id = e.department_id
        ))
        -- Level > 3: Thấy tất cả
        OR p.level > 3
      )
    )
  );

-- Leader (level >= 3) có thể thêm/sửa lịch cho nhân viên
CREATE POLICY "Leaders can manage department saturday schedule"
  ON saturday_work_schedule
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      JOIN positions p ON e.position_id = p.id
      WHERE e.user_id = auth.uid()
      AND p.level >= 3
      AND (
        -- Level 3: Chỉ quản lý nhân viên cùng phòng ban
        (p.level = 3 AND employee_id IN (
          SELECT e2.id FROM employees e2
          WHERE e2.department_id = e.department_id
        ))
        -- Level > 3: Quản lý tất cả
        OR p.level > 3
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees e
      JOIN positions p ON e.position_id = p.id
      WHERE e.user_id = auth.uid()
      AND p.level >= 3
      AND (
        (p.level = 3 AND employee_id IN (
          SELECT e2.id FROM employees e2
          WHERE e2.department_id = e.department_id
        ))
        OR p.level > 3
      )
    )
  );

-- Trigger update timestamp
CREATE OR REPLACE FUNCTION update_saturday_schedule_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_saturday_schedule_updated_at
  BEFORE UPDATE ON saturday_work_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_saturday_schedule_updated_at();

COMMENT ON TABLE saturday_work_schedule IS 'Lịch làm thứ 7 tùy chỉnh cho từng nhân viên';
COMMENT ON COLUMN saturday_work_schedule.is_working IS 'true = Phải làm việc, false = Được nghỉ';
COMMENT ON COLUMN saturday_work_schedule.work_date IS 'Ngày thứ 7 (phải là thứ 7)';
COMMENT ON COLUMN saturday_work_schedule.created_by IS 'Leader phân công';
