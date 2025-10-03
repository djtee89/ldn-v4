import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScoringReason {
  discount_score: number;
  price_drop_score: number;
  view_score: number;
  scarcity_score: number;
  completion_score: number;
  total_score: number;
  details: string[];
}

function createSalesPitch(unit: any, reason: ScoringReason): string {
  const highlights = reason.details.slice(0, 4);
  
  let pitch = `🔥 **HOTTEST DEAL ALERT** - Unit ${unit.unit_number} is your best opportunity right now!\n\n`;
  
  if (reason.discount_score > 20) {
    pitch += `💰 **Outstanding Value**: This ${unit.beds}-bedroom apartment offers exceptional market value at just £${unit.price.toLocaleString()}. `;
  }
  
  if (highlights.length > 0) {
    pitch += `\n\n✨ **Why This Unit Stands Out**:\n`;
    highlights.forEach((detail, idx) => {
      pitch += `${idx + 1}. ${detail}\n`;
    });
  }
  
  pitch += `\n📊 **The Numbers**: ${unit.size_sqft} sq ft of premium living space`;
  if (unit.floor) pitch += ` on floor ${unit.floor}`;
  pitch += `. At £${(unit.price / unit.size_sqft).toFixed(0)}/sqft, this represents genuine value in today's market.`;
  
  if (reason.scarcity_score >= 5) {
    pitch += `\n\n⏰ **Act Fast**: With limited ${unit.beds}-bedroom units remaining, properties like this don't stay available for long.`;
  }
  
  pitch += `\n\n📞 **Don't miss out** - Book a viewing today to secure this exceptional opportunity!`;
  
  return pitch;
}

