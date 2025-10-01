-- Drop existing policies that reference non-existent 'staff' role
DROP POLICY IF EXISTS "Users can view own bookings, staff view all" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can submit bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users update own, staff update all" ON public.bookings;
DROP POLICY IF EXISTS "Users delete own, admins delete all" ON public.bookings;

-- CREATE IMPROVED RLS POLICIES WITH PROPER ROLES AND STRICTER ACCESS CONTROL

-- SELECT: Users can view their own bookings, only admins and booking_managers can view all
CREATE POLICY "Users view own, booking managers view all"
ON public.bookings FOR SELECT
USING (
  -- Users can view their own bookings (authenticated users only)
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Admins and booking managers can view all bookings for support
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'booking_manager'::app_role))
);

-- INSERT: Allow public submissions but with strict validation
CREATE POLICY "Public can submit bookings with validation"
ON public.bookings FOR INSERT
WITH CHECK (
  -- Anonymous users can only insert with user_id = null
  (auth.uid() IS NULL AND user_id IS NULL)
  OR
  -- Authenticated users must use their own user_id
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

-- UPDATE: Only the booking owner or authorized personnel can update
CREATE POLICY "Users update own, booking managers update all"
ON public.bookings FOR UPDATE
USING (
  -- Users can update their own bookings
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Admins and booking managers can update for processing
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'booking_manager'::app_role))
)
WITH CHECK (
  -- Prevent changing ownership
  (auth.uid() = user_id)
  OR
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'booking_manager'::app_role))
);

-- DELETE: Only booking owners or admins can delete (not booking_managers)
CREATE POLICY "Users delete own, admins delete all"
ON public.bookings FOR DELETE
USING (
  -- Users can delete their own bookings
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Only admins can delete any booking
  has_role(auth.uid(), 'admin'::app_role)
);

-- Update table comment with security documentation
COMMENT ON TABLE public.bookings IS 
'Contains sensitive customer PII (names, emails, phone numbers). 
Security model:
- Anonymous users: Can INSERT bookings with user_id=null (for contact forms)
- Authenticated users: Can view/update/delete ONLY their own bookings
- booking_manager role: Can view/update all bookings for customer support
- admin role: Full access including delete operations
IMPORTANT: Application should implement audit logging for all access to this table.';

-- Add a comment on the user_id column to explain its security significance
COMMENT ON COLUMN public.bookings.user_id IS 
'Links booking to authenticated user. NULL indicates anonymous submission. 
SECURITY: This field is critical for RLS policies - never allow users to change this field after creation.';