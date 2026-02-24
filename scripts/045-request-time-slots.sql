-- =============================================
-- Tính năng: Nhiều khung giờ trong 1 phiếu yêu cầu
-- Thêm cột allows_multiple_time_slots vào request_types
-- Tạo bảng request_time_slots lưu nhiều khung giờ
-- =============================================

-- BƯỚC 1: Thêm cột cấu hình vào request_types
ALTER TABLE request_types
ADD COLUMN IF NOT EXISTS allows_multiple_time_slots BOOLEAN DEFAULT false;

COMMENT ON COLUMN request_types.allows_multiple_time_slots 
  IS 'Cho phép nhập nhiều khung giờ trong 1 phiếu (yêu cầu requires_time_range = true)';

-- BƯỚC 2: Tạo bảng request_time_slots
CREATE TABLE IF NOT EXISTS request_time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES employee_requests(id) ON DELETE CASCADE,
  from_time TIME NOT NULL,
  to_time TIME NOT NULL,
  slot_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT chk_time_order CHECK (from_time < to_time)
);

-- BƯỚC 3: Index
CREATE INDEX IF NOT EXISTS idx_request_time_slots_request_id 
  ON request_time_slots(request_id);

-- BƯỚC 4: RLS Policies
ALTER TABLE request_time_slots ENABLE ROW LEVEL SECURITY;

-- Chủ phiếu có thể xem khung giờ của phiếu mình
CREATE POLICY "request_time_slots_select_own" ON request_time_slots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM employee_requests er
      JOIN employees e ON e.id = er.employee_id
      WHERE er.id = request_time_slots.request_id
      AND e.user_id = auth.uid()
    )
  );

-- Admin/HR/Manager có thể xem tất cả khung giờ
CREATE POLICY "request_time_slots_select_manager" ON request_time_slots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.code IN ('admin', 'hr', 'manager')
    )
  );

-- Người được chỉ định duyệt có thể xem khung giờ của phiếu
CREATE POLICY "request_time_slots_select_approver" ON request_time_slots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM request_assigned_approvers raa
      JOIN employees e ON e.id = raa.approver_id
      WHERE raa.request_id = request_time_slots.request_id
      AND e.user_id = auth.uid()
    )
  );

-- Chủ phiếu có thể tạo khung giờ cho phiếu của mình
CREATE POLICY "request_time_slots_insert_own" ON request_time_slots
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM employee_requests er
      JOIN employees e ON e.id = er.employee_id
      WHERE er.id = request_time_slots.request_id
      AND e.user_id = auth.uid()
    )
  );

-- Chủ phiếu có thể xóa khung giờ khi phiếu đang pending
CREATE POLICY "request_time_slots_delete_own" ON request_time_slots
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM employee_requests er
      JOIN employees e ON e.id = er.employee_id
      WHERE er.id = request_time_slots.request_id
      AND e.user_id = auth.uid()
      AND er.status = 'pending'
    )
  );

-- Admin/HR có thể xóa khung giờ
CREATE POLICY "request_time_slots_delete_admin" ON request_time_slots
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.code IN ('admin', 'hr')
    )
  );

-- Comments
COMMENT ON TABLE request_time_slots IS 'Lưu nhiều khung giờ cho 1 phiếu yêu cầu';
COMMENT ON COLUMN request_time_slots.request_id IS 'FK đến employee_requests, cascade delete';
COMMENT ON COLUMN request_time_slots.from_time IS 'Giờ bắt đầu khung giờ';
COMMENT ON COLUMN request_time_slots.to_time IS 'Giờ kết thúc khung giờ';
COMMENT ON COLUMN request_time_slots.slot_order IS 'Thứ tự khung giờ trong phiếu';
