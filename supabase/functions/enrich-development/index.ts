import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnrichmentResult {
  success: boolean;
  dev_id: string;
  geocoded?: boolean;
  transport_added?: number;
  amenities_added?: number;
  schools_added?: number;
  summary_generated?: boolean;
  error?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { dev_id, enrich_transport = true, enrich_amenities = true, generate_summary = true } = await req.json();

    if (!dev_id) {
      throw new Error('dev_id is required');
    }

    console.log(`[enrich-development] Starting enrichment for ${dev_id}`);

    // Fetch development
    const { data: dev, error: fetchError } = await supabase
      .from('developments')
      .select('*')
      .eq('id', dev_id)
      .single();

    if (fetchError || !dev) {
      throw new Error(`Development not found: ${dev_id}`);
    }

    const result: EnrichmentResult = {
      success: true,
      dev_id,
    };

    let lat = dev.lat;
    let lng = dev.lng;

    // Step 1: Geocode if coordinates missing
    if ((!lat || !lng) && dev.postcode) {
      console.log(`[enrich-development] Geocoding postcode: ${dev.postcode}`);
      const mapboxToken = Deno.env.get('MAPBOX_TOKEN') || Deno.env.get('VITE_PUBLIC_MAPBOX_TOKEN');
      
      if (!mapboxToken) {
        console.warn('[enrich-development] No Mapbox token found, skipping geocoding');
      } else {
        try {
          const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(dev.postcode)}.json?access_token=${mapboxToken}&country=GB&limit=1`;
          const geocodeRes = await fetch(geocodeUrl);
          const geocodeData = await geocodeRes.json();

          if (geocodeData.features && geocodeData.features.length > 0) {
            const coords = geocodeData.features[0].geometry.coordinates;
            lng = coords[0];
            lat = coords[1];
            result.geocoded = true;
            console.log(`[enrich-development] Geocoded to: ${lat}, ${lng}`);
          }
        } catch (err) {
          console.error('[enrich-development] Geocoding error:', err);
        }
      }
    }

    // Step 2: Enrich transport data
    if (enrich_transport && lat && lng) {
      console.log(`[enrich-development] Finding nearby transport stations`);
      try {
        // Use TfL API to find nearby stations (free, no key needed)
        const tflUrl = `https://api.tfl.gov.uk/StopPoint?lat=${lat}&lon=${lng}&stopTypes=NaptanMetroStation,NaptanRailStation&radius=1000`;
        const tflRes = await fetch(tflUrl);
        const tflData = await tflRes.json();

        const stations = [];
        const nearbyStations = [];

        if (tflData.stopPoints && tflData.stopPoints.length > 0) {
          for (const stop of tflData.stopPoints.slice(0, 5)) {
            const distance = stop.distance || 0;
            const walkMins = Math.round(distance / 80); // 80m per minute walking speed

            const lines = stop.lines ? stop.lines.map((l: any) => l.name) : [];
            const zone = stop.zones ? stop.zones[0] : null;

            stations.push({
              name: stop.commonName,
              lines,
              walk_mins: walkMins,
              zone: zone ? parseInt(zone) : null,
            });

            nearbyStations.push({
              station: stop.commonName,
              line: lines.join(', '),
              walk_time: walkMins,
            });
          }

          result.transport_added = stations.length;
          console.log(`[enrich-development] Found ${stations.length} stations`);

          await supabase
            .from('developments')
            .update({
              stations,
              nearby_stations: nearbyStations,
            })
            .eq('id', dev_id);
        }
      } catch (err) {
        console.error('[enrich-development] Transport enrichment error:', err);
      }
    }

    // Step 3: Enrich amenities and schools
    if (enrich_amenities && lat && lng) {
      console.log(`[enrich-development] Finding nearby amenities and schools`);
      try {
        // Use Overpass API to find schools and parks
        const overpassQuery = `
          [out:json][timeout:10];
          (
            node["amenity"="school"](around:1000,${lat},${lng});
            way["amenity"="school"](around:1000,${lat},${lng});
            node["leisure"="park"](around:800,${lat},${lng});
            way["leisure"="park"](around:800,${lat},${lng});
          );
          out body;
        `;

        const overpassUrl = 'https://overpass-api.de/api/interpreter';
        const overpassRes = await fetch(overpassUrl, {
          method: 'POST',
          body: overpassQuery,
        });
        const overpassData = await overpassRes.json();

        const amenities: string[] = dev.amenities || [];
        const schools: Array<{ name: string; distance_miles: number }> = [];

        if (overpassData.elements) {
          let hasSchools = false;
          let hasParks = false;

          for (const elem of overpassData.elements) {
            if (elem.tags?.amenity === 'school' && elem.tags?.name) {
              const schoolLat = elem.lat || elem.center?.lat;
              const schoolLng = elem.lon || elem.center?.lon;
              
              if (schoolLat && schoolLng) {
                const distance = calculateDistance(lat, lng, schoolLat, schoolLng);
                schools.push({
                  name: elem.tags.name,
                  distance_miles: parseFloat(distance.toFixed(2)),
                });
                hasSchools = true;
              }
            }

            if (elem.tags?.leisure === 'park') {
              hasParks = true;
            }
          }

          if (hasSchools && !amenities.includes('schools')) amenities.push('schools');
          if (hasParks && !amenities.includes('park')) amenities.push('park');

          result.amenities_added = amenities.length;
          result.schools_added = schools.length;

          console.log(`[enrich-development] Found ${schools.length} schools, ${amenities.length} amenities`);

          await supabase
            .from('developments')
            .update({
              amenities: amenities.length > 0 ? amenities : dev.amenities,
              schools: schools.length > 0 ? schools.slice(0, 10) : dev.schools,
            })
            .eq('id', dev_id);
        }
      } catch (err) {
        console.error('[enrich-development] Amenities enrichment error:', err);
      }
    }

    // Step 4: Generate AI summary
    if (generate_summary) {
      console.log(`[enrich-development] Generating AI summary`);
      try {
        const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
        
        if (!lovableApiKey) {
          console.warn('[enrich-development] No Lovable AI key found, skipping summary generation');
        } else {
          const prompt = `Write a 2-3 sentence area overview for a property development with these details:
- Name: ${dev.name}
- Developer: ${dev.developer}
- Location: ${dev.location || dev.postcode}
- Borough: ${dev.borough || 'London'}
- Zone: ${dev.zone || 'Central London'}
- Nearest transport: ${dev.nearby_stations?.[0]?.station || 'nearby stations'}

Focus on location benefits, transport connectivity, and area character. Keep it professional and concise.`;

          const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${lovableApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                { role: 'system', content: 'You are a professional property copywriter.' },
                { role: 'user', content: prompt },
              ],
            }),
          });

          const aiData = await aiRes.json();
          const summary = aiData.choices?.[0]?.message?.content;

          if (summary) {
            await supabase
              .from('developments')
              .update({ summary })
              .eq('id', dev_id);

            result.summary_generated = true;
            console.log(`[enrich-development] Generated AI summary`);
          }
        }
      } catch (err) {
        console.error('[enrich-development] AI summary error:', err);
      }
    }

    // Update coordinates if geocoded
    if (result.geocoded && lat && lng) {
      await supabase
        .from('developments')
        .update({ lat, lng })
        .eq('id', dev_id);
    }

    console.log(`[enrich-development] Enrichment complete for ${dev_id}`, result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[enrich-development] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Calculate distance between two coordinates in miles
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
