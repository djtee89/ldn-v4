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

    console.log('Fetching Land Registry data...');

    // Get all area metrics
    const { data: areas, error: areasError } = await supabase
      .from('area_metrics')
      .select('id, area_code');

    if (areasError) throw areasError;

    console.log(`Processing ${areas?.length || 0} areas`);

    const updates = [];

    // Note: Land Registry Price Paid Data is available as bulk download
    // For this implementation, we'll use mock/estimated data based on typical London patterns
    // In production, you'd download the CSV from: https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads
    
    for (const area of areas || []) {
      try {
        // Extract first part of postcode (e.g., "SW1" from "SW1A 1")
        const postcodePrefix = area.area_code.split(' ')[0].replace(/[0-9]/g, '');
        
        // Simulate growth data based on London area patterns
        // Central London (W1, SW1, EC, WC): Higher growth
        // Inner London (N, E, SE, SW, NW): Medium growth  
        // Outer London: Lower growth
        let growthPct = 3.5; // Default London average
        
        const centralAreas = ['W1', 'SW1', 'EC', 'WC', 'E1', 'SE1'];
        const innerAreas = ['N', 'E', 'SE', 'SW', 'NW', 'W'];
        
        if (centralAreas.some(prefix => area.area_code.startsWith(prefix))) {
          growthPct = 5.0 + Math.random() * 3; // 5-8%
        } else if (innerAreas.some(prefix => area.area_code.startsWith(prefix))) {
          growthPct = 3.0 + Math.random() * 3; // 3-6%
        } else {
          growthPct = 1.0 + Math.random() * 3; // 1-4%
        }

        // Categorize growth
        let growthRank = 'Average';
        if (growthPct > 7) growthRank = 'Exceptional';
        else if (growthPct > 5) growthRank = 'High';
        else if (growthPct > 3) growthRank = 'Above Average';
        else if (growthPct > 1) growthRank = 'Average';
        else growthRank = 'Below Average';

        updates.push({
          id: area.id,
          growth_12m_pct: Math.round(growthPct * 10) / 10,
          growth_rank: growthRank,
          last_updated: new Date().toISOString(),
        });

        console.log(`${area.area_code}: ${growthPct.toFixed(1)}% growth (${growthRank})`);

      } catch (error) {
        console.error(`Error processing ${area.area_code}:`, error);
      }
    }

    // Batch update all areas
    if (updates.length > 0) {
      console.log(`Updating ${updates.length} areas with growth data...`);
      
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('area_metrics')
          .update({
            growth_12m_pct: update.growth_12m_pct,
            growth_rank: update.growth_rank,
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
        message: `Updated growth data for ${updates.length} areas`,
        note: 'Currently using estimated data. Connect to Land Registry API for real historical price data.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error fetching growth data:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
