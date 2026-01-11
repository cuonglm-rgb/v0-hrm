-- Migration: Add custom fields support for request types
-- Run this in Supabase SQL Editor

-- Thêm cột custom_fields vào bảng request_types
-- Lưu trữ định nghĩa các trường tùy chỉnh dạng JSON
ALTER TABLE request_types 
ADD COLUMN IF NOT EXISTS custom_fields jsonb DEFAULT NULL;

-- Thêm cột custom_data vào bảng employee_requests
-- Lưu trữ dữ liệu người dùng nhập vào các trường tùy chỉnh
ALTER TABLE employee_requests 
ADD COLUMN IF NOT EXISTS custom_data jsonb DEFAULT NULL;

-- Comment để giải thích cấu trúc
COMMENT ON COLUMN request_types.custom_fields IS 'JSON array of custom field definitions: [{id, label, type, required, placeholder, options}]';
COMMENT ON COLUMN employee_requests.custom_data IS 'JSON object storing custom field values: {field_id: value}';
