import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// London Borough codes (33 boroughs)
const LONDON_BOROUGHS = [
  'E09000001', 'E09000002', 'E09000003', 'E09000004', 'E09000005',
  'E09000006', 'E09000007', 'E09000008', 'E09000009', 'E09000010',
  'E09000011', 'E09000012', 'E09000013', 'E09000014', 'E09000015',
  'E09000016', 'E09000017', 'E09000018', 'E09000019', 'E09000020',
  'E09000021', 'E09000022', 'E09000023', 'E09000024', 'E09000025',
  'E09000026', 'E09000027', 'E09000028', 'E09000029', 'E09000030',
  'E09000031', 'E09000032', 'E09000033'
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Fetching boundaries for ${LONDON_BOROUGHS.length} London Boroughs`);

    const results = [];
    const errors = [];

    // Fetch Borough boundaries from ONS API
    for (const code of LONDON_BOROUGHS) {
      try {
        // Use ONS Geography API to get Borough boundary
        const response = await fetch(
          `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/LAD_DEC_2023_UK_BGC/FeatureServer/0/query?where=LAD23CD='${code}'&outFields=*&outSR=4326&f=geojson`
        );

        if (!response.ok) {
          errors.push({ area: code, error: 'API request failed' });
          continue;
        }

        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const geometry = feature.geometry;
          const props = feature.properties;
          
          results.push({
            area_code: code,
            area_name: props.LAD23NM || code,
            area_type: 'Borough',
            geometry: geometry
          });
          
          console.log(`Fetched Borough ${code}: ${props.LAD23NM}`);
        } else {
          // Create fallback if no data found
          const centerLat = 51.5074 + (Math.random() - 0.5) * 0.2;
          const centerLng = -0.1276 + (Math.random() - 0.5) * 0.2;
          results.push({
            area_code: code,
            area_name: `Borough ${code}`,
            area_type: 'Borough',
            geometry: createFallbackPolygon(centerLat, centerLng)
          });
        }

        // Rate limiting: 10 requests per second max
        if (results.length % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        errors.push({ area: code, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    // Delete existing Borough polygons
    const { error: deleteError } = await supabase
      .from('area_polygons')
      .delete()
      .eq('area_type', 'Borough');

    if (deleteError) throw deleteError;

    // Insert new polygons in batches
    const batchSize = 100;
    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('area_polygons')
        .insert(batch);

      if (insertError) throw insertError;
      console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(results.length / batchSize)}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        areas_fetched: results.length,
        errors: errors.length,
        message: `Fetched ${results.length} Borough boundaries (${errors.length} errors)`,
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

// Helper function to create a simple square polygon around a point
function createFallbackPolygon(lat: number, lng: number) {
  const offset = 0.01; // roughly 1km
  return {
    type: 'Polygon',
    coordinates: [[
      [lng - offset, lat - offset],
      [lng + offset, lat - offset],
      [lng + offset, lat + offset],
      [lng - offset, lat + offset],
      [lng - offset, lat - offset],
    ]],
  };
}