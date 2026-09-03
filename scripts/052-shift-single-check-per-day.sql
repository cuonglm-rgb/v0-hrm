-- =============================================
-- CA LÀM VIỆC CHỈ CHẤM CÔNG 1 LẦN/NGÀY
-- =============================================
-- Một số nhóm (VD: SALE freelance) chỉ cần chấm công vào, không chấm công ra.
-- Trước đây không có cách nào tắt vi phạm "Quên check-out" cho riêng nhóm này:
--   - Phạt "Quên chấm công" có thể loại trừ bằng phạm vi phòng ban/chức vụ,
--     NHƯNG phụ cấp theo ngày (VD: Phụ cấp ăn trưa) vẫn coi quên check-out là vi phạm
--     và cắt phụ cấp của họ.
-- Cột này đánh dấu ca làm việc không yêu cầu check-out: ngày chỉ có check-in
-- được tính là ngày làm đầy đủ (không vi phạm, không mất phụ cấp, không bị phạt).

ALTER TABLE work_shifts
  ADD COLUMN IF NOT EXISTS single_check_per_day BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN work_shifts.single_check_per_day IS
  'true = ca chỉ cần chấm công 1 lần/ngày (không bắt buộc check-out). Ngày chỉ có check-in vẫn tính là đủ công, không tính vi phạm quên check-out.';
