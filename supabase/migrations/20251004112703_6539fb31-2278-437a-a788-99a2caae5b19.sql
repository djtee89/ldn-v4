-- Create best_deals table to store featured deals
CREATE TABLE public.best_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dev_id TEXT NOT NULL REFERENCES public.developments(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(dev_id, unit_id)
);

-- Enable RLS
ALTER TABLE public.best_deals ENABLE ROW LEVEL SECURITY;

-- Public can view active best deals
CREATE POLICY "Public can view active best deals"
ON public.best_deals
FOR SELECT
TO anon, authenticated
USING (active = true);

-- Admins can manage best deals
CREATE POLICY "Admins can manage best deals"
ON public.best_deals
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add index for performance
CREATE INDEX idx_best_deals_active ON public.best_deals(active, display_order);
CREATE INDEX idx_best_deals_dev_id ON public.best_deals(dev_id);
CREATE INDEX idx_best_deals_unit_id ON public.best_deals(unit_id);