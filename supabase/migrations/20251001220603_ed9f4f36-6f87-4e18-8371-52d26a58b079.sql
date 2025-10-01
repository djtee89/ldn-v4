-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own bookings, staff view all" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can submit bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users update own, staff update all" ON public.bookings;
DROP POLICY IF EXISTS "Users delete own, admins delete all" ON public.bookings;

-- STRICT RLS POLICIES FOR CUSTOMER PII PROTECTION
-- Using existing roles: admin (full access), staff (customer support), user (regular users)

-- SELECT: Strict user segregation - users can only see their own bookings
CREATE POLICY "Users view own only, staff view all for support"
ON public.bookings FOR SELECT
USING (
  -- Authenticated users can ONLY view their own bookings (not others')
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Staff and admins can view all bookings for customer support purposes
  -- NOTE: Staff role should only be assigned to authorized customer support personnel
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role))
);

-- INSERT: Prevent user_id spoofing while allowing public submissions
CREATE POLICY "Strict user_id validation on insert"
ON public.bookings FOR INSERT
WITH CHECK (
  -- Anonymous users can ONLY insert with user_id = null (cannot impersonate)
  (auth.uid() IS NULL AND user_id IS NULL)
  OR
  -- Authenticated users MUST use their own user_id (cannot insert as others)
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

-- UPDATE: Users can only update their own data, staff can update for processing
CREATE POLICY "Users update own only, staff update for processing"
ON public.bookings FOR UPDATE
USING (
  -- Users can update their own bookings if authenticated
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- Staff and admins can update bookings for status changes, etc.
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role))
)
WITH CHECK (
  -- Prevent changing user_id (even by staff) to prevent ownership changes
  (user_id IS NOT DISTINCT FROM (SELECT user_id FROM public.bookings WHERE id = bookings.id))
  OR
  -- Admin override for emergency situations
  has_role(auth.uid(), 'admin'::app_role)
);

-- DELETE: Very restricted - only owners or admins (NOT staff for extra security)
CREATE POLICY "Users delete own, only admins delete others"
ON public.bookings FOR DELETE
USING (
  -- Users can delete their own bookings
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- ONLY admins can delete any booking (not staff - prevents accidental deletion)
  has_role(auth.uid(), 'admin'::app_role)
);

-- Comprehensive security documentation
COMMENT ON TABLE public.bookings IS 
'⚠️  CONTAINS HIGHLY SENSITIVE PII
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Data: Names, email addresses, phone numbers, booking preferences

SECURITY ACCESS MODEL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 Anonymous (Unauthenticated):
   ✓ Can submit new bookings (user_id=NULL)
   ✗ Cannot view ANY bookings
   ✗ Cannot modify or delete

👤 Regular Users (Authenticated):
   ✓ View ONLY their own bookings
   ✓ Update ONLY their own bookings  
   ✓ Delete ONLY their own bookings
   ✗ Cannot access other users'' data (strict segregation)
   ✗ Cannot change user_id after creation

👔 Staff (Customer Support):
   ✓ View ALL bookings (for support)
   ✓ Update ALL bookings (for processing)
   ✗ Cannot delete bookings
   ✗ Cannot change user_id ownership
   ⚠️  IMPORTANT: Only assign to authorized support personnel

🔐 Admin (System Administrators):
   ✓ FULL ACCESS to all operations
   ✓ Can delete bookings
   ✓ Emergency override for user_id changes
   ⚠️  CRITICAL: Minimum necessary access principle

SECURITY REQUIREMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 🔍 Audit Logging: ALL staff/admin access MUST be logged
2. 🔒 Role Assignment: Staff role only for authorized personnel
3. 📊 Access Monitoring: Regular review of who has staff/admin roles
4. 🚨 Incident Response: Plan for handling unauthorized access
5. ⏱️  Data Retention: Define PII retention and deletion policies

ANTI-SPOOFING PROTECTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ user_id cannot be changed after creation (prevents identity theft)
✓ Authenticated users cannot insert with others'' user_ids
✓ Anonymous users cannot insert with any user_id
✓ Regular users completely isolated from each other';

-- Document the critical user_id security field
COMMENT ON COLUMN public.bookings.user_id IS 
'🔐 SECURITY-CRITICAL FIELD - PRIMARY ACCESS CONTROL BOUNDARY

PURPOSE: Links booking to authenticated user OR marks as anonymous

SECURITY RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. IMMUTABLE: Cannot be changed after creation (prevents impersonation)
2. AUTHENTICATED: Must match auth.uid() for logged-in users
3. ANONYMOUS: Must be NULL for unauthenticated submissions
4. VALIDATION: RLS policies enforce strict user_id validation
5. ACCESS CONTROL: This field determines who can see the booking

THREAT MODEL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ PREVENTS: User A viewing/modifying User B''s bookings
❌ PREVENTS: Anonymous users claiming bookings as theirs  
❌ PREVENTS: Authenticated users inserting as other users
✓ ALLOWS: Staff/admin access for legitimate support needs';

-- Ensure index exists for performance (RLS queries use this heavily)
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);