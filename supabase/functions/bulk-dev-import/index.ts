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

    const { developments } = await req.json();

    if (!Array.isArray(developments) || developments.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing or empty developments array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[bulk-dev-import] importing', { count: developments.length });

    const results = {
      created: 0,
      updated: 0,
      errors: [] as any[]
    };

    for (const dev of developments) {
      try {
        // Check if development exists by id
        if (dev.id) {
          const { data: existing } = await supabase
            .from('developments')
            .select('id')
            .eq('id', dev.id)
            .single();

          if (existing) {
            // Update existing
            const { error } = await supabase
              .from('developments')
              .update({
                ...dev,
                updated_at: new Date().toISOString()
              })
              .eq('id', dev.id);

            if (error) throw error;
            results.updated++;
            continue;
          }
        }

        // Insert new development
        const { error } = await supabase
          .from('developments')
          .insert({
            ...dev,
            status: dev.status || 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
        results.created++;
      } catch (error: any) {
        results.errors.push({
          development: dev.id || dev.name,
          error: error.message
        });
      }
    }

    console.log('[bulk-dev-import] complete', results);
    return new Response(
      JSON.stringify({ success: true, ...results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[bulk-dev-import] error', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
