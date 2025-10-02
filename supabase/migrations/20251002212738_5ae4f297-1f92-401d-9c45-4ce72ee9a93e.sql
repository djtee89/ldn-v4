-- Fix security issue: Make developments_public view use security_definer
-- This allows anonymous users to access limited development data through the view
-- while keeping the full developments table authenticated-only

-- Drop and recreate the view with proper security model
DROP VIEW IF EXISTS public.developments_public;

CREATE VIEW public.developments_public
WITH (security_invoker = false) -- Use security_definer (owner's privileges)
AS SELECT 
  id,
  name,
  developer,
  location,
  postcode,
  zone,
  nearest_tube,
  nearest_tube_line,
  distance_to_tube,
  stations,
  nearby_stations,
  lat,
  lng,
  -- Only expose price range, not detailed pricing strategy
  jsonb_build_object('range', prices->'range') as prices,
  tenure,
  schools,
  transport_score,
  green_spaces,
  area_overview,
  amenities,
  bedrooms,
  images,
  cover_image_index,
  completion_date,
  status,
  featured,
  created_at,
  updated_at
FROM public.developments
WHERE status IN ('Available', 'Coming Soon', 'Nearly Sold Out');

-- Ensure proper access grants
GRANT SELECT ON public.developments_public TO anon, authenticated;

-- Add security documentation
COMMENT ON VIEW public.developments_public IS 
'Public-facing view of developments. Uses SECURITY DEFINER to allow anonymous access to customer-facing data only. Excludes sensitive fields: raw_details, validation_status, hidden_images, detailed pricing. Only shows developments with public-facing status.';