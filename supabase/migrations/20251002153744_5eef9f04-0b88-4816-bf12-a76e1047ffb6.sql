-- Create storage buckets for price lists and images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('ingest', 'ingest', false, 52428800, ARRAY['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
  ('dev-images', 'dev-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- RLS policies for ingest bucket (admin only)
CREATE POLICY "Admins can upload to ingest"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ingest' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can read from ingest"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'ingest' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- RLS policies for dev-images bucket
CREATE POLICY "Anyone can view dev images"
ON storage.objects FOR SELECT
USING (bucket_id = 'dev-images');

CREATE POLICY "Admins can upload dev images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'dev-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update dev images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'dev-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete dev images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'dev-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);