import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://api.mapbox.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  developmentName?: string;
  offerTitle?: string;
  source: 'calendar_booking' | 'wechat_booking' | 'email_contact' | 'token_claim' | 'contact_options';
  honeypot?: string;
  consentGiven: boolean;
}

// Rate limiting store (in-memory, resets on function restart)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\+\-\(\)]{7,20}$/;
  return phoneRegex.test(phone);
}

function sanitizeInput(input: string, maxLength: number): string {
  return input.trim().slice(0, maxLength);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get('x-forwarded-for') || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';

    console.log(`Form submission attempt from IP: ${clientIp}`);

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const formData: ContactFormData = await req.json();

    // Honeypot check - if filled, it's likely a bot
    if (formData.honeypot && formData.honeypot.length > 0) {
      console.warn(`Honeypot triggered for IP: ${clientIp}`);
      // Return success to not alert the bot
      return new Response(
        JSON.stringify({ success: true }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // GDPR compliance check
    if (!formData.consentGiven) {
      return new Response(
        JSON.stringify({ error: 'Privacy policy consent is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate and sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(formData.name, 100),
      email: sanitizeInput(formData.email, 255),
      phone: sanitizeInput(formData.phone, 20),
      message: formData.message ? sanitizeInput(formData.message, 1000) : undefined,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      developmentName: formData.developmentName || formData.offerTitle,
      source: formData.source,
    };

    // Validation
    if (!sanitizedData.name || sanitizedData.name.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Name must be at least 2 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validateEmail(sanitizedData.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validatePhone(sanitizedData.phone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user session if authenticated
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Save to database with server-side metadata
    const { error: dbError } = await supabase
      .from('bookings')
      .insert([{
        development_name: sanitizedData.developmentName || null,
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        preferred_date: sanitizedData.preferredDate || null,
        preferred_time: sanitizedData.preferredTime || null,
        message: sanitizedData.message || null,
        source: sanitizedData.source,
        status: 'pending',
        user_id: userId,
        // Server-side metadata (would need to add these columns)
        // submitted_ip: clientIp,
        // submitted_at: new Date().toISOString(),
      }]);

    if (dbError) {
      // Log error without exposing PII
      console.error('Database error:', { 
        code: dbError.code, 
        message: dbError.message,
        source: sanitizedData.source 
      });
      throw new Error('Failed to save submission');
    }

    // Log success without PII
    console.log('Form submitted successfully', { 
      source: sanitizedData.source,
      timestamp: new Date().toISOString() 
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: userId 
          ? 'Your request has been saved and you can view it in your bookings.'
          : 'We\'ve received your request and will contact you soon.'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    // Log error without exposing PII
    console.error('Form submission error', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({ error: 'Failed to process submission. Please try again.' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});