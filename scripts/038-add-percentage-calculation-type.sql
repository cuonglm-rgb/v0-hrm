-- =============================================
-- Script: 038-add-percentage-calculation-type.sql
-- Mô tả: Thêm calculation_type "percentage" cho payroll_adjustment_types
-- =============================================

-- Bảng payroll_adjustment_types sử dụng text type cho calculation_type
-- Không cần ALTER TYPE, chỉ cần thêm comment và ví dụ

-- Comment về các giá trị hợp lệ
COMMENT ON COLUMN payroll_adjustment_types.calculation_type IS 
'Loại tính toán: fixed (cố định), daily (theo ngày), per_occurrence (theo lần), percentage (theo % lương)';


