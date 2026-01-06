-- =============================================
-- OVERTIME SETTINGS - Cài đặt hệ số tăng ca
-- =============================================

-- 1. Bảng cài đặt hệ số tăng ca (mặc định công ty)
CREATE TABLE IF NOT EXISTS ot_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,                    -- Tên loại OT
  code text UNIQUE NOT NULL,             -- Mã (VD: OT_NORMAL, OT_WEEKEND, OT_HOLIDAY)
  multiplier numeric NOT NULL DEFAULT 1.5, -- Hệ số nhân mặc định (1.5, 2.0, 3.0)
  description text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Bảng hệ số OT riêng cho từng nhân viên (override mặc định)
CREATE TABLE IF NOT EXISTS employee_ot_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  ot_setting_id uuid NOT NULL REFERENCES ot_settings(id) ON DELETE CASCADE,
  multiplier numeric NOT NULL,           -- Hệ số riêng cho nhân viên này
  effective_date date NOT NULL,          -- Ngày bắt đầu hiệu lực
  end_date date,                         -- Ngày kết thúc (NULL = còn hiệu lực)
  note text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, ot_setting_id, effective_date)
);

-- 3. Bảng ngày lễ (HR định nghĩa)
CREATE TABLE IF NOT EXISTS holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,                    -- Tên ngày lễ (VD: Tết Nguyên Đán, Quốc Khánh)
  holiday_date date NOT NULL,            -- Ngày lễ
  year integer NOT NULL,                 -- Năm
  is_recurring boolean DEFAULT false,    -- Lặp lại hàng năm (cho ngày cố định như 1/1, 30/4...)
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(holiday_date, year)
);

-- 4. Bảng phiếu tăng ca (OT records)
CREATE TABLE IF NOT EXISTS overtime_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  ot_date date NOT NULL,                 -- Ngày tăng ca
  ot_setting_id uuid NOT NULL REFERENCES ot_settings(id),
  hours numeric NOT NULL DEFAULT 0,      -- Số giờ tăng ca
  multiplier_used numeric,               -- Hệ số thực tế được áp dụng (lưu lại để tính lương)
  reason text,                           -- Lý do tăng ca
  status text DEFAULT 'pending',         -- pending, approved, rejected
  approver_id uuid REFERENCES employees(id),
  approved_at timestamptz,
  note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Thêm cột multiplier_used nếu chưa có (cho trường hợp đã chạy bản cũ)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'overtime_records' AND column_name = 'multiplier_used'
  ) THEN
    ALTER TABLE overtime_records ADD COLUMN multiplier_used numeric;
  END IF;
END $$;

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_ot_settings_code ON ot_settings(code);
CREATE INDEX IF NOT EXISTS idx_ot_settings_active ON ot_settings(is_active);
CREATE INDEX IF NOT EXISTS idx_employee_ot_rates_employee ON employee_ot_rates(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_ot_rates_effective ON employee_ot_rates(effective_date, end_date);
CREATE INDEX IF NOT EXISTS idx_holidays_date ON holidays(holiday_date);
CREATE INDEX IF NOT EXISTS idx_holidays_year ON holidays(year);
CREATE INDEX IF NOT EXISTS idx_overtime_records_employee ON overtime_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_overtime_records_date ON overtime_records(ot_date);
CREATE INDEX IF NOT EXISTS idx_overtime_records_status ON overtime_records(status);
CREATE INDEX IF NOT EXISTS idx_overtime_records_employee_date ON overtime_records(employee_id, ot_date);

-- 6. RLS Policies
ALTER TABLE ot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_ot_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE overtime_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (để chạy lại được)
DROP POLICY IF EXISTS "ot_settings_hr_admin" ON ot_settings;
DROP POLICY IF EXISTS "ot_settings_select_all" ON ot_settings;
DROP POLICY IF EXISTS "employee_ot_rates_hr_admin" ON employee_ot_rates;
DROP POLICY IF EXISTS "employee_ot_rates_select_self" ON employee_ot_rates;
DROP POLICY IF EXISTS "holidays_hr_admin" ON holidays;
DROP POLICY IF EXISTS "holidays_select_all" ON holidays;
DROP POLICY IF EXISTS "overtime_records_hr_admin" ON overtime_records;
DROP POLICY IF EXISTS "overtime_records_select_self" ON overtime_records;
DROP POLICY IF EXISTS "overtime_records_insert_self" ON overtime_records;
DROP POLICY IF EXISTS "overtime_records_approve_manager" ON overtime_records;

-- OT Settings - HR/Admin full access, all can read
CREATE POLICY "ot_settings_hr_admin" ON ot_settings FOR ALL
USING (has_any_role(array['hr', 'admin']));

CREATE POLICY "ot_settings_select_all" ON ot_settings FOR SELECT
USING (true);

-- Employee OT Rates
CREATE POLICY "employee_ot_rates_hr_admin" ON employee_ot_rates FOR ALL
USING (has_any_role(array['hr', 'admin']));

CREATE POLICY "employee_ot_rates_select_self" ON employee_ot_rates FOR SELECT
USING (employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()));

-- Holidays - HR/Admin full access, all can read
CREATE POLICY "holidays_hr_admin" ON holidays FOR ALL
USING (has_any_role(array['hr', 'admin']));

CREATE POLICY "holidays_select_all" ON holidays FOR SELECT
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

-- 7. Seed data - Các loại OT mặc định
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

