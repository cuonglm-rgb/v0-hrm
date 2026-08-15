-- =============================================
-- 053: Sửa quyền đọc + dọn dữ liệu bảng saturday_work_schedule
-- =============================================
-- ĐÃ CHẠY TRÊN PRODUCTION ngày 2026-08-15. File này giữ lại để lịch sử
-- migration khớp với DB (chạy lại được, idempotent).
--
-- Bối cảnh: điều tra vụ linhhtk@pamoteam.com (Leader, level 3, phòng SUPPORT)
-- không xem được dữ liệu tab "Lịch làm thứ 7".
--
-- KẾT LUẬN ĐIỀU TRA: RLS của level 3 KHÔNG phải nguyên nhân. Đã test trực tiếp
-- bằng cả 2 cách (SET LOCAL ROLE authenticated + request.jwt.claims, và gọi
-- PostgREST bằng JWT của user đó): ở level 3 user đọc được 46 dòng, riêng
-- tháng 8/2026 là 14 dòng, kèm đầy đủ tên nhân viên. Policy của script 041
-- hoạt động đúng như thiết kế cho cả level 3 lẫn level > 3.
--
-- Nhưng trong lúc điều tra phát hiện 2 lỗi thật, file này xử lý cả 2.
-- =============================================


-- ---------------------------------------------
-- LỖI 1: HR/Admin không đọc được lịch của phòng ban khác
-- ---------------------------------------------
-- Policy trong 041 chỉ xét position level, hoàn toàn bỏ qua role hr/admin.
-- Hệ quả đo được: cuonglm@pamoteam.com có role 'admin' nhưng position là
-- Leader (level 3) nên chỉ đọc được 45/206 dòng.
--
-- Nguy hiểm ở chỗ generate-payroll.ts (dòng 286) và recalculate-single.ts
-- đọc bảng này bằng session của user chứ không phải service role. Nếu admin
-- level 3 chạy tính lương thì toàn bộ override thứ 7 của phòng ban khác bị
-- bỏ qua âm thầm -> tính sai ngày công, không có lỗi nào báo ra.
--
-- Vá bằng policy bổ sung (permissive, chỉ THÊM quyền đọc, không đụng vào
-- các policy sẵn có của 041).

DROP POLICY IF EXISTS "saturday_select_hr_admin" ON saturday_work_schedule;

CREATE POLICY "saturday_select_hr_admin"
  ON saturday_work_schedule
  FOR SELECT
  TO authenticated
  USING (has_any_role(ARRAY['hr', 'admin']));

-- Sau khi vá: cuonglm (admin, level 3) đọc được 206/206 dòng.


-- ---------------------------------------------
-- LỖI 2: Dữ liệu có ngày sai năm (gõ nhầm)
-- ---------------------------------------------
-- Có 1 dòng work_date = '22026-08-22' (gõ nhầm năm 22026, do linhhtk tạo
-- ngày 2026-08-03), trùng nội dung với dòng '2026-08-22' của cùng nhân viên.
--
-- Lọt qua được cả 2 lớp kiểm tra:
--   - JS: new Date("22026-08-22").getDay() vẫn trả về 6
--   - DB: CHECK (EXTRACT(DOW FROM work_date) = 6) vẫn đúng với năm 22026
--
-- Phía app đã sửa: validateSaturdayDate() trong saturday-schedule-actions.ts
-- (chặn năm ngoài 2020-2100, dùng getUTCDay thay getDay) và min/max cho ô
-- chọn ngày trong saturday-schedule-panel.tsx.

DELETE FROM saturday_work_schedule
WHERE EXTRACT(YEAR FROM work_date) NOT BETWEEN 2020 AND 2100;

ALTER TABLE saturday_work_schedule
  DROP CONSTRAINT IF EXISTS check_saturday_year;

ALTER TABLE saturday_work_schedule
  ADD CONSTRAINT check_saturday_year
  CHECK (EXTRACT(YEAR FROM work_date) BETWEEN 2020 AND 2100);


-- ---------------------------------------------
-- KIỂM TRA
-- ---------------------------------------------
-- SELECT policyname, cmd, qual FROM pg_policies
--   WHERE tablename = 'saturday_work_schedule' ORDER BY policyname;
--
-- Test RLS theo user bất kỳ (chạy trong transaction rồi ROLLBACK):
-- BEGIN;
--   SELECT set_config('request.jwt.claims', '{"sub":"<user_id>","role":"authenticated"}', true);
--   SET LOCAL ROLE authenticated;
--   SELECT count(*) FROM saturday_work_schedule
--     WHERE work_date BETWEEN '2026-08-01' AND '2026-08-31';
-- ROLLBACK;
