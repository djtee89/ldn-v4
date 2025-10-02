-- Secure bookings table INSERT to prevent data harvesting
-- Remove direct INSERT policies and force all inserts through the protected edge function
-- The edge function has rate limiting, honeypot, validation, and uses service role key

-- Drop the existing INSERT policies that allow direct database inserts
DROP POLICY IF EXISTS "Anonymous users can submit bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can submit their own bookings" ON public.bookings;

-- Add a RESTRICTIVE policy that denies all direct INSERT attempts
-- The edge function uses service role key which bypasses RLS, so it will still work
CREATE POLICY "Block direct inserts - use submit-contact-form function"
ON public.bookings
AS RESTRICTIVE
FOR INSERT
TO public
WITH CHECK (false);

-- Update table comment to document the security model
COMMENT ON TABLE public.bookings IS 'Customer bookings with PII. All inserts must go through the submit-contact-form edge function which enforces rate limiting, honeypot protection, and input validation. Direct inserts are blocked by RLS. SELECT access: users can view their own bookings, admins/booking_managers can view all.';