-- Add foreign key relationship for price_lists to developments
ALTER TABLE public.price_lists
ADD CONSTRAINT price_lists_dev_id_fkey 
FOREIGN KEY (dev_id) 
REFERENCES public.developments(id) 
ON DELETE CASCADE;