-- =============================================
-- Thêm policy DELETE cho request_assigned_approvers
-- Cho phép chủ phiếu xóa người duyệt khi sửa phiếu pending
-- =============================================

-- Xóa policy cũ nếu có
DROP POLICY IF EXISTS "Users can delete assigned approvers for their pending requests" ON request_assigned_approvers;

-- Tạo policy DELETE mới
CREATE POLICY "Users can delete assigned approvers for their pending requests"
  ON request_assigned_approvers FOR DELETE
  USING (
    -- Cho phép xóa nếu user là chủ phiếu và phiếu đang pending
    EXISTS (
      SELECT 1 FROM employee_requests er
      JOIN employees e ON e.id = er.employee_id
      WHERE er.id = request_assigned_approvers.request_id
      AND er.status = 'pending'
      AND e.user_id = auth.uid()
    )
  );

-- Comment
COMMENT ON POLICY "Users can delete assigned approvers for their pending requests" 
  ON request_assigned_approvers 
  IS 'Cho phép chủ phiếu xóa người duyệt khi sửa phiếu pending';
