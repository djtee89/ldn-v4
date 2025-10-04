-- Fix PII exposure issues: Add explicit anonymous SELECT blocks to tables containing customer contact information

-- 1. Fix viewing_requests table
-- Currently allows INSERT for anyone but no explicit anonymous SELECT block
CREATE POLICY "Block anonymous read access to viewing_requests"
ON public.viewing_requests
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

-- 2. Fix event_registrations table  
-- Currently has staff-only SELECT but no explicit anonymous SELECT block
CREATE POLICY "Block anonymous read access to event_registrations"
ON public.event_registrations
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

-- Add documentation
COMMENT ON POLICY "Block anonymous read access to viewing_requests" ON public.viewing_requests IS
'Explicitly blocks anonymous users from reading viewing request data containing customer PII. RESTRICTIVE policy ensures no other policy can override this security requirement.';

COMMENT ON POLICY "Block anonymous read access to event_registrations" ON public.event_registrations IS
'Explicitly blocks anonymous users from reading event registration data containing customer PII. RESTRICTIVE policy ensures no other policy can override this security requirement.';