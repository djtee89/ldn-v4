
-- Fix: Remove SECURITY DEFINER from developments_public view
-- This ensures the view respects the querying user's RLS policies

-- Drop the existing view with SECURITY DEFINER
DROP VIEW IF EXISTS public.developments_public;

-- Recreate the view with SECURITY INVOKER (default, safer)
CREATE VIEW public.developments_public
WITH (security_invoker = true)
AS
SELECT 
  id,
  name,
  developer,
  location,
  postcode,
  borough,
  zone,
  tenure,
  summary,
  lat,
  lng,
  status,
  completion_date,
  amenities,
  images,
  images_count,
  units_count,
  prices,
  stations,
  nearby_stations,
  schools,
  created_at,
  updated_at
FROM public.developments
WHERE status IN ('Available', 'Coming Soon', 'Nearly Sold Out');

-- Grant appropriate access to the view
GRANT SELECT ON public.developments_public TO anon, authenticated;
