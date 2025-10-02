-- Create hottest_unit table for manual overrides
CREATE TABLE IF NOT EXISTS public.hottest_unit (
  dev_id text PRIMARY KEY,
  unit_id uuid NOT NULL,
  score numeric DEFAULT 100,
  manual_override boolean DEFAULT false,
  override_reason text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.hottest_unit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins and managers can manage hottest units" ON public.hottest_unit;
CREATE POLICY "Admins and managers can manage hottest units"
ON public.hottest_unit FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Create header_mappings table for per-developer CSV column mappings
CREATE TABLE IF NOT EXISTS public.header_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer text NOT NULL,
  source_header text NOT NULL,
  target_field text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(developer, source_header)
);

ALTER TABLE public.header_mappings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage header mappings" ON public.header_mappings;
CREATE POLICY "Admins can manage header mappings"
ON public.header_mappings FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Add cover_image_index and hidden_images to developments
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'developments' AND column_name = 'cover_image_index'
  ) THEN
    ALTER TABLE public.developments ADD COLUMN cover_image_index integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'developments' AND column_name = 'hidden_images'
  ) THEN
    ALTER TABLE public.developments ADD COLUMN hidden_images integer[] DEFAULT ARRAY[]::integer[];
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'developments' AND column_name = 'stations'
  ) THEN
    ALTER TABLE public.developments ADD COLUMN stations jsonb DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'developments' AND column_name = 'schools'
  ) THEN
    ALTER TABLE public.developments ADD COLUMN schools jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Create scheduled_tasks table for automation toggles
CREATE TABLE IF NOT EXISTS public.scheduled_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name text UNIQUE NOT NULL,
  enabled boolean DEFAULT false,
  schedule text NOT NULL,
  last_run timestamptz,
  next_run timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.scheduled_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage scheduled tasks" ON public.scheduled_tasks;
CREATE POLICY "Admins can manage scheduled tasks"
ON public.scheduled_tasks FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Insert default scheduled tasks
INSERT INTO public.scheduled_tasks (task_name, schedule, enabled) VALUES
  ('nightly_hottest_refresh', '0 2 * * *', false),
  ('monday_summary_email', '0 9 * * 1', false)
ON CONFLICT (task_name) DO NOTHING;