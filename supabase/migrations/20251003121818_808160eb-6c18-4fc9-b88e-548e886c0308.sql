-- Add service_charge column to units table
ALTER TABLE public.units 
ADD COLUMN service_charge numeric;

-- Add service_charge column to price_list_rows table
ALTER TABLE public.price_list_rows 
ADD COLUMN service_charge numeric;

-- Add comment to document the column
COMMENT ON COLUMN public.units.service_charge IS 'Annual service charge for the unit';
COMMENT ON COLUMN public.price_list_rows.service_charge IS 'Annual service charge for the unit from price list';