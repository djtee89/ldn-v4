import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Real London Borough boundaries from ONS Open Geography Portal
// Fetched from official source with accurate polygon geometries
async function fetchRealBoroughBoundaries() {
  const boroughCodes = [
    { code: 'E09000001', name: 'City of London' },
    { code: 'E09000007', name: 'Camden' },
    { code: 'E09000012', name: 'Hackney' },
    { code: 'E09000019', name: 'Islington' },
    { code: 'E09000020', name: 'Kensington and Chelsea' },
    { code: 'E09000022', name: 'Lambeth' },
    { code: 'E09000028', name: 'Southwark' },
    { code: 'E09000030', name: 'Tower Hamlets' },
    { code: 'E09000032', name: 'Wandsworth' },
    { code: 'E09000033', name: 'Westminster' },
    { code: 'E09000002', name: 'Barking and Dagenham' },
    { code: 'E09000003', name: 'Barnet' },
    { code: 'E09000004', name: 'Bexley' },
    { code: 'E09000005', name: 'Brent' },
    { code: 'E09000006', name: 'Bromley' },
    { code: 'E09000008', name: 'Croydon' },
    { code: 'E09000009', name: 'Ealing' },
    { code: 'E09000010', name: 'Enfield' },
    { code: 'E09000011', name: 'Greenwich' },
    { code: 'E09000013', name: 'Hammersmith and Fulham' },
    { code: 'E09000014', name: 'Haringey' },
    { code: 'E09000015', name: 'Harrow' },
    { code: 'E09000016', name: 'Havering' },
    { code: 'E09000017', name: 'Hillingdon' },
    { code: 'E09000018', name: 'Hounslow' },
    { code: 'E09000021', name: 'Kingston upon Thames' },
    { code: 'E09000023', name: 'Lewisham' },
    { code: 'E09000024', name: 'Merton' },
    { code: 'E09000025', name: 'Newham' },
    { code: 'E09000026', name: 'Redbridge' },
    { code: 'E09000027', name: 'Richmond upon Thames' },
    { code: 'E09000029', name: 'Sutton' },
    { code: 'E09000031', name: 'Waltham Forest' },
  ];

  const results = [];
  
  // Fetch all boroughs in batches
  for (const borough of boroughCodes) {
    try {
      const url = `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Local_Authority_Districts_December_2021_UK_BFE_V3/FeatureServer/0/query?where=LAD21CD='${borough.code}'&outFields=*&outSR=4326&f=geojson`;
      
      const response = await fetch(url);
      if (!response.ok) {
        console.log(`Failed to fetch ${borough.name}, will skip`);
        continue;
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        results.push({
          area_code: borough.code,
          area_name: borough.name,
          area_type: 'Borough',
          geometry: feature.geometry
        });
        console.log(`Fetched ${borough.name} successfully`);
      }
    } catch (error) {
      console.log(`Error fetching ${borough.name}:`, error);
    }
  }
  
  return results;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching real London Borough boundaries from ONS ArcGIS');

    const results = await fetchRealBoroughBoundaries();
    
    console.log(`Fetched ${results.length} borough polygons with real boundaries`);

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
        message: `Created ${results.length} Borough polygons`,
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
