-- =============================================
-- SCRIPT 020: REQUEST APPROVAL FLOW
-- Cấu hình luồng duyệt phiếu với nhiều người duyệt
-- =============================================

-- Thêm cấu hình duyệt vào request_types
ALTER TABLE request_types 
ADD COLUMN IF NOT EXISTS approval_mode VARCHAR(20) DEFAULT 'any' CHECK (approval_mode IN ('any', 'all')),
ADD COLUMN IF NOT EXISTS min_approver_level INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS max_approver_level INT DEFAULT NULL;

-- approval_mode: 'any' = chỉ cần 1 người duyệt, 'all' = cần tất cả người duyệt
-- min_approver_level: level chức vụ tối thiểu của người duyệt (NULL = không giới hạn)
-- max_approver_level: level chức vụ tối đa của người duyệt (NULL = không giới hạn)

-- Bảng người duyệt được chỉ định cho từng loại phiếu
CREATE TABLE IF NOT EXISTS request_type_approvers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type_id UUID NOT NULL REFERENCES request_types(id) ON DELETE CASCADE,
  -- Có thể chỉ định theo: employee cụ thể, position, hoặc role
  approver_employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  approver_position_id UUID REFERENCES positions(id) ON DELETE CASCADE,
  approver_role_code VARCHAR(20),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_approver_type CHECK (
    (approver_employee_id IS NOT NULL)::int + 
    (approver_position_id IS NOT NULL)::int + 
    (approver_role_code IS NOT NULL)::int = 1
  )
);

-- Bảng lưu trạng thái duyệt của từng người duyệt
CREATE TABLE IF NOT EXISTS request_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES employee_requests(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  comment TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(request_id, approver_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_request_type_approvers_type ON request_type_approvers(request_type_id);
CREATE INDEX IF NOT EXISTS idx_request_approvals_request ON request_approvals(request_id);
CREATE INDEX IF NOT EXISTS idx_request_approvals_approver ON request_approvals(approver_id);
CREATE INDEX IF NOT EXISTS idx_request_approvals_status ON request_approvals(status);

-- RLS
ALTER TABLE request_type_approvers ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_approvals ENABLE ROW LEVEL SECURITY;

-- Request type approvers: ai cũng đọc được
CREATE POLICY "request_type_approvers_select" ON request_type_approvers
  FOR SELECT USING (true);

CREATE POLICY "request_type_approvers_admin" ON request_type_approvers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.code IN ('admin', 'hr')
    )
  );

-- Request approvals: người duyệt xem được phiếu của mình
CREATE POLICY "request_approvals_own" ON request_approvals
  FOR SELECT USING (
    approver_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  );

-- Chủ phiếu xem được trạng thái duyệt
CREATE POLICY "request_approvals_owner" ON request_approvals
  FOR SELECT USING (
    request_id IN (
      SELECT id FROM employee_requests 
      WHERE employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    )
  );

-- Người duyệt có thể cập nhật
CREATE POLICY "request_approvals_update" ON request_approvals
  FOR UPDATE USING (
    approver_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    AND status = 'pending'
  );

-- Admin/HR có thể xem tất cả
CREATE POLICY "request_approvals_admin" ON request_approvals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.code IN ('admin', 'hr')
    )
  );

-- Comment
COMMENT ON COLUMN request_types.approval_mode IS 'any = chỉ cần 1 người duyệt, all = cần tất cả đồng ý';
COMMENT ON COLUMN request_types.min_approver_level IS 'Level chức vụ tối thiểu của người duyệt';
COMMENT ON COLUMN request_types.max_approver_level IS 'Level chức vụ tối đa của người duyệt';
COMMENT ON TABLE request_type_approvers IS 'Danh sách người duyệt được chỉ định cho từng loại phiếu';
COMMENT ON TABLE request_approvals IS 'Trạng thái duyệt của từng người duyệt cho mỗi phiếu';
