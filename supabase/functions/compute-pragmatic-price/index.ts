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

    console.log('Starting pragmatic £/ft² computation for London Boroughs...');
    console.log('NOTE: This is currently using MOCK data. For production, integrate:');
    console.log('  1. ONS/Land Registry median price per Borough');
    console.log('  2. EPC (Energy Performance Certificate) median floor area per Borough');
    console.log('  Formula: £/ft² = median_price ÷ (median_floor_area_m² × 10.7639)');

    // Fetch all Borough polygons (simpler, named areas)
    const { data: polygons, error: polyError } = await supabase
      .from('area_polygons')
      .select('*')
      .eq('area_type', 'Borough');

    if (polyError) throw polyError;
    console.log(`Fetched ${polygons.length} Borough polygons`);

    // MOCK COMPUTATION - Compute for ALL London Boroughs (~33)
    // Real implementation: aggregate ONS/LR price + EPC floor area by Borough
    const updates = [];
    
    // Borough price map (realistic Central → Outer gradient)
    const boroughPrices: Record<string, number> = {
      'City of London': 1450,
      'Westminster': 1400,
      'Kensington and Chelsea': 1380,
      'Camden': 1100,
      'Islington': 950,
      'Hackney': 850,
      'Tower Hamlets': 900,
      'Southwark': 920,
      'Lambeth': 780,
      'Wandsworth': 850,
      'Hammersmith and Fulham': 980,
      'Greenwich': 650,
      'Lewisham': 620,
      'Newham': 600,
      'Brent': 700,
      'Ealing': 720,
      'Hounslow': 650,
      'Richmond upon Thames': 880,
      'Kingston upon Thames': 800,
      'Merton': 750,
      'Sutton': 620,
      'Croydon': 580,
      'Bromley': 650,
      'Barnet': 750,
      'Haringey': 780,
      'Enfield': 620,
      'Waltham Forest': 680,
      'Redbridge': 650,
      'Havering': 600,
      'Barking and Dagenham': 550,
      'Bexley': 600,
      'Harrow': 700,
      'Hillingdon': 650,
    };
    
    for (const poly of polygons) {
      const center = poly.geometry.type === 'Polygon'
        ? calculateCenter(poly.geometry)
        : calculateMultiPolygonCenter(poly.geometry);
      
      // Use borough name to lookup price, or calculate from center
      const basePrice = boroughPrices[poly.area_name] || 700;
      
      // Add small variation (±5%)
      const variation = basePrice * 0.05 * (Math.random() - 0.5) * 2;
      const price_per_sqft_overall = Math.round(basePrice + variation);
      
      // Mock sample sizes
      const sample_size_price = Math.floor(200 + Math.random() * 500);
      const sample_size_epc = Math.floor(150 + Math.random() * 400);

      updates.push({
        area_code: poly.area_code,
        area_name: poly.area_name,
        area_type: 'Borough',
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
            method: 'Estimated £/ft² from ONS price ÷ EPC m² (Borough)'
          },
          { source: 'EPC (mock)', sample_size: sample_size_epc }
        ],
        last_updated: new Date().toISOString()
      });
    }

    console.log(`Computed £/ft² for all ${updates.length} London Boroughs`);

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
        message: `Pragmatic £/ft² computed for ${updates.length} London Boroughs`
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
