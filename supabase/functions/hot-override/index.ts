import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { dev_id, unit_id, note } = await req.json();

    if (!dev_id || !unit_id) {
      return new Response(JSON.stringify({ error: 'Missing dev_id or unit_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Setting manual override for dev ${dev_id}, unit ${unit_id}`);

    // Verify unit exists
    const { data: unit } = await supabase
      .from('units')
      .select('*')
      .eq('id', unit_id)
      .single();

    if (!unit) {
      return new Response(JSON.stringify({ error: 'Unit not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Set override
    await supabase
      .from('hottest_unit')
      .upsert({
        dev_id,
        unit_id,
        score: 100,
        reason: {
          total_score: 100,
          details: [note || 'Manual override'],
          override_note: note,
        },
        override: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'dev_id',
      });

    return new Response(
      JSON.stringify({
        success: true,
        dev_id,
        unit_id,
        message: 'Manual override set',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in hot-override function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
