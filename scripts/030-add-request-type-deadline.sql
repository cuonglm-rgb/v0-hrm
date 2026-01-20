-- Add submission_deadline column to request_types table
-- submission_deadline: integer, nullable. 
-- Value is the number of days allowed to submit a request after the event happens.
-- Example: 3 means the request must be submitted within 3 days after the 'from_date' or 'request_date'.

ALTER TABLE request_types 
ADD COLUMN submission_deadline integer DEFAULT NULL;

COMMENT ON COLUMN request_types.submission_deadline IS 'Số ngày tối đa cho phép tạo phiếu sau khi sự việc xảy ra. NULL là không giới hạn.';
