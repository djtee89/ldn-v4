-- Drop existing policies on bookings table
DROP POLICY IF EXISTS "Admin and staff can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin and staff can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Public can create bookings" ON public.bookings;

-- Create new explicit PERMISSIVE policies (default behavior, clearer security model)

-- SELECT: Only authenticated admin/staff can view customer data
CREATE POLICY "Only admin and staff can view bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'staff'::app_role)
);

-- UPDATE: Only authenticated admin/staff can update bookings
CREATE POLICY "Only admin and staff can update bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'staff'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'staff'::app_role)
);

-- DELETE: Only authenticated admins can delete bookings
CREATE POLICY "Only admins can delete bookings"
ON public.bookings FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- INSERT: Public can create bookings (for contact/booking forms)
-- Note: This is intentionally public to allow form submissions
CREATE POLICY "Anyone can submit bookings"
ON public.bookings FOR INSERT
WITH CHECK (true);

-- Add comment explaining the security model
COMMENT ON TABLE public.bookings IS 'Contains sensitive customer PII. RLS enforced: public can only INSERT (submit forms), only admin/staff can view/update, only admins can delete.';