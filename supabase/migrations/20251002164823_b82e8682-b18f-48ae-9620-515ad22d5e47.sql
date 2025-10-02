-- Fix bookings table RLS policies to prevent unauthorized access
-- The current policies are all RESTRICTIVE (AND'd together) which is incorrect
-- We need PERMISSIVE policies (OR'd together) for proper access control

-- Drop the problematic and redundant policies
DROP POLICY IF EXISTS "Deny anonymous public access to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Booking managers and admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Booking managers and admins can update all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete all bookings" ON public.bookings;

-- Create proper PERMISSIVE SELECT policies (OR'd together)
-- Policy 1: Users can view ONLY their own bookings
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: Booking managers and admins can view ALL bookings
CREATE POLICY "Booking managers and admins can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'booking_manager'::app_role) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- UPDATE policies: Users can update their own bookings
CREATE POLICY "Users can update their own bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- UPDATE policies: Booking managers and admins can update all bookings
CREATE POLICY "Booking managers and admins can update all bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'booking_manager'::app_role) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- DELETE policies: Users can delete their own bookings
CREATE POLICY "Users can delete their own bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- DELETE policies: Admins can delete all bookings
CREATE POLICY "Admins can delete all bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Keep the existing INSERT policies as they are correct
-- (Anonymous users can submit bookings without user_id)
-- (Authenticated users can submit their own bookings with user_id)