-- =============================================
-- Lưu trạng thái consume deficit theo tháng payroll (audit)
-- =============================================
-- consumed_deficit_days: số ngày deficit được consume trong tháng run
-- consumed_deficit_detail: danh sách ngày thiếu công gốc đã được bù (để biết consume thuộc tháng nào + audit)

ALTER TABLE payroll_items
ADD COLUMN IF NOT EXISTS consumed_deficit_days numeric DEFAULT 0;

ALTER TABLE payroll_items
ADD COLUMN IF NOT EXISTS consumed_deficit_detail text;

COMMENT ON COLUMN payroll_items.consumed_deficit_days IS 'Số ngày thiếu công đã được bù (consume) trong tháng payroll này';
COMMENT ON COLUMN payroll_items.consumed_deficit_detail IS 'Danh sách linked_deficit_date đã consume (VD: 2026-02-28,2026-03-10) để audit theo tháng';
