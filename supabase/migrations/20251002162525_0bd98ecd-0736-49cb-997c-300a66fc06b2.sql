-- Add 'manager' to existing app_role enum if not present
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'manager' 
    AND enumtypid = 'public.app_role'::regtype
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'manager';
  END IF;
END $$;

-- Create price_lists table
CREATE TABLE IF NOT EXISTS public.price_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dev_id text NOT NULL,
  file_path text NOT NULL,
  source text NOT NULL DEFAULT 'manual',
  uploaded_at timestamptz DEFAULT now(),
  parsed_ok boolean DEFAULT false,
  notes text,
  published_by uuid,
  published_at timestamptz,
  is_active boolean DEFAULT false
);

ALTER TABLE public.price_lists ENABLE ROW LEVEL SECURITY;

-- Create price_list_rows table
CREATE TABLE IF NOT EXISTS public.price_list_rows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  price_list_id uuid NOT NULL REFERENCES public.price_lists(id) ON DELETE CASCADE,
  unit_code text NOT NULL,
  price numeric,
  beds integer,
  size_sqft integer,
  status text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.price_list_rows ENABLE ROW LEVEL SECURITY;

-- Admins and managers can manage price lists
DROP POLICY IF EXISTS "Admins and managers can manage price lists" ON public.price_lists;
CREATE POLICY "Admins and managers can manage price lists"
ON public.price_lists FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Admins and managers can manage price list rows" ON public.price_list_rows;
CREATE POLICY "Admins and managers can manage price list rows"
ON public.price_list_rows FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Create publishes table to track when price lists were published
CREATE TABLE IF NOT EXISTS public.publishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dev_id text NOT NULL,
  price_list_id uuid NOT NULL,
  published_by uuid,
  published_at timestamptz DEFAULT now(),
  units_added integer DEFAULT 0,
  units_updated integer DEFAULT 0,
  units_removed integer DEFAULT 0,
  notes text
);

ALTER TABLE public.publishes ENABLE ROW LEVEL SECURITY;

-- Admins and managers can view publishes
DROP POLICY IF EXISTS "Admins and managers can view publishes" ON public.publishes;
CREATE POLICY "Admins and managers can view publishes"
ON public.publishes FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Create error_log table for tracking issues
CREATE TABLE IF NOT EXISTS public.error_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz DEFAULT now(),
  error_type text NOT NULL,
  error_message text NOT NULL,
  context jsonb,
  file_path text,
  resolved boolean DEFAULT false
);

ALTER TABLE public.error_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins and managers can view errors" ON public.error_log;
CREATE POLICY "Admins and managers can view errors"
ON public.error_log FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Admins can manage errors" ON public.error_log;
CREATE POLICY "Admins can manage errors"
ON public.error_log FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));