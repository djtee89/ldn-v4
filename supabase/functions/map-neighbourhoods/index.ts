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

    // Fetch all ward polygons from area_polygons
    const { data: wards, error: wError } = await supabase
      .from('area_polygons')
      .select('*')
      .eq('area_type', 'Ward');

    if (wError) throw wError;

    console.log(`Found ${neighbourhoods.length} neighbourhoods and ${wards?.length || 0} wards`);

    if (!wards || wards.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No ward polygons found. Please fetch ward boundaries first.',
          neighbourhoods_total: neighbourhoods.length,
          wards_found: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Simple mapping: assign wards to neighbourhoods based on name similarity and borough
    let mappedCount = 0;
    const mappings = [];

    for (const neighbourhood of neighbourhoods) {
      // Find wards that match the neighbourhood name or are in the same borough
      const matchingWards = wards.filter(ward => {
        const wardName = (ward.area_name || '').toLowerCase();
        const neighbourhoodName = neighbourhood.name.toLowerCase();
        const boroughMatch = wardName.includes(neighbourhood.borough.toLowerCase());
        const nameMatch = wardName.includes(neighbourhoodName) || 
                         neighbourhoodName.includes(wardName);
        
        return nameMatch || (boroughMatch && wardName.length < 50);
      });

      if (matchingWards.length > 0) {
        // Create union geometry from all matching wards
        const wardPolygonIds = matchingWards.map(w => w.area_code);
        
        // Simple union: just use the first ward's geometry for now
        // In production, you'd want proper GIS union
        const unionGeometry = matchingWards[0].geometry;

        mappings.push({
          neighbourhood_id: neighbourhood.id,
          area_type: 'Ward',
          polygon_ids: wardPolygonIds,
          union_geometry: unionGeometry,
        });

        mappedCount++;
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

    // Calculate sample neighbourhood prices based on borough averages
    const { data: areaMetrics, error: mError } = await supabase
      .from('area_metrics')
      .select('*')
      .eq('area_type', 'Borough');

    if (mError) throw mError;

    // Update neighbourhoods with price estimates
    for (const neighbourhood of neighbourhoods) {
      const boroughMetric = areaMetrics?.find(m => 
        m.area_name.toLowerCase() === neighbourhood.borough.toLowerCase()
      );

      if (boroughMetric && boroughMetric.price_per_sqft_overall) {
        // Add some variation based on neighbourhood name
        const basePrice = boroughMetric.price_per_sqft_overall;
        let priceVariation = 1.0;

        // Premium areas get higher prices
        const premiumKeywords = ['village', 'park', 'green', 'square', 'hill', 'heath'];
        const affordableKeywords = ['estate', 'town', 'junction', 'road'];
        
        const nameLower = neighbourhood.name.toLowerCase();
        if (premiumKeywords.some(k => nameLower.includes(k))) {
          priceVariation = 1.15;
        } else if (affordableKeywords.some(k => nameLower.includes(k))) {
          priceVariation = 0.85;
        }

        const estimatedPrice = Math.round(basePrice * priceVariation);
        
        // Store in neighbourhood_polygons
        await supabase
          .from('neighbourhood_polygons')
          .update({ 
            union_geometry: {
              ...mappings.find(m => m.neighbourhood_id === neighbourhood.id)?.union_geometry,
              properties: {
                ...mappings.find(m => m.neighbourhood_id === neighbourhood.id)?.union_geometry?.properties,
                price_per_sqft: estimatedPrice,
              }
            }
          })
          .eq('neighbourhood_id', neighbourhood.id);
      }
    }

    console.log('Mapping complete');

    return new Response(
      JSON.stringify({ 
        success: true,
        neighbourhoods_total: neighbourhoods.length,
        neighbourhoods_mapped: mappedCount,
        wards_available: wards.length,
        message: `Successfully mapped ${mappedCount} neighbourhoods`,
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
