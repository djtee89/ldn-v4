import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

// Calculate similarity between two strings (simple Levenshtein-ish)
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshtein(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - editDistance) / longer.length;
}

function levenshtein(s1: string, s2: string): number {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
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

    const { action, keepId, mergeId } = await req.json().catch(() => ({}));

    // If merge action provided, perform the merge
    if (action === 'merge' && keepId && mergeId) {
      console.log('[dedupe] merging', { keepId, mergeId });

      // Get both developments
      const { data: developments } = await supabase
        .from('developments')
        .select('*')
        .in('id', [keepId, mergeId]);

      if (!developments || developments.length !== 2) {
        throw new Error('Could not find both developments');
      }

      const keeper = developments.find(d => d.id === keepId)!;
      const merged = developments.find(d => d.id === mergeId)!;

      // Move units from merged to keeper
      await supabase
        .from('units')
        .update({ dev_id: keepId })
        .eq('dev_id', mergeId);

      // Merge images (dedupe by URL)
      const allImages = [...(keeper.images || []), ...(merged.images || [])];
      const uniqueImages = Array.from(
        new Map(allImages.map(img => [img.sources[0]?.src, img])).values()
      );

      // Update keeper with merged data
      await supabase
        .from('developments')
        .update({
          images: uniqueImages,
          images_count: uniqueImages.length,
          updated_at: new Date().toISOString()
        })
        .eq('id', keepId);

      // Delete the merged development
      await supabase
        .from('developments')
        .update({ status: 'hidden' })
        .eq('id', mergeId);

      console.log('[dedupe] merge complete');
      return new Response(
        JSON.stringify({ success: true, message: 'Developments merged successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Otherwise, find duplicates
    console.log('[dedupe] scanning for duplicates');

    const { data: developments, error } = await supabase
      .from('developments')
      .select('id, name, developer, postcode, lat, lng, status')
      .eq('status', 'active');

    if (error) throw error;

    const duplicates = [];

    // Check each pair of developments
    for (let i = 0; i < developments.length; i++) {
      for (let j = i + 1; j < developments.length; j++) {
        const dev1 = developments[i];
        const dev2 = developments[j];

        let isDuplicate = false;
        let reason = '';

        // Check 1: Same developer + same postcode
        if (dev1.developer === dev2.developer && 
            dev1.postcode === dev2.postcode && 
            dev1.postcode) {
          isDuplicate = true;
          reason = 'Same developer and postcode';
        }

        // Check 2: Within 75m radius + same developer + similar name
        if (!isDuplicate && dev1.lat && dev1.lng && dev2.lat && dev2.lng) {
          const distance = calculateDistance(dev1.lat, dev1.lng, dev2.lat, dev2.lng);
          const nameSimilarity = similarity(dev1.name, dev2.name);

          if (distance < 75 && dev1.developer === dev2.developer && nameSimilarity > 0.7) {
            isDuplicate = true;
            reason = `Within ${Math.round(distance)}m, same developer, ${Math.round(nameSimilarity * 100)}% name match`;
          }
        }

        if (isDuplicate) {
          duplicates.push({
            dev1: { id: dev1.id, name: dev1.name, developer: dev1.developer, postcode: dev1.postcode },
            dev2: { id: dev2.id, name: dev2.name, developer: dev2.developer, postcode: dev2.postcode },
            reason
          });
        }
      }
    }

    console.log('[dedupe] found duplicates', { count: duplicates.length });
    return new Response(
      JSON.stringify({ success: true, duplicates }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[dedupe] error', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
