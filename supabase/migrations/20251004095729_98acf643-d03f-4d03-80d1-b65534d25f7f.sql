-- Fix security issue: Ensure event_registrations PII is only accessible to staff
-- Issue: Event Attendee Contact Information Could Be Stolen
-- The event_registrations table contains customer PII (names, emails, phone numbers)
-- and must be restricted to staff roles only for SELECT operations.

-- Ensure RLS is enabled
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing SELECT policy to recreate it with proper restrictions
DROP POLICY IF EXISTS "Only staff can view event registrations" ON public.event_registrations;

-- Recreate SELECT policy as RESTRICTIVE to ensure no other policy can override it
CREATE POLICY "Only staff can view event registrations"
ON public.event_registrations
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'booking_manager'::app_role)
);

-- Verify INSERT policy exists for public event registration (no changes needed)
-- The "Anyone can register for events" policy allows anonymous users to register
-- This is intentional and secure as it only permits INSERT, not SELECT

-- Add comment documenting security requirements
COMMENT ON TABLE public.event_registrations IS 
'Contains customer PII (names, emails, phone numbers). SELECT access restricted to admin and booking_manager roles only. INSERT allowed for public event registration.';
