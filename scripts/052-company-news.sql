-- =============================================
-- SCRIPT 052: COMPANY NEWS (Tin tức công ty)
-- Bảng tin tức nội bộ hiển thị trên trang chủ dashboard
-- =============================================

CREATE TABLE IF NOT EXISTS company_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  author_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_company_news_published ON company_news(is_published, published_at DESC);

-- RLS
ALTER TABLE company_news ENABLE ROW LEVEL SECURITY;

-- Ai cũng đọc được tin đã publish; HR/Admin đọc được tất cả (kể cả nháp)
CREATE POLICY "company_news_select" ON company_news
  FOR SELECT USING (
    is_published = true
    OR EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.code IN ('admin', 'hr')
    )
  );

-- Chỉ HR/Admin được thêm/sửa/xóa
CREATE POLICY "company_news_admin" ON company_news
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.code IN ('admin', 'hr')
    )
  );

-- Trigger cập nhật updated_at (dùng lại hàm update_request_types_timestamp từ script 018)
CREATE TRIGGER trigger_company_news_updated
  BEFORE UPDATE ON company_news
  FOR EACH ROW EXECUTE FUNCTION update_request_types_timestamp();
