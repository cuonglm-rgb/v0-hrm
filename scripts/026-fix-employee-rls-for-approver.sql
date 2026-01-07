-- =============================================
-- Fix RLS để người duyệt có thể xem thông tin nhân viên của phiếu
-- =============================================

-- Tạo function helper để lấy employee_id của các phiếu mà user được chỉ định duyệt
CREATE OR REPLACE FUNCTION get_employee_ids_from_assigned_requests(p_user_id UUID)
RETURNS SETOF UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT DISTINCT er.employee_id
  FROM employee_requests er
  JOIN request_assigned_approvers raa ON raa.request_id = er.id
  JOIN employees approver ON approver.id = raa.approver_id
  WHERE approver.user_id = p_user_id;
$$;

-- Grant execute
GRANT EXECUTE ON FUNCTION get_employee_ids_from_assigned_requests(UUID) TO authenticated;

-- Thêm policy cho phép người duyệt xem thông tin nhân viên của phiếu họ duyệt
DROP POLICY IF EXISTS "Approvers can view request employee info" ON employees;

CREATE POLICY "Approvers can view request employee info" ON employees
  FOR SELECT USING (
    id IN (SELECT get_employee_ids_from_assigned_requests(auth.uid()))
  );

COMMENT ON POLICY "Approvers can view request employee info" ON employees IS 'Người duyệt có thể xem thông tin nhân viên của phiếu họ được chỉ định duyệt';
