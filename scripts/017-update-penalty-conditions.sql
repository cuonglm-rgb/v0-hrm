-- =============================================
-- CẬP NHẬT: Thêm điều kiện phạt mới
-- =============================================

-- Cập nhật loại phạt hiện có để sử dụng penalty_conditions
UPDATE payroll_adjustment_types
SET auto_rules = jsonb_set(
  COALESCE(auto_rules, '{}'::jsonb),
  '{penalty_conditions}',
  '["late_arrival"]'::jsonb
)
WHERE code = 'LATE_PENALTY_30' AND category = 'penalty';

-- Thêm các loại phạt mới với điều kiện cụ thể
INSERT INTO payroll_adjustment_types (name, code, category, amount, calculation_type, is_auto_applied, auto_rules, description)
VALUES 
  -- Phạt đi muộn hoặc về sớm
  ('Phạt đi muộn/về sớm', 'LATE_EARLY_PENALTY', 'penalty', 0, 'per_occurrence', true,
   '{
     "trigger": "late",
     "penalty_conditions": ["late_arrival", "early_leave"],
     "late_threshold_minutes": 30,
     "penalty_type": "half_day_salary",
     "exempt_with_request": true,
     "exempt_request_types": ["late_arrival", "early_leave"]
   }',
   'Phạt nửa ngày lương khi đi muộn hoặc về sớm quá 30 phút. Miễn nếu có phiếu xin phép.'),
  
  -- Phạt quên chấm công
  ('Phạt quên chấm công', 'FORGOT_CHECKIN_PENALTY', 'penalty', 50000, 'per_occurrence', true,
   '{
     "trigger": "late",
     "penalty_conditions": ["forgot_checkin", "forgot_checkout"],
     "penalty_type": "fixed_amount",
     "exempt_with_request": false
   }',
   'Phạt 50,000đ mỗi lần quên chấm công đến hoặc về.'),
  
  -- Phạt tổng hợp (tất cả điều kiện)
  ('Phạt vi phạm chấm công', 'ATTENDANCE_VIOLATION_PENALTY', 'penalty', 0, 'per_occurrence', true,
   '{
     "trigger": "late",
     "penalty_conditions": ["late_arrival", "early_leave", "forgot_checkin", "forgot_checkout"],
     "late_threshold_minutes": 15,
     "penalty_type": "half_day_salary",
     "exempt_with_request": true,
     "exempt_request_types": ["late_arrival", "early_leave", "forgot_checkin", "forgot_checkout"]
   }',
   'Phạt nửa ngày lương cho mọi vi phạm chấm công (đi muộn >15p, về sớm >15p, quên chấm công). Miễn nếu có phiếu.')

ON CONFLICT (code) DO UPDATE SET
  auto_rules = EXCLUDED.auto_rules,
  description = EXCLUDED.description;

-- Hiển thị kết quả
SELECT 
  name,
  code,
  category,
  amount,
  is_auto_applied,
  auto_rules->>'penalty_conditions' as penalty_conditions,
  auto_rules->>'late_threshold_minutes' as threshold_minutes,
  auto_rules->>'penalty_type' as penalty_type
FROM payroll_adjustment_types
WHERE category = 'penalty'
ORDER BY created_at DESC;
