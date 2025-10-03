-- Create nearby categories configuration table
CREATE TABLE IF NOT EXISTS public.nearby_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  icon TEXT,
  default_visible BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  radius_meters INTEGER DEFAULT 800,
  overpass_query TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create nearby cache table
CREATE TABLE IF NOT EXISTS public.nearby_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dev_id TEXT NOT NULL,
  category TEXT NOT NULL,
  results JSONB NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(dev_id, category)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_nearby_cache_dev_category ON public.nearby_cache(dev_id, category);
CREATE INDEX IF NOT EXISTS idx_nearby_cache_fetched_at ON public.nearby_cache(fetched_at);
CREATE INDEX IF NOT EXISTS idx_nearby_categories_order ON public.nearby_categories(display_order);

-- Enable RLS
ALTER TABLE public.nearby_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nearby_cache ENABLE ROW LEVEL SECURITY;

-- RLS policies for nearby_categories (public read, admin write)
CREATE POLICY "Anyone can view nearby categories"
  ON public.nearby_categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage nearby categories"
  ON public.nearby_categories FOR ALL
  USING (auth.role() = 'authenticated');

-- RLS policies for nearby_cache (public read, service role write)
CREATE POLICY "Anyone can view nearby cache"
  ON public.nearby_cache FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage nearby cache"
  ON public.nearby_cache FOR ALL
  USING (auth.role() = 'service_role');

-- Insert default categories
INSERT INTO public.nearby_categories (name, label, icon, default_visible, display_order, radius_meters, overpass_query) VALUES
  ('supermarkets', 'Supermarkets', '🛒', true, 1, 800, 'node[shop=supermarket](around:{radius},{lat},{lng});way[shop=supermarket](around:{radius},{lat},{lng});'),
  ('coffee', 'Coffee', '☕', true, 2, 800, 'node[amenity=cafe](around:{radius},{lat},{lng});way[amenity=cafe](around:{radius},{lat},{lng});'),
  ('gyms', 'Gyms', '💪', true, 3, 800, 'node[leisure=fitness_centre](around:{radius},{lat},{lng});way[leisure=fitness_centre](around:{radius},{lat},{lng});node[leisure=sports_centre](around:{radius},{lat},{lng});way[leisure=sports_centre](around:{radius},{lat},{lng});'),
  ('parks', 'Parks & Playgrounds', '🌳', true, 4, 800, 'node[leisure=park](around:{radius},{lat},{lng});way[leisure=park](around:{radius},{lat},{lng});node[leisure=playground](around:{radius},{lat},{lng});way[leisure=playground](around:{radius},{lat},{lng});'),
  ('pharmacies', 'Pharmacies/GP', '💊', true, 5, 800, 'node[amenity=pharmacy](around:{radius},{lat},{lng});way[amenity=pharmacy](around:{radius},{lat},{lng});node[amenity=doctors](around:{radius},{lat},{lng});way[amenity=doctors](around:{radius},{lat},{lng});'),
  ('transport', 'Transport', '🚇', true, 6, 1200, 'node[railway=station](around:{radius},{lat},{lng});node[railway=subway_entrance](around:{radius},{lat},{lng});node[amenity=bus_station](around:{radius},{lat},{lng});'),
  ('coworking', 'Co-working', '💼', false, 7, 800, 'node[amenity=coworking_space](around:{radius},{lat},{lng});way[amenity=coworking_space](around:{radius},{lat},{lng});'),
  ('pubs', 'Pubs & Wine Bars', '🍷', false, 8, 800, 'node[amenity=pub](around:{radius},{lat},{lng});way[amenity=pub](around:{radius},{lat},{lng});node[amenity=bar](around:{radius},{lat},{lng});way[amenity=bar](around:{radius},{lat},{lng});'),
  ('ev_charging', 'EV Chargers & Car Clubs', '🔌', false, 9, 1000, 'node[amenity=charging_station](around:{radius},{lat},{lng});way[amenity=charging_station](around:{radius},{lat},{lng});node[amenity=car_sharing](around:{radius},{lat},{lng});'),
  ('nurseries', 'Nurseries/Childcare', '👶', false, 10, 800, 'node[amenity=kindergarten](around:{radius},{lat},{lng});way[amenity=kindergarten](around:{radius},{lat},{lng});node[amenity=childcare](around:{radius},{lat},{lng});'),
  ('banks', 'Banks/ATMs', '🏦', false, 11, 800, 'node[amenity=bank](around:{radius},{lat},{lng});way[amenity=bank](around:{radius},{lat},{lng});node[amenity=atm](around:{radius},{lat},{lng});'),
  ('post', 'Post/Parcel Lockers', '📦', false, 12, 800, 'node[amenity=post_office](around:{radius},{lat},{lng});way[amenity=post_office](around:{radius},{lat},{lng});node[amenity=parcel_locker](around:{radius},{lat},{lng});')
ON CONFLICT (name) DO NOTHING;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_nearby_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_nearby_categories_updated_at
  BEFORE UPDATE ON public.nearby_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_nearby_categories_updated_at();