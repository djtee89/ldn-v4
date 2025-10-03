-- Add voucher_code column to viewing_requests
ALTER TABLE public.viewing_requests 
ADD COLUMN IF NOT EXISTS voucher_code TEXT;

-- Create development_offers table
CREATE TABLE IF NOT EXISTS public.development_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dev_id TEXT NOT NULL,
  offer_title TEXT NOT NULL,
  offer_description TEXT,
  voucher_code TEXT NOT NULL,
  savings_amount TEXT,
  expiry_date TIMESTAMP WITH TIME ZONE,
  terms JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_development
    FOREIGN KEY (dev_id)
    REFERENCES public.developments(id)
    ON DELETE CASCADE
);

-- Enable RLS on development_offers
ALTER TABLE public.development_offers ENABLE ROW LEVEL SECURITY;

-- Public can view active offers
CREATE POLICY "Public can view active development offers"
ON public.development_offers
FOR SELECT
USING (active = true);

-- Admins can manage all offers
CREATE POLICY "Admins can manage development offers"
ON public.development_offers
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_development_offers_dev_id 
ON public.development_offers(dev_id);

CREATE INDEX IF NOT EXISTS idx_development_offers_active 
ON public.development_offers(active);

-- Add updated_at trigger
CREATE TRIGGER update_development_offers_updated_at
BEFORE UPDATE ON public.development_offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();