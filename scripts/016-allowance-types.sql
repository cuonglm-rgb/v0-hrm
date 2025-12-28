-- =============================================
-- ALLOWANCE TYPES - Quản lý loại phụ cấp
-- =============================================

-- 1. Bảng loại phụ cấp
CREATE TABLE IF NOT EXISTS allowance_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,                    -- Tên phụ cấp (VD: Phụ cấp ăn trưa)
  code text UNIQUE,                      -- Mã phụ cấp (VD: LUNCH)
  amount numeric NOT NULL DEFAULT 0,     -- Số tiền (VD: 35000)
  calculation_type text NOT NULL DEFAULT 'fixed', -- fixed (cố định/tháng), daily (theo ngày công)
  is_deductible boolean DEFAULT false,   -- Có thể bị trừ không
  deduction_rules jsonb,                 -- Quy tắc trừ phụ cấp (JSON)
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Ví dụ deduction_rules cho phụ cấp ăn trưa:
-- {
--   "deduct_on_absent": true,           -- Trừ khi nghỉ làm
--   "deduct_on_late": true,             -- Trừ khi đi muộn
--   "late_grace_count": 4,              -- Số lần đi muộn được miễn
--   "late_threshold_minutes": 15        -- Muộn bao nhiêu phút tính là đi muộn
-- }

-- 2. Bảng gán phụ cấp cho nhân viên
CREATE TABLE IF NOT EXISTS employee_allowances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  allowance_type_id uuid NOT NULL REFERENCES allowance_types(id) ON DELETE CASCADE,
  custom_amount numeric,                 -- Số tiền tùy chỉnh (nếu khác mặc định)
  effective_date date NOT NULL,
  end_date date,                         -- NULL = còn hiệu lực
  note text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, allowance_type_id, effective_date)
);

-- 3. Bảng chi tiết phụ cấp trong payroll (để lưu lịch sử tính toán)
CREATE TABLE IF NOT EXISTS payroll_allowance_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_item_id uuid NOT NULL REFERENCES payroll_items(id) ON DELETE CASCADE,
  allowance_type_id uuid NOT NULL REFERENCES allowance_types(id),
  base_amount numeric NOT NULL,          -- Số tiền gốc
  deducted_amount numeric DEFAULT 0,     -- Số tiền bị trừ
  final_amount numeric NOT NULL,         -- Số tiền thực nhận
  deduction_reason text,                 -- Lý do trừ
  late_count integer DEFAULT 0,          -- Số lần đi muộn
  absent_days integer DEFAULT 0,         -- Số ngày nghỉ
  created_at timestamptz DEFAULT now()
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_allowance_types_active ON allowance_types(is_active);
CREATE INDEX IF NOT EXISTS idx_employee_allowances_employee ON employee_allowances(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_allowances_effective ON employee_allowances(effective_date, end_date);
CREATE INDEX IF NOT EXISTS idx_payroll_allowance_details_item ON payroll_allowance_details(payroll_item_id);

-- 5. RLS Policies
ALTER TABLE allowance_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_allowances ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_allowance_details ENABLE ROW LEVEL SECURITY;

-- HR/Admin full access
CREATE POLICY "allowance_types_hr_admin" ON allowance_types FOR ALL
USING (has_any_role(array['hr', 'admin']));

-- Tất cả có thể xem loại phụ cấp
CREATE POLICY "allowance_types_select_all" ON allowance_types FOR SELECT
USING (true);

-- HR/Admin quản lý employee_allowances
CREATE POLICY "employee_allowances_hr_admin" ON employee_allowances FOR ALL
USING (has_any_role(array['hr', 'admin']));

-- Employee xem phụ cấp của mình
CREATE POLICY "employee_allowances_select_self" ON employee_allowances FOR SELECT
USING (employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()));

-- HR/Admin quản lý payroll_allowance_details
CREATE POLICY "payroll_allowance_details_hr_admin" ON payroll_allowance_details FOR ALL
USING (has_any_role(array['hr', 'admin']));

-- Employee xem chi tiết phụ cấp của mình (khi payroll đã locked/paid)
CREATE POLICY "payroll_allowance_details_select_self" ON payroll_allowance_details FOR SELECT
USING (
  payroll_item_id IN (
    SELECT pi.id FROM payroll_items pi
    JOIN payroll_runs pr ON pi.payroll_run_id = pr.id
    WHERE pi.employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
      AND pr.status IN ('locked', 'paid')
  )
);

-- 6. Seed data - Các loại phụ cấp mẫu
INSERT INTO allowance_types (name, code, amount, calculation_type, is_deductible, deduction_rules, description)
VALUES 
  ('Phụ cấp ăn trưa', 'LUNCH', 35000, 'daily', true, 
   '{"deduct_on_absent": true, "deduct_on_late": true, "late_grace_count": 4, "late_threshold_minutes": 15}',
   'Phụ cấp tiền ăn trưa 35,000đ/ngày. Trừ khi nghỉ hoặc đi muộn quá 4 lần/tháng'),
  
  ('Phụ cấp xăng xe', 'TRANSPORT', 500000, 'fixed', false, null,
   'Phụ cấp xăng xe cố định hàng tháng'),
  
  ('Phụ cấp điện thoại', 'PHONE', 200000, 'fixed', false, null,
   'Phụ cấp điện thoại cố định hàng tháng'),
  
  ('Phụ cấp chuyên cần', 'ATTENDANCE', 500000, 'fixed', true,
   '{"deduct_on_absent": true, "deduct_on_late": true, "late_grace_count": 0, "full_deduct_threshold": 2}',
   'Phụ cấp chuyên cần. Mất toàn bộ nếu nghỉ không phép hoặc đi muộn > 2 lần')
ON CONFLICT (code) DO NOTHING;
