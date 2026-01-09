-- =============================================
-- OVERTIME ADJUSTMENT TYPE
-- =============================================
-- Thêm loại điều chỉnh cho tăng ca để lưu chi tiết vào payroll_adjustment_details

INSERT INTO payroll_adjustment_types (name, code, category, amount, calculation_type, is_auto_applied, auto_rules, description)
VALUES 
  ('Tiền tăng ca', 'overtime', 'allowance', 0, 'per_occurrence', false, null,
   'Tiền tăng ca được tính từ phiếu tăng ca đã duyệt')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description;
