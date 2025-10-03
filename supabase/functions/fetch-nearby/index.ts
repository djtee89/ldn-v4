import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NearbyPlace {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  distance: number;
  walkTime: number;
  brand?: string;
}

const WALKING_SPEED_M_PER_MIN = 80; // 80 meters per minute (12.5 min/km)
const CACHE_TTL_HOURS = 24;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dev_id, category, lat, lng, force_refresh } = await req.json();

    if (!dev_id || !category || !lat || !lng) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Fetching nearby ${category} for development ${dev_id}`);

    // Check cache first
    if (!force_refresh) {
      const { data: cached, error: cacheError } = await supabase
        .from('nearby_cache')
        .select('results, fetched_at')
        .eq('dev_id', dev_id)
        .eq('category', category)
        .single();

      if (!cacheError && cached) {
        const cacheAge = Date.now() - new Date(cached.fetched_at).getTime();
        const cacheAgeHours = cacheAge / (1000 * 60 * 60);
        
        if (cacheAgeHours < CACHE_TTL_HOURS) {
          console.log(`Returning cached results (${cacheAgeHours.toFixed(1)}h old)`);
          return new Response(
            JSON.stringify({ results: cached.results, cached: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // Fetch category configuration
    const { data: categoryConfig, error: configError } = await supabase
      .from('nearby_categories')
      .select('*')
      .eq('name', category)
      .single();

    if (configError || !categoryConfig) {
      return new Response(
        JSON.stringify({ error: 'Category not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const radius = categoryConfig.radius_meters;
    const overpassQuery = categoryConfig.overpass_query
      .replace('{radius}', radius.toString())
      .replace('{lat}', lat.toString())
      .replace('{lng}', lng.toString());

    // Build full Overpass query
    const fullQuery = `[out:json][timeout:25];(${overpassQuery});out center;`;

    console.log(`Querying Overpass API with radius ${radius}m`);

    // Query Overpass API
    const overpassResponse = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(fullQuery)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!overpassResponse.ok) {
      throw new Error(`Overpass API error: ${overpassResponse.statusText}`);
    }

    const overpassData = await overpassResponse.json();
    const places: NearbyPlace[] = [];

    // Process results
    for (const element of overpassData.elements) {
      const elementLat = element.lat || element.center?.lat;
      const elementLng = element.lon || element.center?.lon;
      
      if (!elementLat || !elementLng) continue;

      const name = element.tags?.name || element.tags?.operator || element.tags?.brand || 'Unnamed';
      
      // Calculate distance using Haversine formula
      const distance = calculateDistance(lat, lng, elementLat, elementLng);
      const walkTime = Math.round(distance / WALKING_SPEED_M_PER_MIN);

      places.push({
        id: element.id.toString(),
        name,
        type: element.tags?.amenity || element.tags?.shop || element.tags?.leisure || category,
        lat: elementLat,
        lng: elementLng,
        distance,
        walkTime,
        brand: element.tags?.brand,
      });
    }

    // Sort by distance and take closest results
    places.sort((a, b) => a.distance - b.distance);

    console.log(`Found ${places.length} places`);

    // Cache the results
    const { error: upsertError } = await supabase
      .from('nearby_cache')
      .upsert({
        dev_id,
        category,
        results: places,
        fetched_at: new Date().toISOString(),
      }, {
        onConflict: 'dev_id,category'
      });

    if (upsertError) {
      console.error('Error caching results:', upsertError);
    }

    return new Response(
      JSON.stringify({ results: places, cached: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Haversine formula to calculate distance between two coordinates in meters
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
