-- Fix developments_public view to show actual development statuses
-- Current filter is too restrictive and matches zero rows

DROP VIEW IF EXISTS public.developments_public;

CREATE VIEW public.developments_public AS
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