-- Create developments table
CREATE TABLE public.developments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  developer TEXT,
  location TEXT,
  lat NUMERIC,
  lng NUMERIC,
  status TEXT DEFAULT 'Available',
  completion_date TEXT,
  nearest_tube TEXT,
  distance_to_tube TEXT,
  zone TEXT,
  tenure TEXT,
  prices JSONB DEFAULT '{}',
  bedrooms TEXT[],
  amenities TEXT[],
  area_overview TEXT,
  images TEXT[],
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.developments ENABLE ROW LEVEL SECURITY;

-- Public can read developments
CREATE POLICY "Public can read developments"
ON public.developments
FOR SELECT
USING (true);

-- Admins can manage developments
CREATE POLICY "Admins can manage developments"
ON public.developments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for location-based queries
CREATE INDEX idx_developments_location ON public.developments (lat, lng);

-- Create index for search
CREATE INDEX idx_developments_name ON public.developments USING gin(to_tsvector('english', name));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_developments_updated_at
BEFORE UPDATE ON public.developments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();