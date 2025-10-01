-- Add 'booking_manager' role to the app_role enum
-- This must be in its own transaction and committed before being used
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'booking_manager';