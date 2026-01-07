-- =============================================
-- Fix RLS policy để người duyệt được chỉ định có thể xem phiếu
-- Chạy script này trong Supabase SQL Editor
-- =============================================

-- =============================================
-- BƯỚC 1: Drop tất cả policy cũ trên employee_requests liên quan đến approver
-- =============================================
DROP POLICY IF EXISTS "employee_requests_assigned_approver" ON employee_requests;
DROP POLICY IF EXISTS "employee_requests_assigned_approver_update" ON employee_requests;

-- =============================================
-- BƯỚC 2: Tạo policy mới cho người được chỉ định duyệt phiếu
-- =============================================

-- Policy SELECT: Người được chỉ định duyệt có thể xem phiếu
CREATE POLICY "employee_requests_assigned_approver" ON employee_requests
  FOR SELECT USING (
    id IN (
      SELECT request_id FROM request_assigned_approvers
      WHERE approver_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    )
  );

-- Policy UPDATE: Người được chỉ định duyệt có thể cập nhật phiếu
CREATE POLICY "employee_requests_assigned_approver_update" ON employee_requests
  FOR UPDATE USING (
    id IN (
      SELECT request_id FROM request_assigned_approvers
      WHERE approver_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    )
  );

-- =============================================
-- BƯỚC 3: Fix policy INSERT cho request_assigned_approvers
-- Vấn đề: Khi tạo phiếu, cần INSERT vào request_assigned_approvers
-- nhưng policy cũ yêu cầu phiếu phải tồn tại trước (chicken-egg problem)
-- =============================================
DROP POLICY IF EXISTS "Users can create assigned approvers for their requests" ON request_assigned_approvers;

CREATE POLICY "Users can create assigned approvers for their requests"
  ON request_assigned_approvers FOR INSERT
  WITH CHECK (
    -- Cho phép nếu user là chủ phiếu
    EXISTS (
      SELECT 1 FROM employee_requests er
      JOIN employees e ON e.id = er.employee_id
      WHERE er.id = request_assigned_approvers.request_id
      AND e.user_id = auth.uid()
    )
    OR
    -- Hoặc là HR/Admin
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.code IN ('admin', 'hr')
    )
  );

-- =============================================
-- BƯỚC 4: Đảm bảo policy SELECT trên request_assigned_approvers cho phép đọc
-- =============================================
DROP POLICY IF EXISTS "Users can view assigned approvers for their requests" ON request_assigned_approvers;

CREATE POLICY "Users can view assigned approvers for their requests"
  ON request_assigned_approvers FOR SELECT
  USING (
    -- Chủ phiếu có thể xem
    EXISTS (
      SELECT 1 FROM employee_requests er
      JOIN employees e ON e.id = er.employee_id
      WHERE er.id = request_assigned_approvers.request_id
      AND e.user_id = auth.uid()
    )
    OR
    -- Người được chỉ định duyệt có thể xem
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.id = request_assigned_approvers.approver_id
      AND e.user_id = auth.uid()
    )
    OR
    -- HR/Admin có thể xem tất cả
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.code IN ('admin', 'hr')
    )
  );

-- =============================================
-- BƯỚC 5: Policy UPDATE cho người duyệt cập nhật trạng thái của họ
-- =============================================
DROP POLICY IF EXISTS "Approvers can update their approval status" ON request_assigned_approvers;

CREATE POLICY "Approvers can update their approval status"
  ON request_assigned_approvers FOR UPDATE
  USING (
    -- Người được chỉ định duyệt có thể cập nhật trạng thái của họ
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.id = request_assigned_approvers.approver_id
      AND e.user_id = auth.uid()
    )
    OR
    -- HR/Admin có thể cập nhật
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.code IN ('admin', 'hr')
    )
  );

-- =============================================
-- Comments
-- =============================================
COMMENT ON POLICY "employee_requests_assigned_approver" ON employee_requests IS 'Người được chỉ định duyệt có thể xem phiếu';
COMMENT ON POLICY "employee_requests_assigned_approver_update" ON employee_requests IS 'Người được chỉ định duyệt có thể cập nhật phiếu';

-- =============================================
-- KIỂM TRA: Chạy query này để xem dữ liệu trong request_assigned_approvers
-- =============================================
-- SELECT 
--   raa.*, 
--   er.status as request_status,
--   e.full_name as approver_name
-- FROM request_assigned_approvers raa
-- JOIN employee_requests er ON er.id = raa.request_id
-- JOIN employees e ON e.id = raa.approver_id
-- ORDER BY raa.created_at DESC;
