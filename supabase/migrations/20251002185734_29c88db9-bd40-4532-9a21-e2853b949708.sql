-- Create developer registry table
CREATE TABLE IF NOT EXISTS public.developer_registry (
  id text PRIMARY KEY,
  name text NOT NULL,
  allow_domains jsonb NOT NULL DEFAULT '[]'::jsonb,
  index_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  image_rules jsonb NOT NULL DEFAULT '{}'::jsonb,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create discovery queue table for scraped developments awaiting review
CREATE TABLE IF NOT EXISTS public.discovery_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id text NOT NULL REFERENCES developer_registry(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  location text,
  scraped_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending', -- pending, approved, rejected, imported
  is_london boolean NOT NULL DEFAULT false,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  imported_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text
);

-- Create scrape jobs table to track scraping progress
CREATE TABLE IF NOT EXISTS public.scrape_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id text NOT NULL REFERENCES developer_registry(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'queued', -- queued, running, completed, failed
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  discovered_count integer DEFAULT 0,
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.developer_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrape_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for developer_registry
CREATE POLICY "Admins can manage developer registry"
  ON public.developer_registry
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can read active developers"
  ON public.developer_registry
  FOR SELECT
  USING (active = true);

-- RLS Policies for discovery_queue
CREATE POLICY "Admins can manage discovery queue"
  ON public.discovery_queue
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for scrape_jobs
CREATE POLICY "Admins can manage scrape jobs"
  ON public.scrape_jobs
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_discovery_queue_developer ON discovery_queue(developer_id);
CREATE INDEX IF NOT EXISTS idx_discovery_queue_status ON discovery_queue(status);
CREATE INDEX IF NOT EXISTS idx_discovery_queue_is_london ON discovery_queue(is_london);
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_developer ON scrape_jobs(developer_id);
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_status ON scrape_jobs(status);

-- Create trigger for updated_at
CREATE TRIGGER update_developer_registry_updated_at
  BEFORE UPDATE ON public.developer_registry
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();