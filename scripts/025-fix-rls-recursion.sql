-- =============================================
-- Fix infinite recursion trong RLS policy
-- Sử dụng SECURITY DEFINER function để bypass RLS khi check
-- =============================================

-- BƯỚC 1: Tạo function helper với SECURITY DEFINER
-- Function này chạy với quyền owner (bypass RLS) để tránh recursion

CREATE OR REPLACE FUNCTION get_assigned_request_ids_for_user(p_user_id UUID)
RETURNS SETOF UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT raa.request_id
  FROM request_assigned_approvers raa
  JOIN employees e ON e.id = raa.approver_id
  WHERE e.user_id = p_user_id;
$$;

-- BƯỚC 2: Drop policy cũ gây recursion
DROP POLICY IF EXISTS "employee_requests_assigned_approver" ON employee_requests;
DROP POLICY IF EXISTS "employee_requests_assigned_approver_update" ON employee_requests;

-- BƯỚC 3: Tạo policy mới sử dụng function (không recursion)
CREATE POLICY "employee_requests_assigned_approver" ON employee_requests
  FOR SELECT USING (
    id IN (SELECT get_assigned_request_ids_for_user(auth.uid()))
  );

CREATE POLICY "employee_requests_assigned_approver_update" ON employee_requests
  FOR UPDATE USING (
    id IN (SELECT get_assigned_request_ids_for_user(auth.uid()))
  );

-- BƯỚC 4: Fix policy trên request_assigned_approvers để không query employee_requests
DROP POLICY IF EXISTS "Users can view assigned approvers for their requests" ON request_assigned_approvers;

-- Tạo function helper cho request_assigned_approvers
CREATE OR REPLACE FUNCTION check_can_view_assigned_approver(p_user_id UUID, p_request_id UUID, p_approver_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    -- Là chủ phiếu
    SELECT 1 FROM employee_requests er
    JOIN employees e ON e.id = er.employee_id
    WHERE er.id = p_request_id AND e.user_id = p_user_id
  )
  OR EXISTS (
    -- Là người được chỉ định duyệt
    SELECT 1 FROM employees e
    WHERE e.id = p_approver_id AND e.user_id = p_user_id
  )
  OR EXISTS (
    -- Là HR/Admin
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = p_user_id AND r.code IN ('admin', 'hr')
  );
$$;

CREATE POLICY "Users can view assigned approvers for their requests"
  ON request_assigned_approvers FOR SELECT
  USING (
    check_can_view_assigned_approver(auth.uid(), request_id, approver_id)
  );

-- BƯỚC 5: Grant execute cho authenticated users
GRANT EXECUTE ON FUNCTION get_assigned_request_ids_for_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION check_can_view_assigned_approver(UUID, UUID, UUID) TO authenticated;

-- Comments
COMMENT ON FUNCTION get_assigned_request_ids_for_user IS 'Helper function để lấy danh sách request_id mà user được chỉ định duyệt (bypass RLS)';
COMMENT ON FUNCTION check_can_view_assigned_approver IS 'Helper function để kiểm tra quyền xem assigned approver (bypass RLS)';
