-- =============================================
-- ADD STANDARD_WORKING_DAYS TO PAYROLL_ITEMS
-- =============================================
-- Thêm cột lưu công chuẩn của tháng để tính lương ngày chính xác

ALTER TABLE payroll_items 
ADD COLUMN IF NOT EXISTS standard_working_days numeric DEFAULT 25;

COMMENT ON COLUMN payroll_items.standard_working_days IS 'Số ngày công chuẩn của tháng (tính động theo lịch)';
