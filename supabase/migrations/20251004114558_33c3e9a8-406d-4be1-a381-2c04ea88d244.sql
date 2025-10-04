-- Add image fields to development_offers table
ALTER TABLE public.development_offers 
ADD COLUMN IF NOT EXISTS image_url text;

-- Add image fields, floorplan, and description to best_deals table
ALTER TABLE public.best_deals
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS floorplan_url text,
ADD COLUMN IF NOT EXISTS deal_description text;

-- Add image field to events table
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS image_url text;