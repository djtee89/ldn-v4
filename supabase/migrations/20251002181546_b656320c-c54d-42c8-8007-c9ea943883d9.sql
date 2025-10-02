-- Add rich development fields to developments table
ALTER TABLE public.developments
  ADD COLUMN IF NOT EXISTS transport_score text,
  ADD COLUMN IF NOT EXISTS green_spaces text,
  ADD COLUMN IF NOT EXISTS postcode text,
  ADD COLUMN IF NOT EXISTS nearest_tube_line text,
  ADD COLUMN IF NOT EXISTS nearby_stations jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS raw_details jsonb DEFAULT '{}'::jsonb;

-- Create index on dev_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_developments_id ON public.developments(id);

-- Add comment for raw_details field
COMMENT ON COLUMN public.developments.raw_details IS 'Stores any additional fields from legacy data that dont fit structured columns';