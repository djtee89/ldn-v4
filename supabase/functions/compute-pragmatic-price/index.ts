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
    
    // Borough price map by area_code (realistic Central → Outer gradient)
    const boroughPrices: Record<string, number> = {
      'E09000001': 1850, // City of London
      'E09000002': 520,  // Barking and Dagenham
      'E09000003': 680,  // Barnet
      'E09000004': 580,  // Bexley
      'E09000005': 720,  // Brent
      'E09000006': 590,  // Bromley
      'E09000007': 1250, // Camden
      'E09000008': 550,  // Croydon
      'E09000009': 670,  // Ealing
      'E09000010': 560,  // Enfield
      'E09000011': 680,  // Greenwich
      'E09000012': 850,  // Hackney
      'E09000013': 1100, // Hammersmith and Fulham
      'E09000014': 750,  // Haringey
      'E09000015': 620,  // Harrow
      'E09000016': 530,  // Havering
      'E09000017': 580,  // Hillingdon
      'E09000018': 650,  // Hounslow
      'E09000019': 950,  // Islington
      'E09000020': 1600, // Kensington and Chelsea
      'E09000021': 680,  // Kingston upon Thames
      'E09000022': 780,  // Lambeth
      'E09000023': 670,  // Lewisham
      'E09000024': 720,  // Merton
      'E09000025': 650,  // Newham
      'E09000026': 600,  // Redbridge
      'E09000027': 820,  // Richmond upon Thames
      'E09000028': 850,  // Southwark
      'E09000029': 590,  // Sutton
      'E09000030': 820,  // Tower Hamlets
      'E09000031': 620,  // Waltham Forest
      'E09000032': 880,  // Wandsworth
      'E09000033': 1400, // Westminster
    };
    
    for (const poly of polygons) {
      const center = poly.geometry.type === 'Polygon'
        ? calculateCenter(poly.geometry)
        : calculateMultiPolygonCenter(poly.geometry);
      
      // Use borough code for reliable lookup
      const basePrice = boroughPrices[poly.area_code] || 700;
      
      // No variation - use exact price for clarity
      const price_per_sqft_overall = basePrice;
      
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
