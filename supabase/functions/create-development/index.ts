import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Parse Excel files
async function parseExcel(buffer: ArrayBuffer): Promise<string> {
  try {
    const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Convert to CSV for easier parsing
    const csv = XLSX.utils.sheet_to_csv(firstSheet);
    return csv;
  } catch (error) {
    console.error('[Excel parsing error]', error);
    throw new Error('Failed to parse Excel file');
  }
}

// Note: PDF parsing requires conversion - use CSV/Excel for best results
async function extractTextFromPDF(_buffer: ArrayBuffer): Promise<string> {
  throw new Error('PDF upload is not yet supported for development creation. Please convert your PDF to CSV or Excel format and try again.');
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractDevelopmentData(text: string): any {
  const lines = text.split('\n').filter(l => l.trim());
  
  // Extract key information using patterns
  const data: any = {
    name: '',
    developer: '',
    location: '',
    amenities: [],
    bedrooms: [],
    prices: {},
  };

  // Look for name (usually in first few lines or after "Name:" or "Development:")
  for (const line of lines.slice(0, 5)) {
    if (line.length > 5 && line.length < 100 && !line.includes(':')) {
      data.name = line.trim();
      break;
    }
  }

  // Extract developer
  const devMatch = text.match(/(?:developer|developed by)[:\s]+([^\n]+)/i);
  if (devMatch) data.developer = devMatch[1].trim();

  // Extract location/address
  const locMatch = text.match(/(?:location|address)[:\s]+([^\n]+)/i);
  if (locMatch) data.location = locMatch[1].trim();

  // Extract amenities
  const amenityKeywords = ['gym', 'concierge', 'pool', 'garden', 'terrace', 'parking', 'security', 'cinema'];
  for (const keyword of amenityKeywords) {
    if (text.toLowerCase().includes(keyword)) {
      data.amenities.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
    }
  }

  // Extract bedrooms
  const bedroomMatches = text.match(/(\d+)\s*bed(?:room)?/gi);
  if (bedroomMatches) {
    const bedSet = new Set(bedroomMatches.map(m => m.match(/\d+/)?.[0]).filter(Boolean));
    data.bedrooms = Array.from(bedSet).sort();
  }

  // Extract prices
  const priceMatches = text.match(/£\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g);
  if (priceMatches && data.bedrooms.length > 0) {
    priceMatches.slice(0, data.bedrooms.length).forEach((price, idx) => {
      if (data.bedrooms[idx]) {
        data.prices[data.bedrooms[idx]] = price.replace(/\s/g, '');
      }
    });
  }

  return data;
}

Deno.serve(async (req) => {
  const start = Date.now();
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[create-development] start');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'Missing file' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[create-development] file received', { name: file.name, size: file.size });

    const fileBuffer = await file.arrayBuffer();
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    let text = '';
    
    // Parse file based on type
    if (fileExt === 'pdf') {
      console.log('[create-development] parsing PDF');
      text = await extractTextFromPDF(fileBuffer);
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      console.log('[create-development] parsing Excel');
      text = await parseExcel(fileBuffer);
    } else {
      // For CSV, decode as text
      text = new TextDecoder().decode(fileBuffer);
    }

    console.log('[create-development] text extracted', { length: text.length });

    // Extract development data
    const devData = extractDevelopmentData(text);
    
    if (!devData.name) {
      return new Response(JSON.stringify({ 
        error: 'Could not extract development name from file. Please ensure the file contains development information.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate unique ID
    const devId = generateSlug(devData.name);
    
    // Check if development already exists
    const { data: existing } = await supabase
      .from('developments')
      .select('id')
      .eq('id', devId)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ 
        error: `Development with ID "${devId}" already exists. Please use a different name or update the existing one.` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create development entry
    const { data: newDev, error: insertError } = await supabase
      .from('developments')
      .insert({
        id: devId,
        name: devData.name,
        developer: devData.developer || 'Unknown',
        location: devData.location || '',
        amenities: devData.amenities,
        bedrooms: devData.bedrooms,
        prices: devData.prices,
        status: 'Under Construction',
        featured: false,
      })
      .select()
      .single();

    if (insertError || !newDev) {
      console.error('[create-development] insert error', insertError);
      return new Response(JSON.stringify({ 
        error: 'Failed to create development in database' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log the creation
    await supabase.from('change_log').insert({
      dev_id: devId,
      change_type: 'development_created',
      changed_at: new Date().toISOString(),
      details: { 
        source: 'file_upload',
        file_name: file.name,
        extracted_data: devData 
      },
    });

    console.log('[create-development] success', { 
      dev_id: devId, 
      ms: Date.now() - start 
    });

    return new Response(
      JSON.stringify({
        success: true,
        dev_id: devId,
        development_name: devData.name,
        data: devData,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[create-development] error', { 
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
