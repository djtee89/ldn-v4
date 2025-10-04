import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting pragmatic £/ft² computation for all MSOAs...');
    console.log('NOTE: This is currently using MOCK data. For production, integrate:');
    console.log('  1. ONS/Land Registry median price per MSOA');
    console.log('  2. EPC (Energy Performance Certificate) median floor area per MSOA');
    console.log('  Formula: £/ft² = median_price ÷ (median_floor_area_m² × 10.7639)');

    // Fetch all MSOA polygons
    const { data: polygons, error: polyError } = await supabase
      .from('area_polygons')
      .select('*')
      .eq('area_type', 'MSOA');

    if (polyError) throw polyError;
    console.log(`Fetched ${polygons.length} MSOA polygons`);

    // MOCK COMPUTATION - Compute for ALL MSOAs (target: 983)
    // Real implementation: aggregate ONS/LR price + EPC floor area by MSOA code
    // If missing data for an MSOA, fall back to Borough median
    const updates = [];
    
    for (const poly of polygons) {
      // Generate realistic mock based on central London distance
      // Extract coordinates for distance-based pricing
      const center = poly.geometry.type === 'Polygon'
        ? calculateCenter(poly.geometry)
        : calculateMultiPolygonCenter(poly.geometry);
      
      // Central London approximate coordinates
      const centralLat = 51.5074;
      const centralLng = -0.1278;
      
      // Calculate rough distance from center (simple Euclidean)
      const distFromCenter = Math.sqrt(
        Math.pow((center.lat - centralLat) * 111, 2) + 
        Math.pow((center.lng - centralLng) * 69, 2)
      );
      
      // Price gradient: £1400/ft² at center, declining to £700/ft² at 20km
      const basePrice = Math.max(700, 1400 - (distFromCenter * 35));
      
      // Add realistic variation (±10%)
      const variation = basePrice * 0.1 * (Math.random() - 0.5) * 2;
      const price_per_sqft_overall = Math.round(basePrice + variation);
      
      // Mock sample sizes
      const sample_size_price = Math.floor(50 + Math.random() * 200);
      const sample_size_epc = Math.floor(30 + Math.random() * 150);

      updates.push({
        area_code: poly.area_code,
        area_name: poly.area_name,
        area_type: 'MSOA',
        price_per_sqft_overall,
        bounds: poly.geometry.type === 'Polygon' 
          ? calculateBounds(poly.geometry)
          : calculateMultiPolygonBounds(poly.geometry),
        center_lat: center.lat,
        center_lng: center.lng,
        sample_size: sample_size_price,
        data_sources: [
          { 
            source: 'ONS/LR (mock)', 
            sample_size: sample_size_price,
            method: 'Estimated £/ft² from ONS price ÷ EPC m² (MSOA)'
          },
          { source: 'EPC (mock)', sample_size: sample_size_epc }
        ],
        last_updated: new Date().toISOString()
      });
    }

    console.log(`Computed £/ft² for all ${updates.length} MSOAs`);

    console.log(`Upserting ${updates.length} area metrics...`);

    // Upsert in batches
    const batchSize = 100;
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      const { error: upsertError } = await supabase
        .from('area_metrics')
        .upsert(batch, { onConflict: 'area_code' });
      
      if (upsertError) {
        console.error(`Batch ${i / batchSize + 1} error:`, upsertError);
        throw upsertError;
      }
      console.log(`Batch ${i / batchSize + 1} completed`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        areas_computed: updates.length,
        message: 'Pragmatic £/ft² computed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function calculateBounds(geometry: any) {
  const coords = geometry.coordinates[0];
  const lngs = coords.map((c: number[]) => c[0]);
  const lats = coords.map((c: number[]) => c[1]);
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs)
  };
}

function calculateMultiPolygonBounds(geometry: any) {
  const allCoords = geometry.coordinates.flatMap((poly: any) => poly[0]);
  const lngs = allCoords.map((c: number[]) => c[0]);
  const lats = allCoords.map((c: number[]) => c[1]);
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs)
  };
}

function calculateCenter(geometry: any) {
  const coords = geometry.coordinates[0];
  const lngs = coords.map((c: number[]) => c[0]);
  const lats = coords.map((c: number[]) => c[1]);
  return {
    lat: (Math.max(...lats) + Math.min(...lats)) / 2,
    lng: (Math.max(...lngs) + Math.min(...lngs)) / 2
  };
}

function calculateMultiPolygonCenter(geometry: any) {
  const allCoords = geometry.coordinates.flatMap((poly: any) => poly[0]);
  const lngs = allCoords.map((c: number[]) => c[0]);
  const lats = allCoords.map((c: number[]) => c[1]);
  return {
    lat: (Math.max(...lats) + Math.min(...lats)) / 2,
    lng: (Math.max(...lngs) + Math.min(...lngs)) / 2
  };
}
