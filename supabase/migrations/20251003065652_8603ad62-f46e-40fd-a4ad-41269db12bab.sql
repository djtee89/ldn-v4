-- Phase 1: Database Consolidation
-- Remove unnecessary tables that are bloat

-- Drop discovery and scraping related tables (not used)
DROP TABLE IF EXISTS public.discovery_queue CASCADE;
DROP TABLE IF EXISTS public.scrape_jobs CASCADE;
DROP TABLE IF EXISTS public.email_ingests CASCADE;

-- Drop AI/RAG related tables (chatbot not integrated)
DROP TABLE IF EXISTS public.rag_chunks CASCADE;

-- Drop overcomplicated admin/monitoring tables
DROP TABLE IF EXISTS public.scheduled_tasks CASCADE;
DROP TABLE IF EXISTS public.header_mappings CASCADE;
DROP TABLE IF EXISTS public.error_log CASCADE;
DROP TABLE IF EXISTS public.unit_anomalies CASCADE;
DROP TABLE IF EXISTS public.image_validation CASCADE;

-- Keep these 10 core tables:
-- ✅ developments (main database)
-- ✅ units (inventory)
-- ✅ price_lists (upload history)
-- ✅ price_list_rows (price data)
-- ✅ hottest_unit (best value tracking)
-- ✅ bookings (customer inquiries)
-- ✅ developer_registry (developer config)
-- ✅ publishes (publish history)
-- ✅ change_log (audit trail)
-- ✅ user_roles (permissions)

-- Phase 3: Storage Bucket Cleanup
-- Remove duplicate dev-images bucket
DELETE FROM storage.buckets WHERE id = 'dev-images';

-- Keep only:
-- ✅ development-images (public, for all development photos)
-- ✅ ingest (private, for price list uploads)