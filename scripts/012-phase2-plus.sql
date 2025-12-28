-- =============================================
-- PHASE 2+ - Work Shifts & Improvements
-- =============================================

-- 1. Bảng ca làm việc
CREATE TABLE IF NOT EXISTS work_shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  break_minutes int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 2. Thêm shift_id vào employees
ALTER TABLE employees ADD COLUMN IF NOT EXISTS shift_id uuid REFERENCES work_shifts(id);

-- 3. Seed ca làm mặc định
INSERT INTO work_shifts (name, start_time, end_time, break_minutes) VALUES
  ('Hành chính', '08:30', '17:30', 60),
  ('Ca sáng', '06:00', '14:00', 30),
  ('Ca chiều', '14:00', '22:00', 30),
  ('Ca đêm', '22:00', '06:00', 30)
ON CONFLICT DO NOTHING;

-- 4. RLS cho work_shifts (ai cũng xem được)
ALTER TABLE work_shifts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "work_shifts_select_all" ON work_shifts;
CREATE POLICY "work_shifts_select_all"
ON work_shifts FOR SELECT
USING (true);

DROP POLICY IF EXISTS "work_shifts_manage_hr_admin" ON work_shifts;
CREATE POLICY "work_shifts_manage_hr_admin"
ON work_shifts FOR ALL
USING (has_any_role(array['hr', 'admin']));

-- 5. Policy cấm sửa leave sau khi duyệt (bổ sung)
DROP POLICY IF EXISTS "leave_update_self" ON leave_requests;
CREATE POLICY "leave_update_self"
ON leave_requests FOR UPDATE
USING (
  status = 'pending' AND
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);
