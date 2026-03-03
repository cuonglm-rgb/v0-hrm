-- =============================================
-- Fix: Leader (position level >= 3) không xem được đủ nhân viên phòng ban
-- Nguyên nhân: RLS policy "employees_select_manager" yêu cầu role 'manager' 
-- trong user_roles VÀ department_id trong user_roles phải khớp.
-- Nhưng leader (level >= 3) có thể không có role 'manager' trong user_roles,
-- hoặc user_roles.department_id không được set đúng.
-- 
-- Giải pháp: Thêm policy cho phép nhân viên có position level >= 3
-- xem được tất cả nhân viên cùng phòng ban (dựa trên employees.department_id)
-- =============================================

-- Helper function: lấy department_id của employee hiện tại (bypass RLS)
CREATE OR REPLACE FUNCTION get_my_department_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT department_id 
  FROM employees 
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- Helper function: lấy position level của employee hiện tại (bypass RLS)
CREATE OR REPLACE FUNCTION get_my_position_level()
RETURNS INT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(p.level, 0)
  FROM employees e
  JOIN positions p ON p.id = e.position_id
  WHERE e.user_id = auth.uid()
  LIMIT 1;
$$;

-- Grant execute
GRANT EXECUTE ON FUNCTION get_my_department_id() TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_position_level() TO authenticated;

-- Policy: Nhân viên có position level >= 3 xem được nhân viên cùng phòng ban
DROP POLICY IF EXISTS "employees_select_department_leader" ON employees;

CREATE POLICY "employees_select_department_leader" ON employees
  FOR SELECT USING (
    get_my_position_level() >= 3
    AND department_id = get_my_department_id()
  );

COMMENT ON POLICY "employees_select_department_leader" ON employees 
  IS 'Leader (position level >= 3) có thể xem tất cả nhân viên cùng phòng ban';
