-- =============================================
-- PHASE 1: CORE HR TABLES
-- =============================================

-- 1. Departments table (cơ cấu tổ chức)
create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique,
  parent_id uuid references departments(id),
  created_at timestamptz default now()
);

-- 2. Positions table (vị trí công việc)
create table if not exists positions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level int default 1,
  created_at timestamptz default now()
);

-- 3. Roles table (phân quyền)
create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  created_at timestamptz default now()
);

-- 4. Employees table (nhân sự)
create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  employee_code text unique,
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  department_id uuid references departments(id),
  position_id uuid references positions(id),
  manager_id uuid references employees(id),
  join_date date,
  status text default 'onboarding' check (status in ('onboarding', 'active', 'resigned')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. User Roles junction table (1 user có thể có nhiều roles)
create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references roles(id) on delete cascade,
  department_id uuid references departments(id), -- for manager role scoping
  created_at timestamptz default now(),
  unique(user_id, role_id)
);

-- =============================================
-- INDEXES for performance
-- =============================================
create index if not exists idx_employees_user_id on employees(user_id);
create index if not exists idx_employees_department_id on employees(department_id);
create index if not exists idx_employees_status on employees(status);
create index if not exists idx_user_roles_user_id on user_roles(user_id);
create index if not exists idx_departments_parent_id on departments(parent_id);
