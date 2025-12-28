-- =============================================
-- FIX PAYROLL RLS POLICIES
-- Đảm bảo HR/Admin có thể tạo và xem payroll
-- =============================================

-- 1. Kiểm tra function has_any_role tồn tại
CREATE OR REPLACE FUNCTION has_any_role(role_codes text[])
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND r.code = ANY(role_codes)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Fix RLS cho payroll_runs
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payroll_runs_hr_admin" ON payroll_runs;
DROP POLICY IF EXISTS "payroll_runs_select_employee" ON payroll_runs;

-- HR/Admin full access
CREATE POLICY "payroll_runs_hr_admin"
ON payroll_runs FOR ALL
USING (has_any_role(array['hr', 'admin']));

-- Employee xem payroll_runs đã locked/paid
CREATE POLICY "payroll_runs_select_employee"
ON payroll_runs FOR SELECT
USING (status IN ('locked', 'paid'));

-- 3. Fix RLS cho payroll_items
ALTER TABLE payroll_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payroll_items_select_self" ON payroll_items;
DROP POLICY IF EXISTS "payroll_items_hr_admin" ON payroll_items;

-- HR/Admin full access
CREATE POLICY "payroll_items_hr_admin"
ON payroll_items FOR ALL
USING (has_any_role(array['hr', 'admin']));

-- Employee xem lương của mình (khi đã locked/paid)
CREATE POLICY "payroll_items_select_self"
ON payroll_items FOR SELECT
USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  AND payroll_run_id IN (
    SELECT id FROM payroll_runs WHERE status IN ('locked', 'paid')
  )
);

-- 4. Fix RLS cho salary_structure
ALTER TABLE salary_structure ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "salary_select_self" ON salary_structure;
DROP POLICY IF EXISTS "salary_manage_hr_admin" ON salary_structure;

-- HR/Admin full access
CREATE POLICY "salary_manage_hr_admin"
ON salary_structure FOR ALL
USING (has_any_role(array['hr', 'admin']));

-- Employee xem lương của mình
CREATE POLICY "salary_select_self"
ON salary_structure FOR SELECT
USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

-- 5. Kiểm tra dữ liệu
SELECT 'Employees active:' as info, count(*) as count FROM employees WHERE status = 'active';
SELECT 'Salary structures:' as info, count(*) as count FROM salary_structure;
SELECT 'Payroll runs:' as info, count(*) as count FROM payroll_runs;
SELECT 'Payroll items:' as info, count(*) as count FROM payroll_items;
