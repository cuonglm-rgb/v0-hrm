-- Bảng cấu hình lương (key/value)
create table if not exists payroll_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  description text,
  updated_at timestamptz default now()
);

-- Tỉ lệ lương thử việc mặc định 85%
insert into payroll_settings (key, value, description)
values (
  'probation_salary_rate',
  '0.85'::jsonb,
  'Tỉ lệ lương thử việc áp lên base_salary cho những ngày trước official_date (0.85 = 85%)'
)
on conflict (key) do nothing;
