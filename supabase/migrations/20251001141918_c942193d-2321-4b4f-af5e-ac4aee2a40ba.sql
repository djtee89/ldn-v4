-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION public.match_rag_chunks(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 6,
  filter_dev_id text DEFAULT NULL
)
RETURNS TABLE (
  id bigint,
  dev_id text,
  source text,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rag_chunks.id,
    rag_chunks.dev_id,
    rag_chunks.source,
    rag_chunks.content,
    1 - (rag_chunks.embedding <=> query_embedding) as similarity
  FROM public.rag_chunks
  WHERE 
    (filter_dev_id IS NULL OR rag_chunks.dev_id = filter_dev_id)
    AND 1 - (rag_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY rag_chunks.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;