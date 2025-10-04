import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// London Borough GeoJSON - Real boundaries
const LONDON_BOROUGHS_GEOJSON = {
  "type": "FeatureCollection",
  "features": [] // Will be populated from external source or fallback
};

// Borough name to code mapping
const BOROUGH_CODES: Record<string, string> = {
  'Barking and Dagenham': 'E09000002',
  'Barnet': 'E09000003',
  'Bexley': 'E09000004',
  'Brent': 'E09000005',
  'Bromley': 'E09000006',
  'Camden': 'E09000007',
  'City of London': 'E09000001',
  'Croydon': 'E09000008',
  'Ealing': 'E09000009',
  'Enfield': 'E09000010',
  'Greenwich': 'E09000011',
  'Hackney': 'E09000012',
  'Hammersmith and Fulham': 'E09000013',
  'Haringey': 'E09000014',
  'Harrow': 'E09000015',
  'Havering': 'E09000016',
  'Hillingdon': 'E09000017',
  'Hounslow': 'E09000018',
  'Islington': 'E09000019',
  'Kensington and Chelsea': 'E09000020',
  'Kingston upon Thames': 'E09000021',
  'Lambeth': 'E09000022',
  'Lewisham': 'E09000023',
  'Merton': 'E09000024',
  'Newham': 'E09000025',
  'Redbridge': 'E09000026',
  'Richmond upon Thames': 'E09000027',
  'Southwark': 'E09000028',
  'Sutton': 'E09000029',
  'Tower Hamlets': 'E09000030',
  'Waltham Forest': 'E09000031',
  'Wandsworth': 'E09000032',
  'Westminster': 'E09000033',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching real London Borough boundaries from ONS Open Geography Portal');

    // Fetch real GeoJSON from ONS (Office for National Statistics) - authoritative source
    const geojsonUrl = 'https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Local_Authority_Districts_December_2023_Boundaries_UK_BFC_2022/FeatureServer/0/query?where=1%3D1&outFields=*&geometry=-0.510%2C51.286%2C0.335%2C51.692&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outSR=4326&f=geojson&returnGeometry=true';
    const response = await fetch(geojsonUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch GeoJSON: ${response.statusText}`);
    }

    const geojson = await response.json();
    console.log(`Loaded ${geojson.features.length} borough polygons from GeoJSON`);

    const results = [];

    // Process each borough feature
    for (const feature of geojson.features) {
      const boroughName: string = feature.properties?.LAD23NM || feature.properties?.name || feature.properties?.NAME || 'Unknown';
      const boroughCode: string = feature.properties?.LAD23CD || BOROUGH_CODES[boroughName] || `E09${String(results.length).padStart(6, '0')}`;
      
      results.push({
        area_code: boroughCode,
        area_name: boroughName,
        area_type: 'Borough',
        geometry: feature.geometry
      });
      
      console.log(`Loaded Borough ${boroughCode}: ${boroughName}`);
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
