-- =============================================
-- Fix: Nhân viên không thấy tên người duyệt (hiển thị N/A)
-- Nguyên nhân: RLS trên bảng employees không cho phép nhân viên thường
-- xem thông tin của người duyệt phiếu của họ
-- =============================================

-- BƯỚC 1: Tạo function SECURITY DEFINER để lấy danh sách approver_id
-- của các phiếu mà user đã tạo (bypass RLS để tránh recursion)
CREATE OR REPLACE FUNCTION get_approver_ids_for_my_requests(p_user_id UUID)
RETURNS SETOF UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT DISTINCT raa.approver_id
  FROM request_assigned_approvers raa
  JOIN employee_requests er ON er.id = raa.request_id
  JOIN employees e ON e.id = er.employee_id
  WHERE e.user_id = p_user_id;
$$;

-- BƯỚC 2: Grant execute cho authenticated users
GRANT EXECUTE ON FUNCTION get_approver_ids_for_my_requests(UUID) TO authenticated;

-- BƯỚC 3: Thêm policy trên bảng employees cho phép chủ phiếu xem thông tin người duyệt
DROP POLICY IF EXISTS "Request owners can view their approvers info" ON employees;

CREATE POLICY "Request owners can view their approvers info" ON employees
  FOR SELECT USING (
    id IN (SELECT get_approver_ids_for_my_requests(auth.uid()))
  );

COMMENT ON FUNCTION get_approver_ids_for_my_requests IS 'Lấy danh sách approver_id của các phiếu mà user đã tạo (bypass RLS)';
COMMENT ON POLICY "Request owners can view their approvers info" ON employees IS 'Cho phép chủ phiếu xem thông tin người duyệt của phiếu mình';
