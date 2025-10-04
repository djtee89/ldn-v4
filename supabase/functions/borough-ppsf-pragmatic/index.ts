import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function median(nums: number[]) {
  const s = nums.slice().sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log("Fetching ONS borough prices...");
    const { data: priceData, error: priceError } = await supabase
      .from("ons_borough_price")
      .select("area_code, median_price");
    
    if (priceError) throw priceError;

    console.log("Fetching EPC borough areas...");
    const { data: areaData, error: areaError } = await supabase
      .from("epc_borough_area")
      .select("area_code, median_floor_m2");
    
    if (areaError) throw areaError;

    const priceMap = new Map(priceData.map(r => [r.area_code, Number(r.median_price)]));
    const areaMap = new Map(areaData.map(r => [r.area_code, Number(r.median_floor_m2)]));

    const prices = [...priceMap.values()].filter(Number.isFinite);
    const areas = [...areaMap.values()].filter(Number.isFinite);
    const londonPrice = prices.length ? median(prices) : 600000;
    const londonM2 = areas.length ? median(areas) : 70;
    const M2_TO_FT2 = 10.7639;

    console.log(`London fallback: £${londonPrice}, ${londonM2}m²`);

    console.log("Fetching borough polygons...");
    const { data: boroughs, error: boroughError } = await supabase
      .from("area_polygons")
      .select("area_code, area_name")
      .eq("area_type", "Borough");
    
    if (boroughError) throw boroughError;

    const rows = boroughs.map(b => {
      const price = priceMap.get(b.area_code) ?? londonPrice;
      const m2 = areaMap.get(b.area_code) ?? londonM2;
      const ft2 = m2 * M2_TO_FT2;
      const ppsf = price && ft2 ? Math.round(price / ft2) : null;
      
      return {
        area_code: b.area_code,
        area_name: b.area_name,
        area_type: "Borough",
        price_per_sqft_overall: ppsf,
        bounds: { north: 0, south: 0, east: 0, west: 0 },
        center_lat: 0,
        center_lng: 0,
        sample_size: 0,
        data_sources: {
          method: "ONS/LR median price ÷ EPC median floor area (borough)",
          fallback_price: !priceMap.has(b.area_code),
          fallback_area: !areaMap.has(b.area_code)
        },
        last_updated: new Date().toISOString()
      };
    });

    console.log(`Prepared ${rows.length} metric rows`);

    // Delete existing Borough metrics
    const { error: deleteError } = await supabase
      .from("area_metrics")
      .delete()
      .eq("area_type", "Borough");
    
    if (deleteError) throw deleteError;

    console.log("Inserting new borough metrics...");
    const { data: inserted, error: insertError } = await supabase
      .from("area_metrics")
      .insert(rows)
      .select("area_code");
    
    if (insertError) throw insertError;

    const nonNull = rows.filter(r => Number.isFinite(r.price_per_sqft_overall)).length;
    console.log(`Successfully inserted ${inserted?.length || 0} metrics (${nonNull} non-null)`);

    return new Response(
      JSON.stringify({ ok: true, inserted: inserted?.length || 0, nonNull }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error("Function error:", e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
