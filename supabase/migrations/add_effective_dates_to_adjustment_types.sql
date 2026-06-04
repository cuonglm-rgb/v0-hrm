-- Thêm thời gian hiệu lực cho loại phụ cấp/khấu trừ/phạt
-- null = không giới hạn (áp dụng luôn / không bao giờ kết thúc)
ALTER TABLE payroll_adjustment_types
  ADD COLUMN IF NOT EXISTS effective_from date,
  ADD COLUMN IF NOT EXISTS effective_to date;

COMMENT ON COLUMN payroll_adjustment_types.effective_from IS 'Thời gian bắt đầu áp dụng (null = áp dụng luôn)';
COMMENT ON COLUMN payroll_adjustment_types.effective_to IS 'Thời gian kết thúc áp dụng (null = không bao giờ kết thúc)';
