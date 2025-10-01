-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Table for RAG document chunks with embeddings
CREATE TABLE public.rag_chunks (
  id BIGSERIAL PRIMARY KEY,
  dev_id TEXT NOT NULL,
  source TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(768) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast vector similarity search
CREATE INDEX rag_chunks_embedding_idx ON public.rag_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Index for filtering by dev_id
CREATE INDEX rag_chunks_dev_id_idx ON public.rag_chunks(dev_id);

-- Table for property units
CREATE TABLE public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dev_id TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  beds INTEGER NOT NULL,
  price DECIMAL NOT NULL,
  size_sqft INTEGER NOT NULL,
  aspect TEXT,
  floor INTEGER,
  status TEXT NOT NULL DEFAULT 'Available',
  building TEXT,
  completion_date TEXT,
  has_balcony BOOLEAN DEFAULT false,
  view_park BOOLEAN DEFAULT false,
  view_river BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for unit searches
CREATE INDEX units_dev_id_idx ON public.units(dev_id);
CREATE INDEX units_status_idx ON public.units(status);
CREATE INDEX units_price_idx ON public.units(price);
CREATE INDEX units_beds_idx ON public.units(beds);

-- Enable RLS
ALTER TABLE public.rag_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Public read access for rag_chunks
CREATE POLICY "Public can read rag chunks"
ON public.rag_chunks
FOR SELECT
USING (true);

-- Public read access for units
CREATE POLICY "Public can read units"
ON public.units
FOR SELECT
USING (true);

-- Admin can manage rag_chunks
CREATE POLICY "Admins can manage rag chunks"
ON public.rag_chunks
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can manage units
CREATE POLICY "Admins can manage units"
ON public.units
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));