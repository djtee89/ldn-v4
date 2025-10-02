-- Fix user_roles table RLS to prevent privilege escalation
-- Current policy has circular dependency causing infinite recursion
-- Need explicit policies using security definer function

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- SELECT: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- SELECT: Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- INSERT: ONLY admins can create new role assignments
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- UPDATE: ONLY admins can modify role assignments
CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- DELETE: ONLY admins can remove role assignments
CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add comment explaining the security model
COMMENT ON TABLE public.user_roles IS 'User role assignments. Only admins can modify. Uses security definer function has_role() to prevent circular RLS dependencies.';