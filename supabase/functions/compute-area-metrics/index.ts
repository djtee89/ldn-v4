import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ComputeRequest {
  area_codes?: string[];
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

    // Parse request body safely, defaulting to empty object
    let requestData: ComputeRequest = {};
    try {
      const text = await req.text();
      if (text) {
        requestData = JSON.parse(text);
      }
    } catch (e) {
      console.log('No JSON body provided, using defaults');
    }
    
    const { area_codes, force_refresh } = requestData;

    console.log('Computing area metrics for MSOAs...');

    // Fetch all MSOA polygons
    const { data: msoaPolygons, error: polygonError } = await supabase
      .from('area_polygons')
      .select('*')
      .eq('area_type', 'MSOA');

    if (polygonError) throw polygonError;

    if (!msoaPolygons || msoaPolygons.length === 0) {
      throw new Error('No MSOA polygons found. Please run "Fetch Boundaries" first.');
    }

    console.log(`Found ${msoaPolygons.length} MSOA polygons`);

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

    // Group units by MSOA using point-in-polygon check
    const areaGroups = new Map<string, any[]>();

    units?.forEach(unit => {
      const dev = devMap.get(unit.dev_id);
      if (!dev || !dev.lat || !dev.lng) return;

      // Find which MSOA this development falls into
      const msoa = msoaPolygons.find(polygon => 
        isPointInPolygon([dev.lng, dev.lat], polygon.geometry)
      );

      if (msoa) {
        if (!areaGroups.has(msoa.area_code)) {
          areaGroups.set(msoa.area_code, []);
        }
        areaGroups.get(msoa.area_code)!.push({ ...unit, development: dev });
      }
    });

    console.log(`Grouped units into ${areaGroups.size} MSOAs`);

    // Compute metrics for each MSOA
    const metrics = [];

    for (const polygon of msoaPolygons) {
      const areaUnits = areaGroups.get(polygon.area_code) || [];
      
      if (areaUnits.length === 0) {
        // Create entry with null values for MSOAs with no units
        const bounds = calculateBounds(polygon.geometry);
        metrics.push({
          area_code: polygon.area_code,
          area_name: polygon.area_name,
          area_type: 'MSOA',
          bounds: bounds,
          center_lat: (bounds.north + bounds.south) / 2,
          center_lng: (bounds.east + bounds.west) / 2,
          price_per_sqft_1bed: null,
          price_per_sqft_2bed: null,
          price_per_sqft_3bed: null,
          price_per_sqft_overall: null,
          sample_size: 0,
          last_updated: new Date().toISOString(),
          data_sources: ['internal_units'],
        });
        continue;
      }

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

      const bounds = calculateBounds(polygon.geometry);
      metrics.push({
        area_code: polygon.area_code,
        area_name: polygon.area_name,
        area_type: 'MSOA',
        bounds: bounds,
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

    console.log(`Computed metrics for ${metrics.length} MSOAs`);

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
        message: `Computed metrics for ${metrics.length} MSOAs`,
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

// Helper functions
function calculateBounds(geometry: any): { north: number; south: number; east: number; west: number } {
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  
  const processCoords = (coords: any[]) => {
    if (typeof coords[0] === 'number') {
      minLng = Math.min(minLng, coords[0]);
      maxLng = Math.max(maxLng, coords[0]);
      minLat = Math.min(minLat, coords[1]);
      maxLat = Math.max(maxLat, coords[1]);
    } else {
      coords.forEach(processCoords);
    }
  };
  
  processCoords(geometry.coordinates);
  
  return { north: maxLat, south: minLat, east: maxLng, west: minLng };
}

function isPointInPolygon(point: [number, number], geometry: any): boolean {
  const [x, y] = point;
  
  const checkPolygon = (coords: number[][][]) => {
    const ring = coords[0];
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  if (geometry.type === 'Polygon') {
    return checkPolygon(geometry.coordinates);
  } else if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.some(checkPolygon);
  }
  
  return false;
}