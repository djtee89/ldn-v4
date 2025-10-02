-- Recreate the view with explicit SECURITY INVOKER to address linter warning
-- This ensures the view uses the querying user's permissions, not the view creator's
DROP VIEW IF EXISTS public.developments_public;

CREATE VIEW public.developments_public 
WITH (security_invoker = true) AS
SELECT 
  -- Core identification
  id,
  name,
  developer,
  location,
  postcode,
  
  -- Geographic data
  lat,
  lng,
  zone,
  
  -- Customer-facing features
  area_overview,
  bedrooms,
  tenure,
  status,
  completion_date,
  
  -- Public images (excluding hidden_images tracking)
  images,
  cover_image_index,
  
  -- Amenities and transport (customer decision factors)
  amenities,
  nearest_tube,
  nearest_tube_line,
  distance_to_tube,
  transport_score,
  green_spaces,
  nearby_stations,
  stations,
  schools,
  
  -- Basic pricing for customer browsing (simplified)
  -- Only expose the summary range, not detailed breakdown
  jsonb_build_object(
    'range', prices->>'range'
  ) as prices,
  
  -- Featured status for UI
  featured,
  
  -- Timestamps for freshness indication
  created_at,
  updated_at
  
FROM public.developments
-- Only show available or recently updated developments to public
WHERE status IN ('Available', 'Coming Soon', 'Nearly Sold Out');

-- Re-grant public access to the view
GRANT SELECT ON public.developments_public TO anon;
GRANT SELECT ON public.developments_public TO authenticated;

-- Re-add security comment
COMMENT ON VIEW public.developments_public IS
'PUBLIC VIEW (security_invoker): Exposes only customer-facing property information. Excludes proprietary business intelligence like raw_details, validation_status, hidden_images, and detailed pricing breakdowns. Uses security_invoker to ensure proper RLS enforcement. Use this view for public-facing property browsing.';