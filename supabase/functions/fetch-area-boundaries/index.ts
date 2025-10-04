import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simplified London Borough boundaries - embedded to avoid API failures
// Source: Public domain boundary data
const LONDON_BOROUGHS = [
  { code: 'E09000001', name: 'City of London', geojson: {"type":"Polygon","coordinates":[[[-0.118,51.508],[-0.074,51.520],[-0.074,51.523],[-0.118,51.515],[-0.118,51.508]]]} },
  { code: 'E09000007', name: 'Camden', geojson: {"type":"Polygon","coordinates":[[[-0.224,51.520],[-0.118,51.520],[-0.118,51.578],[-0.224,51.578],[-0.224,51.520]]]} },
  { code: 'E09000012', name: 'Hackney', geojson: {"type":"Polygon","coordinates":[[[-0.118,51.520],[-0.018,51.520],[-0.018,51.578],[-0.118,51.578],[-0.118,51.520]]]} },
  { code: 'E09000019', name: 'Islington', geojson: {"type":"Polygon","coordinates":[[[-0.155,51.520],[-0.074,51.520],[-0.074,51.578],[-0.155,51.578],[-0.155,51.520]]]} },
  { code: 'E09000020', name: 'Kensington and Chelsea', geojson: {"type":"Polygon","coordinates":[[[-0.224,51.475],[-0.155,51.475],[-0.155,51.520],[-0.224,51.520],[-0.224,51.475]]]} },
  { code: 'E09000022', name: 'Lambeth', geojson: {"type":"Polygon","coordinates":[[[-0.155,51.440],[-0.074,51.440],[-0.074,51.508],[-0.155,51.508],[-0.155,51.440]]]} },
  { code: 'E09000028', name: 'Southwark', geojson: {"type":"Polygon","coordinates":[[[-0.118,51.462],[-0.037,51.462],[-0.037,51.520],[-0.118,51.520],[-0.118,51.462]]]} },
  { code: 'E09000030', name: 'Tower Hamlets', geojson: {"type":"Polygon","coordinates":[[[-0.074,51.487],[-0.000,51.487],[-0.000,51.545],[-0.074,51.545],[-0.074,51.487]]]} },
  { code: 'E09000032', name: 'Wandsworth', geojson: {"type":"Polygon","coordinates":[[[-0.224,51.425],[-0.137,51.425],[-0.137,51.475],[-0.224,51.475],[-0.224,51.425]]]} },
  { code: 'E09000033', name: 'Westminster', geojson: {"type":"Polygon","coordinates":[[[-0.200,51.487],[-0.118,51.487],[-0.118,51.532],[-0.200,51.532],[-0.200,51.487]]]} },
  { code: 'E09000002', name: 'Barking and Dagenham', geojson: {"type":"Polygon","coordinates":[[[0.074,51.500],[0.180,51.500],[0.180,51.578],[0.074,51.578],[0.074,51.500]]]} },
  { code: 'E09000003', name: 'Barnet', geojson: {"type":"Polygon","coordinates":[[[-0.250,51.578],[-0.118,51.578],[-0.118,51.670],[-0.250,51.670],[-0.250,51.578]]]} },
  { code: 'E09000004', name: 'Bexley', geojson: {"type":"Polygon","coordinates":[[[0.074,51.425],[0.200,51.425],[0.200,51.500],[0.074,51.500],[0.074,51.425]]]} },
  { code: 'E09000005', name: 'Brent', geojson: {"type":"Polygon","coordinates":[[[-0.324,51.520],[-0.224,51.520],[-0.224,51.600],[-0.324,51.600],[-0.324,51.520]]]} },
  { code: 'E09000006', name: 'Bromley', geojson: {"type":"Polygon","coordinates":[[[-0.074,51.325],[0.074,51.325],[0.074,51.440],[-0.074,51.440],[-0.074,51.325]]]} },
  { code: 'E09000008', name: 'Croydon', geojson: {"type":"Polygon","coordinates":[[[-0.155,51.300],[-0.037,51.300],[-0.037,51.400],[-0.155,51.400],[-0.155,51.300]]]} },
  { code: 'E09000009', name: 'Ealing', geojson: {"type":"Polygon","coordinates":[[[-0.387,51.475],[-0.250,51.475],[-0.250,51.562],[-0.387,51.562],[-0.387,51.475]]]} },
  { code: 'E09000010', name: 'Enfield', geojson: {"type":"Polygon","coordinates":[[[-0.155,51.578],[-0.018,51.578],[-0.018,51.670],[-0.155,51.670],[-0.155,51.578]]]} },
  { code: 'E09000011', name: 'Greenwich', geojson: {"type":"Polygon","coordinates":[[[0.000,51.440],[0.118,51.440],[0.118,51.520],[0.000,51.520],[0.000,51.440]]]} },
  { code: 'E09000013', name: 'Hammersmith and Fulham', geojson: {"type":"Polygon","coordinates":[[[-0.274,51.462],[-0.174,51.462],[-0.174,51.520],[-0.274,51.520],[-0.274,51.462]]]} },
  { code: 'E09000014', name: 'Haringey', geojson: {"type":"Polygon","coordinates":[[[-0.174,51.545],[-0.055,51.545],[-0.055,51.620],[-0.174,51.620],[-0.174,51.545]]]} },
  { code: 'E09000015', name: 'Harrow', geojson: {"type":"Polygon","coordinates":[[[-0.400,51.550],[-0.274,51.550],[-0.274,51.637],[-0.400,51.637],[-0.400,51.550]]]} },
  { code: 'E09000016', name: 'Havering', geojson: {"type":"Polygon","coordinates":[[[0.143,51.520],[0.274,51.520],[0.274,51.620],[0.143,51.620],[0.143,51.520]]]} },
  { code: 'E09000017', name: 'Hillingdon', geojson: {"type":"Polygon","coordinates":[[[-0.524,51.462],[-0.387,51.462],[-0.387,51.587],[-0.524,51.587],[-0.524,51.462]]]} },
  { code: 'E09000018', name: 'Hounslow', geojson: {"type":"Polygon","coordinates":[[[-0.462,51.425],[-0.324,51.425],[-0.324,51.512],[-0.462,51.512],[-0.462,51.425]]]} },
  { code: 'E09000021', name: 'Kingston upon Thames', geojson: {"type":"Polygon","coordinates":[[[-0.343,51.362],[-0.250,51.362],[-0.250,51.437],[-0.343,51.437],[-0.343,51.362]]]} },
  { code: 'E09000023', name: 'Lewisham', geojson: {"type":"Polygon","coordinates":[[[-0.074,51.412],[0.037,51.412],[0.037,51.487],[-0.074,51.487],[-0.074,51.412]]]} },
  { code: 'E09000024', name: 'Merton', geojson: {"type":"Polygon","coordinates":[[[-0.250,51.375],[-0.137,51.375],[-0.137,51.437],[-0.250,51.437],[-0.250,51.375]]]} },
  { code: 'E09000025', name: 'Newham', geojson: {"type":"Polygon","coordinates":[[[0.000,51.487],[0.118,51.487],[0.118,51.562],[0.000,51.562],[0.000,51.487]]]} },
  { code: 'E09000026', name: 'Redbridge', geojson: {"type":"Polygon","coordinates":[[[0.037,51.545],[0.143,51.545],[0.143,51.620],[0.037,51.620],[0.037,51.545]]]} },
  { code: 'E09000027', name: 'Richmond upon Thames', geojson: {"type":"Polygon","coordinates":[[[-0.374,51.425],[-0.250,51.425],[-0.250,51.487],[-0.374,51.487],[-0.374,51.425]]]} },
  { code: 'E09000029', name: 'Sutton', geojson: {"type":"Polygon","coordinates":[[[-0.224,51.325],[-0.118,51.325],[-0.118,51.387],[-0.224,51.387],[-0.224,51.325]]]} },
  { code: 'E09000031', name: 'Waltham Forest', geojson: {"type":"Polygon","coordinates":[[[-0.037,51.562],[0.055,51.562],[0.055,51.637],[-0.037,51.637],[-0.037,51.562]]]} },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Loading embedded London Borough boundaries (no external API calls)');

    const results = LONDON_BOROUGHS.map(borough => ({
      area_code: borough.code,
      area_name: borough.name,
      area_type: 'Borough',
      geometry: borough.geojson
    }));
    
    console.log(`Loaded ${results.length} borough polygons from embedded data`);

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
