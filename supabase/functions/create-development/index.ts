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

function parseCSVRow(csv: string): { headers: string[]; row: string[] } | null {
  const lines = csv.split('\n').filter(l => l.trim());
  if (lines.length < 2) return null;
  
  // Parse CSV with basic quote handling
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };
  
  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
  const row = parseCSVLine(lines[1]);
  
  console.log('[parseCSVRow] headers:', headers);
  console.log('[parseCSVRow] row values:', row);
  
  return { headers, row };
}

function extractDevelopmentData(text: string): any {
  console.log('[extractDevelopmentData] Starting extraction');
  
  // Try to parse as structured CSV first
  const csvData = parseCSVRow(text);
  
  if (csvData) {
    console.log('[extractDevelopmentData] Detected structured CSV data');
    const { headers, row } = csvData;
    
    // Map common column names
    const getColumn = (names: string[]): string => {
      for (const name of names) {
        const idx = headers.findIndex(h => h.includes(name));
        if (idx !== -1 && row[idx]) return row[idx].trim();
      }
      return '';
    };
    
    const data: any = {
      name: getColumn(['name', 'development']),
      developer: getColumn(['developer', 'developed by']),
      location: getColumn(['location', 'area', 'address']),
      postcode: getColumn(['postcode', 'post code']),
      zone: getColumn(['zone']),
      amenities: [],
      bedrooms: [],
      prices: {},
    };
    
    console.log('[extractDevelopmentData] Extracted base data:', data);
    
    // Parse amenities from Amenities column
    const amenitiesText = getColumn(['amenities', 'amenity', 'facilities']);
    if (amenitiesText) {
      const amenityKeywords = ['gym', 'concierge', 'pool', 'garden', 'terrace', 'parking', 'security', 'cinema', 'spa', 'sauna', 'lounge', 'studio'];
      for (const keyword of amenityKeywords) {
        if (amenitiesText.toLowerCase().includes(keyword)) {
          const capitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1);
          if (!data.amenities.includes(capitalized)) {
            data.amenities.push(capitalized);
          }
        }
      }
      console.log('[extractDevelopmentData] Parsed amenities:', data.amenities);
    }
    
    // Parse prices from Prices column
    const pricesText = getColumn(['prices', 'price', 'pricing']);
    if (pricesText) {
      const priceLines = pricesText.split(/[\n;]/).filter(l => l.trim());
      for (const line of priceLines) {
        const match = line.match(/(studio|\d+[\s-]*bed)[:\s]*from\s*£\s*([\d,]+)/i);
        if (match) {
          const bedType = match[1].toLowerCase().includes('studio') ? 'studio' : match[1].match(/\d+/)?.[0];
          const price = `£${match[2]}`;
          if (bedType) {
            data.prices[bedType] = price;
            if (bedType !== 'studio' && !data.bedrooms.includes(bedType)) {
              data.bedrooms.push(bedType);
            }
          }
        }
      }
      data.bedrooms.sort();
      console.log('[extractDevelopmentData] Parsed prices:', data.prices);
      console.log('[extractDevelopmentData] Parsed bedrooms:', data.bedrooms);
    }
    
    // Parse area overview
    const areaOverview = getColumn(['area overview', 'overview', 'description']);
    if (areaOverview) {
      data.area_overview = areaOverview;
    }
    
    // Parse tenure
    const tenure = getColumn(['tenure']);
    if (tenure) {
      data.tenure = tenure;
    }
    
    // Parse nearest station/tube
    const station = getColumn(['nearest tube', 'nearest station', 'tube', 'station', 'nearest tube/station']);
    if (station) {
      data.nearest_tube = station;
    }
    
    console.log('[extractDevelopmentData] Final structured data:', JSON.stringify(data, null, 2));
    return data;
  }
  
  // Fallback to unstructured text parsing
  console.log('[extractDevelopmentData] Using unstructured text parsing');
  const lines = text.split('\n').filter(l => l.trim());
  
  const data: any = {
    name: '',
    developer: '',
    location: '',
    amenities: [],
    bedrooms: [],
    prices: {},
  };

  // Look for name patterns
  const namePatterns = [
    /(?:development|project|name)[:\s]+([^\n]+)/i,
    /^([A-Z][A-Za-z\s&]+)(?:\s*-\s*|\s+by\s+)/i
  ];
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]?.trim()) {
      data.name = match[1].trim();
      console.log('[extractDevelopmentData] Found name via pattern:', data.name);
      break;
    }
  }

  // Extract developer
  const devMatch = text.match(/(?:developer|developed by|by)[:\s]+([^\n,]+)/i);
  if (devMatch) {
    data.developer = devMatch[1].trim();
  }

  // Extract location
  const locMatch = text.match(/(?:location|address|area)[:\s]+([^\n]+)/i);
  if (locMatch) {
    data.location = locMatch[1].trim();
  }

  // Extract amenities
  const amenityKeywords = ['gym', 'concierge', 'pool', 'garden', 'terrace', 'parking', 'security', 'cinema', 'spa'];
  for (const keyword of amenityKeywords) {
    if (text.toLowerCase().includes(keyword)) {
      data.amenities.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
    }
  }

  // Extract bedrooms and prices
  const bedroomMatches = text.match(/(\d+)\s*bed(?:room)?/gi);
  if (bedroomMatches) {
    const bedSet = new Set(bedroomMatches.map(m => m.match(/\d+/)?.[0]).filter(Boolean));
    data.bedrooms = Array.from(bedSet).sort();
  }

  const priceMatches = text.match(/£\s*(\d{1,3}(?:,\d{3})*)/g);
  if (priceMatches && data.bedrooms.length > 0) {
    priceMatches.slice(0, data.bedrooms.length).forEach((price, idx) => {
      if (data.bedrooms[idx]) {
        data.prices[data.bedrooms[idx]] = price.replace(/\s/g, '');
      }
    });
  }

  console.log('[extractDevelopmentData] Final unstructured data:', JSON.stringify(data, null, 2));
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
      console.error('[create-development] No name found. Text sample:', text.substring(0, 500));
      return new Response(JSON.stringify({ 
        error: 'Could not extract development name from file. Please ensure the file contains a clear development name in the first few lines.',
        debug: {
          textLength: text.length,
          textSample: text.substring(0, 200)
        }
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