Deno.serve(async (req) => {
  const start = Date.now();
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[hot-auto] start', { method: req.method, url: req.url });
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { dev_id } = await req.json().catch(() => ({}));
    console.log('[hot-auto] payload', { dev_id });

    if (!dev_id) {
      console.log('[hot-auto] error: missing dev_id', { ms: Date.now() - start });
      return new Response(JSON.stringify({ error: 'Missing dev_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get available/negotiation units
    const { data: units } = await supabase
      .from('units')
      .select('*')
      .eq('dev_id', dev_id)
      .in('status', ['Available', 'Under Negotiation']);

    if (!units || units.length === 0) {
      console.log('[hot-auto] no available units', { dev_id, ms: Date.now() - start });
      return new Response(JSON.stringify({ error: 'No available units' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[hot-auto] scoring', { dev_id, unit_count: units.length });

    // Calculate price per sqft for all units
    const unitsWithPpsqft = units.map(u => ({
      ...u,
      ppsqft: u.size_sqft > 0 ? u.price / u.size_sqft : 0,
    }));

    // Calculate average ppsqft by bed count for comparison
    const avgPpsqftByBeds = new Map<number, number>();
    const bedGroups = new Map<number, number[]>();
    
    unitsWithPpsqft.forEach(u => {
      if (!bedGroups.has(u.beds)) bedGroups.set(u.beds, []);
      bedGroups.get(u.beds)!.push(u.ppsqft);
    });

    bedGroups.forEach((prices, beds) => {
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
      avgPpsqftByBeds.set(beds, avg);
    });

    // Score each unit
    const scoredUnits = unitsWithPpsqft.map(unit => {
      const reason: ScoringReason = {
        discount_score: 0,
        price_drop_score: 0,
        view_score: 0,
        scarcity_score: 0,
        completion_score: 0,
        total_score: 0,
        details: [],
      };

      // 1. Discount vs comps (0-40 points)
      const avgPpsqft = avgPpsqftByBeds.get(unit.beds) || unit.ppsqft;
      const ppsqft = unit.ppsqft;
      if (avgPpsqft > 0) {
        const discount = (avgPpsqft - unit.ppsqft) / avgPpsqft;
        if (discount > 0) {
          reason.discount_score = Math.min(40, discount * 200);
          const discountPercent = (discount * 100).toFixed(1);
          reason.details.push(`Exceptional value at £${ppsqft.toFixed(0)}/sqft - ${discountPercent}% below market average for ${unit.beds}-bed units`);
        }
      }

      // 2. View bonuses (0-15 points)
      if (unit.view_park) {
        reason.view_score += 8;
        reason.details.push('Stunning park views offering tranquil green vistas');
      }
      if (unit.view_river) {
        reason.view_score += 7;
        reason.details.push('Premium river views - a rare find in this development');
      }

      // 3. Floor bonus (higher floor = better)
      if (unit.floor && unit.floor >= 10) {
        reason.view_score += 5;
        reason.details.push(`High floor living on level ${unit.floor} with elevated panoramic views`);
      } else if (unit.floor && unit.floor >= 5) {
        reason.view_score += 3;
        reason.details.push(`Mid-level floor ${unit.floor} offering excellent light and privacy`);
      }

      // 4. Scarcity (0-10 points)
      const similarUnits = unitsWithPpsqft.filter(u => u.beds === unit.beds);
      if (similarUnits.length <= 3) {
        reason.scarcity_score = 10;
        reason.details.push(`Extremely limited availability - only ${similarUnits.length} ${unit.beds}-bed ${similarUnits.length === 1 ? 'unit' : 'units'} remaining in the entire development!`);
      } else if (similarUnits.length <= 5) {
        reason.scarcity_score = 5;
        reason.details.push(`High demand - just ${similarUnits.length} ${unit.beds}-bed units left`);
      }

      // 5. Completion proximity (0-10 points)
      if (unit.completion_date) {
        const completionYear = parseInt(unit.completion_date);
        const currentYear = new Date().getFullYear();
        if (completionYear <= currentYear) {
          reason.completion_score = 10;
          reason.details.push('Ready to move in NOW - immediate completion available');
        } else if (completionYear <= currentYear + 1) {
          reason.completion_score = 8;
          reason.details.push(`Completing ${unit.completion_date} - secure your home with minimal wait time`);
        }
      }

      // 6. Size value bonus
      if (unit.size_sqft > 0) {
        const avgSize = unitsWithPpsqft.filter(u => u.beds === unit.beds).reduce((sum, u) => sum + u.size_sqft, 0) / similarUnits.length;
        if (unit.size_sqft > avgSize * 1.1) {
          reason.view_score += 3;
          reason.details.push(`Spacious ${unit.size_sqft} sqft - larger than average for a ${unit.beds}-bed unit`);
        }
      }

      reason.total_score = 
        reason.discount_score +
        reason.view_score +
        reason.scarcity_score +
        reason.completion_score;

      return { unit, reason };
    });

    // Pick highest scoring unit
    scoredUnits.sort((a, b) => b.reason.total_score - a.reason.total_score);
    const winner = scoredUnits[0];
    
    // Create compelling sales pitch
    const pitch = createSalesPitch(winner.unit, winner.reason);
    
    console.log('[hot-auto] winner selected', { 
      unit_number: winner.unit.unit_number, 
      score: winner.reason.total_score,
      top_reasons: winner.reason.details.slice(0, 3)
    });

    // Upsert hottest_unit
    await supabase
      .from('hottest_unit')
      .upsert({
        dev_id,
        unit_id: winner.unit.id,
        score: winner.reason.total_score,
        override_reason: pitch,
        manual_override: false,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'dev_id',
      });

    console.log('[hot-auto] ok', { ms: Date.now() - start, unit_number: winner.unit.unit_number, score: winner.reason.total_score });
    return new Response(
      JSON.stringify({
        success: true,
        dev_id,
        hottest_unit: {
          unit_number: winner.unit.unit_number,
          score: winner.reason.total_score,
          reason: winner.reason,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[hot-auto] error', { 
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
