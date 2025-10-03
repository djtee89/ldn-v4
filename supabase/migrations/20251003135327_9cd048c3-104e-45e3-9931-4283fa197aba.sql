-- Create event_registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert registrations (public events)
CREATE POLICY "Anyone can register for events"
  ON public.event_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can view registrations
CREATE POLICY "Authenticated users can view registrations"
  ON public.event_registrations
  FOR SELECT
  TO authenticated
  USING (true);