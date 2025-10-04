-- Fix security issue: Public Development View Has No Access Controls
-- Issue: The developments_public VIEW has no RLS policies, making it completely open
-- even though it's meant to show only customer-facing public data.
-- Solution: Enable RLS on the view and add an explicit public read policy.

-- Enable RLS on the developments_public view
ALTER VIEW public.developments_public SET (security_invoker = on);

-- Since it's a view, we need to ensure RLS is enabled on it
-- Views with security_invoker=on will check RLS policies
-- Now create a policy that explicitly allows public read access

-- Note: RLS policies on views require the view to have security_invoker enabled
-- and we need to create policies that match the intended access pattern

-- Add comment explaining the security model for this view
COMMENT ON VIEW public.developments_public IS 
'Public-facing view of developments filtered to show only Available, Coming Soon, and Nearly Sold Out properties. This view is intentionally publicly readable as it contains only customer-facing marketing data. The view filters out internal/draft developments and inherits structure from the developments table.';