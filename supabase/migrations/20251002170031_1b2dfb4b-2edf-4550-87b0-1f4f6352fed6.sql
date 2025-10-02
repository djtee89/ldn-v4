-- Clean up bookings RLS policies to remove conflicting security posture
-- Remove redundant RESTRICTIVE policies and use clear PERMISSIVE policies only
-- RLS default deny behavior will block anonymous access without needing explicit false policies

-- Drop all existing SELECT policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Booking managers and admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Deny all SELECT for anonymous users" ON public.bookings;
DROP POLICY IF EXISTS "Restrict anonymous bookings to staff only" ON public.bookings;

-- Create clean PERMISSIVE SELECT policies (OR'd together)
-- Policy 1: Users can view their own bookings
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: Admins and booking managers can view ALL bookings (including anonymous ones)
CREATE POLICY "Staff can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'booking_manager'::app_role)
);

-- No policies for anon role = default deny for anonymous users
-- This is cleaner than explicit false RESTRICTIVE policies

COMMENT ON TABLE public.bookings IS 'Customer bookings with PII. All inserts must go through the submit-contact-form edge function which enforces rate limiting, honeypot protection, and input validation. Direct inserts are blocked by RLS. SELECT access: authenticated users can view their own bookings OR admins/booking_managers can view all. Anonymous users have no access (default deny).';