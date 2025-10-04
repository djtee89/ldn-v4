-- Add price_per_sqft column to neighbourhood_polygons if it doesn't exist
ALTER TABLE neighbourhood_polygons 
ADD COLUMN IF NOT EXISTS price_per_sqft numeric;