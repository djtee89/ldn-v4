-- Create storage bucket for development images
INSERT INTO storage.buckets (id, name, public)
VALUES ('development-images', 'development-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to development images
CREATE POLICY "Public can view development images"
ON storage.objects FOR SELECT
USING (bucket_id = 'development-images');

-- Allow admins to upload development images
CREATE POLICY "Admins can upload development images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'development-images' 
  AND (auth.uid() IS NULL OR has_role(auth.uid(), 'admin'::app_role))
);

-- Allow admins to update development images
CREATE POLICY "Admins can update development images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'development-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete development images
CREATE POLICY "Admins can delete development images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'development-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);