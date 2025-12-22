-- =============================================
-- ENABLE RLS
-- =============================================

alter table employees enable row level security;
alter table departments enable row level security;
alter table positions enable row level security;
alter table roles enable row level security;
alter table user_roles enable row level security;

-- =============================================
-- HELPER FUNCTION: Check user role
-- =============================================

create or replace function has_role(required_role text)
returns boolean as $$
begin
  return exists (
    select 1 from user_roles ur
    join roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and r.code = required_role
  );
end;
$$ language plpgsql security definer;

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

-- =============================================
-- EMPLOYEES POLICIES
-- =============================================

-- Employee can view their own record
create policy "employees_select_self"
on employees for select
using (user_id = auth.uid());

-- HR and Admin can view all employees
create policy "employees_select_hr_admin"
on employees for select
using (has_any_role(array['hr', 'admin']));

-- Manager can view employees in their department
create policy "employees_select_manager"
on employees for select
using (
  has_role('manager') and
  department_id in (
    select department_id from user_roles where user_id = auth.uid()
  )
);

-- HR and Admin can insert employees
create policy "employees_insert_hr_admin"
on employees for insert
with check (has_any_role(array['hr', 'admin']));

-- Employee can update their own non-sensitive fields
create policy "employees_update_self"
on employees for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- HR and Admin can update any employee
create policy "employees_update_hr_admin"
on employees for update
using (has_any_role(array['hr', 'admin']));

-- =============================================
-- DEPARTMENTS POLICIES (everyone can read)
-- =============================================

create policy "departments_select_all"
on departments for select
using (true);

create policy "departments_insert_hr_admin"
on departments for insert
with check (has_any_role(array['hr', 'admin']));

create policy "departments_update_hr_admin"
on departments for update
using (has_any_role(array['hr', 'admin']));

-- =============================================
-- POSITIONS POLICIES (everyone can read)
-- =============================================

create policy "positions_select_all"
on positions for select
using (true);

create policy "positions_insert_hr_admin"
on positions for insert
with check (has_any_role(array['hr', 'admin']));

-- =============================================
-- ROLES POLICIES (everyone can read)
-- =============================================

create policy "roles_select_all"
on roles for select
using (true);

-- =============================================
-- USER_ROLES POLICIES
-- =============================================

-- User can view their own roles
create policy "user_roles_select_self"
on user_roles for select
using (user_id = auth.uid());

-- HR and Admin can view all user roles
create policy "user_roles_select_hr_admin"
on user_roles for select
using (has_any_role(array['hr', 'admin']));

-- Only Admin can manage roles
create policy "user_roles_insert_admin"
on user_roles for insert
with check (has_role('admin'));

create policy "user_roles_delete_admin"
on user_roles for delete
using (has_role('admin'));
