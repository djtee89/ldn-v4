-- Create events table for managing upcoming events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dev_id TEXT REFERENCES public.developments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  location TEXT,
  registration_required BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public can view active future events
CREATE POLICY "Public can view active future events"
ON public.events
FOR SELECT
TO anon, authenticated
USING (active = true AND event_date >= CURRENT_DATE);

-- Admins can manage events
CREATE POLICY "Admins can manage events"
ON public.events
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add indexes for performance
CREATE INDEX idx_events_active_date ON public.events(active, event_date);
CREATE INDEX idx_events_dev_id ON public.events(dev_id);

-- Update development_offers table to add active status if not exists
-- (already has active column based on schema)

-- Add index for development offers
CREATE INDEX IF NOT EXISTS idx_development_offers_active ON public.development_offers(active, expiry_date);