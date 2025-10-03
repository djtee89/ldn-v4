-- Fix: Restrict event_registrations access to authorized staff only
-- This prevents unauthorized harvesting of attendee contact information

-- Drop the overly permissive policy that allows any authenticated user to view registrations
DROP POLICY IF EXISTS "Authenticated users can view registrations" ON public.event_registrations;

-- Create a restrictive policy that only allows staff to view event registrations
CREATE POLICY "Only staff can view event registrations"
ON public.event_registrations
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'booking_manager'::app_role)
);

-- Add comment explaining the security model
COMMENT ON TABLE public.event_registrations IS 
'Contains event attendee contact information with strict RLS policies.
Access control:
- Anyone (anonymous or authenticated) can register for events (INSERT)
- Only admin and booking_manager roles can view registrations (SELECT)
- No UPDATE or DELETE operations allowed to maintain audit trail
- Protects attendee PII from unauthorized access';

-- Verify RLS is enabled
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;