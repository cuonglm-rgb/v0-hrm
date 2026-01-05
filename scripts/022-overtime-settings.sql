-- =============================================
-- OVERTIME SETTINGS - Cài đặt hệ số tăng ca
-- =============================================

-- 1. Bảng cài đặt hệ số tăng ca
CREATE TABLE IF NOT EXISTS ot_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,                    -- Tên loại OT
  code text UNIQUE NOT NULL,             -- Mã (VD: OT_NORMAL, OT_WEEKEND, OT_HOLIDAY)
  multiplier numeric NOT NULL DEFAULT 1.5, -- Hệ số nhân (1.5, 2.0, 3.0)
  description text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Bảng phiếu tăng ca (OT records)
CREATE TABLE IF NOT EXISTS overtime_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  ot_date date NOT NULL,                 -- Ngày tăng ca
  ot_setting_id uuid NOT NULL REFERENCES ot_settings(id),
  hours numeric NOT NULL DEFAULT 0,      -- Số giờ tăng ca
  reason text,                           -- Lý do tăng ca
  status text DEFAULT 'pending',         -- pending, approved, rejected
  approver_id uuid REFERENCES employees(id),
  approved_at timestamptz,
  note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_ot_settings_code ON ot_settings(code);
CREATE INDEX IF NOT EXISTS idx_ot_settings_active ON ot_settings(is_active);
CREATE INDEX IF NOT EXISTS idx_overtime_records_employee ON overtime_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_overtime_records_date ON overtime_records(ot_date);
CREATE INDEX IF NOT EXISTS idx_overtime_records_status ON overtime_records(status);
CREATE INDEX IF NOT EXISTS idx_overtime_records_employee_date ON overtime_records(employee_id, ot_date);

-- 4. RLS Policies
ALTER TABLE ot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE overtime_records ENABLE ROW LEVEL SECURITY;

-- OT Settings - HR/Admin full access, all can read
CREATE POLICY "ot_settings_hr_admin" ON ot_settings FOR ALL
USING (has_any_role(array['hr', 'admin']));

CREATE POLICY "ot_settings_select_all" ON ot_settings FOR SELECT
USING (true);

-- Overtime Records
CREATE POLICY "overtime_records_hr_admin" ON overtime_records FOR ALL
USING (has_any_role(array['hr', 'admin']));

CREATE POLICY "overtime_records_select_self" ON overtime_records FOR SELECT
USING (employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()));

CREATE POLICY "overtime_records_insert_self" ON overtime_records FOR INSERT
WITH CHECK (employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()));

CREATE POLICY "overtime_records_approve_manager" ON overtime_records FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM employees e
    WHERE e.id = overtime_records.employee_id
      AND e.department_id = (SELECT department_id FROM employees WHERE user_id = auth.uid())
  )
  AND has_any_role(array['hr', 'admin', 'manager'])
);

-- 5. Seed data - Các loại OT mặc định
INSERT INTO ot_settings (name, code, multiplier, description, display_order)
VALUES 
  ('Tăng ca ngày thường', 'OT_NORMAL', 1.5, 'Tăng ca vào ngày làm việc bình thường (x1.5)', 1),
  ('Tăng ca ngày nghỉ', 'OT_WEEKEND', 2.0, 'Tăng ca vào ngày nghỉ cuối tuần (x2.0)', 2),
  ('Tăng ca ngày lễ', 'OT_HOLIDAY', 3.0, 'Tăng ca vào ngày lễ, tết (x3.0)', 3)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  multiplier = EXCLUDED.multiplier,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;

-- 6. Trigger cập nhật updated_at
CREATE OR REPLACE FUNCTION update_ot_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ot_settings_updated_at
  BEFORE UPDATE ON ot_settings
  FOR EACH ROW EXECUTE FUNCTION update_ot_updated_at();

CREATE TRIGGER overtime_records_updated_at
  BEFORE UPDATE ON overtime_records
  FOR EACH ROW EXECUTE FUNCTION update_ot_updated_at();
