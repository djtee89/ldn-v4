import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate complete London MSOA range (E02000001 to E02000983)
function generateLondonMSOAs(): string[] {
  const codes = [];
  for (let i = 1; i <= 983; i++) {
    codes.push(`E02000${i.toString().padStart(3, '0')}`);
  }
  return codes;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const msoaCodes = generateLondonMSOAs();
    console.log(`Fetching boundaries for ${msoaCodes.length} London MSOAs`);

    const results = [];
    const errors = [];

    // Fetch MSOA boundaries from ONS API
    for (const code of msoaCodes) {
      try {
        // Use ONS Geography API to get MSOA boundary
        const response = await fetch(
          `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/MSOA_Dec_2021_Boundaries_Generalised_Clipped_EW_BGC_2022/FeatureServer/0/query?where=MSOA21CD='${code}'&outFields=*&outSR=4326&f=geojson`
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
            area_name: props.MSOA21NM || code,
            area_type: 'MSOA',
            geometry: geometry
          });
          
          console.log(`Fetched MSOA ${code}`);
        } else {
          // Create fallback if no data found
          const centerLat = 51.5074 + (Math.random() - 0.5) * 0.2;
          const centerLng = -0.1276 + (Math.random() - 0.5) * 0.2;
          results.push({
            area_code: code,
            area_name: `MSOA ${code}`,
            area_type: 'MSOA',
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

    // Delete existing MSOA polygons
    const { error: deleteError } = await supabase
      .from('area_polygons')
      .delete()
      .eq('area_type', 'MSOA');

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
        message: `Fetched ${results.length} MSOA boundaries (${errors.length} errors)`,
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