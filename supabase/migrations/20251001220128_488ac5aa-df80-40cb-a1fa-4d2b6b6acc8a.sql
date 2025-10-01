-- Add user_id column to bookings table (nullable to allow anonymous submissions)
ALTER TABLE public.bookings 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add index for performance on user_id lookups
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);

-- Drop existing policies
DROP POLICY IF EXISTS "Only admin and staff can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Only admin and staff can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Only admins can delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can submit bookings" ON public.bookings;

-- New comprehensive RLS policies with user segregation

-- SELECT: Users can view their own bookings, admin/staff can view all
CREATE POLICY "Users can view own bookings, staff view all"
ON public.bookings FOR SELECT
USING (
  -- User can see their own bookings
  (auth.uid() = user_id) 
  OR 
  -- Admin/staff can see all bookings
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role))
);

-- INSERT: Anyone can create bookings, authenticated users auto-set user_id
CREATE POLICY "Anyone can submit bookings"
ON public.bookings FOR INSERT
WITH CHECK (
  -- If authenticated, must use own user_id or null
  (auth.uid() IS NULL OR user_id IS NULL OR user_id = auth.uid())
);

-- UPDATE: Users can update their own bookings, staff can update any
CREATE POLICY "Users update own, staff update all"
ON public.bookings FOR UPDATE
USING (
  (auth.uid() = user_id) 
  OR 
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role))
)
WITH CHECK (
  (auth.uid() = user_id) 
  OR 
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role))
);

-- DELETE: Users can delete their own bookings, admins can delete any
CREATE POLICY "Users delete own, admins delete all"
ON public.bookings FOR DELETE
USING (
  (auth.uid() = user_id) 
  OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Update table comment with new security model
COMMENT ON TABLE public.bookings IS 'Contains customer PII with user segregation. RLS enforced: authenticated users can view/manage their own bookings, anonymous users can submit bookings (user_id=null), admin/staff have full access to all bookings for support purposes.';