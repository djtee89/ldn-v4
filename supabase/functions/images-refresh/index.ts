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

    const { dev_id } = await req.json();

    if (!dev_id) {
      return new Response(JSON.stringify({ error: 'Missing dev_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Refreshing images for dev_id: ${dev_id}`);

    // Get development and developer info
    const { data: dev } = await supabase
      .from('developments')
      .select('*, developers(*)')
      .eq('id', dev_id)
      .single();

    if (!dev || !dev.site_url) {
      return new Response(JSON.stringify({ error: 'Development not found or missing site_url' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const allowedDomains = dev.developers?.allow_domains || [];
    const siteUrl = new URL(dev.site_url);

    // Check if site_url is in allowed domains
    if (!allowedDomains.some((domain: string) => siteUrl.hostname.includes(domain))) {
      return new Response(JSON.stringify({ error: 'Site URL not in allowed domains' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch page HTML
    const response = await fetch(dev.site_url);
    const html = await response.text();

    // Extract images
    const images: Array<{ url: string; source: string }> = [];

    // 1. Look for og:image
    const ogMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (ogMatch) {
      images.push({ url: ogMatch[1], source: 'og:image' });
    }

    // 2. Look for large img tags (simplified)
    const imgMatches = html.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/g);
    for (const match of imgMatches) {
      const imgUrl = match[1];
      // Filter for likely gallery images
      if (imgUrl.includes('gallery') || imgUrl.includes('hero') || imgUrl.includes('main')) {
        const fullUrl = new URL(imgUrl, dev.site_url).href;
        images.push({ url: fullUrl, source: 'img_tag' });
      }
    }

    // 3. Fallback: generate static map
    if (images.length === 0 && dev.lat && dev.lng) {
      const mapboxToken = Deno.env.get('MAPBOX_TOKEN') || '';
      const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${dev.lng},${dev.lat},14,0/800x600@2x?access_token=${mapboxToken}`;
      images.push({ url: mapUrl, source: 'mapbox_static' });
    }

    // Take up to 6 images
    const selectedImages = images.slice(0, 6);

    // Update development
    await supabase
      .from('developments')
      .update({
        images: selectedImages.map(img => img.url),
        updated_at: new Date().toISOString(),
      })
      .eq('id', dev_id);

    console.log(`Updated ${selectedImages.length} images for ${dev_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        dev_id,
        images_found: selectedImages.length,
        images: selectedImages,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in images-refresh function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
