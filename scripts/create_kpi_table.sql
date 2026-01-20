-- =============================================
-- KPI EVALUATIONS TABLE
-- Bảng đánh giá KPI nhân viên theo tháng
-- =============================================

CREATE TABLE IF NOT EXISTS kpi_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  status TEXT NOT NULL CHECK (status IN ('achieved', 'not_achieved')),
  bonus_type TEXT NOT NULL CHECK (bonus_type IN ('percentage', 'fixed')),
  bonus_percentage NUMERIC(5,2), -- % lương (VD: 10.00 = 10%)
  bonus_amount NUMERIC(15,2), -- Số tiền cố định
  final_bonus NUMERIC(15,2) NOT NULL DEFAULT 0, -- Số tiền thưởng cuối cùng
  note TEXT,
  evaluated_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  evaluated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Mỗi nhân viên chỉ có 1 đánh giá KPI mỗi tháng
  UNIQUE(employee_id, month, year)
);

-- Index để query nhanh theo tháng/năm
CREATE INDEX IF NOT EXISTS idx_kpi_evaluations_period ON kpi_evaluations(year, month);
CREATE INDEX IF NOT EXISTS idx_kpi_evaluations_employee ON kpi_evaluations(employee_id);

-- Enable RLS
ALTER TABLE kpi_evaluations ENABLE ROW LEVEL SECURITY;

-- Policy cho HR và Admin có thể xem và sửa tất cả
CREATE POLICY "HR and Admin can manage KPI evaluations" ON kpi_evaluations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.code IN ('admin', 'hr')
    )
  );

-- Policy cho nhân viên xem KPI của mình
CREATE POLICY "Employees can view own KPI" ON kpi_evaluations
  FOR SELECT
  USING (
    employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    )
  );

-- Trigger cập nhật updated_at
CREATE OR REPLACE FUNCTION update_kpi_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_kpi_updated_at
  BEFORE UPDATE ON kpi_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_kpi_updated_at();

-- Comment
COMMENT ON TABLE kpi_evaluations IS 'Bảng đánh giá KPI nhân viên theo tháng';
COMMENT ON COLUMN kpi_evaluations.status IS 'Trạng thái: achieved (đạt), not_achieved (không đạt)';
COMMENT ON COLUMN kpi_evaluations.bonus_type IS 'Loại thưởng: percentage (% lương), fixed (số tiền cố định)';
COMMENT ON COLUMN kpi_evaluations.bonus_percentage IS 'Phần trăm thưởng theo lương cơ bản';
COMMENT ON COLUMN kpi_evaluations.bonus_amount IS 'Số tiền thưởng cố định';
COMMENT ON COLUMN kpi_evaluations.final_bonus IS 'Số tiền thưởng cuối cùng (tính từ % hoặc fixed)';
