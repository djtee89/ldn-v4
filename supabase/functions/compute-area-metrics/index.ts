import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ComputeRequest {
  area_codes?: string[]; // If empty, compute all
  force_refresh?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { area_codes, force_refresh } = await req.json() as ComputeRequest;

    console.log('Computing area metrics...', { area_codes, force_refresh });

    // Fetch all units
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('*')
      .eq('status', 'Available');

    if (unitsError) throw unitsError;

    console.log(`Fetched ${units?.length || 0} units`);

    // Fetch all developments
    const { data: developments, error: devsError } = await supabase
      .from('developments')
      .select('id, lat, lng, borough, postcode');

    if (devsError) throw devsError;

    // Create a map for quick development lookup
    const devMap = new Map(developments?.map(dev => [dev.id, dev]) || []);

    // Group units by postcode sector (first 4-5 chars of postcode)
    const areaGroups = new Map<string, any[]>();

    units?.forEach(unit => {
      const dev = devMap.get(unit.dev_id);
      if (!dev || !dev.postcode) return;

      // Extract postcode sector (e.g., "SW1A 1" from "SW1A 1AA")
      const postcodeParts = dev.postcode.trim().split(' ');
      const sector = postcodeParts.length >= 2 
        ? `${postcodeParts[0]} ${postcodeParts[1][0]}` 
        : postcodeParts[0];

      if (!areaGroups.has(sector)) {
        areaGroups.set(sector, []);
      }
      areaGroups.get(sector)!.push({ ...unit, development: dev });
    });

    console.log(`Grouped into ${areaGroups.size} postcode sectors`);

    // Compute metrics for each area
    const metrics = [];

    for (const [areaCode, areaUnits] of areaGroups) {
      // Calculate price per sqft by bedroom count
      const unitsByBeds = new Map<number, number[]>();
      const allPricesPerSqft: number[] = [];
      const lats: number[] = [];
      const lngs: number[] = [];

      areaUnits.forEach(u => {
        const pricePerSqft = u.price / u.size_sqft;
        if (!isFinite(pricePerSqft) || pricePerSqft <= 0) return;

        if (!unitsByBeds.has(u.beds)) {
          unitsByBeds.set(u.beds, []);
        }
        unitsByBeds.get(u.beds)!.push(pricePerSqft);
        allPricesPerSqft.push(pricePerSqft);

        if (u.development?.lat) lats.push(u.development.lat);
        if (u.development?.lng) lngs.push(u.development.lng);
      });

      if (allPricesPerSqft.length === 0) continue;

      // Calculate medians
      const median = (arr: number[]) => {
        const sorted = [...arr].sort((a, b) => a - b);
        return sorted[Math.floor(sorted.length / 2)];
      };

      const price_1bed = unitsByBeds.has(1) ? median(unitsByBeds.get(1)!) : null;
      const price_2bed = unitsByBeds.has(2) ? median(unitsByBeds.get(2)!) : null;
      const price_3bed = unitsByBeds.has(3) ? median(unitsByBeds.get(3)!) : null;
      const price_overall = median(allPricesPerSqft);

      // Calculate bounds
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      metrics.push({
        area_code: areaCode,
        area_name: areaCode,
        area_type: 'postcode_sector',
        bounds: {
          north: maxLat,
          south: minLat,
          east: maxLng,
          west: minLng,
        },
        center_lat: centerLat,
        center_lng: centerLng,
        price_per_sqft_1bed: price_1bed,
        price_per_sqft_2bed: price_2bed,
        price_per_sqft_3bed: price_3bed,
        price_per_sqft_overall: price_overall,
        sample_size: allPricesPerSqft.length,
        last_updated: new Date().toISOString(),
        data_sources: ['internal_units'],
      });
    }

    console.log(`Computed metrics for ${metrics.length} areas`);

    // Upsert into database
    if (metrics.length > 0) {
      const { error: upsertError } = await supabase
        .from('area_metrics')
        .upsert(metrics, { 
          onConflict: 'area_code',
          ignoreDuplicates: false 
        });

      if (upsertError) throw upsertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        areas_computed: metrics.length,
        message: `Computed metrics for ${metrics.length} areas`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error computing area metrics:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
