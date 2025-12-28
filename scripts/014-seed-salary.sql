-- =============================================
-- SEED SALARY STRUCTURE
-- Tạo dữ liệu lương mẫu cho nhân viên
-- =============================================

-- Lấy danh sách employee_id và insert salary
-- Bạn cần thay đổi giá trị lương phù hợp với thực tế

-- Cách 1: Insert thủ công cho từng nhân viên
-- INSERT INTO salary_structure (employee_id, base_salary, allowance, effective_date, note)
-- VALUES 
--   ('employee-uuid-1', 15000000, 2000000, '2025-01-01', 'Lương khởi điểm'),
--   ('employee-uuid-2', 20000000, 3000000, '2025-01-01', 'Lương khởi điểm');

-- Cách 2: Insert tự động cho tất cả nhân viên active (lương mặc định)
INSERT INTO salary_structure (employee_id, base_salary, allowance, effective_date, note)
SELECT 
  id as employee_id,
  15000000 as base_salary,  -- 15 triệu VND
  2000000 as allowance,     -- 2 triệu phụ cấp
  '2025-01-01' as effective_date,
  'Lương khởi điểm' as note
FROM employees
WHERE status = 'active'
  AND id NOT IN (SELECT employee_id FROM salary_structure);

-- Kiểm tra dữ liệu
SELECT 
  e.employee_code,
  e.full_name,
  s.base_salary,
  s.allowance,
  s.effective_date
FROM salary_structure s
JOIN employees e ON e.id = s.employee_id
ORDER BY e.employee_code;
