-- =============================================
-- VERIFY AND FIX PAYSLIP RLS POLICIES
-- =============================================
-- Đảm bảo nhân viên có thể xem chi tiết phiếu lương của mình

-- 1. Kiểm tra policy hiện tại
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('payroll_items', 'payroll_adjustment_details', 'payroll_runs')
ORDER BY tablename, policyname;

-- 2. Đảm bảo nhân viên có thể đọc payroll_items của mình khi bảng lương đã khóa
DROP POLICY IF EXISTS "payroll_items_select_self" ON payroll_items;
CREATE POLICY "payroll_items_select_self" ON payroll_items FOR SELECT
USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  AND payroll_run_id IN (
    SELECT id FROM payroll_runs WHERE status IN ('locked', 'paid')
  )
);

-- 3. Đảm bảo nhân viên có thể đọc payroll_adjustment_details của mình
DROP POLICY IF EXISTS "payroll_adjustment_details_select_self" ON payroll_adjustment_details;
CREATE POLICY "payroll_adjustment_details_select_self" ON payroll_adjustment_details FOR SELECT
USING (
  payroll_item_id IN (
    SELECT pi.id FROM payroll_items pi
    JOIN payroll_runs pr ON pi.payroll_run_id = pr.id
    WHERE pi.employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
      AND pr.status IN ('locked', 'paid')
  )
);

-- 4. Đảm bảo nhân viên có thể đọc payroll_runs khi đã khóa
DROP POLICY IF EXISTS "payroll_runs_select_locked" ON payroll_runs;
CREATE POLICY "payroll_runs_select_locked" ON payroll_runs FOR SELECT
USING (
  status IN ('locked', 'paid')
  OR has_any_role(array['hr', 'admin'])
);

-- 5. Kiểm tra lại sau khi tạo
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('payroll_items', 'payroll_adjustment_details', 'payroll_runs')
  AND policyname LIKE '%select%'
ORDER BY tablename, policyname;
