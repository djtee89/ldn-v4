-- Phase 1: Database Schema Refinement (Fixed v2)

-- Drop the view first to avoid dependency issues
DROP VIEW IF EXISTS public.developments_public;

-- Add new columns to developments
ALTER TABLE public.developments 
  ADD COLUMN IF NOT EXISTS borough TEXT,
  ADD COLUMN IF NOT EXISTS images_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS units_count INTEGER DEFAULT 0;

-- Rename area_overview to summary (only if it exists)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'developments' AND column_name = 'area_overview'
  ) THEN
    ALTER TABLE public.developments RENAME COLUMN area_overview TO summary;
  END IF;
END $$;

-- Remove bloat columns
ALTER TABLE public.developments 
  DROP COLUMN IF EXISTS bedrooms,
  DROP COLUMN IF EXISTS green_spaces,
  DROP COLUMN IF EXISTS distance_to_tube,
  DROP COLUMN IF EXISTS nearest_tube,
  DROP COLUMN IF EXISTS nearest_tube_line,
  DROP COLUMN IF EXISTS transport_score,
  DROP COLUMN IF EXISTS validation_status,
  DROP COLUMN IF EXISTS raw_details,
  DROP COLUMN IF EXISTS featured,
  DROP COLUMN IF EXISTS hidden_images,
  DROP COLUMN IF EXISTS cover_image_index;

-- Standardize status enum (update existing values first)
UPDATE public.developments 
SET status = CASE 
  WHEN status = 'Available' THEN 'active'
  WHEN status = 'Coming Soon' THEN 'active'
  WHEN status = 'Nearly Sold Out' THEN 'active'
  ELSE 'active'
END
WHERE status NOT IN ('active', 'paused', 'hidden');

-- Function to compute prices from units (using existing 'prices' column)
CREATE OR REPLACE FUNCTION public.compute_development_prices(dev_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_object_agg(beds::text, min_price)
  INTO result
  FROM (
    SELECT 
      beds,
      MIN(price) as min_price
    FROM public.units
    WHERE units.dev_id = compute_development_prices.dev_id
      AND status IN ('Available', 'Under Negotiation')
    GROUP BY beds
  ) prices_data;
  
  RETURN COALESCE(result, '{}'::jsonb);
END;
$$;

-- Function to update development counters and prices
CREATE OR REPLACE FUNCTION public.update_development_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  dev_id_to_update TEXT;
BEGIN
  -- Determine which dev_id to update
  IF TG_OP = 'DELETE' THEN
    dev_id_to_update := OLD.dev_id;
  ELSE
    dev_id_to_update := NEW.dev_id;
  END IF;
  
  -- Update units_count and prices
  UPDATE public.developments
  SET 
    units_count = (
      SELECT COUNT(*) 
      FROM public.units 
      WHERE units.dev_id = dev_id_to_update
    ),
    prices = public.compute_development_prices(dev_id_to_update),
    updated_at = NOW()
  WHERE id = dev_id_to_update;
  
  RETURN NULL;
END;
$$;

-- Create trigger on units table
DROP TRIGGER IF EXISTS update_dev_stats_on_units ON public.units;
CREATE TRIGGER update_dev_stats_on_units
  AFTER INSERT OR UPDATE OR DELETE ON public.units
  FOR EACH ROW
  EXECUTE FUNCTION public.update_development_stats();

-- Initialize counters for existing developments
UPDATE public.developments d
SET 
  units_count = (SELECT COUNT(*) FROM public.units WHERE units.dev_id = d.id),
  images_count = COALESCE(array_length(images, 1), 0),
  prices = public.compute_development_prices(d.id);

-- Recreate developments_public view with new schema
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
WHERE status = 'active';