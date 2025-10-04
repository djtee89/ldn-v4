import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching area boundaries...');

    // Get all area metrics
    const { data: areas, error: areasError } = await supabase
      .from('area_metrics')
      .select('id, area_code, area_name, area_type, center_lat, center_lng');

    if (areasError) throw areasError;

    console.log(`Processing ${areas?.length || 0} areas`);

    const insertData = [];

    for (const area of areas || []) {
      try {
        console.log(`Fetching boundary for ${area.area_code}...`);
        
        // Use Nominatim API to search for the postcode boundary
        const searchUrl = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(area.area_code)}&country=GB&format=json&polygon_geojson=1&limit=1`;
        
        const response = await fetch(searchUrl, {
          headers: {
            'User-Agent': 'PropertyAnalysisTool/1.0'
          }
        });

        if (!response.ok) {
          console.error(`Failed to fetch for ${area.area_code}: ${response.status}`);
          // Create a simple bounding box polygon as fallback
          const geometry = createFallbackPolygon(area.center_lat, area.center_lng);
          insertData.push({
            area_code: area.area_code,
            area_name: area.area_name,
            area_type: area.area_type,
            geometry: geometry,
          });
          continue;
        }

        const data = await response.json();

        if (data && data.length > 0 && data[0].geojson) {
          insertData.push({
            area_code: area.area_code,
            area_name: area.area_name,
            area_type: area.area_type,
            geometry: data[0].geojson,
          });
          console.log(`✓ Found boundary for ${area.area_code}`);
        } else {
          // Create fallback polygon
          console.log(`No boundary found for ${area.area_code}, using fallback`);
          const geometry = createFallbackPolygon(area.center_lat, area.center_lng);
          insertData.push({
            area_code: area.area_code,
            area_name: area.area_name,
            area_type: area.area_type,
            geometry: geometry,
          });
        }

        // Rate limit: wait 1 second between requests (Nominatim requirement)
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing ${area.area_code}:`, error);
        // Create fallback polygon on error
        const geometry = createFallbackPolygon(area.center_lat, area.center_lng);
        insertData.push({
          area_code: area.area_code,
          area_name: area.area_name,
          area_type: area.area_type,
          geometry: geometry,
        });
      }
    }

    // Insert all polygons
    if (insertData.length > 0) {
      console.log(`Inserting ${insertData.length} area boundaries...`);
      
      // Delete existing polygons first
      const { error: deleteError } = await supabase
        .from('area_polygons')
        .delete()
        .in('area_code', insertData.map(d => d.area_code));

      if (deleteError) {
        console.error('Failed to delete existing polygons:', deleteError);
      }

      // Insert new polygons
      const { error: insertError } = await supabase
        .from('area_polygons')
        .insert(insertData);

      if (insertError) {
        throw insertError;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        areas_processed: insertData.length,
        message: `Fetched and stored boundaries for ${insertData.length} areas`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error fetching area boundaries:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper function to create a simple square polygon around a center point
function createFallbackPolygon(lat: number, lng: number) {
  // Create a simple square ~1km on each side
  const offset = 0.009; // roughly 1km
  
  return {
    type: 'Polygon',
    coordinates: [[
      [lng - offset, lat - offset],
      [lng + offset, lat - offset],
      [lng + offset, lat + offset],
      [lng - offset, lat + offset],
      [lng - offset, lat - offset],
    ]]
  };
}
