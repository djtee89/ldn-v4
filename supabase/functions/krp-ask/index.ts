import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, devId = 'krp' } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Missing query parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Processing query:', query);

    // Step 1: Generate embedding for the query using Lovable AI
    console.log('Generating embedding...');
    const embeddingResponse = await fetch('https://ai.gateway.lovable.dev/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query,
      }),
    });

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error('Embedding error:', errorText);
      throw new Error(`Embedding failed: ${errorText}`);
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    // Step 2: Retrieve relevant document chunks using vector similarity
    console.log('Retrieving relevant chunks...');
    let chunks: any[] = [];
    const { data: rpcChunks, error: chunksError } = await supabase.rpc('match_rag_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 6,
      filter_dev_id: devId
    });

    if (chunksError) {
      console.error('Chunks retrieval error:', chunksError);
      // If function doesn't exist, fallback to basic search
      const { data: fallbackChunks } = await supabase
        .from('rag_chunks')
        .select('source, content')
        .eq('dev_id', devId)
        .limit(6);
      
      chunks = fallbackChunks || [];
    } else {
      chunks = rpcChunks || [];
    }

    console.log(`Found ${chunks?.length || 0} relevant chunks`);

    // Step 3: Use Lovable AI with tool calling to extract filters and generate answer
    const systemPrompt = `You are an AI assistant for King's Road Park development. 
Answer questions ONLY about this development using the provided documentation. 
Always cite your sources.

When users ask about available units, call the filter_units tool with constraints from their query.
If they ask about features, amenities, or general info, answer directly from the docs.
Never invent data. If uncertain, say so.`;

    const context = chunks?.map((d: any) => `[${d.source}] ${d.content}`).join('\n\n') || 'No relevant documentation found.';

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Context:\n${context}\n\nUser question: ${query}` }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'filter_units',
            description: 'Filter available units by user constraints',
            parameters: {
              type: 'object',
              properties: {
                max_price: { type: 'number', description: 'Maximum price in GBP' },
                min_price: { type: 'number', description: 'Minimum price in GBP' },
                min_beds: { type: 'number', description: 'Minimum bedrooms' },
                max_beds: { type: 'number', description: 'Maximum bedrooms' },
                aspect: { 
                  type: 'string', 
                  enum: ['south', 'southwest', 'west', 'east', 'north', 'southeast', 'northwest', 'northeast'],
                  description: 'Preferred aspect/direction'
                },
                view_park: { type: 'boolean', description: 'Must have park view' },
                view_river: { type: 'boolean', description: 'Must have river view' },
                has_balcony: { type: 'boolean', description: 'Must have balcony' }
              }
            }
          }
        }]
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI response error:', errorText);
      throw new Error(`AI request failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response:', JSON.stringify(aiData, null, 2));

    let units: any[] = [];
    let answer = aiData.choices[0].message.content || '';

    // Step 4: If AI called filter_units tool, query the database
    if (aiData.choices[0].message.tool_calls) {
      const toolCall = aiData.choices[0].message.tool_calls[0];
      if (toolCall.function.name === 'filter_units') {
        const params = JSON.parse(toolCall.function.arguments);
        console.log('Filtering units with params:', params);

        let unitsQuery = supabase
          .from('units')
          .select('*')
          .eq('dev_id', devId)
          .in('status', ['Available', 'Under negotiation']);

        if (params.max_price) unitsQuery = unitsQuery.lte('price', params.max_price);
        if (params.min_price) unitsQuery = unitsQuery.gte('price', params.min_price);
        if (params.min_beds) unitsQuery = unitsQuery.gte('beds', params.min_beds);
        if (params.max_beds) unitsQuery = unitsQuery.lte('beds', params.max_beds);
        if (params.aspect) unitsQuery = unitsQuery.eq('aspect', params.aspect);
        if (params.view_park !== undefined) unitsQuery = unitsQuery.eq('view_park', params.view_park);
        if (params.view_river !== undefined) unitsQuery = unitsQuery.eq('view_river', params.view_river);
        if (params.has_balcony !== undefined) unitsQuery = unitsQuery.eq('has_balcony', params.has_balcony);

        const { data: filteredUnits, error: unitsError } = await unitsQuery
          .order('price', { ascending: true })
          .limit(12);

        if (unitsError) {
          console.error('Units query error:', unitsError);
        } else {
          units = filteredUnits || [];
          console.log(`Found ${units.length} matching units`);
        }
      }
    }

    // Extract sources from chunks
    const sources = chunks?.map((d: any) => d.source).filter((s: string, i: number, arr: string[]) => arr.indexOf(s) === i).slice(0, 3) || [];

    return new Response(
      JSON.stringify({
        answer: answer || 'I found some information about King\'s Road Park. Please see the sources below.',
        sources,
        units,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in krp-ask function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});