import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Full local developments data
const localDevelopments = [
  // ... we'll fetch this from the existing file via import
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting development data migration...');

    // Get the local file data (we'll need to copy this from src/data/newDevelopments.ts)
    const { localData } = await req.json();
    
    const report = {
      processed: 0,
      updated: 0,
      errors: [] as string[],
      details: [] as any[]
    };

    for (const dev of localData) {
      try {
        console.log(`Processing ${dev.id}...`);
        
        // Get existing DB record
        const { data: existing, error: fetchError } = await supabase
          .from('developments')
          .select('*')
          .eq('id', dev.id)
          .maybeSingle();

        if (fetchError) {
          report.errors.push(`Error fetching ${dev.id}: ${fetchError.message}`);
          continue;
        }

        // Prepare update data - only fill in missing fields (DB wins)
        const updateData: any = {};
        
        if (!existing?.area_overview && dev.areaOverview) {
          updateData.area_overview = dev.areaOverview;
        }
        if (!existing?.transport_score && dev.transportScore) {
          updateData.transport_score = dev.transportScore;
        }
        if (!existing?.tenure && dev.tenure) {
          updateData.tenure = dev.tenure;
        }
        if (!existing?.green_spaces && dev.greenSpaces) {
          updateData.green_spaces = dev.greenSpaces;
        }
        if (!existing?.postcode && dev.postcode) {
          updateData.postcode = dev.postcode;
        }
        if (!existing?.nearest_tube_line && dev.nearestTube?.line) {
          updateData.nearest_tube_line = dev.nearestTube.line;
        }
        if (!existing?.amenities && dev.amenities?.length > 0) {
          updateData.amenities = dev.amenities;
        }
        
        // Handle schools - merge with existing or add new
        const existingSchools = existing?.schools || [];
        if (dev.schools && dev.schools.length > 0) {
          const mergedSchools = [...new Set([...existingSchools, ...dev.schools])];
          if (JSON.stringify(existingSchools) !== JSON.stringify(mergedSchools)) {
            updateData.schools = mergedSchools;
          }
        }

        // Store nearby stations if available
        if (dev.nearestTube) {
          const stations = existing?.nearby_stations || [];
          const stationExists = stations.some((s: any) => s.station === dev.nearestTube.station);
          if (!stationExists) {
            updateData.nearby_stations = [...stations, {
              station: dev.nearestTube.station,
              line: dev.nearestTube.line,
              walk_time: dev.nearestTube.walkTime
            }];
          }
        }

        // Store any additional fields in raw_details
        const rawDetails = existing?.raw_details || {};
        if (dev.hospital && !rawDetails.hospital) {
          rawDetails.hospital = dev.hospital;
        }
        if (dev.videoUrl && !rawDetails.videoUrl) {
          rawDetails.videoUrl = dev.videoUrl;
        }
        if (Object.keys(rawDetails).length > 0) {
          updateData.raw_details = rawDetails;
        }

        // Handle images - upload to storage if they're URLs and merge
        const existingImages = existing?.images || [];
        if (dev.images && dev.images.length > 0) {
          // For now, just merge URLs (file upload would require additional logic)
          const newImages = dev.images.filter((img: string) => !existingImages.includes(img));
          if (newImages.length > 0) {
            updateData.images = [...existingImages, ...newImages];
          }
        }

        // Only update if there are changes
        if (Object.keys(updateData).length > 0) {
          const { error: updateError } = await supabase
            .from('developments')
            .update(updateData)
            .eq('id', dev.id);

          if (updateError) {
            report.errors.push(`Error updating ${dev.id}: ${updateError.message}`);
          } else {
            report.updated++;
            report.details.push({
              id: dev.id,
              name: dev.name,
              fieldsUpdated: Object.keys(updateData)
            });
          }
        }

        report.processed++;
      } catch (error) {
        console.error(`Error processing ${dev.id}:`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        report.errors.push(`Exception for ${dev.id}: ${errorMessage}`);
      }
    }

    console.log('Migration complete:', report);

    return new Response(JSON.stringify({
      success: true,
      report
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Migration error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
