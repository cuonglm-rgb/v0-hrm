-- =============================================
-- WORK SHIFTS UPDATE - Thêm giờ nghỉ trưa
-- =============================================

-- Thêm cột break_start và break_end
ALTER TABLE work_shifts ADD COLUMN IF NOT EXISTS break_start time;
ALTER TABLE work_shifts ADD COLUMN IF NOT EXISTS break_end time;

-- Cập nhật dữ liệu mẫu
UPDATE work_shifts SET 
  break_start = '12:00',
  break_end = '13:30'
WHERE break_start IS NULL;

-- Thêm ca làm mẫu nếu chưa có
INSERT INTO work_shifts (name, start_time, end_time, break_start, break_end, break_minutes)
VALUES 
  ('Ca hành chính', '08:00', '17:00', '12:00', '13:30', 90),
  ('Ca sáng', '06:00', '14:00', '11:00', '11:30', 30),
  ('Ca chiều', '14:00', '22:00', '18:00', '18:30', 30)
ON CONFLICT DO NOTHING;

-- RLS cho work_shifts
ALTER TABLE work_shifts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "work_shifts_select_all" ON work_shifts;
CREATE POLICY "work_shifts_select_all" ON work_shifts FOR SELECT USING (true);

DROP POLICY IF EXISTS "work_shifts_manage_hr_admin" ON work_shifts;
CREATE POLICY "work_shifts_manage_hr_admin" ON work_shifts FOR ALL
USING (has_any_role(array['hr', 'admin']));
