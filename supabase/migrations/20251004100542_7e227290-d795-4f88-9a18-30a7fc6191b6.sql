-- Add explicit policy to block anonymous SELECT on bookings table
-- This is technically redundant (RLS denies by default when no policy matches),
-- but makes the security model explicit and satisfies security scanners

-- Create a restrictive policy that explicitly blocks anonymous SELECT
CREATE POLICY "Block anonymous read access to bookings"
ON public.bookings
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

-- Add documentation
COMMENT ON POLICY "Block anonymous read access to bookings" ON public.bookings IS
'Explicitly blocks anonymous users from reading bookings data. This policy is RESTRICTIVE, meaning it works in conjunction with other policies to ensure anonymous users can never SELECT, even if other policies would allow it.';