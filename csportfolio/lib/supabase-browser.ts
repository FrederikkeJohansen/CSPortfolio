import { createBrowserClient } from '@supabase/ssr'

/** Browser-safe Supabase client with cookie-based auth (used in client components). */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
