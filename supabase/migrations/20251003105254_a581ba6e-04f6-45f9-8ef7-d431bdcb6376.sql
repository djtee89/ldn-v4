-- Add foreign key constraint from hottest_unit.unit_id to units.id
-- This enables Supabase to automatically join these tables in queries

ALTER TABLE public.hottest_unit
ADD CONSTRAINT fk_hottest_unit_unit_id
FOREIGN KEY (unit_id)
REFERENCES public.units(id)
ON DELETE CASCADE;