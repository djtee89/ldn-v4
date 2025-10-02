-- Fix: Switch from SECURITY DEFINER to SECURITY INVOKER pattern
-- Following Supabase best practice: use RLS policies for security, not view privileges

-- Step 1: Add RLS policy to developments table for anonymous public access to limited fields
-- This policy allows anonymous users to see only customer-facing developments
CREATE POLICY "Anonymous users can view public developments"
ON public.developments
FOR SELECT
TO anon
USING (status IN ('Available', 'Coming Soon', 'Nearly Sold Out'));

-- Step 2: Recreate the view with SECURITY INVOKER
-- Now the view just selects fields; security is handled by RLS
DROP VIEW IF EXISTS public.developments_public;

CREATE VIEW public.developments_public
WITH (security_invoker = true) -- Use caller's privileges, respects RLS
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

-- Grant access
GRANT SELECT ON public.developments_public TO anon, authenticated;

-- Update security documentation
COMMENT ON VIEW public.developments_public IS 
'Public-facing view of developments. Uses SECURITY INVOKER to respect RLS policies. Security is enforced by RLS policy "Anonymous users can view public developments" which limits access to public-facing status only. The view definition simply selects customer-facing fields, excluding: raw_details, validation_status, hidden_images, detailed pricing.';

COMMENT ON POLICY "Anonymous users can view public developments" ON public.developments IS
'Allows anonymous users to view developments with public-facing status only. Used in conjunction with developments_public view to provide limited read access to unauthenticated users.';