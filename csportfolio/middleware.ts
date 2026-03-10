import { updateSession } from '@/lib/supabase-middleware'
import { type NextRequest } from 'next/server'

/* Middleware -> runs before any /admin page loads. 
If no valid session cookie exists, redirects to /admin/login. 
Unauthenticated users never see the admin page at all. */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/admin/:path*'],
}
