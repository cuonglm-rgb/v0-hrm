-- Migration: Add resignation_date to employees table
-- Purpose: Track when an employee resigned/terminated
-- Date: 2026-04-07

-- Add resignation_date column
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS resignation_date DATE;

-- Add comment
COMMENT ON COLUMN employees.resignation_date IS 'Ngày nghỉ việc của nhân viên. Khi tính lương chỉ tính đến ngày này.';

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_employees_resignation_date ON employees(resignation_date);

-- Update existing resigned employees to have a resignation_date if needed
-- (This is optional - you may want to manually set these dates)
-- UPDATE employees 
-- SET resignation_date = updated_at::date 
-- WHERE status = 'resigned' AND resignation_date IS NULL;
