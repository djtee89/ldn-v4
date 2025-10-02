-- Lock down bookings table with strict RLS policies
-- This migration ensures customer PII cannot be read by the public

-- Drop all existing policies first
DROP POLICY IF EXISTS "Anonymous users can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can insert their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Staff can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Only staff can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Only staff can delete bookings" ON public.bookings;

-- INSERT Policies: Allow public submission but restrict which fields can be set
-- Anonymous users can insert bookings (user_id must be NULL, status will default to 'pending')
CREATE POLICY "Anonymous users can insert bookings"
ON public.bookings
FOR INSERT
WITH CHECK (
  user_id IS NULL
  AND status = 'pending'
);

-- Authenticated users can insert their own bookings (user_id auto-set to auth.uid())
CREATE POLICY "Authenticated users can insert their own bookings"
ON public.bookings
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND status = 'pending'
);

-- SELECT Policies: Strict read access control
-- Authenticated users can only read their own bookings
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
USING (
  auth.role() = 'authenticated'
  AND user_id = auth.uid()
);

-- Staff (admin/booking_manager) can read all bookings
CREATE POLICY "Staff can view all bookings"
ON public.bookings
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'booking_manager'::app_role)
);

-- UPDATE Policy: Staff only
CREATE POLICY "Only staff can update bookings"
ON public.bookings
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'booking_manager'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'booking_manager'::app_role)
);

-- DELETE Policy: Staff only
CREATE POLICY "Only staff can delete bookings"
ON public.bookings
FOR DELETE
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'booking_manager'::app_role)
);

-- Add table comment for security documentation
COMMENT ON TABLE public.bookings IS 'Customer booking data with strict RLS. Anonymous users can INSERT only. SELECT restricted to staff (all rows) and authenticated users (own rows only). UPDATE/DELETE staff only.';