-- Create viewing_requests table
CREATE TABLE IF NOT EXISTS public.viewing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  development_id TEXT NOT NULL,
  development_name TEXT NOT NULL,
  unit_id UUID,
  unit_number TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  source TEXT DEFAULT 'website',
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.viewing_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert viewing requests (public bookings)
CREATE POLICY "Anyone can book viewings"
  ON public.viewing_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated users can view their own requests
CREATE POLICY "Users can view their own viewing requests"
  ON public.viewing_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Staff can view all viewing requests
CREATE POLICY "Staff can view all viewing requests"
  ON public.viewing_requests
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'booking_manager'::app_role));

-- Staff can update viewing requests
CREATE POLICY "Staff can update viewing requests"
  ON public.viewing_requests
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'booking_manager'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_viewing_requests_updated_at
  BEFORE UPDATE ON public.viewing_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();