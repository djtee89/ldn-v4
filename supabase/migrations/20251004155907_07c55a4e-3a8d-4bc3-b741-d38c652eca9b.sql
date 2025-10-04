-- Create storage bucket for static GeoJSON files
INSERT INTO storage.buckets (id, name, public)
VALUES ('static', 'static', true)
ON CONFLICT (id) DO NOTHING;

-- Create staging table for ONS/Land Registry borough median prices
CREATE TABLE IF NOT EXISTS public.ons_borough_price (
  area_code TEXT PRIMARY KEY,
  median_price NUMERIC NOT NULL,
  data_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create staging table for EPC borough median floor areas
CREATE TABLE IF NOT EXISTS public.epc_borough_area (
  area_code TEXT PRIMARY KEY,
  median_floor_m2 NUMERIC NOT NULL,
  sample_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ons_borough_price ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epc_borough_area ENABLE ROW LEVEL SECURITY;

-- RLS policies for staging tables
CREATE POLICY "Anyone can view ONS borough prices"
  ON public.ons_borough_price FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage ONS borough prices"
  ON public.ons_borough_price FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view EPC borough areas"
  ON public.epc_borough_area FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage EPC borough areas"
  ON public.epc_borough_area FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert sample data for all 33 London boroughs (realistic estimates)
INSERT INTO public.ons_borough_price (area_code, median_price, data_year) VALUES
('E09000001', 950000, 2024), -- City of London
('E09000007', 850000, 2024), -- Camden
('E09000012', 580000, 2024), -- Hackney
('E09000019', 650000, 2024), -- Islington
('E09000020', 1200000, 2024), -- Kensington and Chelsea
('E09000022', 520000, 2024), -- Lambeth
('E09000028', 580000, 2024), -- Southwark
('E09000030', 530000, 2024), -- Tower Hamlets
('E09000032', 620000, 2024), -- Wandsworth
('E09000033', 980000, 2024), -- Westminster
('E09000002', 320000, 2024), -- Barking and Dagenham
('E09000003', 480000, 2024), -- Barnet
('E09000004', 380000, 2024), -- Bexley
('E09000005', 520000, 2024), -- Brent
('E09000006', 450000, 2024), -- Bromley
('E09000008', 380000, 2024), -- Croydon
('E09000009', 480000, 2024), -- Ealing
('E09000010', 420000, 2024), -- Enfield
('E09000011', 420000, 2024), -- Greenwich
('E09000013', 680000, 2024), -- Hammersmith and Fulham
('E09000014', 550000, 2024), -- Haringey
('E09000015', 450000, 2024), -- Harrow
('E09000016', 380000, 2024), -- Havering
('E09000017', 420000, 2024), -- Hillingdon
('E09000018', 450000, 2024), -- Hounslow
('E09000021', 480000, 2024), -- Kingston upon Thames
('E09000023', 480000, 2024), -- Lewisham
('E09000024', 520000, 2024), -- Merton
('E09000025', 420000, 2024), -- Newham
('E09000026', 450000, 2024), -- Redbridge
('E09000027', 650000, 2024), -- Richmond upon Thames
('E09000029', 420000, 2024), -- Sutton
('E09000031', 480000, 2024)  -- Waltham Forest
ON CONFLICT (area_code) DO UPDATE SET
  median_price = EXCLUDED.median_price,
  data_year = EXCLUDED.data_year,
  updated_at = now();

INSERT INTO public.epc_borough_area (area_code, median_floor_m2, sample_size) VALUES
('E09000001', 65, 1500), -- City of London
('E09000007', 72, 8500), -- Camden
('E09000012', 68, 7200), -- Hackney
('E09000019', 70, 6800), -- Islington
('E09000020', 85, 5200), -- Kensington and Chelsea
('E09000022', 69, 9800), -- Lambeth
('E09000028', 67, 8900), -- Southwark
('E09000030', 66, 9200), -- Tower Hamlets
('E09000032', 75, 10500), -- Wandsworth
('E09000033', 78, 7800), -- Westminster
('E09000002', 72, 6200), -- Barking and Dagenham
('E09000003', 82, 12500), -- Barnet
('E09000004', 78, 8500), -- Bexley
('E09000005', 74, 9200), -- Brent
('E09000006', 85, 11200), -- Bromley
('E09000008', 76, 11800), -- Croydon
('E09000009', 80, 10200), -- Ealing
('E09000010', 78, 9800), -- Enfield
('E09000011', 75, 8200), -- Greenwich
('E09000013', 72, 6500), -- Hammersmith and Fulham
('E09000014', 75, 8200), -- Haringey
('E09000015', 82, 7800), -- Harrow
('E09000016', 82, 7200), -- Havering
('E09000017', 85, 8800), -- Hillingdon
('E09000018', 78, 8200), -- Hounslow
('E09000021', 82, 5500), -- Kingston upon Thames
('E09000023', 72, 8800), -- Lewisham
('E09000024', 78, 6800), -- Merton
('E09000025', 70, 9500), -- Newham
('E09000026', 75, 8500), -- Redbridge
('E09000027', 85, 6200), -- Richmond upon Thames
('E09000029', 80, 7200), -- Sutton
('E09000031', 72, 8200)  -- Waltham Forest
ON CONFLICT (area_code) DO UPDATE SET
  median_floor_m2 = EXCLUDED.median_floor_m2,
  sample_size = EXCLUDED.sample_size,
  updated_at = now();