-- Add unique constraint for upsert operations
ALTER TABLE public.units 
DROP CONSTRAINT IF EXISTS units_dev_id_unit_number_key;

ALTER TABLE public.units 
ADD CONSTRAINT units_dev_id_unit_number_key 
UNIQUE (dev_id, unit_number);