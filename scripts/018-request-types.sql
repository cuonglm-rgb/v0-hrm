-- =============================================
-- SCRIPT 018: REQUEST TYPES (Loại phiếu)
-- Cho phép người dùng tạo template loại phiếu
-- =============================================

-- Bảng loại phiếu (template)
CREATE TABLE IF NOT EXISTS request_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  -- Cấu hình phiếu
  requires_date_range BOOLEAN DEFAULT true,      -- Cần chọn từ ngày - đến ngày
  requires_single_date BOOLEAN DEFAULT false,    -- Chỉ cần 1 ngày
  requires_time BOOLEAN DEFAULT false,           -- Cần chọn giờ (1 giờ)
  requires_time_range BOOLEAN DEFAULT false,     -- Cần chọn từ giờ - đến giờ
  requires_reason BOOLEAN DEFAULT true,          -- Bắt buộc nhập lý do
  requires_attachment BOOLEAN DEFAULT false,     -- Cần đính kèm file
  -- Ảnh hưởng đến chấm công/lương
  affects_attendance BOOLEAN DEFAULT false,      -- Ảnh hưởng chấm công
  affects_payroll BOOLEAN DEFAULT false,         -- Ảnh hưởng lương
  deduct_leave_balance BOOLEAN DEFAULT false,    -- Trừ phép năm
  -- Trạng thái
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bảng phiếu yêu cầu (generic requests)
CREATE TABLE IF NOT EXISTS employee_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  request_type_id UUID NOT NULL REFERENCES request_types(id) ON DELETE RESTRICT,
  -- Thông tin phiếu
  from_date DATE,
  to_date DATE,
  request_date DATE,                             -- Cho phiếu chỉ cần 1 ngày
  request_time TIME,                             -- Cho phiếu cần 1 giờ
  from_time TIME,                                -- Cho phiếu cần từ giờ
  to_time TIME,                                  -- Cho phiếu cần đến giờ
  reason TEXT,
  attachment_url TEXT,
  -- Trạng thái duyệt
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approver_id UUID REFERENCES employees(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_employee_requests_employee ON employee_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_requests_type ON employee_requests(request_type_id);
CREATE INDEX IF NOT EXISTS idx_employee_requests_status ON employee_requests(status);
CREATE INDEX IF NOT EXISTS idx_request_types_code ON request_types(code);
CREATE INDEX IF NOT EXISTS idx_request_types_active ON request_types(is_active);

-- Seed các loại phiếu mặc định
INSERT INTO request_types (name, code, description, requires_date_range, requires_single_date, requires_time, requires_time_range, requires_reason, affects_attendance, affects_payroll, deduct_leave_balance, display_order)
VALUES 
  ('Nghỉ phép năm', 'annual_leave', 'Đơn xin nghỉ phép năm theo quy định', true, false, false, false, true, true, true, true, 1),
  ('Nghỉ ốm', 'sick_leave', 'Đơn xin nghỉ ốm (cần giấy khám bệnh)', true, false, false, false, true, true, true, false, 2),
  ('Nghỉ không lương', 'unpaid_leave', 'Đơn xin nghỉ không hưởng lương', true, false, false, false, true, true, true, false, 3),
  ('Nghỉ thai sản', 'maternity_leave', 'Đơn xin nghỉ thai sản theo luật', true, false, false, false, true, true, true, false, 4),
  ('Quên chấm công', 'forgot_checkin', 'Phiếu giải trình quên chấm công', false, true, true, false, true, true, false, false, 5),
  ('Đi muộn', 'late_arrival', 'Phiếu giải trình đi muộn', false, true, true, false, true, true, false, false, 6),
  ('Về sớm', 'early_leave', 'Phiếu xin về sớm', false, true, true, false, true, true, false, false, 7),
  ('Làm việc từ xa', 'work_from_home', 'Đơn xin làm việc từ xa', true, false, false, false, true, true, false, false, 8),
  ('Công tác', 'business_trip', 'Đơn xin đi công tác', true, false, false, false, true, true, false, false, 9),
  ('Tăng ca', 'overtime', 'Đơn xin làm thêm giờ', false, true, false, true, true, true, true, false, 10)
ON CONFLICT (code) DO NOTHING;

-- RLS Policies
ALTER TABLE request_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_requests ENABLE ROW LEVEL SECURITY;

-- Request types: ai cũng đọc được, chỉ admin/hr sửa
CREATE POLICY "request_types_select" ON request_types
  FOR SELECT USING (true);

CREATE POLICY "request_types_admin" ON request_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.code IN ('admin', 'hr')
    )
  );

-- Employee requests: nhân viên xem của mình, manager/hr/admin xem tất cả
CREATE POLICY "employee_requests_own" ON employee_requests
  FOR SELECT USING (
    employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "employee_requests_manager" ON employee_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.code IN ('admin', 'hr', 'manager')
    )
  );

CREATE POLICY "employee_requests_insert" ON employee_requests
  FOR INSERT WITH CHECK (
    employee_id IN (
      SELECT id FROM employees WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "employee_requests_update" ON employee_requests
  FOR UPDATE USING (
    -- Chủ phiếu có thể sửa khi pending
    (employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()) AND status = 'pending')
    OR
    -- Admin/HR/Manager có thể duyệt
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.code IN ('admin', 'hr', 'manager')
    )
  );

CREATE POLICY "employee_requests_delete" ON employee_requests
  FOR DELETE USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()) AND status = 'pending'
  );

-- Trigger update timestamp
CREATE OR REPLACE FUNCTION update_request_types_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_request_types_updated
  BEFORE UPDATE ON request_types
  FOR EACH ROW EXECUTE FUNCTION update_request_types_timestamp();

CREATE TRIGGER trigger_employee_requests_updated
  BEFORE UPDATE ON employee_requests
  FOR EACH ROW EXECUTE FUNCTION update_request_types_timestamp();
