-- =============================================
-- Fix RLS để tất cả user có thể xem danh sách người duyệt
-- Vấn đề: Khi tạo phiếu, user cần xem danh sách người có quyền duyệt
-- nhưng RLS chặn không cho xem employees khác
-- =============================================

-- CÁCH 1: Tạo function SECURITY DEFINER để lấy danh sách người duyệt (bypass RLS)
-- Đây là cách an toàn nhất vì chỉ trả về thông tin cần thiết

CREATE OR REPLACE FUNCTION get_eligible_approvers_by_level(
  p_min_level INT DEFAULT NULL,
  p_max_level INT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  employee_code TEXT,
  position_name TEXT,
  position_level INT,
  department_name TEXT
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT DISTINCT
    e.id,
    e.full_name,
    e.employee_code,
    p.name as position_name,
    COALESCE(p.level, 0) as position_level,
    d.name as department_name
  FROM employees e
  LEFT JOIN positions p ON p.id = e.position_id
  LEFT JOIN departments d ON d.id = e.department_id
  WHERE e.status = 'active'
    AND (
      -- Điều kiện 1: Theo level (nếu có cấu hình)
      (
        (p_min_level IS NULL OR COALESCE(p.level, 0) >= p_min_level)
        AND (p_max_level IS NULL OR COALESCE(p.level, 0) <= p_max_level)
      )
      OR
      -- Điều kiện 2: Admin và HR luôn có quyền duyệt mọi phiếu
      EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = e.user_id
        AND r.code IN ('admin', 'hr')
      )
    )
  ORDER BY COALESCE(p.level, 0) DESC, e.full_name;
$$;

-- Function lấy người duyệt theo position_id
CREATE OR REPLACE FUNCTION get_approvers_by_position(p_position_id UUID)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  employee_code TEXT,
  position_name TEXT,
  position_level INT,
  department_name TEXT
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    e.id,
    e.full_name,
    e.employee_code,
    p.name as position_name,
    COALESCE(p.level, 0) as position_level,
    d.name as department_name
  FROM employees e
  LEFT JOIN positions p ON p.id = e.position_id
  LEFT JOIN departments d ON d.id = e.department_id
  WHERE e.status = 'active'
    AND e.position_id = p_position_id
  ORDER BY e.full_name;
$$;

-- Function lấy người duyệt theo role code
CREATE OR REPLACE FUNCTION get_approvers_by_role(p_role_code TEXT)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  employee_code TEXT,
  position_name TEXT,
  position_level INT,
  department_name TEXT
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    e.id,
    e.full_name,
    e.employee_code,
    p.name as position_name,
    COALESCE(p.level, 0) as position_level,
    d.name as department_name
  FROM employees e
  LEFT JOIN positions p ON p.id = e.position_id
  LEFT JOIN departments d ON d.id = e.department_id
  JOIN user_roles ur ON ur.user_id = e.user_id
  JOIN roles r ON r.id = ur.role_id
  WHERE e.status = 'active'
    AND r.code = p_role_code
  ORDER BY COALESCE(p.level, 0) DESC, e.full_name;
$$;

-- Function lấy thông tin 1 employee cụ thể (cho approver_employee_id)
CREATE OR REPLACE FUNCTION get_employee_as_approver(p_employee_id UUID)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  employee_code TEXT,
  position_name TEXT,
  position_level INT,
  department_name TEXT
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    e.id,
    e.full_name,
    e.employee_code,
    p.name as position_name,
    COALESCE(p.level, 0) as position_level,
    d.name as department_name
  FROM employees e
  LEFT JOIN positions p ON p.id = e.position_id
  LEFT JOIN departments d ON d.id = e.department_id
  WHERE e.id = p_employee_id
    AND e.status = 'active';
$$;

-- Grant execute cho authenticated users
GRANT EXECUTE ON FUNCTION get_eligible_approvers_by_level(INT, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_approvers_by_position(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_approvers_by_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_employee_as_approver(UUID) TO authenticated;

-- Comments
COMMENT ON FUNCTION get_eligible_approvers_by_level IS 'Lấy danh sách người duyệt theo level (bypass RLS)';
COMMENT ON FUNCTION get_approvers_by_position IS 'Lấy danh sách người duyệt theo position (bypass RLS)';
COMMENT ON FUNCTION get_approvers_by_role IS 'Lấy danh sách người duyệt theo role (bypass RLS)';
COMMENT ON FUNCTION get_employee_as_approver IS 'Lấy thông tin 1 employee làm người duyệt (bypass RLS)';

-- =============================================
-- CÁCH 2 (ALTERNATIVE): Thêm policy cho phép xem employees có level cao
-- Uncomment nếu muốn dùng cách này thay vì functions
-- =============================================

-- DROP POLICY IF EXISTS "employees_select_for_approver_list" ON employees;
-- 
-- CREATE POLICY "employees_select_for_approver_list" ON employees
--   FOR SELECT USING (
--     -- Cho phép xem employees có position level >= min_approver_level của bất kỳ request_type nào
--     EXISTS (
--       SELECT 1 FROM positions p
--       WHERE p.id = employees.position_id
--       AND p.level >= COALESCE(
--         (SELECT MIN(min_approver_level) FROM request_types WHERE is_active = true AND min_approver_level IS NOT NULL),
--         0
--       )
--     )
--   );
