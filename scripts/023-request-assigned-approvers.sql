-- =============================================
-- Bảng lưu người duyệt được chỉ định khi tạo phiếu
-- =============================================

-- Tạo bảng request_assigned_approvers
CREATE TABLE IF NOT EXISTS request_assigned_approvers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES employee_requests(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  display_order INT DEFAULT 1,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  comment TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Mỗi người duyệt chỉ được chỉ định 1 lần cho mỗi phiếu
  UNIQUE(request_id, approver_id)
);

-- Index để tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_request_assigned_approvers_request_id 
  ON request_assigned_approvers(request_id);
CREATE INDEX IF NOT EXISTS idx_request_assigned_approvers_approver_id 
  ON request_assigned_approvers(approver_id);
CREATE INDEX IF NOT EXISTS idx_request_assigned_approvers_status 
  ON request_assigned_approvers(status);

-- RLS Policies
ALTER TABLE request_assigned_approvers ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc nếu là người tạo phiếu hoặc người duyệt
CREATE POLICY "Users can view assigned approvers for their requests"
  ON request_assigned_approvers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM employee_requests er
      JOIN employees e ON e.id = er.employee_id
      WHERE er.id = request_assigned_approvers.request_id
      AND e.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.id = request_assigned_approvers.approver_id
      AND e.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.code IN ('admin', 'hr')
    )
  );

-- Cho phép tạo khi tạo phiếu
CREATE POLICY "Users can create assigned approvers for their requests"
  ON request_assigned_approvers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employee_requests er
      JOIN employees e ON e.id = er.employee_id
      WHERE er.id = request_assigned_approvers.request_id
      AND e.user_id = auth.uid()
    )
  );

-- Cho phép người duyệt cập nhật trạng thái
CREATE POLICY "Approvers can update their approval status"
  ON request_assigned_approvers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.id = request_assigned_approvers.approver_id
      AND e.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.code IN ('admin', 'hr')
    )
  );

-- Comment
COMMENT ON TABLE request_assigned_approvers IS 'Lưu danh sách người duyệt được chỉ định khi tạo phiếu';
COMMENT ON COLUMN request_assigned_approvers.display_order IS 'Thứ tự hiển thị/ưu tiên duyệt';
COMMENT ON COLUMN request_assigned_approvers.status IS 'Trạng thái duyệt của người này';
