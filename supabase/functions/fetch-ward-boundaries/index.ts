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

    console.log('Fetching London ward boundaries...');

    // Fetch ward boundaries from ONS API with correct parameter format
    const params = new URLSearchParams({
      where: "1=1",  // Get all records
      outFields: "WD23CD,WD23NM,LAD23CD,LAD23NM",
      outSR: "4326",
      f: "geoJSON"
    });

    const wardResponse = await fetch(
      `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/WD_DEC_2023_GB_BFE/FeatureServer/0/query?${params}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!wardResponse.ok) {
      const errorText = await wardResponse.text();
      console.error('ONS API error response:', errorText);
      throw new Error(`ONS API returned ${wardResponse.status}: ${errorText}`);
    }

    const wardData = await wardResponse.json();
    
    if (!wardData.features || wardData.features.length === 0) {
      throw new Error('No ward data returned from ONS API');
    }

    console.log(`Fetched ${wardData.features.length} wards from ONS`);

    // Filter for London wards only (LAD codes E09000001-E09000033)
    const londonWards = wardData.features.filter((feature: any) => {
      const ladCode = feature.properties.LAD23CD;
      return ladCode && ladCode.match(/^E09000\d{3}$/);
    });

    console.log(`Filtered to ${londonWards.length} London wards`);

    // Transform to our schema
    const results = londonWards.map((feature: any) => ({
      area_code: feature.properties.WD23CD,
      area_name: feature.properties.WD23NM,
      area_type: 'Ward',
      geometry: feature.geometry,
    }));

    // Delete existing Ward polygons
    const { error: deleteError } = await supabase
      .from('area_polygons')
      .delete()
      .eq('area_type', 'Ward');

    if (deleteError) throw deleteError;
    console.log('Deleted existing ward polygons');

    // Insert new ward polygons in batches
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('area_polygons')
        .insert(batch);

      if (insertError) throw insertError;
      insertedCount += batch.length;
      console.log(`Inserted ${insertedCount}/${results.length} wards`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        wards_fetched: results.length,
        message: `Created ${results.length} ward polygons`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error fetching ward boundaries:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
