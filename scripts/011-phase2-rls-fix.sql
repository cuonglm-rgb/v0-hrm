-- =============================================
-- PHASE 2 - RLS fixes for Attendance & Leave
-- =============================================

-- Employee có thể update attendance của mình (checkout)
DROP POLICY IF EXISTS "attendance_update_self" ON attendance_logs;
CREATE POLICY "attendance_update_self"
ON attendance_logs FOR UPDATE
USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

-- Employee có thể delete đơn nghỉ pending của mình
DROP POLICY IF EXISTS "leave_delete_self" ON leave_requests;
CREATE POLICY "leave_delete_self"
ON leave_requests FOR DELETE
USING (
  status = 'pending' AND
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);
