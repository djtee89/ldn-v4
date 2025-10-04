-- Fix critical security issue: Configuration Data Could Be Modified by Any Logged-In User
-- Issue: The 'nearby_categories' table allows ANY authenticated user to INSERT/UPDATE/DELETE
-- category configurations, which could break the application's nearby places feature.
-- Solution: Restrict management operations to admin users only, keep SELECT for public.

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can manage nearby categories" ON public.nearby_categories;

-- Add restrictive policies: Only admins can manage categories
CREATE POLICY "Only admins can insert nearby categories"
ON public.nearby_categories
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update nearby categories"
ON public.nearby_categories
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete nearby categories"
ON public.nearby_categories
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- The existing "Anyone can view nearby categories" SELECT policy remains unchanged
-- This allows the public UI to display available nearby categories

-- Add comment documenting the security model
COMMENT ON TABLE public.nearby_categories IS 
'Contains application configuration for nearby place categories. SELECT access is public for UI display. INSERT/UPDATE/DELETE operations restricted to admin role only to prevent unauthorized modification of application behavior.';