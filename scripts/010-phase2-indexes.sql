-- =============================================
-- PHASE 2 - Additional indexes for Attendance & Leave
-- =============================================

-- Index cho attendance theo employee + date (theo Phase 2 spec)
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date
ON attendance_logs(employee_id, check_in);

-- Index cho leave theo employee + date range
CREATE INDEX IF NOT EXISTS idx_leave_employee_date
ON leave_requests(employee_id, from_date, to_date);

-- Tạo function IMMUTABLE để extract date từ timestamptz
CREATE OR REPLACE FUNCTION get_date_from_timestamptz(ts timestamptz)
RETURNS date AS $$
  SELECT ts::date;
$$ LANGUAGE sql IMMUTABLE;

-- Đảm bảo constraint 1 ngày / 1 record attendance
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_one_per_day
ON attendance_logs(employee_id, get_date_from_timestamptz(check_in))
WHERE check_in IS NOT NULL;
