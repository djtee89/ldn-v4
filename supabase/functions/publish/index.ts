import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  const start = Date.now();
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[publish] start', { method: req.method, url: req.url });
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { price_list_id } = await req.json().catch(() => ({}));
    console.log('[publish] payload', { price_list_id });

    if (!price_list_id) {
      console.log('[publish] error: missing price_list_id', { ms: Date.now() - start });
      return new Response(JSON.stringify({ error: 'Missing price_list_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get price list and rows
    const { data: priceList, error: plError } = await supabase
      .from('price_lists')
      .select('*, price_list_rows(*)')
      .eq('id', price_list_id)
      .single();

    if (plError || !priceList) {
      console.error('[publish] price list not found', { error: String(plError), ms: Date.now() - start });
      return new Response(JSON.stringify({ error: 'Price list not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dev_id = priceList.dev_id;
    console.log('[publish] processing', { dev_id, rowCount: priceList.price_list_rows?.length || 0 });
    let updated = 0;

    // Upsert units
    for (const row of priceList.price_list_rows || []) {
      const { error: upsertError } = await supabase
        .from('units')
        .upsert({
          dev_id,
          unit_number: row.unit_code,
          beds: row.beds,
          size_sqft: row.size_sqft,
          price: row.price,
          service_charge: row.service_charge,
          status: row.status,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'dev_id,unit_number',
        });

      if (!upsertError) updated++;
    }

    // Recompute start prices by bed count
    const { data: units } = await supabase
      .from('units')
      .select('beds, price')
      .eq('dev_id', dev_id)
      .in('status', ['Available', 'Negotiation']);

    const pricesByBeds = new Map<number, number[]>();
    units?.forEach(u => {
      if (!pricesByBeds.has(u.beds)) pricesByBeds.set(u.beds, []);
      pricesByBeds.get(u.beds)!.push(u.price);
    });

    const startPrices: Record<string, number> = {};
    for (const [beds, prices] of pricesByBeds) {
      startPrices[`${beds}bed`] = Math.min(...prices);
    }

    // Update development
    await supabase
      .from('developments')
      .update({
        prices: startPrices,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dev_id);

    // Check if we should recompute hottest unit
    const { data: hottest } = await supabase
      .from('hottest_unit')
      .select('manual_override')
      .eq('dev_id', dev_id)
      .maybeSingle();

    if (!hottest || !hottest.manual_override) {
      console.log('[publish] triggering hot-auto', { dev_id });
      await supabase.functions.invoke('hot-auto', {
        body: { dev_id },
      });
    } else {
      console.log('[publish] skipping hot-auto (override active)', { dev_id });
    }

    // Log the publish event
    await supabase.from('change_log').insert({
      dev_id,
      change_type: 'publish',
      changed_at: new Date().toISOString(),
      details: { units_updated: updated, start_prices: startPrices },
      price_list_id,
    });

    // Run validation checks
    await supabase.functions.invoke('validate-units', {
      body: { dev_id, price_list_id },
    });

    console.log('[publish] ok', { ms: Date.now() - start, units_updated: updated, start_prices: startPrices });
    return new Response(
      JSON.stringify({
        success: true,
        dev_id,
        units_updated: updated,
        start_prices: startPrices,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[publish] error', { 
      err: String(error), 
      stack: (error as Error)?.stack, 
      ms: Date.now() - start 
    });
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
