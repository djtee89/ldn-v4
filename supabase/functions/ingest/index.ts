import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IngestRequest {
  dev_id: string;
  file?: File;
  file_path?: string;
}

interface DiffResult {
  new_units: number;
  updated_units: number;
  removed_units: number;
  price_changes: Array<{ unit_code: string; old_price: number; new_price: number }>;
  status_changes: Array<{ unit_code: string; old_status: string; new_status: string }>;
  error_rate: number;
  auto_publish: boolean;
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

    const formData = await req.formData();
    const dev_id = formData.get('dev_id') as string;
    const file = formData.get('file') as File;

    if (!dev_id || !file) {
      return new Response(JSON.stringify({ error: 'Missing dev_id or file' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing ingest for dev_id: ${dev_id}, file: ${file.name}`);

    // Upload file to storage
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const storagePath = `ingest/${dev_id}/${timestamp}.${fileExt}`;
    
    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('price-lists')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(JSON.stringify({ error: 'Failed to upload file' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse CSV (simplified - in production use a CSV parser library)
    const text = new TextDecoder().decode(fileBuffer);
    const lines = text.split('\n').filter(l => l.trim());
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    
    const unitCodeIdx = headers.findIndex(h => h.includes('unit') || h.includes('apt'));
    const priceIdx = headers.findIndex(h => h.includes('price') || h.includes('asking'));
    const bedsIdx = headers.findIndex(h => h.includes('bed'));
    const sizeIdx = headers.findIndex(h => h.includes('sqft') || h.includes('size'));
    const statusIdx = headers.findIndex(h => h.includes('status'));

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim());
      if (cols.length < 2) continue;

      rows.push({
        unit_code: cols[unitCodeIdx] || '',
        price: parseFloat(cols[priceIdx]?.replace(/[£,]/g, '') || '0'),
        beds: parseInt(cols[bedsIdx] || '0'),
        size_sqft: parseInt(cols[sizeIdx] || '0'),
        status: cols[statusIdx] || 'Available',
        raw: cols,
      });
    }

    // Create price_lists record
    const { data: priceList, error: plError } = await supabase
      .from('price_lists')
      .insert({
        dev_id,
        source: 'manual_upload',
        file_path: storagePath,
        received_at: new Date().toISOString(),
        parsed_ok: false,
      })
      .select()
      .single();

    if (plError || !priceList) {
      console.error('Price list creation error:', plError);
      return new Response(JSON.stringify({ error: 'Failed to create price list' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert price_list_rows
    const priceListRows = rows.map((row, idx) => ({
      price_list_id: priceList.id,
      row_no: idx + 1,
      unit_code: row.unit_code,
      beds: row.beds,
      size_sqft: row.size_sqft,
      price: row.price,
      status: row.status,
      raw: row.raw,
    }));

    const { error: rowsError } = await supabase
      .from('price_list_rows')
      .insert(priceListRows);

    if (rowsError) {
      console.error('Rows insert error:', rowsError);
    }

    // Get current units for diff
    const { data: currentUnits } = await supabase
      .from('units')
      .select('unit_number, price, status')
      .eq('dev_id', dev_id);

    const currentMap = new Map(currentUnits?.map(u => [u.unit_number, u]) || []);
    const newMap = new Map(rows.map(r => [r.unit_code, r]));

    const diff: DiffResult = {
      new_units: 0,
      updated_units: 0,
      removed_units: 0,
      price_changes: [],
      status_changes: [],
      error_rate: 0,
      auto_publish: false,
    };

    // Calculate diff
    for (const [code, newUnit] of newMap) {
      const current = currentMap.get(code);
      if (!current) {
        diff.new_units++;
      } else {
        if (current.price !== newUnit.price) {
          diff.price_changes.push({
            unit_code: code,
            old_price: current.price,
            new_price: newUnit.price,
          });
          diff.updated_units++;
        }
        if (current.status !== newUnit.status) {
          diff.status_changes.push({
            unit_code: code,
            old_status: current.status,
            new_status: newUnit.status,
          });
        }
      }
    }

    for (const code of currentMap.keys()) {
      if (!newMap.has(code)) {
        diff.removed_units++;
      }
    }

    // Calculate error rate
    const totalChanges = diff.new_units + diff.updated_units + diff.removed_units;
    const totalUnits = Math.max(currentMap.size, 1);
    diff.error_rate = totalChanges / totalUnits;

    // Check if auto-publish is safe
    const largePriceChanges = diff.price_changes.filter(pc => {
      const change = Math.abs((pc.new_price - pc.old_price) / pc.old_price);
      return change > 0.15; // >15% change
    });

    diff.auto_publish = diff.error_rate < 0.05 && largePriceChanges.length === 0;

    // Update parsed_ok
    await supabase
      .from('price_lists')
      .update({ parsed_ok: diff.auto_publish })
      .eq('id', priceList.id);

    // Auto-publish if safe
    if (diff.auto_publish) {
      console.log('Auto-publishing safe changes');
      await supabase.functions.invoke('publish', {
        body: { price_list_id: priceList.id },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        price_list_id: priceList.id,
        rows_parsed: rows.length,
        diff,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ingest function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
