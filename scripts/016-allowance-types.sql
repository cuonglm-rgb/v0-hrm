-- =============================================
-- PAYROLL ADJUSTMENTS - Phụ cấp, Quỹ, Phạt
-- =============================================

-- 1. Bảng loại điều chỉnh lương (phụ cấp, quỹ, phạt)
CREATE TABLE IF NOT EXISTS payroll_adjustment_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,                    -- Tên (VD: Phụ cấp ăn trưa, Quỹ chung, Phạt đi muộn)
  code text UNIQUE,                      -- Mã (VD: LUNCH, FUND, LATE_PENALTY)
  category text NOT NULL DEFAULT 'allowance', -- allowance (phụ cấp), deduction (khấu trừ/quỹ), penalty (phạt)
  amount numeric NOT NULL DEFAULT 0,     -- Số tiền mặc định
  calculation_type text NOT NULL DEFAULT 'fixed', -- fixed (cố định/tháng), daily (theo ngày công), per_occurrence (theo lần vi phạm)
  is_auto_applied boolean DEFAULT false, -- Tự động áp dụng dựa trên điều kiện
  auto_rules jsonb,                      -- Quy tắc tự động (JSON)
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Ví dụ auto_rules cho phụ cấp ăn trưa:
-- {
--   "trigger": "attendance",            -- Trigger: attendance, late, absent
--   "deduct_on_absent": true,           -- Trừ khi nghỉ làm
--   "deduct_on_late": true,             -- Trừ khi đi muộn
--   "late_grace_count": 4,              -- Số lần đi muộn được miễn
--   "late_threshold_minutes": 15        -- Muộn bao nhiêu phút tính là đi muộn
-- }

-- Ví dụ auto_rules cho phạt đi muộn:
-- {
--   "trigger": "late",
--   "late_threshold_minutes": 30,       -- Muộn từ 30 phút
--   "penalty_type": "half_day_salary",  -- Trừ nửa ngày lương
--   "exempt_with_request": true         -- Miễn nếu có phiếu xin phép
-- }

-- 2. Bảng gán điều chỉnh cho nhân viên
CREATE TABLE IF NOT EXISTS employee_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  adjustment_type_id uuid NOT NULL REFERENCES payroll_adjustment_types(id) ON DELETE CASCADE,
  custom_amount numeric,                 -- Số tiền tùy chỉnh (nếu khác mặc định)
  effective_date date NOT NULL,
  end_date date,                         -- NULL = còn hiệu lực
  note text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, adjustment_type_id, effective_date)
);

-- 3. Bảng chi tiết điều chỉnh trong payroll
CREATE TABLE IF NOT EXISTS payroll_adjustment_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_item_id uuid NOT NULL REFERENCES payroll_items(id) ON DELETE CASCADE,
  adjustment_type_id uuid NOT NULL REFERENCES payroll_adjustment_types(id),
  category text NOT NULL,                -- allowance, deduction, penalty
  base_amount numeric NOT NULL,          -- Số tiền gốc
  adjusted_amount numeric DEFAULT 0,     -- Số tiền điều chỉnh (trừ/cộng)
  final_amount numeric NOT NULL,         -- Số tiền cuối cùng
  reason text,                           -- Lý do điều chỉnh
  occurrence_count integer DEFAULT 0,    -- Số lần (cho penalty)
  created_at timestamptz DEFAULT now()
);

