-- =============================================
-- UPGRADE cuonglm@pamoteam.com TO ADMIN + HR
-- =============================================

DO $$
DECLARE
  v_user_id uuid;
  v_admin_role_id uuid;
  v_hr_role_id uuid;
BEGIN
  -- Lấy user_id
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'cuonglm@pamoteam.com';

  -- Lấy role IDs
  SELECT id INTO v_admin_role_id FROM roles WHERE code = 'admin';
  SELECT id INTO v_hr_role_id FROM roles WHERE code = 'hr';

  -- Gán role Admin
  INSERT INTO user_roles (user_id, role_id)
  VALUES (v_user_id, v_admin_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;

  -- Gán role HR
  INSERT INTO user_roles (user_id, role_id)
  VALUES (v_user_id, v_hr_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;

  RAISE NOTICE 'Done! User upgraded to Admin + HR';
END $$;

-- Verify
SELECT 
  u.email,
  e.full_name,
  array_agg(r.code ORDER BY r.code) as roles
FROM auth.users u
JOIN employees e ON e.user_id = u.id
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r ON r.id = ur.role_id
WHERE u.email = 'cuonglm@pamoteam.com'
GROUP BY u.id, u.email, e.full_name;
