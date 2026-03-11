import { createClient } from '@supabase/supabase-js'

/** Default Supabase client using the public anon key (respects RLS). */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)
