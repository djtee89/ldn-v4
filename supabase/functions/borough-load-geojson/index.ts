// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Feature = {
  type: "Feature",
  properties: { lad_code?: string; lad_name?: string } & Record<string, any>,
  geometry: any
};
type FC = { type: "FeatureCollection", features: Feature[] };

function cleanCode(raw?: string) {
  if (!raw) return undefined;
  const m = raw.match(/E0900\d{4}|E090000\d{2}|E090\d+/);
  return m ? m[0].slice(0, 9) : raw;
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

    console.log("Fetching GeoJSON from storage...");
    const { data, error } = await supabase.storage
      .from("static")
      .download("boroughs/london-boroughs.geojson");
    
    if (error) {
      console.error("Storage error:", error);
      throw error;
    }

    const text = await data.text();
    const fc: FC = JSON.parse(text);
    console.log(`Loaded ${fc.features.length} features from GeoJSON`);

    const toWrite: Array<{ area_code: string; area_name: string; geometry: any }> = [];
    for (const f of fc.features) {
      const props = f.properties || {};
      const code = cleanCode(
        props.lad21cd || props.lad22cd || props.lad19cd || 
        props.lad_code || props.GSS_CODE || props.LAD_CODE
      );
      const name = (
        props.lad21nm || props.lad22nm || props.lad19nm || 
        props.lad_name || props.LAD_NAME || props.NAME || ""
      ).trim();
      
      if (!code || !name || !f.geometry) continue;
      if (!code.startsWith("E090")) continue;
      
      toWrite.push({ area_code: code, area_name: name, geometry: f.geometry });
    }

    console.log(`Prepared ${toWrite.length} borough records`);

    if (toWrite.length !== 33) {
      return new Response(
        JSON.stringify({ ok: false, msg: `Expected 33 boroughs, got ${toWrite.length}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rows = toWrite.map(r => ({
      area_code: r.area_code,
      area_name: r.area_name,
      area_type: "Borough",
      geometry: r.geometry
    }));

    // Delete existing Borough polygons
    const { error: deleteError } = await supabase
      .from("area_polygons")
      .delete()
      .eq("area_type", "Borough");
    
    if (deleteError) {
      console.error("Delete error:", deleteError);
      throw deleteError;
    }

    console.log("Inserting new borough polygons...");
    const { data: inserted, error: insertError } = await supabase
      .from("area_polygons")
      .insert(rows)
      .select("area_code");
    
    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    console.log(`Successfully inserted ${inserted?.length || 0} borough polygons`);

    return new Response(
      JSON.stringify({ ok: true, inserted: inserted?.length || 0 }),
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
