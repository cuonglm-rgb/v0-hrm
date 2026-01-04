-- =============================================
-- SCRIPT 019: UPDATE REQUEST TYPES
-- Thêm cột requires_time_range và from_time, to_time
-- =============================================

-- Thêm cột requires_time_range vào request_types
ALTER TABLE request_types 
ADD COLUMN IF NOT EXISTS requires_time_range BOOLEAN DEFAULT false;

-- Thêm cột from_time, to_time vào employee_requests
ALTER TABLE employee_requests 
ADD COLUMN IF NOT EXISTS from_time TIME,
ADD COLUMN IF NOT EXISTS to_time TIME;

-- Cập nhật loại phiếu Tăng ca để dùng time range
UPDATE request_types 
SET requires_time_range = true, requires_time = false 
WHERE code = 'overtime';

-- Cập nhật comment
COMMENT ON COLUMN request_types.requires_time IS 'Cần chọn 1 giờ';
COMMENT ON COLUMN request_types.requires_time_range IS 'Cần chọn từ giờ - đến giờ';
COMMENT ON COLUMN employee_requests.request_time IS 'Giờ (cho phiếu cần 1 giờ)';
COMMENT ON COLUMN employee_requests.from_time IS 'Từ giờ (cho phiếu cần khoảng giờ)';
COMMENT ON COLUMN employee_requests.to_time IS 'Đến giờ (cho phiếu cần khoảng giờ)';
