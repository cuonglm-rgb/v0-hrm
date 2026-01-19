-- Run this in your Supabase SQL Editor

ALTER TABLE public.employees 
ADD COLUMN official_date DATE;

-- Optional: Update existing employees to have official_date = join_date if they are active
UPDATE public.employees
SET official_date = join_date
WHERE status = 'active' AND official_date IS NULL;
