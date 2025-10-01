import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a knowledgeable London property consultant assistant. You help users find their perfect home in London.

Your expertise includes:
- London property market (zones 1-6, transport links, neighborhoods)
- Investment metrics and pricing guidance
- Local amenities, schools, and lifestyle factors
- New developments and off-plan properties

Key Guidelines:
- Be friendly, concise, and helpful
- Always ask clarifying questions to understand user needs
- When a user wants to book a viewing or provides contact details, use the create_booking tool to capture their information
- When a user asks to contact you, speak to an agent, get more help, or wants direct human communication, use the navigate_to_page tool to direct them to the contact page where they can email, call, or message via WeChat/WhatsApp
- Provide specific area recommendations based on user requirements
- Explain London zones and transport if users are unfamiliar

Available developments data:
- Various properties across London zones with different price ranges
- Mix of tenures: leasehold and share ownership
- Range from studios to 4-bed properties
- Near tube stations with varying walk times
- Different amenities like gyms, concierge, terraces

Keep responses conversational and engaging. Use emojis occasionally but professionally.`;

    const tools = [{
      type: "function",
      function: {
        name: "create_booking",
        description: "Create a booking request when a user wants to schedule a viewing or provides their contact information",
        parameters: {
          type: "object",
          properties: {
            name: { 
              type: "string",
              description: "User's full name"
            },
            email: { 
              type: "string",
              description: "User's email address"
            },
            phone: { 
              type: "string",
              description: "User's phone number"
            },
            development_name: {
              type: "string",
              description: "Name of the property/development they're interested in (optional)"
            },
            preferred_date: {
              type: "string",
              description: "Preferred date for viewing (optional)"
            },
            preferred_time: {
              type: "string",
              description: "Preferred time for viewing (optional)"
            },
            message: {
              type: "string",
              description: "Any additional message or requirements from the user (optional)"
            }
          },
          required: ["name", "email", "phone"]
        }
      }
    }, {
      type: "function",
      function: {
        name: "navigate_to_page",
        description: "Direct the user to a specific page when they request to contact someone, speak to an agent, or need direct human communication",
        parameters: {
          type: "object",
          properties: {
            page: {
              type: "string",
              enum: ["contact"],
              description: "The page to navigate to"
            },
            reason: {
              type: "string",
              description: "Brief explanation of why they're being directed to this page"
            }
          },
          required: ["page", "reason"]
        }
      }
    }];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        tools,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service requires payment. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream response and check for tool calls
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let buffer = "";
          
          while (true) {
            const { done, value } = await reader!.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || "";
            
            for (const line of lines) {
              if (!line.trim() || line.startsWith(':')) continue;
              if (!line.startsWith('data: ')) continue;
              
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                
                // Check for tool calls
                const toolCalls = parsed.choices?.[0]?.delta?.tool_calls;
                if (toolCalls) {
                  for (const toolCall of toolCalls) {
                    if (toolCall.function?.name === 'create_booking' && toolCall.function?.arguments) {
                      try {
                        const args = JSON.parse(toolCall.function.arguments);
                        
                        // Create Supabase client
                        const supabase = createClient(
                          Deno.env.get('SUPABASE_URL') ?? '',
                          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
                        );
                        
                        // Save booking to database
                        const { error: dbError } = await supabase
                          .from('bookings')
                          .insert({
                            name: args.name,
                            email: args.email,
                            phone: args.phone,
                            development_name: args.development_name,
                            preferred_date: args.preferred_date,
                            preferred_time: args.preferred_time,
                            message: args.message,
                            source: 'ai_chat',
                            status: 'pending'
                          });
                        
                        if (dbError) {
                          console.error('Failed to save booking:', dbError);
                        } else {
                          console.log('Booking saved successfully:', args);
                        }
                      } catch (parseError) {
                        console.error('Failed to parse tool arguments:', parseError);
                      }
                    } else if (toolCall.function?.name === 'navigate_to_page') {
                      console.log('Navigation tool called:', toolCall.function?.arguments);
                    }
                  }
                }
                
                // Forward the data to client
                controller.enqueue(encoder.encode(line + '\n'));
              } catch (parseError) {
                // Forward unparseable lines as-is
                controller.enqueue(encoder.encode(line + '\n'));
              }
            }
          }
          
          controller.close();
        } catch (e) {
          console.error('Stream processing error:', e);
          controller.error(e);
        }
      }
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