-- 4. Bảng phiếu xin phép (đi muộn/về sớm)
CREATE TABLE IF NOT EXISTS time_adjustment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  request_type text NOT NULL,            -- late_arrival, early_leave
  request_date date NOT NULL,
  reason text,
  status text DEFAULT 'pending',         -- pending, approved, rejected
  approver_id uuid REFERENCES employees(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_adjustment_types_category ON payroll_adjustment_types(category);
CREATE INDEX IF NOT EXISTS idx_adjustment_types_active ON payroll_adjustment_types(is_active);
CREATE INDEX IF NOT EXISTS idx_employee_adjustments_employee ON employee_adjustments(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_adjustments_effective ON employee_adjustments(effective_date, end_date);
CREATE INDEX IF NOT EXISTS idx_payroll_adjustment_details_item ON payroll_adjustment_details(payroll_item_id);
CREATE INDEX IF NOT EXISTS idx_time_adjustment_requests_employee ON time_adjustment_requests(employee_id, request_date);

-- 6. RLS Policies
ALTER TABLE payroll_adjustment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_adjustment_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_adjustment_requests ENABLE ROW LEVEL SECURITY;

-- HR/Admin full access
CREATE POLICY "adjustment_types_hr_admin" ON payroll_adjustment_types FOR ALL
USING (has_any_role(array['hr', 'admin']));

CREATE POLICY "adjustment_types_select_all" ON payroll_adjustment_types FOR SELECT
USING (true);

CREATE POLICY "employee_adjustments_hr_admin" ON employee_adjustments FOR ALL
USING (has_any_role(array['hr', 'admin']));

CREATE POLICY "employee_adjustments_select_self" ON employee_adjustments FOR SELECT
USING (employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()));

CREATE POLICY "payroll_adjustment_details_hr_admin" ON payroll_adjustment_details FOR ALL
USING (has_any_role(array['hr', 'admin']));

CREATE POLICY "payroll_adjustment_details_select_self" ON payroll_adjustment_details FOR SELECT
USING (
  payroll_item_id IN (
    SELECT pi.id FROM payroll_items pi
    JOIN payroll_runs pr ON pi.payroll_run_id = pr.id
    WHERE pi.employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
      AND pr.status IN ('locked', 'paid')
  )
);

-- Time adjustment requests
CREATE POLICY "time_requests_hr_admin" ON time_adjustment_requests FOR ALL
USING (has_any_role(array['hr', 'admin']));

CREATE POLICY "time_requests_select_self" ON time_adjustment_requests FOR SELECT
USING (employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()));

CREATE POLICY "time_requests_insert_self" ON time_adjustment_requests FOR INSERT
WITH CHECK (employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()));

CREATE POLICY "time_requests_approve_manager" ON time_adjustment_requests FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM employees e
    WHERE e.id = time_adjustment_requests.employee_id
      AND e.department_id = (SELECT department_id FROM employees WHERE user_id = auth.uid())
  )
  AND has_any_role(array['hr', 'admin', 'manager'])
);

-- 7. Seed data - Các loại điều chỉnh mẫu
INSERT INTO payroll_adjustment_types (name, code, category, amount, calculation_type, is_auto_applied, auto_rules, description)
VALUES 
  -- Phụ cấp
  ('Phụ cấp ăn trưa', 'LUNCH', 'allowance', 35000, 'daily', true, 
   '{"trigger": "attendance", "deduct_on_absent": true, "deduct_on_late": true, "late_grace_count": 4, "late_threshold_minutes": 15}',
   'Phụ cấp tiền ăn trưa 35,000đ/ngày. Trừ khi nghỉ hoặc đi muộn quá 4 lần/tháng'),
  
  ('Phụ cấp xăng xe', 'TRANSPORT', 'allowance', 500000, 'fixed', false, null,
   'Phụ cấp xăng xe cố định hàng tháng'),
  
  ('Phụ cấp điện thoại', 'PHONE', 'allowance', 200000, 'fixed', false, null,
   'Phụ cấp điện thoại cố định hàng tháng'),
  
  ('Phụ cấp chuyên cần', 'ATTENDANCE_BONUS', 'allowance', 500000, 'fixed', true,
   '{"trigger": "attendance", "deduct_on_absent": true, "deduct_on_late": true, "late_grace_count": 0, "full_deduct_threshold": 2}',
   'Phụ cấp chuyên cần. Mất toàn bộ nếu nghỉ không phép hoặc đi muộn > 2 lần'),

  -- Quỹ/Khấu trừ
  ('Quỹ chung', 'COMMON_FUND', 'deduction', 200000, 'fixed', false, null,
   'Tiền quỹ chung công ty 200,000đ/tháng'),
  
  ('Bảo hiểm xã hội', 'SOCIAL_INSURANCE', 'deduction', 0, 'fixed', false, 
   '{"calculate_from": "base_salary", "percentage": 8}',
   'BHXH 8% lương cơ bản'),

  -- Phạt
  ('Phạt đi muộn >30 phút', 'LATE_PENALTY_30', 'penalty', 0, 'per_occurrence', true,
   '{"trigger": "late", "late_threshold_minutes": 30, "penalty_type": "half_day_salary", "exempt_with_request": true}',
   'Đi muộn quá 30 phút trừ nửa ngày lương. Miễn nếu có phiếu xin phép'),
  
  ('Phạt nghỉ không phép', 'ABSENT_PENALTY', 'penalty', 0, 'per_occurrence', true,
   '{"trigger": "absent", "penalty_type": "full_day_salary", "multiplier": 1.5}',
   'Nghỉ không phép trừ 1.5 ngày lương')
ON CONFLICT (code) DO NOTHING;
