import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simplified London Borough boundaries using representative polygons
// These are approximate boundaries for visualization purposes
function getSimplifiedBoroughBoundaries() {
  const boroughs = [
    {
      code: 'E09000001',
      name: 'City of London',
      coords: [[[-0.118,51.508],[-0.074,51.520],[-0.074,51.523],[-0.118,51.515],[-0.118,51.508]]]
    },
    {
      code: 'E09000007',
      name: 'Camden',
      coords: [[[-0.224,51.520],[-0.118,51.520],[-0.118,51.578],[-0.224,51.578],[-0.224,51.520]]]
    },
    {
      code: 'E09000012',
      name: 'Hackney',
      coords: [[[-0.118,51.520],[-0.018,51.520],[-0.018,51.578],[-0.118,51.578],[-0.118,51.520]]]
    },
    {
      code: 'E09000019',
      name: 'Islington',
      coords: [[[-0.155,51.520],[-0.074,51.520],[-0.074,51.578],[-0.155,51.578],[-0.155,51.520]]]
    },
    {
      code: 'E09000020',
      name: 'Kensington and Chelsea',
      coords: [[[-0.224,51.475],[-0.155,51.475],[-0.155,51.520],[-0.224,51.520],[-0.224,51.475]]]
    },
    {
      code: 'E09000022',
      name: 'Lambeth',
      coords: [[[-0.155,51.440],[-0.074,51.440],[-0.074,51.508],[-0.155,51.508],[-0.155,51.440]]]
    },
    {
      code: 'E09000028',
      name: 'Southwark',
      coords: [[[-0.118,51.462],[-0.037,51.462],[-0.037,51.520],[-0.118,51.520],[-0.118,51.462]]]
    },
    {
      code: 'E09000030',
      name: 'Tower Hamlets',
      coords: [[[-0.074,51.487],[-0.000,51.487],[-0.000,51.545],[-0.074,51.545],[-0.074,51.487]]]
    },
    {
      code: 'E09000032',
      name: 'Wandsworth',
      coords: [[[-0.224,51.425],[-0.137,51.425],[-0.137,51.475],[-0.224,51.475],[-0.224,51.425]]]
    },
    {
      code: 'E09000033',
      name: 'Westminster',
      coords: [[[-0.200,51.487],[-0.118,51.487],[-0.118,51.532],[-0.200,51.532],[-0.200,51.487]]]
    },
    {
      code: 'E09000002',
      name: 'Barking and Dagenham',
      coords: [[[0.074,51.500],[0.180,51.500],[0.180,51.578],[0.074,51.578],[0.074,51.500]]]
    },
    {
      code: 'E09000003',
      name: 'Barnet',
      coords: [[[-0.250,51.578],[-0.118,51.578],[-0.118,51.670],[-0.250,51.670],[-0.250,51.578]]]
    },
    {
      code: 'E09000004',
      name: 'Bexley',
      coords: [[[0.074,51.425],[0.200,51.425],[0.200,51.500],[0.074,51.500],[0.074,51.425]]]
    },
    {
      code: 'E09000005',
      name: 'Brent',
      coords: [[[-0.324,51.520],[-0.224,51.520],[-0.224,51.600],[-0.324,51.600],[-0.324,51.520]]]
    },
    {
      code: 'E09000006',
      name: 'Bromley',
      coords: [[[-0.074,51.325],[0.074,51.325],[0.074,51.440],[-0.074,51.440],[-0.074,51.325]]]
    },
    {
      code: 'E09000008',
      name: 'Croydon',
      coords: [[[-0.155,51.300],[-0.037,51.300],[-0.037,51.400],[-0.155,51.400],[-0.155,51.300]]]
    },
    {
      code: 'E09000009',
      name: 'Ealing',
      coords: [[[-0.387,51.475],[-0.250,51.475],[-0.250,51.562],[-0.387,51.562],[-0.387,51.475]]]
    },
    {
      code: 'E09000010',
      name: 'Enfield',
      coords: [[[-0.155,51.578],[-0.018,51.578],[-0.018,51.670],[-0.155,51.670],[-0.155,51.578]]]
    },
    {
      code: 'E09000011',
      name: 'Greenwich',
      coords: [[[0.000,51.440],[0.118,51.440],[0.118,51.520],[0.000,51.520],[0.000,51.440]]]
    },
    {
      code: 'E09000013',
      name: 'Hammersmith and Fulham',
      coords: [[[-0.274,51.462],[-0.174,51.462],[-0.174,51.520],[-0.274,51.520],[-0.274,51.462]]]
    },
    {
      code: 'E09000014',
      name: 'Haringey',
      coords: [[[-0.174,51.545],[-0.055,51.545],[-0.055,51.620],[-0.174,51.620],[-0.174,51.545]]]
    },
    {
      code: 'E09000015',
      name: 'Harrow',
      coords: [[[-0.400,51.550],[-0.274,51.550],[-0.274,51.637],[-0.400,51.637],[-0.400,51.550]]]
    },
    {
      code: 'E09000016',
      name: 'Havering',
      coords: [[[0.143,51.520],[0.274,51.520],[0.274,51.620],[0.143,51.620],[0.143,51.520]]]
    },
    {
      code: 'E09000017',
      name: 'Hillingdon',
      coords: [[[-0.524,51.462],[-0.387,51.462],[-0.387,51.587],[-0.524,51.587],[-0.524,51.462]]]
    },
    {
      code: 'E09000018',
      name: 'Hounslow',
      coords: [[[-0.462,51.425],[-0.324,51.425],[-0.324,51.512],[-0.462,51.512],[-0.462,51.425]]]
    },
    {
      code: 'E09000021',
      name: 'Kingston upon Thames',
      coords: [[[-0.343,51.362],[-0.250,51.362],[-0.250,51.437],[-0.343,51.437],[-0.343,51.362]]]
    },
    {
      code: 'E09000023',
      name: 'Lewisham',
      coords: [[[-0.074,51.412],[0.037,51.412],[0.037,51.487],[-0.074,51.487],[-0.074,51.412]]]
    },
    {
      code: 'E09000024',
      name: 'Merton',
      coords: [[[-0.250,51.375],[-0.137,51.375],[-0.137,51.437],[-0.250,51.437],[-0.250,51.375]]]
    },
    {
      code: 'E09000025',
      name: 'Newham',
      coords: [[[0.000,51.487],[0.118,51.487],[0.118,51.562],[0.000,51.562],[0.000,51.487]]]
    },
    {
      code: 'E09000026',
      name: 'Redbridge',
      coords: [[[0.037,51.545],[0.143,51.545],[0.143,51.620],[0.037,51.620],[0.037,51.545]]]
    },
    {
      code: 'E09000027',
      name: 'Richmond upon Thames',
      coords: [[[-0.374,51.425],[-0.250,51.425],[-0.250,51.487],[-0.374,51.487],[-0.374,51.425]]]
    },
    {
      code: 'E09000029',
      name: 'Sutton',
      coords: [[[-0.224,51.325],[-0.118,51.325],[-0.118,51.387],[-0.224,51.387],[-0.224,51.325]]]
    },
    {
      code: 'E09000031',
      name: 'Waltham Forest',
      coords: [[[-0.037,51.562],[0.055,51.562],[0.055,51.637],[-0.037,51.637],[-0.037,51.562]]]
    }
  ];

  return boroughs.map(b => ({
    area_code: b.code,
    area_name: b.name,
    area_type: 'Borough',
    geometry: {
      type: 'Polygon',
      coordinates: b.coords
    }
  }));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Loading simplified London Borough boundaries');

    const results = getSimplifiedBoroughBoundaries();
    
    console.log(`Loaded ${results.length} borough polygons with simplified boundaries`);

    // Delete existing Borough polygons
    const { error: deleteError } = await supabase
      .from('area_polygons')
      .delete()
      .eq('area_type', 'Borough');

    if (deleteError) throw deleteError;

    // Insert new polygons in batches
    const batchSize = 100;
    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('area_polygons')
        .insert(batch);

      if (insertError) throw insertError;
      console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(results.length / batchSize)}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        areas_fetched: results.length,
        message: `Created ${results.length} Borough polygons with simplified boundaries`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error loading area boundaries:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
