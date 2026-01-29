-- =============================================
-- Script: 039-add-insurance-salary.sql
-- Mô tả: Thêm cột insurance_salary (lương BHXH) vào salary_structure
-- =============================================

-- Thêm cột lương BHXH
ALTER TABLE salary_structure 
ADD COLUMN IF NOT EXISTS insurance_salary numeric DEFAULT NULL;

-- Comment
COMMENT ON COLUMN salary_structure.insurance_salary IS 
'Lương đóng BHXH (có thể khác lương cơ bản). Nếu NULL thì dùng base_salary';

-- Cập nhật dữ liệu hiện tại: set insurance_salary = base_salary cho các bản ghi chưa có
UPDATE salary_structure 
SET insurance_salary = base_salary 
WHERE insurance_salary IS NULL;
