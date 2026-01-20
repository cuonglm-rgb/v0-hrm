-- Thêm adjustment_type cho KPI Bonus
INSERT INTO payroll_adjustment_types (name, code, category, amount, calculation_type, is_auto_applied, description)
VALUES 
  ('Thưởng KPI', 'KPI_BONUS', 'allowance', 0, 'fixed', false, 'Thưởng KPI dựa trên đánh giá hiệu suất')
ON CONFLICT (code) DO NOTHING;
