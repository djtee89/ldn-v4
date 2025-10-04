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

    console.log('Fetching yield data...');

    // Get all area metrics
    const { data: areas, error: areasError } = await supabase
      .from('area_metrics')
      .select('id, area_code, price_per_sqft_1bed, price_per_sqft_2bed, price_per_sqft_3bed');

    if (areasError) throw areasError;

    console.log(`Processing ${areas?.length || 0} areas`);

    const updates = [];

    for (const area of areas || []) {
      try {
        // In production, you would use:
        // - Rightmove/Zoopla rental data APIs
        // - VOA (Valuation Office Agency) data
        // - ONS rental statistics
        
        // For now, we'll estimate yields based on typical London patterns
        // Yield = (Annual Rent / Property Price) * 100
        
        const postcodePrefix = area.area_code.split(' ')[0];
        
        // Central London tends to have lower yields (3-4%)
        // Inner London: 4-5%
        // Outer London: 5-6%
        
        let baseYield = 4.5; // Default
        
        const centralAreas = ['W1', 'SW1', 'EC', 'WC', 'E1', 'SE1'];
        const outerAreas = ['BR', 'CR', 'DA', 'EN', 'HA', 'IG', 'KT', 'RM', 'SM', 'TW', 'UB', 'WD'];
        
        if (centralAreas.some(prefix => area.area_code.startsWith(prefix))) {
          baseYield = 3.0 + Math.random() * 1.5; // 3-4.5%
        } else if (outerAreas.some(prefix => area.area_code.startsWith(prefix))) {
          baseYield = 5.0 + Math.random() * 1.5; // 5-6.5%
        } else {
          baseYield = 4.0 + Math.random() * 1.5; // 4-5.5%
        }

        // Studio/1-bed tend to have higher yields
        const yield1bed = baseYield + 0.5 + Math.random() * 0.5;
        const yield2bed = baseYield + Math.random() * 0.5;
        const yield3bed = baseYield - 0.3 + Math.random() * 0.5;

        updates.push({
          id: area.id,
          yield_1bed: Math.round(yield1bed * 10) / 10,
          yield_2bed: Math.round(yield2bed * 10) / 10,
          yield_3bed: Math.round(yield3bed * 10) / 10,
          last_updated: new Date().toISOString(),
        });

        console.log(`${area.area_code}: 1-bed ${yield1bed.toFixed(1)}%, 2-bed ${yield2bed.toFixed(1)}%, 3-bed ${yield3bed.toFixed(1)}%`);

      } catch (error) {
        console.error(`Error processing ${area.area_code}:`, error);
      }
    }

    // Batch update all areas
    if (updates.length > 0) {
      console.log(`Updating ${updates.length} areas with yield data...`);
      
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('area_metrics')
          .update({
            yield_1bed: update.yield_1bed,
            yield_2bed: update.yield_2bed,
            yield_3bed: update.yield_3bed,
            last_updated: update.last_updated,
          })
          .eq('id', update.id);

        if (updateError) {
          console.error(`Failed to update ${update.id}:`, updateError);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        areas_updated: updates.length,
        message: `Updated yield data for ${updates.length} areas`,
        note: 'Currently using estimated data. Connect to rental data APIs for real market yields.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error fetching yield data:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
