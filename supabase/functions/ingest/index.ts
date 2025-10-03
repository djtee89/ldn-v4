import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple PDF text extraction using pdfjs-dist
async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    // Use pdfjs-dist via esm.sh
    const pdfjsLib = await import('https://esm.sh/pdfjs-dist@3.11.174/build/pdf.mjs');
    
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('[PDF extraction error]', error);
    throw new Error('Failed to extract text from PDF');
  }
}

interface IngestRequest {
  dev_id: string;
  file?: File;
  file_path?: string;
}

interface DiffResult {
  added: number;
  updated: number;
  removed: number;
  errors: number;
  price_changes: Array<{ unit_code: string; old_price: number; new_price: number }>;
  status_changes: Array<{ unit_code: string; old_status: string; new_status: string }>;
  error_rate: number;
  auto_publish: boolean;
}

Deno.serve(async (req) => {
  const start = Date.now();
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[ingest] start', { method: req.method, url: req.url });
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const dev_id = formData.get('dev_id') as string;
    const file = formData.get('file') as File;

    if (!dev_id || !file) {
      console.log('[ingest] error: missing params', { ms: Date.now() - start });
      return new Response(JSON.stringify({ error: 'Missing dev_id or file' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[ingest] payload', { dev_id, fileName: file.name, fileSize: file.size });

    // Upload file to storage
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const storagePath = `ingest/${dev_id}/${timestamp}.${fileExt}`;
    
    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('ingest')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('[ingest] storage upload failed', { error: String(uploadError), ms: Date.now() - start });
      return new Response(JSON.stringify({ error: 'Failed to upload file' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[ingest] file uploaded', { storagePath });

    // Parse file based on type
    let rows = [];
    const fileExtension = fileExt?.toLowerCase();

    if (fileExtension === 'pdf') {
      console.log('[ingest] parsing PDF');
      try {
        const text = await extractTextFromPDF(fileBuffer);
        
        // Extract table data from PDF text
        // Look for lines that contain unit codes and prices
        const lines = text.split('\n').filter(l => l.trim());
        const potentialRows = [];
        
        for (const line of lines) {
          // Try to extract structured data from each line
          // Look for patterns like: unit_code, beds, sqft, price
          const unitMatch = line.match(/([A-Z0-9-]+)\s+(\d+)\s*bed/i);
          const priceMatch = line.match(/£?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
          const sqftMatch = line.match(/(\d{3,5})\s*(?:sq\.?\s*ft|sqft)/i);
          
          if (unitMatch && priceMatch) {
            potentialRows.push({
              unit_code: unitMatch[1],
              beds: parseInt(unitMatch[2]),
              price: parseFloat(priceMatch[1].replace(/,/g, '')),
              size_sqft: sqftMatch ? parseInt(sqftMatch[1]) : 0,
              status: line.toLowerCase().includes('sold') ? 'Sold' : 'Available',
              service_charge: null,
            });
          }
        }
        
        if (potentialRows.length === 0) {
          // Fallback: try to parse as comma-separated values
          const csvLikeLines = lines.filter(l => l.includes(',') && l.split(',').length > 3);
          if (csvLikeLines.length > 0) {
            const headers = csvLikeLines[0].toLowerCase().split(',').map(h => h.trim());
            const unitCodeIdx = headers.findIndex(h => h.includes('unit') || h.includes('apt'));
            const priceIdx = headers.findIndex(h => h.includes('price') || h.includes('asking'));
            const bedsIdx = headers.findIndex(h => h.includes('bed'));
            const sizeIdx = headers.findIndex(h => h.includes('sqft') || h.includes('size'));
            const statusIdx = headers.findIndex(h => h.includes('status'));
            
            for (let i = 1; i < csvLikeLines.length; i++) {
              const cols = csvLikeLines[i].split(',').map(c => c.trim());
              if (cols.length < 2) continue;
              potentialRows.push({
                unit_code: cols[unitCodeIdx] || '',
                price: parseFloat(cols[priceIdx]?.replace(/[£,]/g, '') || '0'),
                beds: parseInt(cols[bedsIdx] || '0'),
                size_sqft: parseInt(cols[sizeIdx] || '0'),
                status: cols[statusIdx] || 'Available',
                service_charge: null,
              });
            }
          }
        }
        
        rows = potentialRows;
        console.log('[ingest] PDF parsed', { rowsFound: rows.length });
        
        if (rows.length === 0) {
          throw new Error('No table data found in PDF. Please ensure the PDF contains a structured price list.');
        }
      } catch (pdfError) {
        console.error('[ingest] PDF parse error', { error: String(pdfError) });
        return new Response(JSON.stringify({ 
          error: `PDF parsing failed: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}. Please try converting to CSV/Excel first.` 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      // Parse CSV/Excel (original logic)
      const text = new TextDecoder().decode(fileBuffer);
      const lines = text.split('\n').filter(l => l.trim());
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      
      // Flexible header detection
      const unitCodeIdx = headers.findIndex(h => 
        h.includes('unit') || h.includes('apt') || h.includes('home') || h.includes('plot')
      );
      const priceIdx = headers.findIndex(h => 
        h.includes('price') || h.includes('asking')
      );
      const bedsIdx = headers.findIndex(h => 
        h.includes('bed') || h.includes('type')
      );
      const sizeIdx = headers.findIndex(h => 
        h.includes('sqft') || h.includes('size')
      );
      const statusIdx = headers.findIndex(h => 
        h.includes('status') || h.includes('availability')
      );
      const serviceChargeIdx = headers.findIndex(h => 
        h.includes('service') && h.includes('charge')
      );

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim());
        if (cols.length < 2) continue;

        // Extract beds from Type column (e.g., "2 Bed" → 2)
        let bedsValue = 0;
        if (bedsIdx >= 0 && cols[bedsIdx]) {
          const bedsMatch = cols[bedsIdx].match(/(\d+)/);
          bedsValue = bedsMatch ? parseInt(bedsMatch[1]) : 0;
        }

        // Map "Completed" status to "Available"
        let statusValue = cols[statusIdx] || 'Available';
        if (statusValue.toLowerCase() === 'completed') {
          statusValue = 'Available';
        }

        rows.push({
          unit_code: cols[unitCodeIdx] || '',
          price: parseFloat(cols[priceIdx]?.replace(/[£,]/g, '') || '0'),
          beds: bedsValue,
          size_sqft: parseInt(cols[sizeIdx] || '0'),
          status: statusValue,
          service_charge: serviceChargeIdx >= 0 ? parseFloat(cols[serviceChargeIdx]?.replace(/[£,]/g, '') || '0') : null,
        });
      }
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
      console.error('[ingest] price list creation failed', { error: String(plError), ms: Date.now() - start });
      return new Response(JSON.stringify({ error: 'Failed to create price list' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log the upload
    await supabase.from('change_log').insert({
      dev_id,
      change_type: 'price_list_upload',
      changed_at: new Date().toISOString(),
      details: { file_name: file.name, file_size: file.size },
      price_list_id: priceList.id,
    });

    console.log('[ingest] price_list created', { id: priceList.id, rowCount: rows.length });

    // Insert price_list_rows
    const priceListRows = rows.map((row) => ({
      price_list_id: priceList.id,
      unit_code: row.unit_code,
      beds: row.beds,
      size_sqft: row.size_sqft,
      price: row.price,
      status: row.status,
      service_charge: row.service_charge,
    }));

    const { error: rowsError } = await supabase
      .from('price_list_rows')
      .insert(priceListRows);

    if (rowsError) {
      console.error('[ingest] rows insert error', { 
        error: rowsError.message || String(rowsError),
        details: JSON.stringify(rowsError),
        sampleRow: priceListRows[0] 
      });
    } else {
      console.log('[ingest] price_list_rows inserted', { count: priceListRows.length });
    }

    // Get current units for diff
    const { data: currentUnits } = await supabase
      .from('units')
      .select('unit_number, price, status')
      .eq('dev_id', dev_id);

    const currentMap = new Map(currentUnits?.map(u => [u.unit_number, u]) || []);
    const newMap = new Map(rows.map(r => [r.unit_code, r]));

    const diff: DiffResult = {
      added: 0,
      updated: 0,
      removed: 0,
      errors: 0,
      price_changes: [],
      status_changes: [],
      error_rate: 0,
      auto_publish: false,
    };

    // Calculate diff and track errors
    for (const [code, newUnit] of newMap) {
      // Track parsing errors (missing required fields)
      if (!code || !newUnit.price || newUnit.beds === 0) {
        diff.errors++;
        continue;
      }

      const current = currentMap.get(code);
      if (!current) {
        diff.added++;
      } else {
        if (current.price !== newUnit.price) {
          diff.price_changes.push({
            unit_code: code,
            old_price: current.price,
            new_price: newUnit.price,
          });
          diff.updated++;
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
        diff.removed++;
      }
    }

    // Calculate error rate (parsing errors + unexpected removals)
    const totalUnits = Math.max(currentMap.size, newMap.size, 1);
    diff.error_rate = (diff.errors + (currentMap.size > 0 ? diff.removed : 0)) / totalUnits;

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
      console.log('[ingest] auto-publishing', { price_list_id: priceList.id, diff });
      await supabase.functions.invoke('publish', {
        body: { price_list_id: priceList.id },
      });
    } else {
      console.log('[ingest] manual approval required', { error_rate: diff.error_rate, large_changes: diff.price_changes.length });
    }

    console.log('[ingest] ok', { ms: Date.now() - start, auto_publish: diff.auto_publish });
    return new Response(
      JSON.stringify({
        success: true,
        price_list_id: priceList.id,
        rows_parsed: rows.length,
        auto_published: diff.auto_publish,
        diff: {
          added: diff.added,
          updated: diff.updated,
          removed: diff.removed,
          errors: diff.errors,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[ingest] error', { 
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
