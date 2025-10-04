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

    console.log('Fetching air quality data...');

    // Get all area metrics with coordinates
    const { data: areas, error: areasError } = await supabase
      .from('area_metrics')
      .select('id, area_code, center_lat, center_lng');

    if (areasError) throw areasError;

    console.log(`Processing ${areas?.length || 0} areas`);

    const updates = [];

    for (const area of areas || []) {
      try {
        // Use OpenAQ API for air quality data (free, public)
        // Alternative: UK-AIR DEFRA API
        const aqUrl = `https://api.openaq.org/v2/latest?coordinates=${area.center_lat},${area.center_lng}&radius=5000&limit=10`;
        
        console.log(`Fetching air quality for ${area.area_code}...`);
        
        const aqResponse = await fetch(aqUrl, {
          headers: {
            'User-Agent': 'LondonPropertyApp/1.0',
          },
        });

        if (!aqResponse.ok) {
          console.error(`Failed to fetch AQ data for ${area.area_code}: ${aqResponse.status}`);
          
          // Use fallback estimation based on location
          const badge = estimateAirQuality(area.area_code);
          updates.push({
            id: area.id,
            noise_air_badge: badge,
            last_updated: new Date().toISOString(),
          });
          continue;
        }

        const aqData = await aqResponse.json();
        
        // Calculate average PM2.5 and NO2 levels
        let pm25 = 0;
        let no2 = 0;
        let count = 0;

        if (aqData.results && aqData.results.length > 0) {
          for (const result of aqData.results) {
            for (const measurement of result.measurements || []) {
              if (measurement.parameter === 'pm25') {
                pm25 += measurement.value;
                count++;
              } else if (measurement.parameter === 'no2') {
                no2 += measurement.value;
                count++;
              }
            }
          }
        }

        // Determine badge based on WHO guidelines
        let badge = 'Good';
        const avgPm25 = count > 0 ? pm25 / count : 0;
        const avgNo2 = count > 0 ? no2 / count : 0;

        if (avgPm25 > 25 || avgNo2 > 50) {
          badge = 'Poor';
        } else if (avgPm25 > 15 || avgNo2 > 30) {
          badge = 'Fair';
        } else if (avgPm25 > 0) {
          badge = 'Good';
        } else {
          // No data - estimate
          badge = estimateAirQuality(area.area_code);
        }

        updates.push({
          id: area.id,
          noise_air_badge: badge,
          last_updated: new Date().toISOString(),
        });

        console.log(`${area.area_code}: ${badge} (PM2.5: ${avgPm25.toFixed(1)}, NO2: ${avgNo2.toFixed(1)})`);

        // Rate limit
        await new Promise(resolve => setTimeout(resolve, 150));

      } catch (error) {
        console.error(`Error processing ${area.area_code}:`, error);
        // Use estimation on error
        const badge = estimateAirQuality(area.area_code);
        updates.push({
          id: area.id,
          noise_air_badge: badge,
          last_updated: new Date().toISOString(),
        });
      }
    }

    // Batch update all areas
    if (updates.length > 0) {
      console.log(`Updating ${updates.length} areas with air quality data...`);
      
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('area_metrics')
          .update({
            noise_air_badge: update.noise_air_badge,
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
        message: `Updated air quality data for ${updates.length} areas`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function estimateAirQuality(areaCode: string): string {
  // Major roads and central areas tend to have worse air quality
  const poorAreas = ['A1', 'A2', 'A3', 'EC', 'WC', 'E1'];
  const fairAreas = ['N', 'E', 'SE', 'SW', 'W1'];
  
  if (poorAreas.some(prefix => areaCode.startsWith(prefix))) {
    return 'Fair';
  } else if (fairAreas.some(prefix => areaCode.startsWith(prefix))) {
    return 'Good';
  }
  return 'Good'; // Outer London generally better
}
