import { createClient } from '@supabase/supabase-js'

// Service role client for admin operations — bypasses RLS.
// ONLY use in server-side code (Server Actions, Route Handlers).
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
