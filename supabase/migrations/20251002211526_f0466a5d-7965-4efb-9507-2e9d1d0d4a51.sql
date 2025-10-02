-- Add secure token column for booking retrieval
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS booking_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex');

-- Create index for efficient token lookups
CREATE INDEX IF NOT EXISTS idx_bookings_token ON public.bookings(booking_token) WHERE booking_token IS NOT NULL;

-- Drop existing SELECT policies to recreate them with better security
DROP POLICY IF EXISTS "Staff can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

-- Recreate SELECT policies with enhanced security

-- Policy 1: Staff (admin/booking_manager) can view all bookings
CREATE POLICY "Staff can view all bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'booking_manager')
);

-- Policy 2: Authenticated users can ONLY view their own bookings
CREATE POLICY "Authenticated users can view their own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() AND 
  auth.role() = 'authenticated'
);

-- Policy 3: Anyone with a valid booking token can view that specific booking
-- This enables anonymous booking retrieval without exposing other bookings
CREATE POLICY "Booking retrieval by token"
ON public.bookings
FOR SELECT
TO anon, authenticated
USING (
  booking_token IS NOT NULL AND
  booking_token = current_setting('request.jwt.claim.booking_token', true)
);

-- Add comment explaining the security model
COMMENT ON COLUMN public.bookings.booking_token IS 
'Secure random token for anonymous booking retrieval. Each booking gets a unique token that must be provided to view the booking details without authentication.';

COMMENT ON POLICY "Booking retrieval by token" ON public.bookings IS
'Allows retrieval of a specific booking using its secure token. The token must be passed in the JWT claims or query parameters. This enables anonymous users to check their booking status without exposing all booking data.';