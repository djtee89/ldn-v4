-- Create area_metrics table to store computed statistics by area
CREATE TABLE IF NOT EXISTS public.area_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_code TEXT NOT NULL UNIQUE,
  area_name TEXT NOT NULL,
  area_type TEXT NOT NULL, -- 'postcode_sector', 'borough', 'ward', etc.
  
  -- Geographic bounds for the area
  bounds JSONB NOT NULL, -- {north, south, east, west}
  center_lat NUMERIC NOT NULL,
  center_lng NUMERIC NOT NULL,
  
  -- Price metrics
  price_per_sqft_1bed NUMERIC,
  price_per_sqft_2bed NUMERIC,
  price_per_sqft_3bed NUMERIC,
  price_per_sqft_overall NUMERIC,
  
  -- Yield metrics (estimated net yield %)
  yield_1bed NUMERIC,
  yield_2bed NUMERIC,
  yield_3bed NUMERIC,
  
  -- Growth metrics
  growth_12m_pct NUMERIC,
  growth_rank TEXT, -- 'top_20', 'above_avg', 'avg', 'below_avg', 'bottom_20'
  
  -- Schools
  schools_outstanding_primary INTEGER DEFAULT 0,
  schools_outstanding_secondary INTEGER DEFAULT 0,
  schools_score NUMERIC, -- 0-5 composite score
  
  -- Green space (% within 800m)
  green_space_pct NUMERIC,
  parks_count INTEGER DEFAULT 0,
  
  -- Noise/Air quality
  noise_air_badge TEXT, -- 'good', 'ok', 'busy'
  
  -- Crime (per 1,000 residents, 12-month)
  crime_per_1000 NUMERIC,
  crime_category TEXT, -- 'below_avg', 'avg', 'above_avg'
  
  -- Metadata
  sample_size INTEGER DEFAULT 0, -- number of transactions/units used
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_sources JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on area_code for fast lookups
CREATE INDEX idx_area_metrics_area_code ON public.area_metrics(area_code);
CREATE INDEX idx_area_metrics_area_type ON public.area_metrics(area_type);

-- Enable RLS
ALTER TABLE public.area_metrics ENABLE ROW LEVEL SECURITY;

-- Public can read area metrics
CREATE POLICY "Anyone can view area metrics"
  ON public.area_metrics
  FOR SELECT
  USING (true);

-- Only admins can insert/update area metrics
CREATE POLICY "Admins can manage area metrics"
  ON public.area_metrics
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger to update updated_at
CREATE TRIGGER update_area_metrics_updated_at
  BEFORE UPDATE ON public.area_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create area_polygons table to store geographic boundaries
CREATE TABLE IF NOT EXISTS public.area_polygons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_code TEXT NOT NULL UNIQUE,
  area_name TEXT NOT NULL,
  area_type TEXT NOT NULL,
  
  -- GeoJSON polygon geometry
  geometry JSONB NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_area_polygons_area_code ON public.area_polygons(area_code);

-- Enable RLS
ALTER TABLE public.area_polygons ENABLE ROW LEVEL SECURITY;

-- Public can read polygons
CREATE POLICY "Anyone can view area polygons"
  ON public.area_polygons
  FOR SELECT
  USING (true);

-- Only admins can manage polygons
CREATE POLICY "Admins can manage area polygons"
  ON public.area_polygons
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));