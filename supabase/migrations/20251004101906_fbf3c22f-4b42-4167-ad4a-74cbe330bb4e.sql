-- Add explicit grants to clarify the access pattern for developments_public view
-- The view already has security_invoker=on which enforces RLS from the base table
-- Adding grants makes the intended public access explicit

-- Grant SELECT on developments_public to anonymous role
GRANT SELECT ON public.developments_public TO anon;

-- Grant SELECT on developments_public to authenticated role
GRANT SELECT ON public.developments_public TO authenticated;

-- Ensure the underlying developments table enforces its RLS policies
-- when accessed through the view (already done via security_invoker=on)

-- Add comprehensive documentation
COMMENT ON VIEW public.developments_public IS 
'SECURITY: Public-facing view with security_invoker=on enabled. This view inherits and enforces RLS policies from the developments table. Anonymous and authenticated users can SELECT, but the underlying RLS policies on developments table control what rows are visible. The view filters to only show Available, Coming Soon, and Nearly Sold Out statuses, matching the anonymous user policy on the base table. No sensitive internal development data is exposed.';