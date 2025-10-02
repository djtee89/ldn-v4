import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { queue_id } = await req.json();

    if (!queue_id) {
      throw new Error('queue_id is required');
    }

    console.log('Importing development from queue:', queue_id);

    // Get queue item
    const { data: queueItem, error: queueError } = await supabase
      .from('discovery_queue')
      .select('*, developer_registry(name)')
      .eq('id', queue_id)
      .single();

    if (queueError || !queueItem) {
      throw new Error('Queue item not found');
    }

    // Generate development ID
    const devId = generateDevId(queueItem.name, queueItem.developer_registry.name);

    // Check if development already exists
    const { data: existing } = await supabase
      .from('developments')
      .select('id')
      .eq('id', devId)
      .single();

    if (existing) {
      throw new Error('Development already exists with this ID');
    }

    // Prepare development data
    const scrapedData = queueItem.scraped_data as Record<string, any>;
    const images = queueItem.images as string[];

    const developmentData = {
      id: devId,
      name: queueItem.name,
      developer: queueItem.developer_registry.name,
      location: queueItem.location,
      images: images,
      area_overview: scrapedData.description || `${queueItem.name} development in ${queueItem.location || 'London'}`,
      raw_details: {
        source_url: queueItem.url,
        scraped_at: scrapedData.extracted_at,
        original_data: scrapedData,
      },
      status: 'Available',
      featured: false,
    };

    // Insert development
    const { error: insertError } = await supabase
      .from('developments')
      .insert(developmentData);

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error(`Failed to insert development: ${insertError.message}`);
    }

    console.log('Successfully imported development:', devId);

    return new Response(
      JSON.stringify({
        success: true,
        dev_id: devId,
        development: developmentData,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Import error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateDevId(name: string, developer: string): string {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 40);
  
  const cleanDev = developer
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 20);
  
  return `${cleanName}-${cleanDev}`;
}