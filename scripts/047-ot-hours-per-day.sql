-- =============================================
-- OT HOURS PER DAY - Giờ công chuẩn OT
-- =============================================
-- Thêm cấu hình giờ công chuẩn OT (mặc định 8 giờ)
-- Khác với giờ công chuẩn hành chính (7.5 giờ)
-- Công thức: Lương OT = Lương cơ bản / (Công chuẩn × ot_hours_per_day) × Số giờ OT × Hệ số

-- Tạo bảng cấu hình OT
CREATE TABLE IF NOT EXISTS ot_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value numeric NOT NULL,
  label text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed giờ công chuẩn OT mặc định = 8
INSERT INTO ot_config (key, value, label, description)
VALUES (
  'ot_hours_per_day',
  8,
  'Giờ công chuẩn OT',
  'Số giờ chuẩn để tính lương OT theo giờ. VD: Lương OT/giờ = Lương cơ bản ÷ Công chuẩn ÷ 8'
)
ON CONFLICT (key) DO NOTHING;

-- RLS
ALTER TABLE ot_config ENABLE ROW LEVEL SECURITY;

-- Mọi người đều đọc được
CREATE POLICY "ot_config_select" ON ot_config
  FOR SELECT USING (true);

-- Chỉ HR/Admin mới sửa
CREATE POLICY "ot_config_update" ON ot_config
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.code IN ('hr', 'admin')
    )
  );
