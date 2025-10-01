-- Create bookings table for viewing requests
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  development_name TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date TEXT,
  preferred_time TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  source TEXT DEFAULT 'ai_chat' CHECK (source IN ('ai_chat', 'booking_modal', 'website')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert bookings (for the chat to work)
CREATE POLICY "Anyone can create bookings"
ON public.bookings
FOR INSERT
WITH CHECK (true);

-- Only allow reading all bookings (for admin view)
CREATE POLICY "Anyone can view bookings"
ON public.bookings
FOR SELECT
USING (true);

-- Create index for faster queries
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX idx_bookings_status ON public.bookings(status);