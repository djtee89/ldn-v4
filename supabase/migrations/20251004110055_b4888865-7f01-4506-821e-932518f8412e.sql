-- Security fix for bookings table: Ensure anonymous users cannot read any bookings
-- Current policies are secure but we'll make them more explicit

-- First, verify the RLS is enabled (it should be)
-- No action needed, already enabled

-- Add an explicit RESTRICTIVE policy to absolutely block anonymous SELECT
-- This works together with PERMISSIVE policies to require both conditions
DROP POLICY IF EXISTS "Block anonymous read access to bookings" ON public.bookings;

CREATE POLICY "Absolutely no anonymous reads on bookings"
ON public.bookings
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

-- Ensure authenticated users can only see bookings where they're the owner
-- Keep existing policy but make it more explicit
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

CREATE POLICY "Authenticated users view own bookings only"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  user_id IS NOT NULL 
  AND user_id = auth.uid()
);

-- The staff policy is already good, but let's recreate it for clarity
DROP POLICY IF EXISTS "Authenticated staff can view all bookings" ON public.bookings;

CREATE POLICY "Staff can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'booking_manager'::app_role)
);

-- Also ensure anonymous users can only INSERT their own bookings with NULL user_id
-- and cannot set arbitrary user_ids
DROP POLICY IF EXISTS "Anonymous users can create bookings" ON public.bookings;

CREATE POLICY "Anonymous users create bookings with null user_id"
ON public.bookings
FOR INSERT
TO anon
WITH CHECK (
  user_id IS NULL 
  AND status = 'pending'::text
);

-- Authenticated users can only create bookings with their own user_id
DROP POLICY IF EXISTS "Authenticated users can create own bookings" ON public.bookings;

CREATE POLICY "Authenticated users create own bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  AND status = 'pending'::text
);