-- Fix: Secure bookings table with token expiration and access tracking

-- Step 1: Add security tracking columns
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS token_expires_at timestamp with time zone DEFAULT (now() + interval '7 days'),
ADD COLUMN IF NOT EXISTS token_last_accessed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS token_access_count integer DEFAULT 0;

-- Step 2: Create token validation function
CREATE OR REPLACE FUNCTION public.is_valid_booking_token(token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  booking_record record;
BEGIN
  -- Find booking by token
  SELECT * INTO booking_record
  FROM public.bookings
  WHERE booking_token = token;
  
  -- Token doesn't exist
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Token expired
  IF booking_record.token_expires_at < now() THEN
    RETURN false;
  END IF;
  
  -- Token accessed too many times (max 50 accesses)
  IF booking_record.token_access_count > 50 THEN
    RETURN false;
  END IF;
  
  -- Update access tracking
  UPDATE public.bookings
  SET 
    token_last_accessed_at = now(),
    token_access_count = token_access_count + 1
  WHERE id = booking_record.id;
  
  RETURN true;
END;
$$;

-- Step 3: Drop insecure policy
DROP POLICY IF EXISTS "Booking retrieval by token" ON public.bookings;

-- Step 4: Create new secure policy with token validation
CREATE POLICY "Secure booking retrieval by token"
ON public.bookings
FOR SELECT
TO anon, authenticated
USING (
  booking_token IS NOT NULL 
  AND booking_token = current_setting('request.jwt.claim.booking_token', true)
  AND is_valid_booking_token(booking_token)
);

COMMENT ON POLICY "Secure booking retrieval by token" ON public.bookings IS
'Allows token-based booking retrieval with expiration (7 days), access tracking, and rate limiting (max 50 accesses). Validates token through is_valid_booking_token function.';