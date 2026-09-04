-- =============================================
-- Phân biệt "duyệt thật" và "duyệt tự động" trong request_assigned_approvers
-- Bối cảnh: quy tắc "mỗi bước chỉ cần 1 người đồng ý" khiến các dòng của những
-- người KHÔNG bấm duyệt cũng bị chuyển thành approved → UI hiển thị "Đã duyệt"
-- cho người chưa từng duyệt. Thêm cờ auto_approved để UI hiển thị "Tự động duyệt".
-- Chạy SAU script 050 và 051, trong Supabase SQL Editor. Chạy lại an toàn.
-- =============================================

ALTER TABLE request_assigned_approvers
  ADD COLUMN IF NOT EXISTS auto_approved BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN request_assigned_approvers.auto_approved IS
  'TRUE = dòng này được hệ thống tự duyệt (bước đã có người khác đồng ý / duyệt thay), không phải người này bấm duyệt';

-- Backfill: các dòng do script 050 duyệt bù có approved_at ghi bằng NOW() của
-- Postgres (có micro giây), còn app luôn ghi getNowVN() tròn giây
-- → dòng approved có phần lẻ giây chắc chắn là duyệt tự động.
UPDATE request_assigned_approvers
SET auto_approved = TRUE
WHERE status = 'approved'
  AND approved_at IS NOT NULL
  AND approved_at <> date_trunc('second', approved_at);

-- KIỂM TRA:
-- SELECT raa.request_id, e.full_name, raa.display_order, raa.status, raa.auto_approved, raa.approved_at
-- FROM request_assigned_approvers raa
-- JOIN employees e ON e.id = raa.approver_id
-- WHERE raa.status = 'approved'
-- ORDER BY raa.approved_at DESC
-- LIMIT 30;
