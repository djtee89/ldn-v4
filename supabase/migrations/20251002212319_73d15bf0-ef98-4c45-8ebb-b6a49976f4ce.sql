-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Public can read developments" ON public.developments;

-- Restrict full table access to authenticated users only
CREATE POLICY "Authenticated users can view all development details"
ON public.developments
FOR SELECT
TO authenticated
USING (true);

-- Create a public-facing view with customer-essential fields only
CREATE OR REPLACE VIEW public.developments_public AS
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

-- Grant public access to the view only
GRANT SELECT ON public.developments_public TO anon;
GRANT SELECT ON public.developments_public TO authenticated;

-- Add security comments
COMMENT ON VIEW public.developments_public IS
'PUBLIC VIEW: Exposes only customer-facing property information. Excludes proprietary business intelligence like raw_details, validation_status, hidden_images, and detailed pricing breakdowns. Use this view for public-facing property browsing.';

COMMENT ON POLICY "Authenticated users can view all development details" ON public.developments IS
'Restricts full development data access to authenticated users only. Public users must use developments_public view instead. This protects proprietary scraping infrastructure, validation logic, and detailed pricing strategies from competitors.';

-- Create index on status for view performance
CREATE INDEX IF NOT EXISTS idx_developments_public_status 
ON public.developments(status) 
WHERE status IN ('Available', 'Coming Soon', 'Nearly Sold Out');

-- Add table comment documenting security model
COMMENT ON TABLE public.developments IS
'RESTRICTED: Contains proprietary business intelligence including scraping data (raw_details), validation logic (validation_status), content management (hidden_images), and detailed pricing strategies. Public access restricted to developments_public view only. Full access requires authentication.';