-- Update the ingest bucket to allow PDF files
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
WHERE id = 'ingest';