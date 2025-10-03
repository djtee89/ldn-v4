-- Add explicit restrictive policy to prevent anonymous users from reading bookings
-- This addresses security concern about potential PII exposure in the bookings table

-- First, drop the existing permissive SELECT policies
DROP POLICY IF EXISTS "Staff can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can only view own bookings" ON public.bookings;

-- Create a RESTRICTIVE policy that explicitly blocks anonymous users from reading bookings
-- This policy MUST pass (in addition to any permissive policies) for SELECT operations
-- RESTRICTIVE policies cannot be bypassed - they use AND logic
ALTER TABLE public.bookings FORCE ROW LEVEL SECURITY;

CREATE POLICY "Block anonymous users from viewing bookings"
  ON public.bookings
  AS RESTRICTIVE
  FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

-- Recreate the permissive policies with better documentation
-- These use OR logic - if either one allows access, the SELECT is permitted
-- But they still must satisfy the RESTRICTIVE policy above
CREATE POLICY "Authenticated staff can view all bookings"
  ON public.bookings
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'booking_manager'::app_role)
  );

CREATE POLICY "Authenticated users can view their own bookings"
  ON public.bookings
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Add documentation to explain the security model
COMMENT ON TABLE public.bookings IS 
  'Contains customer booking requests with PII (name, email, phone). 
   Multi-layered RLS policies ensure:
   1. RESTRICTIVE policy: auth.uid() MUST NOT be NULL (blocks all anonymous reads)
   2. PERMISSIVE policies: User must be staff OR viewing their own booking
   Result: Anonymous users absolutely CANNOT read bookings, even with direct SQL access.
   Anonymous users CAN still create bookings via INSERT policies.';

COMMENT ON COLUMN public.bookings.user_id IS 
  'User who created the booking. NULL for anonymous form submissions. 
   NULL user_id bookings are only readable by staff, never by the anonymous creator.';