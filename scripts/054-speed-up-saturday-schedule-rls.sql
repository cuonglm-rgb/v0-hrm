-- =============================================
-- 054: Sửa lỗi tab "Lịch làm thứ 7" không hiển thị dữ liệu (statement timeout)
-- =============================================
-- TRIỆU CHỨNG: Leader (level 3) mở tab thì mọi thứ 7 đều báo "0 nhân viên có
-- lịch riêng", dù dữ liệu có trong DB. Giám đốc (level 5) thì xem được.
--
-- NGUYÊN NHÂN THẬT (đã bắt được lỗi trong log dev server):
--   Error listing saturday schedules: { code: '57014',
--     message: 'canceling statement due to statement timeout' }
--
--   Không phải RLS chặn nhầm, mà là query CHẠY QUÁ CHẬM rồi bị DB hủy.
--   Role `authenticated` của Supabase có statement_timeout = 8s.
--   listSaturdaySchedules() bắt được lỗi rồi `return []`, nên UI hiện 0 dòng
--   mà không báo gì cho người dùng.
--
--   Đo được: query đọc 206 dòng mất ~3.000 ms cho user level 3, trong khi
--   bảng company_news cùng lúc chỉ mất ~237 ms. Qua PostgREST lúc tải nặng
--   thì vượt 8s -> bị hủy.
--
--   Vì sao chậm: policy của script 041 dùng biểu thức tương quan theo từng dòng
--
--     EXISTS (SELECT 1 FROM employees e JOIN positions p ON ...
--             WHERE e.user_id = auth.uid() AND ...
--             AND employee_id IN (SELECT e2.id FROM employees e2
--                                 WHERE e2.department_id = e.department_id))
--
--   Vì có tham chiếu `employee_id` của dòng đang xét, Postgres phải chạy lại
--   toàn bộ khối này CHO TỪNG DÒNG. Mỗi lần lại quét bảng employees, mà
--   employees cũng có RLS riêng gọi get_my_position_level()/get_my_department_id().
--   Nhân lên thành hàng nghìn lần gọi hàm cho một lần mở trang.
--
-- CÁCH SỬA: đưa toàn bộ phần "user này là ai, được xem những ai" vào các hàm
-- STABLE + SECURITY DEFINER không nhận tham số theo dòng. Postgres tính MỘT LẦN
-- cho cả query (InitPlan) rồi dùng lại, thay vì tính lại mỗi dòng.
-- SECURITY DEFINER cũng giúp không phải đi qua RLS của employees nữa.
--
-- PHẠM VI QUYỀN GIỮ NGUYÊN như 041 + 053:
--   - level > 3            : xem & sửa tất cả
--   - level = 3            : xem & sửa nhân viên cùng phòng ban
--   - hr/admin             : xem tất cả (cần cho tính lương - xem 053)
--   - nhân viên thường     : chỉ xem lịch của chính mình
-- =============================================


-- ---------------------------------------------
-- 1. HÀM HỖ TRỢ (STABLE + SECURITY DEFINER -> chạy 1 lần / query)
-- ---------------------------------------------

CREATE OR REPLACE FUNCTION get_my_employee_id()
RETURNS UUID LANGUAGE SQL SECURITY DEFINER STABLE AS $$
  SELECT id FROM employees WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Xem được tất cả: level > 3 hoặc có role hr/admin
CREATE OR REPLACE FUNCTION can_view_all_saturday_schedule()
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER STABLE AS $$
  SELECT COALESCE((
    SELECT p.level > 3 FROM employees e
    JOIN positions p ON p.id = e.position_id
    WHERE e.user_id = auth.uid() LIMIT 1
  ), false)
  OR EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() AND r.code IN ('hr', 'admin')
  );
$$;

-- Sửa được tất cả: chỉ level > 3 (giữ đúng như 041)
CREATE OR REPLACE FUNCTION can_manage_all_saturday_schedule()
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER STABLE AS $$
  SELECT COALESCE((
    SELECT p.level > 3 FROM employees e
    JOIN positions p ON p.id = e.position_id
    WHERE e.user_id = auth.uid() LIMIT 1
  ), false);
$$;

-- Danh sách nhân viên cùng phòng ban, chỉ trả về khi người gọi là level >= 3
CREATE OR REPLACE FUNCTION my_department_employee_ids()
RETURNS SETOF UUID LANGUAGE SQL SECURITY DEFINER STABLE AS $$
  SELECT e2.id FROM employees e2
  WHERE e2.department_id IS NOT NULL
    AND e2.department_id = (
      SELECT department_id FROM employees WHERE user_id = auth.uid() LIMIT 1
    )
    AND COALESCE((
      SELECT p.level FROM employees e
      JOIN positions p ON p.id = e.position_id
      WHERE e.user_id = auth.uid() LIMIT 1
    ), 0) >= 3;
$$;

GRANT EXECUTE ON FUNCTION get_my_employee_id() TO authenticated;
GRANT EXECUTE ON FUNCTION can_view_all_saturday_schedule() TO authenticated;
GRANT EXECUTE ON FUNCTION can_manage_all_saturday_schedule() TO authenticated;
GRANT EXECUTE ON FUNCTION my_department_employee_ids() TO authenticated;


-- ---------------------------------------------
-- 2. THAY POLICY CŨ
-- ---------------------------------------------

DROP POLICY IF EXISTS "Employees can view their own saturday schedule" ON saturday_work_schedule;
DROP POLICY IF EXISTS "Leaders can view department saturday schedule" ON saturday_work_schedule;
DROP POLICY IF EXISTS "Leaders can manage department saturday schedule" ON saturday_work_schedule;
DROP POLICY IF EXISTS "saturday_select_hr_admin" ON saturday_work_schedule;
DROP POLICY IF EXISTS "saturday_select_scope" ON saturday_work_schedule;
DROP POLICY IF EXISTS "saturday_manage_scope" ON saturday_work_schedule;

CREATE POLICY "saturday_select_scope"
  ON saturday_work_schedule FOR SELECT TO authenticated
  USING (
    can_view_all_saturday_schedule()
    OR employee_id = get_my_employee_id()
    OR employee_id IN (SELECT my_department_employee_ids())
  );

CREATE POLICY "saturday_manage_scope"
  ON saturday_work_schedule FOR ALL TO authenticated
  USING (
    can_manage_all_saturday_schedule()
    OR employee_id IN (SELECT my_department_employee_ids())
  )
  WITH CHECK (
    can_manage_all_saturday_schedule()
    OR employee_id IN (SELECT my_department_employee_ids())
  );


-- ---------------------------------------------
-- 3. KIỂM TRA LẠI (chạy trong transaction rồi ROLLBACK)
-- ---------------------------------------------
-- Thay <user_id> bằng auth.users.id cần thử. Kết quả phải giống hệt trước khi
-- sửa, chỉ khác là nhanh hơn nhiều.
--
-- BEGIN;
--   SELECT set_config('request.jwt.claims', '{"sub":"<user_id>","role":"authenticated"}', true);
--   SET LOCAL ROLE authenticated;
--   \timing on
--   SELECT count(*) FROM saturday_work_schedule;
-- ROLLBACK;
