-- =============================================
-- Thêm cột custom_percentage cho employee_adjustments
-- Cho phép gán % lương tùy chỉnh cho từng nhân viên
-- =============================================

-- Thêm cột custom_percentage
ALTER TABLE employee_adjustments 
ADD COLUMN IF NOT EXISTS custom_percentage numeric;

-- Comment
COMMENT ON COLUMN employee_adjustments.custom_percentage IS 'Phần trăm lương tùy chỉnh (VD: 8 = 8%). Nếu có sẽ ưu tiên hơn custom_amount và auto_rules.percentage';
