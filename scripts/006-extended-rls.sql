-- =============================================
-- RLS POLICIES cho các bảng mới
-- =============================================

-- =============================================
-- EMPLOYEE_JOB_HISTORY
-- =============================================
ALTER TABLE employee_job_history ENABLE ROW LEVEL SECURITY;

-- Employee xem lịch sử của mình
CREATE POLICY "job_history_select_self"
ON employee_job_history FOR SELECT
USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

-- HR/Admin xem tất cả
CREATE POLICY "job_history_select_hr_admin"
ON employee_job_history FOR SELECT
USING (has_any_role(array['hr', 'admin']));

-- HR/Admin có thể insert/update
CREATE POLICY "job_history_insert_hr_admin"
ON employee_job_history FOR INSERT
WITH CHECK (has_any_role(array['hr', 'admin']));

CREATE POLICY "job_history_update_hr_admin"
ON employee_job_history FOR UPDATE
USING (has_any_role(array['hr', 'admin']));

-- =============================================
-- ATTENDANCE_LOGS
-- =============================================
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;

-- Employee xem chấm công của mình
CREATE POLICY "attendance_select_self"
ON attendance_logs FOR SELECT
USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

-- HR/Admin xem tất cả
CREATE POLICY "attendance_select_hr_admin"
ON attendance_logs FOR SELECT
USING (has_any_role(array['hr', 'admin']));

-- Manager xem nhân viên phòng mình
CREATE POLICY "attendance_select_manager"
ON attendance_logs FOR SELECT
USING (
  has_role('manager') AND
  employee_id IN (
    SELECT e.id FROM employees e
    WHERE e.department_id IN (
      SELECT department_id FROM user_roles WHERE user_id = auth.uid()
    )
  )
);

-- Employee có thể tự chấm công
CREATE POLICY "attendance_insert_self"
ON attendance_logs FOR INSERT
WITH CHECK (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

-- HR/Admin có thể insert/update
CREATE POLICY "attendance_insert_hr_admin"
ON attendance_logs FOR INSERT
WITH CHECK (has_any_role(array['hr', 'admin']));

CREATE POLICY "attendance_update_hr_admin"
ON attendance_logs FOR UPDATE
USING (has_any_role(array['hr', 'admin']));

-- =============================================
-- LEAVE_REQUESTS
-- =============================================
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Employee xem đơn nghỉ của mình
CREATE POLICY "leave_select_self"
ON leave_requests FOR SELECT
USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

-- HR/Admin xem tất cả
CREATE POLICY "leave_select_hr_admin"
ON leave_requests FOR SELECT
USING (has_any_role(array['hr', 'admin']));

-- Manager xem đơn nghỉ nhân viên phòng mình
CREATE POLICY "leave_select_manager"
ON leave_requests FOR SELECT
USING (
  has_role('manager') AND
  employee_id IN (
    SELECT e.id FROM employees e
    WHERE e.department_id IN (
      SELECT department_id FROM user_roles WHERE user_id = auth.uid()
    )
  )
);

-- Employee tạo đơn nghỉ cho mình
CREATE POLICY "leave_insert_self"
ON leave_requests FOR INSERT
WITH CHECK (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

-- Employee cập nhật đơn pending của mình
CREATE POLICY "leave_update_self"
ON leave_requests FOR UPDATE
USING (
  status = 'pending' AND
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

-- Manager/HR/Admin duyệt đơn
CREATE POLICY "leave_update_approver"
ON leave_requests FOR UPDATE
USING (has_any_role(array['hr', 'admin', 'manager']));

-- =============================================
-- PAYROLL_RUNS
-- =============================================
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;

-- HR/Admin xem và quản lý payroll
CREATE POLICY "payroll_runs_select_hr_admin"
ON payroll_runs FOR SELECT
USING (has_any_role(array['hr', 'admin']));

CREATE POLICY "payroll_runs_insert_hr_admin"
ON payroll_runs FOR INSERT
WITH CHECK (has_any_role(array['hr', 'admin']));

CREATE POLICY "payroll_runs_update_hr_admin"
ON payroll_runs FOR UPDATE
USING (has_any_role(array['hr', 'admin']));

-- =============================================
-- PAYROLL_ITEMS
-- =============================================
ALTER TABLE payroll_items ENABLE ROW LEVEL SECURITY;

-- Employee xem lương của mình
CREATE POLICY "payroll_items_select_self"
ON payroll_items FOR SELECT
USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

-- HR/Admin xem và quản lý
CREATE POLICY "payroll_items_select_hr_admin"
ON payroll_items FOR SELECT
USING (has_any_role(array['hr', 'admin']));

CREATE POLICY "payroll_items_insert_hr_admin"
ON payroll_items FOR INSERT
WITH CHECK (has_any_role(array['hr', 'admin']));

CREATE POLICY "payroll_items_update_hr_admin"
ON payroll_items FOR UPDATE
USING (has_any_role(array['hr', 'admin']));
