-- Drop the insecure public SELECT policy on developer_registry
DROP POLICY IF EXISTS "Public can read active developers" ON public.developer_registry;

-- Create restricted SELECT policy for admin and manager roles only
CREATE POLICY "Only admins and managers can view developer registry"
ON public.developer_registry
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'manager')
);

-- Add security comment explaining the restriction
COMMENT ON POLICY "Only admins and managers can view developer registry" ON public.developer_registry IS
'Restricts access to scraping infrastructure configuration to authorized staff only. This prevents competitors from viewing allow_domains, index_urls, and image_rules which are proprietary business intelligence.';

-- Add table-level comment about security
COMMENT ON TABLE public.developer_registry IS
'CONFIDENTIAL: Contains proprietary scraping infrastructure configuration. Access restricted to admin and manager roles only to prevent business intelligence leaks to competitors.';