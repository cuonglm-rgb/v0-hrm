-- =============================================
-- Sửa dữ liệu phiếu bị kẹt bởi quy tắc "mỗi bước chỉ cần 1 người đồng ý"
-- Bối cảnh: khi 1 người duyệt được gán ở nhiều bước bấm duyệt, dòng của họ ở
-- bước sau cũng được duyệt, nhưng những người còn lại của bước đó vẫn pending
-- → phiếu chờ mãi dù bước đã có người đồng ý.
-- Chạy script này trong Supabase SQL Editor (1 lần, an toàn khi chạy lại).
-- =============================================

-- BƯỚC 1: Với các phiếu đang pending, bước nào đã có ít nhất 1 người approved
-- thì tự duyệt các dòng pending còn lại của bước đó.
UPDATE request_assigned_approvers raa
SET status = 'approved',
    approved_at = NOW()
WHERE raa.status = 'pending'
  AND EXISTS (
    SELECT 1 FROM employee_requests er
    WHERE er.id = raa.request_id
      AND er.status = 'pending'
  )
  AND EXISTS (
    SELECT 1 FROM request_assigned_approvers raa2
    WHERE raa2.request_id = raa.request_id
      AND COALESCE(raa2.display_order, 1) = COALESCE(raa.display_order, 1)
      AND raa2.status = 'approved'
  );

-- BƯỚC 2: Phiếu pending nào không còn ai pending và không có ai rejected
-- → chuyển phiếu sang approved, ghi đúng NGƯỜI DUYỆT THẬT (không lấy dòng
-- vừa được BƯỚC 1 duyệt bù). Phân biệt: app ghi approved_at bằng getNowVN()
-- (chính xác đến giây, phần lẻ giây = 0), còn BƯỚC 1 ghi NOW() có micro giây.
UPDATE employee_requests er
SET status = 'approved',
    approved_at = COALESCE(real_approver.approved_at, NOW()),
    approver_id = COALESCE(real_approver.approver_id, er.approver_id)
FROM (
  SELECT DISTINCT ON (raa.request_id)
         raa.request_id, raa.approver_id, raa.approved_at
  FROM request_assigned_approvers raa
  WHERE raa.status = 'approved'
    AND raa.approved_at IS NOT NULL
    AND raa.approved_at = date_trunc('second', raa.approved_at) -- dòng do app ghi = người bấm duyệt thật
  ORDER BY raa.request_id, raa.approved_at DESC, raa.display_order DESC NULLS LAST
) real_approver
WHERE er.id = real_approver.request_id
  AND er.status = 'pending'
  AND NOT EXISTS (
    SELECT 1 FROM request_assigned_approvers raa
    WHERE raa.request_id = er.id
      AND raa.status IN ('pending', 'rejected')
  );

-- KIỂM TRA: các phiếu pending còn lại và trạng thái từng người duyệt
-- SELECT er.id, er.status AS request_status, e.full_name, raa.display_order, raa.status
-- FROM employee_requests er
-- JOIN request_assigned_approvers raa ON raa.request_id = er.id
-- JOIN employees e ON e.id = raa.approver_id
-- WHERE er.status = 'pending'
-- ORDER BY er.created_at DESC, raa.display_order;
