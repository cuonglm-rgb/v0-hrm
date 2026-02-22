-- Add lunar calendar support for holidays
-- Allows setting holidays by lunar date (e.g., Tết Nguyên Đán, Giỗ Tổ Hùng Vương)

ALTER TABLE holidays ADD COLUMN IF NOT EXISTS is_lunar BOOLEAN DEFAULT FALSE;
ALTER TABLE holidays ADD COLUMN IF NOT EXISTS lunar_month INTEGER;
ALTER TABLE holidays ADD COLUMN IF NOT EXISTS lunar_day INTEGER;

COMMENT ON COLUMN holidays.is_lunar IS 'Whether this holiday is based on lunar calendar';
COMMENT ON COLUMN holidays.lunar_month IS 'Lunar month (1-12)';
COMMENT ON COLUMN holidays.lunar_day IS 'Lunar day (1-30)';
