-- Add cancellation fields to employee_requests table
-- Allows HR/Admin to cancel approved requests

-- First, drop the existing status check constraint
ALTER TABLE employee_requests DROP CONSTRAINT IF EXISTS employee_requests_status_check;

-- Add the new columns if they don't exist
ALTER TABLE employee_requests
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cancelled_by UUID,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Clean up any invalid data in cancelled_by (set to NULL if not a valid employee_id)
UPDATE employee_requests
SET cancelled_by = NULL
WHERE cancelled_by IS NOT NULL 
  AND cancelled_by NOT IN (SELECT id FROM employees);

-- Drop existing foreign key constraint if exists
ALTER TABLE employee_requests
DROP CONSTRAINT IF EXISTS employee_requests_cancelled_by_fkey;

-- Add foreign key constraint with explicit name
ALTER TABLE employee_requests
ADD CONSTRAINT employee_requests_cancelled_by_fkey 
FOREIGN KEY (cancelled_by) REFERENCES employees(id);

-- Re-create the status check constraint with 'cancelled' included
ALTER TABLE employee_requests
ADD CONSTRAINT employee_requests_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled'));

-- Add comments
COMMENT ON COLUMN employee_requests.cancelled_at IS 'Timestamp when the request was cancelled';
COMMENT ON COLUMN employee_requests.cancelled_by IS 'Employee ID who cancelled the request';
COMMENT ON COLUMN employee_requests.cancellation_reason IS 'Reason for cancelling the request';
