-- Fix anonymous bookings security vulnerability
-- Add explicit protections to prevent unauthorized access to bookings with user_id IS NULL

-- Add RESTRICTIVE policy to explicitly deny SELECT for anonymous users (no auth)
-- This ensures anonymous users cannot read ANY bookings, including anonymous ones
CREATE POLICY "Deny all SELECT for anonymous users"
ON public.bookings
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

-- Add RESTRICTIVE policy to prevent authenticated users from viewing anonymous bookings
-- unless they are booking_manager or admin
-- This closes the gap where user_id IS NULL bookings might be accessible
CREATE POLICY "Restrict anonymous bookings to staff only"
ON public.bookings
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (
  -- Allow if the booking belongs to the user
  (user_id = auth.uid())
  OR
  -- Allow if user is admin or booking_manager
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'booking_manager'::app_role))
);

-- Add comment explaining the security model
COMMENT ON TABLE public.bookings IS 'Customer bookings with PII. Anonymous bookings (user_id IS NULL) can only be viewed by booking_manager or admin roles. Uses RESTRICTIVE policies to explicitly prevent unauthorized access.';