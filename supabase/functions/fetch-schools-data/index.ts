import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface School {
  name: string;
  lat: number;
  lng: number;
  rating: string;
  phase: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching schools data...');

    // Get all area metrics with coordinates
    const { data: areas, error: areasError } = await supabase
      .from('area_metrics')
      .select('id, area_code, center_lat, center_lng');

    if (areasError) throw areasError;

    console.log(`Processing ${areas?.length || 0} areas`);

    const updates = [];

    for (const area of areas || []) {
      try {
        // In production, you would use:
        // - Get Information About Schools API: https://get-information-schools.service.gov.uk/
        // - Ofsted API for ratings
        
        // For now, we'll estimate based on London patterns
        // Central/affluent areas tend to have more outstanding schools
        const postcodePrefix = area.area_code.split(' ')[0];
        
        // Simulate school data based on area characteristics
        let outstandingPrimary = 0;
        let outstandingSecondary = 0;
        let schoolsScore = 50; // Base score
        
        // Affluent areas with typically good schools
        const goodSchoolAreas = ['SW1', 'SW3', 'SW7', 'W8', 'W11', 'N1', 'N6', 'SE1', 'E1'];
        const excellentSchoolAreas = ['SW19', 'NW3', 'NW8', 'W4', 'W5'];
        
        if (excellentSchoolAreas.some(prefix => area.area_code.startsWith(prefix))) {
          outstandingPrimary = Math.floor(Math.random() * 3) + 2; // 2-4
          outstandingSecondary = Math.floor(Math.random() * 2) + 1; // 1-2
          schoolsScore = 85 + Math.random() * 15; // 85-100
        } else if (goodSchoolAreas.some(prefix => area.area_code.startsWith(prefix))) {
          outstandingPrimary = Math.floor(Math.random() * 2) + 1; // 1-2
          outstandingSecondary = Math.floor(Math.random() * 2); // 0-1
          schoolsScore = 65 + Math.random() * 20; // 65-85
        } else {
          outstandingPrimary = Math.floor(Math.random() * 2); // 0-1
          outstandingSecondary = 0;
          schoolsScore = 40 + Math.random() * 25; // 40-65
        }

        updates.push({
          id: area.id,
          schools_outstanding_primary: outstandingPrimary,
          schools_outstanding_secondary: outstandingSecondary,
          schools_score: Math.round(schoolsScore),
          last_updated: new Date().toISOString(),
        });

        console.log(`${area.area_code}: ${outstandingPrimary} primary, ${outstandingSecondary} secondary, score: ${schoolsScore.toFixed(0)}`);

      } catch (error) {
        console.error(`Error processing ${area.area_code}:`, error);
      }
    }

    // Batch update all areas
    if (updates.length > 0) {
      console.log(`Updating ${updates.length} areas with schools data...`);
      
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('area_metrics')
          .update({
            schools_outstanding_primary: update.schools_outstanding_primary,
            schools_outstanding_secondary: update.schools_outstanding_secondary,
            schools_score: update.schools_score,
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
        message: `Updated schools data for ${updates.length} areas`,
        note: 'Currently using estimated data. Connect to Ofsted API for real school ratings.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error fetching schools data:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
