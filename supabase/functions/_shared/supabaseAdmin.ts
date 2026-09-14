import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically into
// every Edge Function's environment by Supabase — no need to set them via
// `supabase secrets set`. The service role key bypasses Row Level Security,
// which is exactly what these functions need to write to `payments` and
// confirm bookings on the caller's behalf after verifying who they are.
export function getSupabaseAdmin() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } }
  );
}
