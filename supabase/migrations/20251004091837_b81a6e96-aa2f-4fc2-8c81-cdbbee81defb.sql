-- Fix bookings table RLS: Only staff should view customer contact information
-- Drop the overly permissive policy that allows any authenticated user to view bookings
DROP POLICY IF EXISTS "Authenticated users can view their own bookings" ON public.bookings;

-- Keep the restrictive policy that blocks anonymous access
-- Keep the staff-only view policy
-- Now ONLY admin and booking_manager roles can view customer contact information

COMMENT ON TABLE public.bookings IS 'Customer booking information with strict access control: Only staff (admin, booking_manager) can view. Regular users cannot view any bookings, even their own, to protect customer PII.';
