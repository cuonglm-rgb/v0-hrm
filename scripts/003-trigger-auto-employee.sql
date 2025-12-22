-- =============================================
-- TRIGGER: Auto create employee when user signs up
-- =============================================

-- Function to generate employee code
create or replace function generate_employee_code()
returns text as $$
declare
  new_code text;
  code_exists boolean;
begin
  loop
    -- Generate code: NV + YYYYMM + 4 random digits
    new_code := 'NV' || to_char(now(), 'YYYYMM') || lpad(floor(random() * 10000)::text, 4, '0');
    
    -- Check if code exists
    select exists(select 1 from employees where employee_code = new_code) into code_exists;
    
    exit when not code_exists;
  end loop;
  
  return new_code;
end;
$$ language plpgsql;

-- Function to handle new user registration
create or replace function handle_new_user()
returns trigger as $$
declare
  default_role_id uuid;
begin
  -- Create employee record
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

-- Create trigger (drop first if exists)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
