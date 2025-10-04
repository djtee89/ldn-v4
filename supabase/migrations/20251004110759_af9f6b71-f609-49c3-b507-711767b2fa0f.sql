-- Security fix: Align anonymous access to developments table with developments_public view
-- This ensures consistent behavior and proper access control

-- Drop and recreate the anonymous access policy to match the view filter
DROP POLICY IF EXISTS "Anonymous users can view public developments" ON public.developments;

CREATE POLICY "Anonymous users can view published developments"
ON public.developments
FOR SELECT
TO anon
USING (
  status IN (
    'Available',
    'Coming Soon',
    'Nearly Sold Out',
    'Phased Completion',
    'Under Construction',
    'Complete',
    'Final Phase'
  )
);

-- Also ensure authenticated users policy is clear
DROP POLICY IF EXISTS "Authenticated users can view all development details" ON public.developments;

CREATE POLICY "Authenticated users view all developments"
ON public.developments
FOR SELECT
TO authenticated
USING (true);

-- Document the security model:
-- 1. developments_public VIEW filters to public-safe statuses
-- 2. View uses security_invoker=true (runs with user's permissions)
-- 3. Anonymous users hit the RLS policy above (only sees public statuses)
-- 4. Authenticated users see ALL developments (including draft/private ones)
-- 5. Admins can modify via separate admin policy