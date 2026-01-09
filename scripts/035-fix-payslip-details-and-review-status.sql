-- =============================================
-- FIX: Nhân viên xem chi tiết phụ cấp và tăng ca
-- =============================================
-- Tổng hợp các fix:
-- 1. RLS policies cho nhân viên xem payroll_adjustment_details
-- 2. Thêm trạng thái "review" cho payroll_runs
-- 3. Sửa kiểu dữ liệu occurrence_count để hỗ trợ số thập phân (3.5h)

-- =============================================
-- PHẦN 1: FIX RLS POLICIES
-- =============================================

-- 1.1. Kiểm tra policy hiện tại
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  CASE 
    WHEN qual IS NOT NULL THEN LEFT(qual, 100) || '...'
    ELSE NULL
  END as qual_preview
FROM pg_policies
WHERE tablename IN ('payroll_items', 'payroll_adjustment_details', 'payroll_runs')
ORDER BY tablename, policyname;

-- 1.2. XÓA và TẠO LẠI policy cho payroll_items (nhân viên xem phiếu lương của mình)
DROP POLICY IF EXISTS "payroll_items_select_self" ON payroll_items;
CREATE POLICY "payroll_items_select_self" ON payroll_items FOR SELECT
USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  AND payroll_run_id IN (
    SELECT id FROM payroll_runs WHERE status IN ('review', 'locked', 'paid')
  )
);

-- 1.3. XÓA và TẠO LẠI policy cho payroll_adjustment_details (CHI TIẾT phụ cấp, tăng ca, phạt)
DROP POLICY IF EXISTS "payroll_adjustment_details_select_self" ON payroll_adjustment_details;
CREATE POLICY "payroll_adjustment_details_select_self" ON payroll_adjustment_details FOR SELECT
USING (
  payroll_item_id IN (
    SELECT pi.id FROM payroll_items pi
    JOIN payroll_runs pr ON pi.payroll_run_id = pr.id
    WHERE pi.employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
      AND pr.status IN ('review', 'locked', 'paid')
  )
);

-- 1.4. XÓA và TẠO LẠI policy cho payroll_runs (nhân viên xem bảng lương đã gửi review)
DROP POLICY IF EXISTS "payroll_runs_select_locked" ON payroll_runs;
CREATE POLICY "payroll_runs_select_locked" ON payroll_runs FOR SELECT
USING (
  status IN ('review', 'locked', 'paid')
  OR has_any_role(array['hr', 'admin'])
);

-- =============================================
-- PHẦN 2: THÊM TRẠNG THÁI "REVIEW"
-- =============================================

-- 2.1. Kiểm tra cấu trúc bảng payroll_runs
SELECT 
  column_name, 
  data_type, 
  udt_name,
  column_default
FROM information_schema.columns
WHERE table_name = 'payroll_runs' 
  AND column_name = 'status';

-- 2.2. Kiểm tra các giá trị status hiện có
SELECT DISTINCT status 
FROM payroll_runs 
ORDER BY status;

-- 2.3. Thêm constraint check cho status (cho phép: draft, review, locked, paid)
DO $$ 
BEGIN
  -- Xóa constraint cũ nếu có
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'payroll_runs_status_check'
  ) THEN
    ALTER TABLE payroll_runs DROP CONSTRAINT payroll_runs_status_check;
  END IF;
  
  -- Thêm constraint mới
  ALTER TABLE payroll_runs 
  ADD CONSTRAINT payroll_runs_status_check 
  CHECK (status IN ('draft', 'review', 'locked', 'paid'));
END $$;

-- =============================================
-- PHẦN 3: FIX KIỂU DỮ LIỆU OCCURRENCE_COUNT
-- =============================================

-- 3.1. Kiểm tra kiểu dữ liệu hiện tại
SELECT 
  column_name, 
  data_type, 
  udt_name,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'payroll_adjustment_details' 
  AND column_name = 'occurrence_count';

-- 3.2. Thay đổi kiểu dữ liệu từ integer sang numeric(10,2)
-- Cho phép lưu giá trị thập phân như 3.5h, 4.25h
ALTER TABLE payroll_adjustment_details 
ALTER COLUMN occurrence_count TYPE numeric(10,2);

-- =============================================
-- PHẦN 4: KIỂM TRA SAU KHI THỰC HIỆN
-- =============================================

-- 4.1. Kiểm tra lại policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd
FROM pg_policies
WHERE tablename IN ('payroll_items', 'payroll_adjustment_details', 'payroll_runs')
  AND policyname LIKE '%select%'
ORDER BY tablename, policyname;

-- 4.2. Kiểm tra constraint status
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conname = 'payroll_runs_status_check';

-- 4.3. Kiểm tra kiểu dữ liệu occurrence_count
SELECT 
  column_name, 
  data_type, 
  udt_name,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'payroll_adjustment_details' 
  AND column_name = 'occurrence_count';

-- =============================================
-- HOÀN TẤT
-- =============================================
-- Sau khi chạy script này:
-- 1. Nhân viên có thể xem chi tiết phụ cấp và tăng ca khi HR gửi review
-- 2. HR có thể gửi bảng lương cho nhân viên xem xét (status = 'review')
-- 3. Hệ thống hỗ trợ lưu giá trị tăng ca thập phân (3.5h, 4.25h)
-- 
-- Quy trình mới:
-- Draft → Gửi xem xét (Review) → Khóa (Locked) → Đã trả (Paid)
--         ↓
--     Nhân viên xem và kiến nghị
