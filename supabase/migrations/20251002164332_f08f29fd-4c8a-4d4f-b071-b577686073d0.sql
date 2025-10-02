-- Feature 1: Email ingest tracking
CREATE TABLE IF NOT EXISTS public.email_ingests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dev_id text NOT NULL,
  sender_email text NOT NULL,
  subject text,
  received_at timestamp with time zone DEFAULT now(),
  file_path text,
  processed boolean DEFAULT false
);

ALTER TABLE public.email_ingests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email ingests"
ON public.email_ingests
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Feature 4 & 5: Unit validation and anomalies
CREATE TABLE IF NOT EXISTS public.unit_anomalies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dev_id text NOT NULL,
  unit_id uuid REFERENCES public.units(id) ON DELETE CASCADE,
  anomaly_type text NOT NULL, -- 'duplicate', 'price_drop', 'psf_outlier', 'missing_data'
  severity text NOT NULL DEFAULT 'warning', -- 'warning', 'error', 'info'
  details jsonb,
  detected_at timestamp with time zone DEFAULT now(),
  resolved boolean DEFAULT false,
  resolved_at timestamp with time zone,
  resolved_by uuid
);

ALTER TABLE public.unit_anomalies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and managers can view anomalies"
ON public.unit_anomalies
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Admins can manage anomalies"
ON public.unit_anomalies
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Feature 6: Development validation status
ALTER TABLE public.developments
ADD COLUMN IF NOT EXISTS validation_status jsonb DEFAULT '{}'::jsonb;

-- Feature 9: Change diary / audit log
CREATE TABLE IF NOT EXISTS public.change_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dev_id text NOT NULL,
  change_type text NOT NULL, -- 'price_list_upload', 'publish', 'rollback', 'hottest_override', 'image_update'
  changed_by uuid,
  changed_at timestamp with time zone DEFAULT now(),
  details jsonb,
  price_list_id uuid,
  notes text
);

ALTER TABLE public.change_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and managers can view change log"
ON public.change_log
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "System can insert change log"
ON public.change_log
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Feature 7: Image validation
CREATE TABLE IF NOT EXISTS public.image_validation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dev_id text NOT NULL,
  image_url text NOT NULL,
  width integer,
  height integer,
  file_size integer,
  issues jsonb DEFAULT '[]'::jsonb, -- ['too_small', 'portrait_hero', 'low_quality']
  validated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.image_validation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view image validation"
ON public.image_validation
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Admins can manage image validation"
ON public.image_validation
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add received_at field to price_lists if not exists
ALTER TABLE public.price_lists
ADD COLUMN IF NOT EXISTS received_at timestamp with time zone DEFAULT now();

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_change_log_dev_id ON public.change_log(dev_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_unit_anomalies_dev_id ON public.unit_anomalies(dev_id, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_ingests_processed ON public.email_ingests(processed, received_at DESC);