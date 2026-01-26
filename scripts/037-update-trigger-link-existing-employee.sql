-- =============================================
-- UPDATE TRIGGER: Link existing employee when user signs up
-- =============================================

-- Function to handle new user registration (updated)
create or replace function handle_new_user()
returns trigger as $$
declare
  default_role_id uuid;
  existing_employee_id uuid;
begin
  -- Check if employee with this email already exists (pre-imported)
  select id into existing_employee_id 
  from employees 
  where email = new.email and user_id is null;

  if existing_employee_id is not null then
    -- Link existing employee to this user
    update employees 
    set 
      user_id = new.id,
      avatar_url = coalesce(avatar_url, new.raw_user_meta_data->>'avatar_url'),
      updated_at = now()
    where id = existing_employee_id;
  else
    -- Create new employee record
    insert into employees (
      user_id,
      employee_code,
      full_name,
      email,
      avatar_url,
      status
    )
    values (
      new.id,
      generate_employee_code(),
      coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
      new.email,
      new.raw_user_meta_data->>'avatar_url',
      'onboarding'
    );
  end if;

  -- Get default employee role
  select id into default_role_id from roles where code = 'employee';
  
  -- Assign default employee role
  if default_role_id is not null then
    insert into user_roles (user_id, role_id)
    values (new.id, default_role_id);
  end if;

  return new;
end;
$$ language plpgsql security definer;
