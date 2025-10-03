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

    const formData = await req.formData();
    const devId = formData.get('dev_id') as string;
    const files = formData.getAll('files') as File[];

    if (!devId || files.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing dev_id or files' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[images-upload] uploading', { devId, fileCount: files.length });

    const uploadedImages = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${devId}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('dev-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('dev-images')
        .getPublicUrl(fileName);

      uploadedImages.push({
        alt: file.name.replace(/\.[^/.]+$/, ''),
        sources: [{ src: publicUrl, width: 1280 }]
      });
    }

    // Get current images
    const { data: dev } = await supabase
      .from('developments')
      .select('images')
      .eq('id', devId)
      .single();

    const currentImages = dev?.images || [];
    const newImages = [...currentImages, ...uploadedImages];

    // Update development with new images and increment count
    const { error: updateError } = await supabase
      .from('developments')
      .update({
        images: newImages,
        images_count: newImages.length,
        updated_at: new Date().toISOString()
      })
      .eq('id', devId);

    if (updateError) throw updateError;

    console.log('[images-upload] success', { devId, uploaded: uploadedImages.length });
    return new Response(
      JSON.stringify({ 
        success: true, 
        uploaded: uploadedImages.length,
        images: uploadedImages 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[images-upload] error', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
