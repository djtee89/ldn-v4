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

    const { dev_id, price_list_id } = await req.json();

    if (!dev_id) {
      return new Response(JSON.stringify({ error: 'Missing dev_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get units for this development
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('*')
      .eq('dev_id', dev_id);

    if (unitsError) throw unitsError;

    const anomalies = [];

    // Feature 4: Auto unit dedupe - flag near-duplicate units
    const unitMap = new Map();
    for (const unit of units || []) {
      const key = `${unit.beds}-${unit.building}-${unit.floor}`;
      if (!unitMap.has(key)) {
        unitMap.set(key, []);
      }
      unitMap.get(key).push(unit);
    }

    for (const [key, group] of unitMap.entries()) {
      if (group.length > 1) {
        // Check for similar sizes (±3%)
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            const sizeA = group[i].size_sqft;
            const sizeB = group[j].size_sqft;
            const sizeDiff = Math.abs(sizeA - sizeB) / Math.max(sizeA, sizeB);
            
            if (sizeDiff <= 0.03) {
              anomalies.push({
                dev_id,
                unit_id: group[i].id,
                anomaly_type: 'duplicate',
                severity: 'warning',
                details: {
                  duplicate_with: group[j].unit_number,
                  beds: group[i].beds,
                  building: group[i].building,
                  floor: group[i].floor,
                  size_diff_pct: (sizeDiff * 100).toFixed(1),
                },
              });
            }
          }
        }
      }
    }

    // Feature 5: Anomaly radar - price drops, outliers, missing data
    const { data: oldUnits } = await supabase
      .from('units')
      .select('unit_number, price')
      .eq('dev_id', dev_id);

    const oldPriceMap = new Map(oldUnits?.map(u => [u.unit_number, u.price]) || []);

    for (const unit of units || []) {
      // Check for large price drops (>20%)
      const oldPrice = oldPriceMap.get(unit.unit_number);
      if (oldPrice && unit.price < oldPrice) {
        const drop = (oldPrice - unit.price) / oldPrice;
        if (drop > 0.20) {
          anomalies.push({
            dev_id,
            unit_id: unit.id,
            anomaly_type: 'price_drop',
            severity: 'error',
            details: {
              old_price: oldPrice,
              new_price: unit.price,
              drop_pct: (drop * 100).toFixed(1),
            },
          });
        }
      }

      // Check for missing/invalid data
      if (!unit.size_sqft || unit.size_sqft === 0) {
        anomalies.push({
          dev_id,
          unit_id: unit.id,
          anomaly_type: 'missing_data',
          severity: 'error',
          details: { field: 'size_sqft', unit_number: unit.unit_number },
        });
      }

      if (!unit.price || unit.price === 0) {
        anomalies.push({
          dev_id,
          unit_id: unit.id,
          anomaly_type: 'missing_data',
          severity: 'error',
          details: { field: 'price', unit_number: unit.unit_number },
        });
      }

      // Duplicate unit codes
      const duplicates = units.filter(u => u.unit_number === unit.unit_number);
      if (duplicates.length > 1) {
        anomalies.push({
          dev_id,
          unit_id: unit.id,
          anomaly_type: 'duplicate',
          severity: 'error',
          details: { field: 'unit_code', unit_number: unit.unit_number, count: duplicates.length },
        });
      }
    }

    // Calculate £/sqft outliers
    const psfs = units?.map(u => u.price / u.size_sqft).filter(p => p > 0 && isFinite(p)) || [];
    if (psfs.length > 0) {
      const avg = psfs.reduce((a, b) => a + b, 0) / psfs.length;
      const stdDev = Math.sqrt(psfs.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b) / psfs.length);

      for (const unit of units || []) {
        if (unit.size_sqft > 0 && unit.price > 0) {
          const psf = unit.price / unit.size_sqft;
          const zScore = Math.abs((psf - avg) / stdDev);
          
          if (zScore > 3) {
            anomalies.push({
              dev_id,
              unit_id: unit.id,
              anomaly_type: 'psf_outlier',
              severity: 'warning',
              details: {
                psf: psf.toFixed(0),
                avg_psf: avg.toFixed(0),
                z_score: zScore.toFixed(2),
              },
            });
          }
        }
      }
    }

    // Insert anomalies
    if (anomalies.length > 0) {
      const { error: insertError } = await supabase
        .from('unit_anomalies')
        .insert(anomalies);

      if (insertError) {
        console.error('Error inserting anomalies:', insertError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        anomalies_detected: anomalies.length,
        critical: anomalies.filter(a => a.severity === 'error').length,
        warnings: anomalies.filter(a => a.severity === 'warning').length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[validate-units] error', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
