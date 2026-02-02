-- =============================================
-- ADD COMPANY HOLIDAY TYPE TO SPECIAL WORK DAYS
-- =============================================
-- Thêm loại "Ngày nghỉ công ty" - ngày này sẽ trừ 1 ngày công chuẩn trong payroll

-- Thêm cột is_company_holiday
ALTER TABLE special_work_days 
ADD COLUMN IF NOT EXISTS is_company_holiday BOOLEAN DEFAULT false;

-- Comment
COMMENT ON COLUMN special_work_days.is_company_holiday IS 'Ngày nghỉ công ty - trừ 1 ngày công chuẩn trong payroll';
