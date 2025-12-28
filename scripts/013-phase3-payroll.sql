-- =============================================
-- PHASE 3 - PAYROLL CORE
-- =============================================

-- 1. Bảng cấu trúc lương (lịch sử lương)
CREATE TABLE IF NOT EXISTS salary_structure (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  base_salary numeric NOT NULL,
  allowance numeric DEFAULT 0,
  effective_date date NOT NULL,
  note text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_salary_employee_date
ON salary_structure(employee_id, effective_date DESC);

-- 2. Cập nhật payroll_items thêm các cột mới
ALTER TABLE payroll_items ADD COLUMN IF NOT EXISTS working_days numeric DEFAULT 0;
ALTER TABLE payroll_items ADD COLUMN IF NOT EXISTS leave_days numeric DEFAULT 0;
ALTER TABLE payroll_items ADD COLUMN IF NOT EXISTS unpaid_leave_days numeric DEFAULT 0;

-- 3. RLS cho salary_structure
ALTER TABLE salary_structure ENABLE ROW LEVEL SECURITY;

-- Employee xem lương của mình
DROP POLICY IF EXISTS "salary_select_self" ON salary_structure;
CREATE POLICY "salary_select_self"
ON salary_structure FOR SELECT
USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

-- HR/Admin xem và quản lý tất cả
DROP POLICY IF EXISTS "salary_manage_hr_admin" ON salary_structure;
CREATE POLICY "salary_manage_hr_admin"
ON salary_structure FOR ALL
USING (has_any_role(array['hr', 'admin']));

-- 4. Cập nhật RLS payroll_items (Manager KHÔNG được xem)
-- Xóa policy cũ nếu có
DROP POLICY IF EXISTS "payroll_items_select_self" ON payroll_items;
DROP POLICY IF EXISTS "payroll_items_select_hr_admin" ON payroll_items;
DROP POLICY IF EXISTS "payroll_items_insert_hr_admin" ON payroll_items;
DROP POLICY IF EXISTS "payroll_items_update_hr_admin" ON payroll_items;

-- Employee chỉ xem lương của mình (khi payroll đã locked hoặc paid)
CREATE POLICY "payroll_items_select_self"
ON payroll_items FOR SELECT
USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  AND payroll_run_id IN (
    SELECT id FROM payroll_runs WHERE status IN ('locked', 'paid')
  )
);

-- HR/Admin full access
CREATE POLICY "payroll_items_hr_admin"
ON payroll_items FOR ALL
USING (has_any_role(array['hr', 'admin']));

-- 5. Cập nhật RLS payroll_runs
DROP POLICY IF EXISTS "payroll_runs_select_hr_admin" ON payroll_runs;
DROP POLICY IF EXISTS "payroll_runs_insert_hr_admin" ON payroll_runs;
DROP POLICY IF EXISTS "payroll_runs_update_hr_admin" ON payroll_runs;

-- HR/Admin full access payroll_runs
CREATE POLICY "payroll_runs_hr_admin"
ON payroll_runs FOR ALL
USING (has_any_role(array['hr', 'admin']));

-- Employee xem payroll_runs đã locked/paid (để biết có payslip)
CREATE POLICY "payroll_runs_select_employee"
ON payroll_runs FOR SELECT
USING (status IN ('locked', 'paid'));
