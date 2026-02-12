-- Restrict user registration to @pamoteam.com domain only
-- This trigger will prevent users with non-pamoteam.com emails from being created

CREATE OR REPLACE FUNCTION check_email_domain()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if email ends with @pamoteam.com
  IF NEW.email NOT ILIKE '%@pamoteam.com' THEN
    RAISE EXCEPTION 'Only @pamoteam.com email addresses are allowed'
      USING HINT = 'Please use your company email address';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS enforce_email_domain ON auth.users;
CREATE TRIGGER enforce_email_domain
  BEFORE INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION check_email_domain();

-- Note: This requires superuser access to auth schema
-- If you get permission errors, use the callback validation method instead
