-- =============================================
-- Sửa lại "Đã duyệt bởi" cho các phiếu đã được script 050 (bản cũ) chốt duyệt
-- Lỗi: BƯỚC 2 của 050 bản cũ chọn người có approved_at mới nhất, mà BƯỚC 1
-- vừa set approved_at = NOW() cho các dòng duyệt bù → người được duyệt bù
-- (không hề bấm duyệt) bị ghi thành người duyệt phiếu.
-- Cách nhận diện: app luôn ghi approved_at bằng getNowVN() — chính xác đến
-- GIÂY (phần lẻ giây = 0), còn script ghi NOW() của Postgres có MICRO GIÂY.
-- → Phiếu có er.approved_at lẻ giây = phiếu do script 050 chốt.
-- → Dòng người duyệt có approved_at tròn giây = người bấm duyệt thật.
-- Chạy 1 lần trong Supabase SQL Editor; chạy lại an toàn (sau khi sửa,
-- approved_at của phiếu tròn giây nên không còn khớp điều kiện nữa).
-- =============================================

UPDATE employee_requests er
SET approver_id = real_approver.approver_id,
    approved_at = real_approver.approved_at
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
  AND er.status = 'approved'
  AND er.approved_at IS NOT NULL
  AND er.approved_at <> date_trunc('second', er.approved_at); -- phiếu do script 050 bản cũ chốt

-- KIỂM TRA: xem lại người duyệt của các phiếu đã duyệt gần đây
-- SELECT er.id, er.approved_at, e.full_name AS approved_by
-- FROM employee_requests er
-- JOIN employees e ON e.id = er.approver_id
-- WHERE er.status = 'approved'
-- ORDER BY er.approved_at DESC
-- LIMIT 20;
