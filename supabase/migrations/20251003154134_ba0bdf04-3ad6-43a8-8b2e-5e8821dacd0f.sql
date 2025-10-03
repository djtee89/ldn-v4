-- Fix: Remove token-based access mechanism from bookings table
-- This eliminates the attack surface of potential token exploitation
-- and ensures bookings can only be accessed by the owner or authorized staff

-- Drop the token validation function (no longer needed)
DROP FUNCTION IF EXISTS public.is_valid_booking_token(text);

-- Remove token-related columns from bookings table
ALTER TABLE public.bookings 
  DROP COLUMN IF EXISTS booking_token,
  DROP COLUMN IF EXISTS token_expires_at,
  DROP COLUMN IF EXISTS token_last_accessed_at,
  DROP COLUMN IF EXISTS token_access_count;

-- Add comment explaining the security model
COMMENT ON TABLE public.bookings IS 
'Contains customer booking requests with strict RLS policies. 
Access control:
- Users can only view their own bookings (via user_id = auth.uid())
- Staff (admin/booking_manager roles) can view and manage all bookings
- Anonymous users can create bookings but cannot view them
- No token-based access to prevent exploitation';

-- Verify RLS is enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
