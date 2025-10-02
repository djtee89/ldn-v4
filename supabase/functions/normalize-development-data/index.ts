import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Edge function to normalize development data
 * - Standardize price formats across all developments
 * - Fill in missing data where possible
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting data normalization...');

    // Fetch all developments
    const { data: developments, error: fetchError } = await supabase
      .from('developments')
      .select('*');

    if (fetchError) {
      throw new Error(`Failed to fetch developments: ${fetchError.message}`);
    }

    console.log(`Found ${developments?.length || 0} developments to process`);

    let updatedCount = 0;
    let errorCount = 0;

    // Process each development
    for (const dev of developments || []) {
      try {
        let needsUpdate = false;
        const updates: any = {};

        // Normalize prices object
        if (dev.prices && typeof dev.prices === 'object') {
          const normalizedPrices: any = {};
          
          // Helper to extract numeric value from various formats
          const extractNumber = (val: any): number | null => {
            if (typeof val === 'number') return val;
            if (typeof val === 'object' && val.from) return extractNumber(val.from);
            if (typeof val === 'string') {
              const cleaned = val.replace(/£|,/g, '').trim();
              if (cleaned.match(/k$/i)) {
                return parseFloat(cleaned.replace(/k$/i, '')) * 1000;
              }
              if (cleaned.match(/m$/i)) {
                return parseFloat(cleaned.replace(/m$/i, '')) * 1000000;
              }
              const num = parseFloat(cleaned);
              return isNaN(num) ? null : num;
            }
            return null;
          };

          // Map common variations to standard keys
          const keyMap: Record<string, string> = {
            'studio': 'studio',
            'Studio': 'studio',
            '0': 'studio',
            '1bed': '1-bed',
            '1-bed': '1-bed',
            'oneBed': '1-bed',
            'one_bed': '1-bed',
            '1': '1-bed',
            '2bed': '2-bed',
            '2-bed': '2-bed',
            'twoBed': '2-bed',
            'two_bed': '2-bed',
            '2': '2-bed',
            '3bed': '3-bed',
            '3-bed': '3-bed',
            'threeBed': '3-bed',
            'three_bed': '3-bed',
            '3': '3-bed',
            '4bed': '4-bed',
            '4-bed': '4-bed',
            'fourBed': '4-bed',
            'four_bed': '4-bed',
            '4': '4-bed'
          };

          // Normalize each price entry
          for (const [key, value] of Object.entries(dev.prices)) {
            if (key === 'range') {
              normalizedPrices.range = value;
              continue;
            }

            const standardKey = keyMap[key] || key;
            const numValue = extractNumber(value);
            
            if (numValue && numValue > 0) {
              normalizedPrices[standardKey] = numValue;
            }
          }

          // Check if prices changed
          if (JSON.stringify(dev.prices) !== JSON.stringify(normalizedPrices)) {
            updates.prices = normalizedPrices;
            needsUpdate = true;
          }
        }

        // Fill in missing nearest_tube if we have station data
        if (!dev.nearest_tube && dev.stations && Array.isArray(dev.stations) && dev.stations.length > 0) {
          const firstStation = dev.stations[0];
          if (firstStation.name) {
            updates.nearest_tube = firstStation.name;
            needsUpdate = true;
          }
        }

        // Set default zone if missing
        if (!dev.zone) {
          updates.zone = '1-2'; // Default to central London
          needsUpdate = true;
        }

        // Update if needed
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('developments')
            .update(updates)
            .eq('id', dev.id);

          if (updateError) {
            console.error(`Error updating ${dev.id}:`, updateError);
            errorCount++;
          } else {
            console.log(`Updated ${dev.id}: ${Object.keys(updates).join(', ')}`);
            updatedCount++;
          }
        }
      } catch (err) {
        console.error(`Error processing ${dev.id}:`, err);
        errorCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Data normalization complete`,
        stats: {
          total: developments?.length || 0,
          updated: updatedCount,
          errors: errorCount
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
