-- Fix critical security issue: Customer Contact Information Exposed to Anonymous Users
-- Issue: The 'Block anonymous users from viewing bookings' policy allows ANY authenticated user
-- to view all booking records, exposing customer PII to potential attackers.
-- Solution: Remove the permissive policy and add a policy for users to see only their own bookings.

-- Drop the problematic policy that allows all authenticated users to view all bookings
DROP POLICY IF EXISTS "Block anonymous users from viewing bookings" ON public.bookings;

-- Add policy for authenticated users to view ONLY their own bookings
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- The existing "Authenticated staff can view all bookings" policy remains in place
-- This ensures:
-- 1. Staff (admin/booking_manager) can view all bookings
-- 2. Regular authenticated users can only see their own bookings (where user_id matches)
-- 3. Anonymous users cannot view any bookings
-- 4. Anonymous bookings (user_id IS NULL) are only visible to staff

-- Add comment documenting the security model
COMMENT ON TABLE public.bookings IS 
'Contains customer PII (names, emails, phone numbers). SELECT access: staff can view all, users can view only their own bookings (matched by user_id). Anonymous bookings are staff-only visible.';