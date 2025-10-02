-- Lockdown bookings table to prevent PII leaks while allowing legitimate inserts
-- INSERT: allowed for public (anon & authenticated), user_id auto-set when authenticated
-- SELECT: staff sees all, authenticated users see only their own, anon sees nothing
-- UPDATE/DELETE: staff only

-- ============= DROP ALL EXISTING POLICIES =============
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Staff can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Booking managers and admins can update all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Block direct inserts - use submit-contact-form function" ON public.bookings;

-- ============= INSERT POLICIES =============
-- Allow anonymous inserts (user_id will be NULL)
CREATE POLICY "Anonymous users can insert bookings"
ON public.bookings
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Allow authenticated inserts with auto-set user_id
CREATE POLICY "Authenticated users can insert their own bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- ============= SELECT POLICIES =============
-- Anonymous users cannot SELECT anything (default deny + explicit)
-- (No policy for anon = denied by default)

-- Authenticated users can only SELECT their own bookings
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Staff (admin/manager) can SELECT all bookings including anonymous ones
CREATE POLICY "Staff can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'booking_manager'::app_role)
);

-- ============= UPDATE POLICIES - STAFF ONLY =============
CREATE POLICY "Only staff can update bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'booking_manager'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'booking_manager'::app_role)
);

-- ============= DELETE POLICIES - STAFF ONLY =============
CREATE POLICY "Only staff can delete bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'booking_manager'::app_role)
);

-- Update table documentation
COMMENT ON TABLE public.bookings IS 'Customer bookings with PII. INSERT: allowed for all (anon sets user_id=NULL, auth auto-sets user_id=auth.uid()). SELECT: anon denied, authenticated users see only their own (user_id=auth.uid()), staff see all. UPDATE/DELETE: staff only. Validated via submit-contact-form edge function.';