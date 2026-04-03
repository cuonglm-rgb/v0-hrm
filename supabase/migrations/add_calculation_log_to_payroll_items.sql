-- Add calculation_log column to payroll_items table
ALTER TABLE payroll_items 
ADD COLUMN IF NOT EXISTS calculation_log TEXT;

COMMENT ON COLUMN payroll_items.calculation_log IS 'Log chi tiết quy trình tính lương của nhân viên';
