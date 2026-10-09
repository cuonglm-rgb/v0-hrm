-- =============================================
-- NGÀY LÀM BÙ CHO NGÀY NGHỈ CÔNG TY
-- =============================================
-- Công ty hoán đổi ngày nghỉ: nghỉ 1 ngày làm việc (ngày nghỉ công ty, vẫn có lương)
-- và làm bù vào 1 ngày đang nghỉ (CN / T7 nghỉ) → ngày làm bù thành ngày công bình thường,
-- công chuẩn của tháng chứa ngày làm bù +1.
--
-- Ngày làm bù là 1 dòng riêng trong special_work_days, trỏ về ngày nghỉ qua makeup_for_id.
-- Xóa ngày nghỉ → ngày làm bù bị xóa theo (ON DELETE CASCADE).
-- Phạm vi nhân viên (special_work_day_employees) được copy từ ngày nghỉ sang ngày làm bù.

ALTER TABLE special_work_days
  ADD COLUMN IF NOT EXISTS is_makeup_workday BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS makeup_for_id UUID REFERENCES special_work_days(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_special_work_days_makeup_for ON special_work_days(makeup_for_id);

COMMENT ON COLUMN special_work_days.is_makeup_workday IS 'Ngày làm bù: ngày nghỉ theo lịch (CN/T7 nghỉ) thành ngày công bình thường, +1 công chuẩn';
COMMENT ON COLUMN special_work_days.makeup_for_id IS 'Ngày nghỉ công ty mà ngày này làm bù cho';
