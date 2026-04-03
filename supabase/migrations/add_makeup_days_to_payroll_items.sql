-- Add makeup_days column to payroll_items table
-- Ngày công bù: số ngày công từ làm bù deficit (consumed_deficit_days)
ALTER TABLE payroll_items 
ADD COLUMN IF NOT EXISTS makeup_days NUMERIC DEFAULT 0;

COMMENT ON COLUMN payroll_items.makeup_days IS 'Số ngày công bù (từ làm bù deficit)';
