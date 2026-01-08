-- Sửa trigger của phạt quên chấm công để đảm bảo logic tính lương hoạt động đúng
-- Logic tính lương đã được cập nhật để hỗ trợ cả trigger "late" và "attendance"

-- Cập nhật phạt "Quên chấm công" để có trigger = "attendance"
UPDATE payroll_adjustment_types
SET auto_rules = jsonb_set(
  COALESCE(auto_rules, '{}'::jsonb),
  '{trigger}',
  '"attendance"'::jsonb
)
WHERE code = 'FORGOT_CHECKIN'
  AND category = 'penalty';

-- Kiểm tra kết quả
SELECT 
  id,
  name,
  code,
  category,
  amount,
  calculation_type,
  is_auto_applied,
  auto_rules->>'trigger' as trigger,
  auto_rules->'penalty_conditions' as penalty_conditions,
  is_active
FROM payroll_adjustment_types
WHERE code = 'FORGOT_CHECKIN';

-- Ghi chú:
-- - trigger = "attendance": Phạt dựa trên phiếu xin phép (forgot_checkin, forgot_checkout)
-- - trigger = "late": Phạt dựa trên attendance_logs (late_arrival, early_leave)
-- - Logic tính lương đã hỗ trợ cả 2 loại trigger
