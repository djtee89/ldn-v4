-- Fix the security definer issue on the view
-- Explicitly set to SECURITY INVOKER so it uses querying user's permissions

DROP VIEW IF EXISTS public.developments_public;

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
WHERE status IN (
  'Available',
  'Coming Soon', 
  'Nearly Sold Out',
  'Phased Completion',
  'Under Construction',
  'Complete',
  'Final Phase'
);

-- Ensure grants are still in place
GRANT SELECT ON public.developments_public TO anon;
GRANT SELECT ON public.developments_public TO authenticated;