import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// London Borough data with simplified polygons (fallback)
const LONDON_BOROUGHS = [
  { code: 'E09000001', name: 'City of London', lat: 51.5155, lng: -0.0922 },
  { code: 'E09000002', name: 'Barking and Dagenham', lat: 51.5464, lng: 0.1293 },
  { code: 'E09000003', name: 'Barnet', lat: 51.6252, lng: -0.1517 },
  { code: 'E09000004', name: 'Bexley', lat: 51.4549, lng: 0.1505 },
  { code: 'E09000005', name: 'Brent', lat: 51.5588, lng: -0.2817 },
  { code: 'E09000006', name: 'Bromley', lat: 51.4039, lng: 0.0198 },
  { code: 'E09000007', name: 'Camden', lat: 51.5290, lng: -0.1255 },
  { code: 'E09000008', name: 'Croydon', lat: 51.3714, lng: -0.0977 },
  { code: 'E09000009', name: 'Ealing', lat: 51.5130, lng: -0.3089 },
  { code: 'E09000010', name: 'Enfield', lat: 51.6538, lng: -0.0799 },
  { code: 'E09000011', name: 'Greenwich', lat: 51.4892, lng: 0.0648 },
  { code: 'E09000012', name: 'Hackney', lat: 51.5450, lng: -0.0553 },
  { code: 'E09000013', name: 'Hammersmith and Fulham', lat: 51.4990, lng: -0.2291 },
  { code: 'E09000014', name: 'Haringey', lat: 51.5906, lng: -0.1110 },
  { code: 'E09000015', name: 'Harrow', lat: 51.5898, lng: -0.3346 },
  { code: 'E09000016', name: 'Havering', lat: 51.5779, lng: 0.2120 },
  { code: 'E09000017', name: 'Hillingdon', lat: 51.5441, lng: -0.4760 },
  { code: 'E09000018', name: 'Hounslow', lat: 51.4746, lng: -0.3677 },
  { code: 'E09000019', name: 'Islington', lat: 51.5416, lng: -0.1022 },
  { code: 'E09000020', name: 'Kensington and Chelsea', lat: 51.4991, lng: -0.1938 },
  { code: 'E09000021', name: 'Kingston upon Thames', lat: 51.4085, lng: -0.3064 },
  { code: 'E09000022', name: 'Lambeth', lat: 51.4607, lng: -0.1163 },
  { code: 'E09000023', name: 'Lewisham', lat: 51.4452, lng: -0.0209 },
  { code: 'E09000024', name: 'Merton', lat: 51.4098, lng: -0.2108 },
  { code: 'E09000025', name: 'Newham', lat: 51.5077, lng: 0.0469 },
  { code: 'E09000026', name: 'Redbridge', lat: 51.5590, lng: 0.0741 },
  { code: 'E09000027', name: 'Richmond upon Thames', lat: 51.4613, lng: -0.3037 },
  { code: 'E09000028', name: 'Southwark', lat: 51.5035, lng: -0.0804 },
  { code: 'E09000029', name: 'Sutton', lat: 51.3618, lng: -0.1945 },
  { code: 'E09000030', name: 'Tower Hamlets', lat: 51.5099, lng: -0.0059 },
  { code: 'E09000031', name: 'Waltham Forest', lat: 51.5886, lng: -0.0117 },
  { code: 'E09000032', name: 'Wandsworth', lat: 51.4571, lng: -0.1818 },
  { code: 'E09000033', name: 'Westminster', lat: 51.4975, lng: -0.1357 },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Creating ${LONDON_BOROUGHS.length} London Borough polygons`);

    const results = [];

    // Use built-in fallback polygons for all boroughs (reliable)
    for (const borough of LONDON_BOROUGHS) {
      results.push({
        area_code: borough.code,
        area_name: borough.name,
        area_type: 'Borough',
        geometry: createBoroughPolygon(borough.lat, borough.lng)
      });
      
      console.log(`Created Borough ${borough.code}: ${borough.name}`);
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

// Helper function to create a realistic borough-sized polygon around a point
function createBoroughPolygon(lat: number, lng: number) {
  const offset = 0.05; // roughly 5km for borough size
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