import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CrimeData {
  category: string;
  location: {
    latitude: string;
    longitude: string;
  };
  month: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching area metrics...');

    // Get all area metrics with coordinates
    const { data: areas, error: areasError } = await supabase
      .from('area_metrics')
      .select('id, area_code, center_lat, center_lng');

    if (areasError) throw areasError;

    console.log(`Processing ${areas?.length || 0} areas`);

    const updates = [];

    for (const area of areas || []) {
      try {
        // Police.uk API: Get crimes within 1 mile radius (approx 1600m)
        // Using street-level crimes endpoint
        const crimeUrl = `https://data.police.uk/api/crimes-street/all-crime?lat=${area.center_lat}&lng=${area.center_lng}`;
        
        console.log(`Fetching crime data for ${area.area_code}...`);
        
        const crimeResponse = await fetch(crimeUrl, {
          headers: {
            'User-Agent': 'LondonPropertyApp/1.0',
          },
        });

        if (!crimeResponse.ok) {
          console.error(`Failed to fetch crime data for ${area.area_code}: ${crimeResponse.status}`);
          continue;
        }

        const crimes: CrimeData[] = await crimeResponse.json();
        
        // Count crimes (last month of available data)
        const crimeCount = crimes.length;

        // Estimate population based on London average (approx 100 people per postcode)
        // This is a rough estimate - ideally we'd use ONS population data
        const estimatedPopulation = 500; // Average for a postcode sector
        
        const crimePer1000 = (crimeCount / estimatedPopulation) * 1000;

        // Categorize crime level
        let crimeCategory = 'Low';
        if (crimePer1000 > 80) crimeCategory = 'Very High';
        else if (crimePer1000 > 60) crimeCategory = 'High';
        else if (crimePer1000 > 40) crimeCategory = 'Medium';
        else if (crimePer1000 > 20) crimeCategory = 'Low';
        else crimeCategory = 'Very Low';

        updates.push({
          id: area.id,
          crime_per_1000: Math.round(crimePer1000 * 10) / 10,
          crime_category: crimeCategory,
          last_updated: new Date().toISOString(),
        });

        console.log(`${area.area_code}: ${crimeCount} crimes, ${crimePer1000.toFixed(1)} per 1k (${crimeCategory})`);

        // Rate limit: Police.uk allows 15 requests per second
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error processing ${area.area_code}:`, error);
      }
    }

    // Batch update all areas
    if (updates.length > 0) {
      console.log(`Updating ${updates.length} areas with crime data...`);
      
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('area_metrics')
          .update({
            crime_per_1000: update.crime_per_1000,
            crime_category: update.crime_category,
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
        message: `Updated crime data for ${updates.length} areas`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error fetching crime data:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
