-- =============================================
-- UPDATE TRIGGER: Link existing employee when user signs up
-- =============================================

-- Function to handle new user registration (updated with better error handling)
create or replace function handle_new_user()
returns trigger as $$
declare
  default_role_id uuid;
  existing_employee_id uuid;
begin
  -- Check if employee with this email already exists (pre-imported)
  begin
    select id into existing_employee_id 
    from employees 
    where lower(email) = lower(new.email) and user_id is null
    limit 1;
  exception when others then
    existing_employee_id := null;
  end;

  if existing_employee_id is not null then
    -- Link existing employee to this user
    begin
      update employees 
      set 
        user_id = new.id,
        avatar_url = coalesce(avatar_url, new.raw_user_meta_data->>'avatar_url'),
        updated_at = now()
      where id = existing_employee_id;
      
      raise notice 'Linked existing employee % to user %', existing_employee_id, new.id;
    exception when others then
      raise warning 'Failed to link existing employee: %', SQLERRM;
    end;
  else
    -- Create new employee record
    begin
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
        coalesce(
          new.raw_user_meta_data->>'full_name', 
          new.raw_user_meta_data->>'name', 
          split_part(new.email, '@', 1)
        ),
        new.email,
        new.raw_user_meta_data->>'avatar_url',
        'onboarding'
      );
      
      raise notice 'Created new employee for user %', new.id;
    exception when others then
      raise warning 'Failed to create employee: %', SQLERRM;
    end;
  end if;

  -- Get default employee role
  begin
    select id into default_role_id from roles where code = 'employee' limit 1;
    
    -- Assign default employee role
    if default_role_id is not null then
      insert into user_roles (user_id, role_id)
      values (new.id, default_role_id)
      on conflict (user_id, role_id) do nothing;
      
      raise notice 'Assigned employee role to user %', new.id;
    end if;
  exception when others then
    raise warning 'Failed to assign role: %', SQLERRM;
  end;

  -- Always return new to allow authentication to proceed
  return new;
exception when others then
  -- Log error but don't block authentication
  raise warning 'Error in handle_new_user trigger: %', SQLERRM;
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger to ensure it uses the updated function
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Verify trigger is created
select 
  tgname as trigger_name,
  tgenabled as enabled,
  'Trigger updated successfully' as status
from pg_trigger
where tgname = 'on_auth_user_created';
