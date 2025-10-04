-- Fix developments_public view access for mobile (point A/F)
-- Views don't support RLS - they rely on GRANTs and underlying table policies

-- Ensure the view is accessible to anon and authenticated roles
GRANT SELECT ON public.developments_public TO anon;
GRANT SELECT ON public.developments_public TO authenticated;

-- Also ensure the underlying developments table grants are set
GRANT SELECT ON public.developments TO anon;
GRANT SELECT ON public.developments TO authenticated;