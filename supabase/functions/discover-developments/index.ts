import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DevelopmentListing {
  name: string;
  url: string;
  location?: string;
  images: string[];
  scrapedData: Record<string, any>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { developer_id } = await req.json();

    if (!developer_id) {
      throw new Error('developer_id is required');
    }

    console.log('Starting discovery for developer:', developer_id);

    // Get developer config
    const { data: developer, error: devError } = await supabase
      .from('developer_registry')
      .select('*')
      .eq('id', developer_id)
      .single();

    if (devError || !developer) {
      throw new Error(`Developer not found: ${developer_id}`);
    }

    // Create scrape job
    const { data: job, error: jobError } = await supabase
      .from('scrape_jobs')
      .insert({
        developer_id,
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (jobError) throw jobError;

    console.log('Created scrape job:', job.id);

    // Scrape each index URL
    const discoveries: DevelopmentListing[] = [];
    const indexUrls = developer.index_urls as string[];
    
    for (const indexUrl of indexUrls) {
      console.log('Scraping index URL:', indexUrl);
      
      try {
        const response = await fetch(indexUrl);
        const html = await response.text();
        
        // Simple regex-based extraction (replace with proper HTML parsing in production)
        const developmentLinks = extractDevelopmentLinks(html, developer.allow_domains as string[]);
        
        console.log(`Found ${developmentLinks.length} development links`);
        
        // Scrape each development page
        for (const link of developmentLinks.slice(0, 10)) { // Limit to 10 per run
          try {
            const devResponse = await fetch(link);
            const devHtml = await devResponse.text();
            
            const listing = extractDevelopmentData(
              devHtml,
              link,
              developer.image_rules as { keywords: string[] }
            );
            
            if (listing) {
              discoveries.push(listing);
            }
          } catch (error) {
            console.error(`Error scraping ${link}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error scraping index ${indexUrl}:`, error);
      }
    }

    console.log(`Discovered ${discoveries.length} developments`);

    // Insert into discovery queue
    const queueInserts = discoveries.map((dev) => ({
      developer_id,
      name: dev.name,
      url: dev.url,
      location: dev.location,
      scraped_data: dev.scrapedData,
      images: dev.images,
      is_london: isLondonLocation(dev.location || dev.name),
    }));

    if (queueInserts.length > 0) {
      const { error: queueError } = await supabase
        .from('discovery_queue')
        .insert(queueInserts);

      if (queueError) {
        console.error('Error inserting into queue:', queueError);
      }
    }

    // Update job status
    await supabase
      .from('scrape_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        discovered_count: discoveries.length,
      })
      .eq('id', job.id);

    return new Response(
      JSON.stringify({
        success: true,
        job_id: job.id,
        discovered: discoveries.length,
        developments: discoveries,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Discovery error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractDevelopmentLinks(html: string, allowedDomains: string[]): string[] {
  const links: string[] = [];
  const linkRegex = /href=["']([^"']+)["']/gi;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[1];
    
    // Check if URL is from allowed domain and looks like a development page
    if (
      allowedDomains.some((domain) => url.includes(domain)) &&
      (url.includes('development') || url.includes('homes') || url.includes('project'))
    ) {
      const fullUrl = url.startsWith('http') ? url : `https://${allowedDomains[0]}${url}`;
      if (!links.includes(fullUrl)) {
        links.push(fullUrl);
      }
    }
  }

  return links;
}

function extractDevelopmentData(
  html: string,
  url: string,
  imageRules: { keywords: string[] }
): DevelopmentListing | null {
  try {
    // Extract title (various common patterns)
    const titleMatch =
      html.match(/<h1[^>]*>([^<]+)<\/h1>/i) ||
      html.match(/<title>([^<]+)<\/title>/i) ||
      html.match(/property-name[^>]*>([^<]+)</i);

    const name = titleMatch ? titleMatch[1].trim().replace(/&amp;/g, '&') : 'Unknown Development';

    // Extract location
    const locationMatch =
      html.match(/location[^>]*>([^<]+)</i) ||
      html.match(/address[^>]*>([^<]+)</i) ||
      html.match(/London, ([^<,]+)/i);

    const location = locationMatch ? locationMatch[1].trim() : undefined;

    // Extract images based on keywords
    const images: string[] = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let imgMatch;

    while ((imgMatch = imgRegex.exec(html)) !== null) {
      const imgUrl = imgMatch[1];
      const matchesKeyword = imageRules.keywords.some((keyword) =>
        imgUrl.toLowerCase().includes(keyword)
      );

      if (matchesKeyword && imgUrl.startsWith('http')) {
        images.push(imgUrl);
      }
    }

    // Extract other data
    const scrapedData: Record<string, any> = {
      extracted_at: new Date().toISOString(),
    };

    // Try to extract price
    const priceMatch = html.match(/£([\d,]+)/);
    if (priceMatch) {
      scrapedData.price = priceMatch[1].replace(/,/g, '');
    }

    // Try to extract bedrooms
    const bedsMatch = html.match(/(\d+)\s*bed/i);
    if (bedsMatch) {
      scrapedData.bedrooms = bedsMatch[1];
    }

    return {
      name,
      url,
      location,
      images: images.slice(0, 10), // Limit to 10 images
      scrapedData,
    };
  } catch (error) {
    console.error('Error extracting development data:', error);
    return null;
  }
}

function isLondonLocation(text: string): boolean {
  const londonKeywords = [
    'london',
    'central london',
    'east london',
    'west london',
    'south london',
    'north london',
    'city of london',
    'greater london',
    // London boroughs
    'westminster',
    'camden',
    'islington',
    'hackney',
    'tower hamlets',
    'greenwich',
    'lewisham',
    'southwark',
    'lambeth',
    'wandsworth',
    'hammersmith',
    'fulham',
    'kensington',
    'chelsea',
    'brent',
    'ealing',
    'hounslow',
    'richmond',
    'barnet',
    'haringey',
    'enfield',
    'waltham forest',
    'redbridge',
    'newham',
    'barking',
    'dagenham',
    'havering',
    'bexley',
    'bromley',
    'croydon',
    'sutton',
    'merton',
    'kingston',
  ];

  const lowerText = text.toLowerCase();
  return londonKeywords.some((keyword) => lowerText.includes(keyword));
}