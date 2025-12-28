-- =============================================
-- EXTENDED TABLES (theo doc CORE HRM)
-- =============================================

-- Thêm cột dob vào employees nếu chưa có
ALTER TABLE employees ADD COLUMN IF NOT EXISTS dob date;

-- =============================================
-- 1. employee_job_history (lịch sử chức danh & lương)
-- =============================================
CREATE TABLE IF NOT EXISTS employee_job_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id),
  position_id uuid REFERENCES positions(id),
  salary numeric,
  start_date date NOT NULL,
  end_date date,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- 2. attendance_logs (chấm công)
-- =============================================
CREATE TABLE IF NOT EXISTS attendance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  check_in timestamptz,
  check_out timestamptz,
  source text, -- 'manual', 'fingerprint', 'face', 'qr'
  note text,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- 3. leave_requests (nghỉ phép)
-- =============================================
CREATE TABLE IF NOT EXISTS leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type text NOT NULL, -- 'annual', 'sick', 'unpaid', 'maternity', 'other'
  from_date date NOT NULL,
  to_date date NOT NULL,
  reason text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approver_id uuid REFERENCES employees(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- 4. payroll_runs (đợt chạy lương)
-- =============================================
CREATE TABLE IF NOT EXISTS payroll_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month int NOT NULL CHECK (month BETWEEN 1 AND 12),
  year int NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'locked', 'paid')),
  note text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(month, year)
);

-- =============================================
-- 5. payroll_items (chi tiết lương từng nhân viên)
-- =============================================
CREATE TABLE IF NOT EXISTS payroll_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_run_id uuid NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  base_salary numeric DEFAULT 0,
  allowances numeric DEFAULT 0,
  total_income numeric DEFAULT 0,
  total_deduction numeric DEFAULT 0,
  net_salary numeric DEFAULT 0,
  note text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(payroll_run_id, employee_id)
);

-- =============================================
-- INDEXES (performance)
-- =============================================
CREATE INDEX IF NOT EXISTS idx_job_history_employee ON employee_job_history(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance_logs(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_checkin ON attendance_logs(check_in);
CREATE INDEX IF NOT EXISTS idx_leave_employee ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_payroll_items_employee ON payroll_items(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_runs_period ON payroll_runs(year, month);
