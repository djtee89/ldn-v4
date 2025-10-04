import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting neighbourhood mapping...');

    // Fetch all neighbourhoods
    const { data: neighbourhoods, error: nError } = await supabase
      .from('neighbourhoods')
      .select('*')
      .order('borough', { ascending: true });

    if (nError) throw nError;

    // Fetch borough polygons (we'll use these since we don't have ward data yet)
    const { data: boroughs, error: bError } = await supabase
      .from('area_polygons')
      .select('*')
      .eq('area_type', 'Borough');

    if (bError) throw bError;

    console.log(`Found ${neighbourhoods.length} neighbourhoods and ${boroughs?.length || 0} boroughs`);

    if (!boroughs || boroughs.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No borough polygons found. Please fetch boundaries first.',
          neighbourhoods_total: neighbourhoods.length,
          boroughs_found: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create a normalized borough lookup
    const boroughMap = new Map();
    boroughs.forEach(b => {
      const normalized = b.area_name.toLowerCase().replace(/[^a-z]/g, '');
      boroughMap.set(normalized, b);
    });

    // Map neighbourhoods to their borough polygons
    let mappedCount = 0;
    const mappings = [];

    for (const neighbourhood of neighbourhoods) {
      const normalizedBorough = neighbourhood.borough.toLowerCase().replace(/[^a-z]/g, '');
      const borough = boroughMap.get(normalizedBorough);

      if (borough && borough.geometry) {
        mappings.push({
          neighbourhood_id: neighbourhood.id,
          area_type: 'Borough',
          polygon_ids: [borough.area_code],
          union_geometry: borough.geometry,
        });
        mappedCount++;
      } else {
        console.log(`No borough match for: ${neighbourhood.borough}`);
      }
    }

    console.log(`Created ${mappings.length} mappings`);

    // Batch insert/upsert mappings
    if (mappings.length > 0) {
      const { error: insertError } = await supabase
        .from('neighbourhood_polygons')
        .upsert(mappings, { onConflict: 'neighbourhood_id' });

      if (insertError) throw insertError;
    }

    // Calculate neighbourhood prices based on borough averages with variation
    const { data: areaMetrics, error: mError } = await supabase
      .from('area_metrics')
      .select('*')
      .eq('area_type', 'Borough');

    if (mError) throw mError;

    // Update price estimates
    for (const neighbourhood of neighbourhoods) {
      const normalizedBorough = neighbourhood.borough.toLowerCase().replace(/[^a-z]/g, '');
      const boroughMetric = areaMetrics?.find(m => 
        m.area_name.toLowerCase().replace(/[^a-z]/g, '') === normalizedBorough
      );

      if (boroughMetric && boroughMetric.price_per_sqft_overall) {
        const basePrice = boroughMetric.price_per_sqft_overall;
        let priceVariation = 1.0;

        // Premium areas get higher prices
        const premiumKeywords = ['village', 'park', 'green', 'square', 'hill', 'heath', 'gardens'];
        const affordableKeywords = ['estate', 'town', 'junction', 'road', 'lane'];
        
        const nameLower = neighbourhood.name.toLowerCase();
        if (premiumKeywords.some(k => nameLower.includes(k))) {
          priceVariation = 1.2;
        } else if (affordableKeywords.some(k => nameLower.includes(k))) {
          priceVariation = 0.85;
        }

        const estimatedPrice = Math.round(basePrice * priceVariation);
        
        await supabase
          .from('neighbourhood_polygons')
          .update({ price_per_sqft: estimatedPrice })
          .eq('neighbourhood_id', neighbourhood.id);
      }
    }

    console.log('Mapping complete');

    return new Response(
      JSON.stringify({ 
        success: true,
        neighbourhoods_total: neighbourhoods.length,
        neighbourhoods_mapped: mappedCount,
        boroughs_available: boroughs.length,
        message: `Successfully mapped ${mappedCount} neighbourhoods to ${boroughs.length} boroughs`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
