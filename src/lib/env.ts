// Environment variable validator
// Ensures all required env vars are present at runtime

const required = ["VITE_PUBLIC_MAPBOX_TOKEN"] as const;
type Key = typeof required[number];

export function getEnv(): Record<Key, string> {
  const missing: string[] = [];
  const out = {} as Record<Key, string>;
  
  for (const k of required) {
    const v = import.meta.env[k as any] as string | undefined;
    if (!v) missing.push(k);
    else (out as any)[k] = v;
  }
  
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
      `Please check .env.example and ensure all variables are set.`
    );
  }
  
  return out;
}

// Supabase vars are auto-provided by Lovable Cloud
export function getSupabaseEnv() {
  return {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID,
  };
}
