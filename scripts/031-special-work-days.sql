-- =============================================
-- SPECIAL WORK DAYS (Ngày làm việc đặc biệt)
-- =============================================
-- Dùng để đánh dấu các ngày có điều kiện làm việc đặc biệt
-- VD: Bão, sự kiện công ty, được về sớm hợp lệ

CREATE TABLE IF NOT EXISTS special_work_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_date DATE NOT NULL,
  reason TEXT NOT NULL,
  allow_early_leave BOOLEAN DEFAULT true,
  allow_late_arrival BOOLEAN DEFAULT false,
  custom_start_time TIME,
  custom_end_time TIME,
  note TEXT,
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(work_date)
);

-- Index
CREATE INDEX idx_special_work_days_date ON special_work_days(work_date);

-- RLS Policies
ALTER TABLE special_work_days ENABLE ROW LEVEL SECURITY;

-- Tất cả nhân viên đều có thể xem
CREATE POLICY "Employees can view special work days"
  ON special_work_days
  FOR SELECT
  TO authenticated
  USING (true);

-- Chỉ HR/Admin có thể thêm/sửa/xóa
CREATE POLICY "HR/Admin can manage special work days"
  ON special_work_days
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

-- Trigger update timestamp
CREATE OR REPLACE FUNCTION update_special_work_days_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_special_work_days_updated_at
  BEFORE UPDATE ON special_work_days
  FOR EACH ROW
  EXECUTE FUNCTION update_special_work_days_updated_at();

COMMENT ON TABLE special_work_days IS 'Quản lý các ngày làm việc đặc biệt (bão, sự kiện, được về sớm hợp lệ)';
COMMENT ON COLUMN special_work_days.allow_early_leave IS 'Cho phép về sớm không bị phạt';
COMMENT ON COLUMN special_work_days.allow_late_arrival IS 'Cho phép đi muộn không bị phạt';
COMMENT ON COLUMN special_work_days.custom_start_time IS 'Giờ vào tùy chỉnh cho ngày này (nếu có)';
COMMENT ON COLUMN special_work_days.custom_end_time IS 'Giờ ra tùy chỉnh cho ngày này (nếu có)';