-- 8. Seed data - Ngày lễ Việt Nam 2025 & 2026
INSERT INTO holidays (name, holiday_date, year, is_recurring, description)
VALUES 
  -- 2025
  ('Tết Dương lịch', '2025-01-01', 2025, true, 'Ngày đầu năm mới'),
  ('Tết Nguyên Đán', '2025-01-28', 2025, false, 'Tết Âm lịch - 29 tháng Chạp'),
  ('Tết Nguyên Đán', '2025-01-29', 2025, false, 'Tết Âm lịch - 30 tháng Chạp'),
  ('Tết Nguyên Đán', '2025-01-30', 2025, false, 'Tết Âm lịch - Mùng 1'),
  ('Tết Nguyên Đán', '2025-01-31', 2025, false, 'Tết Âm lịch - Mùng 2'),
  ('Tết Nguyên Đán', '2025-02-01', 2025, false, 'Tết Âm lịch - Mùng 3'),
  ('Tết Nguyên Đán', '2025-02-02', 2025, false, 'Tết Âm lịch - Mùng 4'),
  ('Tết Nguyên Đán', '2025-02-03', 2025, false, 'Tết Âm lịch - Mùng 5'),
  ('Giỗ Tổ Hùng Vương', '2025-04-07', 2025, false, '10/3 Âm lịch'),
  ('Ngày Giải phóng', '2025-04-30', 2025, true, 'Ngày Giải phóng miền Nam'),
  ('Ngày Quốc tế Lao động', '2025-05-01', 2025, true, 'Ngày Quốc tế Lao động'),
  ('Quốc Khánh', '2025-09-02', 2025, true, 'Ngày Quốc Khánh'),
  -- 2026
  ('Tết Dương lịch', '2026-01-01', 2026, true, 'Ngày đầu năm mới'),
  ('Tết Nguyên Đán', '2026-02-16', 2026, false, 'Tết Âm lịch - 29 tháng Chạp'),
  ('Tết Nguyên Đán', '2026-02-17', 2026, false, 'Tết Âm lịch - Mùng 1'),
  ('Tết Nguyên Đán', '2026-02-18', 2026, false, 'Tết Âm lịch - Mùng 2'),
  ('Tết Nguyên Đán', '2026-02-19', 2026, false, 'Tết Âm lịch - Mùng 3'),
  ('Tết Nguyên Đán', '2026-02-20', 2026, false, 'Tết Âm lịch - Mùng 4'),
  ('Giỗ Tổ Hùng Vương', '2026-04-26', 2026, false, '10/3 Âm lịch'),
  ('Ngày Giải phóng', '2026-04-30', 2026, true, 'Ngày Giải phóng miền Nam'),
  ('Ngày Quốc tế Lao động', '2026-05-01', 2026, true, 'Ngày Quốc tế Lao động'),
  ('Quốc Khánh', '2026-09-02', 2026, true, 'Ngày Quốc Khánh')
ON CONFLICT (holiday_date, year) DO NOTHING;

-- 9. Trigger cập nhật updated_at
CREATE OR REPLACE FUNCTION update_ot_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ot_settings_updated_at ON ot_settings;
CREATE TRIGGER ot_settings_updated_at
  BEFORE UPDATE ON ot_settings
  FOR EACH ROW EXECUTE FUNCTION update_ot_updated_at();

DROP TRIGGER IF EXISTS overtime_records_updated_at ON overtime_records;
CREATE TRIGGER overtime_records_updated_at
  BEFORE UPDATE ON overtime_records
  FOR EACH ROW EXECUTE FUNCTION update_ot_updated_at();

-- 10. Function để lấy hệ số OT cho nhân viên (ưu tiên hệ số riêng, fallback về mặc định)
CREATE OR REPLACE FUNCTION get_employee_ot_multiplier(
  p_employee_id uuid,
  p_ot_setting_id uuid,
  p_date date
) RETURNS numeric AS $$
DECLARE
  v_multiplier numeric;
BEGIN
  -- Tìm hệ số riêng của nhân viên
  SELECT multiplier INTO v_multiplier
  FROM employee_ot_rates
  WHERE employee_id = p_employee_id
    AND ot_setting_id = p_ot_setting_id
    AND effective_date <= p_date
    AND (end_date IS NULL OR end_date >= p_date)
  ORDER BY effective_date DESC
  LIMIT 1;
  
  -- Nếu không có, lấy hệ số mặc định
  IF v_multiplier IS NULL THEN
    SELECT multiplier INTO v_multiplier
    FROM ot_settings
    WHERE id = p_ot_setting_id;
  END IF;
  
  RETURN COALESCE(v_multiplier, 1.5);
END;
$$ LANGUAGE plpgsql;

-- 11. Function kiểm tra ngày có phải ngày lễ không
CREATE OR REPLACE FUNCTION is_holiday(p_date date) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM holidays
    WHERE holiday_date = p_date
      AND year = EXTRACT(YEAR FROM p_date)::integer
  );
END;
$$ LANGUAGE plpgsql;

-- 12. Function gợi ý loại OT dựa trên ngày
CREATE OR REPLACE FUNCTION suggest_ot_type(p_date date) RETURNS text AS $$
BEGIN
  -- Kiểm tra ngày lễ trước
  IF is_holiday(p_date) THEN
    RETURN 'OT_HOLIDAY';
  END IF;
  
  -- Kiểm tra cuối tuần (0 = Sunday, 6 = Saturday)
  IF EXTRACT(DOW FROM p_date) IN (0, 6) THEN
    RETURN 'OT_WEEKEND';
  END IF;
  
  -- Mặc định là ngày thường
  RETURN 'OT_NORMAL';
END;
$$ LANGUAGE plpgsql;
