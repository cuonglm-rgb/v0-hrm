-- =============================================
-- MAKEUP WORK REQUEST TYPES (Làm bù)
-- =============================================
-- Thêm 2 loại phiếu mới:
--   1. late_early_makeup: Đi muộn/về sớm làm bù (cùng tháng)
--   2. full_day_makeup: Làm bù cả ngày (TẠM THỜI: cùng tháng, có thể mở lại cho phép bù tháng sau)
-- Cả 2 đều bắt buộc linked_deficit_date trong custom_data

INSERT INTO request_types (
  name, code, description,
  requires_date_range, requires_single_date, requires_time, requires_time_range,
  requires_reason, requires_attachment,
  affects_attendance, affects_payroll, deduct_leave_balance,
  is_active, display_order, allows_multiple_time_slots
)
VALUES
  (
    'Đi muộn/về sớm làm bù',
    'late_early_makeup',
    'Phiếu đăng ký làm bù khi đi muộn hoặc về sớm. Giờ checkout phải sau giờ kết thúc trong phiếu, nếu không sẽ bị tính vi phạm. Chỉ được tạo trong cùng tháng với ngày thiếu công.',
    false, true, false, true,
    true, false,
    true, true, false,
    true, 11, false
  ),
  (
    'Làm bù cả ngày',
    'full_day_makeup',
    'Phiếu đăng ký làm bù cả ngày vào ngày nghỉ. Chỉ được tạo trong cùng tháng với ngày thiếu công.',
    false, true, false, true,
    true, false,
    true, true, false,
    true, 12, false
  )
ON CONFLICT (code) DO NOTHING;
