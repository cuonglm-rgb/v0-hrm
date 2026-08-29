-- =============================================
-- 055: Lịch thứ 7 mặc định của công ty (cấu hình được ở Settings)
-- =============================================
-- Dùng lại bảng key/value payroll_settings (xem supabase/migrations/add_payroll_settings.sql).
-- Giá trị mặc định giữ nguyên quy luật đang chạy: thứ 7 ngày 10/01/2026 là ngày NGHỈ,
-- các thứ 7 còn lại xen kẽ từ mốc đó.

create table if not exists payroll_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  description text,
  updated_at timestamptz default now()
);

insert into payroll_settings (key, value, description)
values (
  'saturday_default_schedule',
  jsonb_build_object(
    'mode', 'alternating',
    'anchor_date', '2026-01-10',
    'anchor_is_working', false,
    'unassigned_saturday_is_off', false
  ),
  'Lịch thứ 7 mặc định của công ty (xen kẽ / làm tất cả / nghỉ tất cả)'
)
on conflict (key) do nothing;

-- =============================================
-- RLS cho payroll_settings
-- =============================================
-- Bảng này được tạo ở supabase/migrations/add_payroll_settings.sql mà KHÔNG kèm policy nào,
-- nên khi RLS bật thì mọi INSERT/UPDATE đều bị chặn:
--   "new row violates row-level security policy for table payroll_settings"
-- Đọc: mọi user đã đăng nhập (payroll/chấm công cần đọc config này).
-- Ghi: chỉ hr | admin — khớp với check trong updateSaturdayDefaultConfig / updateProbationSalaryRate.

alter table payroll_settings enable row level security;

-- has_any_role là SECURITY DEFINER (scripts/004-rls-policies.sql) nên không đụng RLS của
-- user_roles → tránh đệ quy policy. Tạo lại ở đây để script chạy độc lập được.
create or replace function has_any_role(required_roles text[])
returns boolean as $$
begin
  return exists (
    select 1 from user_roles ur
    join roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and r.code = any(required_roles)
  );
end;
$$ language plpgsql security definer;

drop policy if exists "payroll_settings_select_authenticated" on payroll_settings;
create policy "payroll_settings_select_authenticated"
on payroll_settings for select
to authenticated
using (true);

drop policy if exists "payroll_settings_insert_hr_admin" on payroll_settings;
create policy "payroll_settings_insert_hr_admin"
on payroll_settings for insert
to authenticated
with check (has_any_role(array['hr', 'admin']));

drop policy if exists "payroll_settings_update_hr_admin" on payroll_settings;
create policy "payroll_settings_update_hr_admin"
on payroll_settings for update
to authenticated
using (has_any_role(array['hr', 'admin']))
with check (has_any_role(array['hr', 'admin']));
