# Admin Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a secure, middleware-protected admin dashboard for managing projects, courses, and passphrases.

**Architecture:** Supabase Auth with `@supabase/ssr` for cookie-based sessions. Next.js middleware protects `/admin` routes. Server Actions with session verification for all mutations. Single-page dashboard with tabs.

**Tech Stack:** Next.js 16, Supabase Auth, `@supabase/ssr`, shadcn/ui (Tabs, Switch, AlertDialog, Input, Label, Table)

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install @supabase/ssr**

Run: `cd csportfolio && npm install @supabase/ssr`

**Step 2: Install shadcn/ui components**

Run: `cd csportfolio && npx shadcn@latest add tabs switch alert-dialog input label table`

**Step 3: Commit**

```bash
git add -A
git commit -m "feat(admin): install @supabase/ssr and shadcn/ui components"
```

---

### Task 2: Supabase Server & Middleware Clients

**Files:**
- Create: `lib/supabase-server.ts`
- Create: `lib/supabase-middleware.ts`

**Step 1: Create server client**

Create `lib/supabase-server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — ignore.
            // Middleware will refresh the session.
          }
        },
      },
    }
  )
}
```

**Step 2: Create middleware client**

Create `lib/supabase-middleware.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginPage && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (isLoginPage && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

**Step 3: Create middleware**

Create `middleware.ts` (in `csportfolio/` root, next to `app/`):

```typescript
import { updateSession } from '@/lib/supabase-middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

**Step 4: Verify dev server starts**

Run: `cd csportfolio && npm run dev`
Expected: Server starts without errors on port 3000.

**Step 5: Commit**

```bash
git add csportfolio/lib/supabase-server.ts csportfolio/lib/supabase-middleware.ts csportfolio/middleware.ts
git commit -m "feat(admin): add Supabase server/middleware clients and route protection"
```

---

### Task 3: Admin Login Page

**Files:**
- Create: `app/admin/login/page.tsx`

**Step 1: Create login page**

Create `app/admin/login/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 p-8 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-xl font-bold text-center text-zinc-900 dark:text-zinc-100">Admin Login</h1>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}
```

**Step 2: Verify in browser**

Visit: `http://localhost:3000/admin/login`
Expected: Login form renders. Visiting `/admin` redirects to `/admin/login`.

**Step 3: Commit**

```bash
git add csportfolio/app/admin/login/page.tsx
git commit -m "feat(admin): add login page"
```

---

### Task 4: Admin Types and Queries

**Files:**
- Modify: `types/index.ts`
- Modify: `lib/queries.ts`

**Step 1: Add AdminProject type**

Add to `types/index.ts`:

```typescript
export type AdminProject = Project & {
  student_name: string | null
  student_email: string | null
  student_number: string | null
}
```

**Step 2: Add admin queries**

Add to `lib/queries.ts`:

```typescript
import { AdminProject } from "@/types"
// (existing import of Course, Project stays)

const ADMIN_PROJECT_SELECT = `
  id, title, description, year, video_url, poster_url,
  featured, visible, student_creators, keywords,
  display_order, created_at,
  student_name, student_email, student_number,
  courses(id, name, available),
  project_images(image_url, display_order)
`

export async function getAdminProjects(): Promise<AdminProject[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(ADMIN_PROJECT_SELECT)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to fetch admin projects:", error)
    return []
  }

  return (data as unknown as AdminProject[]) ?? []
}

export async function getAllCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("id, name, available")
    .order("name", { ascending: true })

  if (error) {
    console.error("Failed to fetch all courses:", error)
    return []
  }

  return (data ?? []) as Course[]
}

export async function getPassphrases(): Promise<{ id: string; value: string; active: boolean }[]> {
  const { data, error } = await supabase
    .from("passphrases")
    .select("id, value, active")
    .order("value", { ascending: true })

  if (error) {
    console.error("Failed to fetch passphrases:", error)
    return []
  }

  return data ?? []
}
```

**Step 3: Commit**

```bash
git add csportfolio/types/index.ts csportfolio/lib/queries.ts
git commit -m "feat(admin): add admin types and queries"
```

---

### Task 5: Admin Server Actions

**Files:**
- Create: `app/admin/actions.ts`

**Step 1: Create server actions**

Create `app/admin/actions.ts`:

```typescript
'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

async function requireAuth() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return supabase
}

// ── Projects ──

export async function toggleProjectVisible(id: string, visible: boolean) {
  const supabase = await requireAuth()
  const { error } = await supabase.from('projects').update({ visible }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function toggleProjectFeatured(id: string, featured: boolean) {
  const supabase = await requireAuth()
  const { error } = await supabase.from('projects').update({ featured }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function updateDisplayOrder(id: string, displayOrder: number) {
  const supabase = await requireAuth()
  const { error } = await supabase.from('projects').update({ display_order: displayOrder }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function deleteProject(id: string) {
  const supabase = await requireAuth()

  // Delete associated images from storage
  const { data: images } = await supabase
    .from('project_images')
    .select('image_url')
    .eq('project_id', id)

  if (images && images.length > 0) {
    const paths = images
      .map(img => {
        const url = img.image_url
        const match = url.match(/project-images\/(.+)$/)
        return match ? match[1] : null
      })
      .filter(Boolean) as string[]

    if (paths.length > 0) {
      await supabase.storage.from('project-images').remove(paths)
    }
  }

  // Delete project (cascades to project_images rows via FK)
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

// ── Courses ──

export async function toggleCourseAvailable(id: string, available: boolean) {
  const supabase = await requireAuth()
  const { error } = await supabase.from('courses').update({ available }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function createCourse(name: string) {
  const supabase = await requireAuth()
  const { error } = await supabase.from('courses').insert({ name, available: true })
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

// ── Passphrases ──

export async function createPassphrase(value: string) {
  const supabase = await requireAuth()
  const { error } = await supabase.from('passphrases').insert({ value, active: true })
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function updatePassphrase(id: string, value: string) {
  const supabase = await requireAuth()
  const { error } = await supabase.from('passphrases').update({ value }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function deletePassphrase(id: string) {
  const supabase = await requireAuth()
  const { error } = await supabase.from('passphrases').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
}
```

**Step 2: Commit**

```bash
git add csportfolio/app/admin/actions.ts
git commit -m "feat(admin): add server actions for projects, courses, passphrases"
```

---

### Task 6: Admin Dashboard Page (Server Component Shell)

**Files:**
- Create: `app/admin/page.tsx`

**Step 1: Create admin page**

Create `app/admin/page.tsx`:

```tsx
import { getAdminProjects, getAllCourses, getPassphrases } from '@/lib/queries'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const [projects, courses, passphrases] = await Promise.all([
    getAdminProjects(),
    getAllCourses(),
    getPassphrases(),
  ])

  return <AdminDashboard projects={projects} courses={courses} passphrases={passphrases} />
}
```

**Step 2: Create a placeholder AdminDashboard client component**

Create `components/admin/AdminDashboard.tsx` with a placeholder that renders "Admin Dashboard" text with a logout button, just to verify the protected route works.

```tsx
'use client'

import { AdminProject } from '@/types'
import { Course } from '@/types'
import { signOut } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Props = {
  projects: AdminProject[]
  courses: Course[]
  passphrases: { id: string; value: string; active: boolean }[]
}

export function AdminDashboard({ projects, courses, passphrases }: Props) {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Admin Dashboard</h1>
        <Button variant="outline" size="sm" onClick={handleSignOut}>Sign out</Button>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-zinc-600 dark:text-zinc-400">
          {projects.length} projects, {courses.length} courses, {passphrases.length} passphrases loaded.
        </p>
      </main>
    </div>
  )
}
```

**Step 3: Verify in browser**

1. Create an admin user in Supabase dashboard (Authentication → Users → Add user)
2. Visit `/admin` → should redirect to `/admin/login`
3. Log in with admin credentials → should redirect to `/admin` showing data counts
4. Sign out → should redirect to `/`

**Step 4: Commit**

```bash
git add csportfolio/app/admin/page.tsx csportfolio/components/admin/AdminDashboard.tsx
git commit -m "feat(admin): add admin dashboard page with auth flow"
```

---

### Task 7: Projects Tab Component

**Files:**
- Create: `components/admin/ProjectsTab.tsx`
- Modify: `components/admin/AdminDashboard.tsx`

**Step 1: Create ProjectsTab**

Create `components/admin/ProjectsTab.tsx`:

A table component that renders all projects with:
- Columns: title, course name, year, student name, student email, student number, visible (Switch), featured (Switch), display_order (Input number), delete (Button)
- Uses `toggleProjectVisible`, `toggleProjectFeatured`, `updateDisplayOrder`, `deleteProject` server actions
- AlertDialog confirmation before delete
- Display order updates on blur (not on every keystroke)
- Each row has a subtle background color: green-tinted if visible, red-tinted if not visible, to make unaccepted projects immediately obvious

**Step 2: Wire into AdminDashboard**

Replace the placeholder content in `AdminDashboard.tsx` with shadcn Tabs containing `ProjectsTab` as the default tab and placeholder divs for Courses and Passphrases tabs.

**Step 3: Verify in browser**

Visit `/admin`, log in. Projects tab should show all projects with working toggles.

**Step 4: Commit**

```bash
git add csportfolio/components/admin/ProjectsTab.tsx csportfolio/components/admin/AdminDashboard.tsx
git commit -m "feat(admin): add projects tab with inline editing"
```

---

### Task 8: Courses Tab Component

**Files:**
- Create: `components/admin/CoursesTab.tsx`
- Modify: `components/admin/AdminDashboard.tsx`

**Step 1: Create CoursesTab**

Create `components/admin/CoursesTab.tsx`:

A table component that renders all courses with:
- Columns: name, available (Switch)
- "Add Course" button at top that reveals an inline form (Input + Button)
- Uses `toggleCourseAvailable`, `createCourse` server actions

**Step 2: Wire into AdminDashboard**

Replace the Courses tab placeholder with `CoursesTab`.

**Step 3: Verify in browser**

Visit `/admin`, switch to Courses tab. Toggle availability, add a new course.

**Step 4: Commit**

```bash
git add csportfolio/components/admin/CoursesTab.tsx csportfolio/components/admin/AdminDashboard.tsx
git commit -m "feat(admin): add courses tab with availability toggle and course creation"
```

---

### Task 9: Passphrases Tab Component

**Files:**
- Create: `components/admin/PassphrasesTab.tsx`
- Modify: `components/admin/AdminDashboard.tsx`

**Step 1: Create PassphrasesTab**

Create `components/admin/PassphrasesTab.tsx`:

A table component that renders all passphrases with:
- Columns: value (editable inline), active status, edit button, delete button
- "Add Passphrase" button at top with inline form
- AlertDialog confirmation before delete
- Uses `createPassphrase`, `updatePassphrase`, `deletePassphrase` server actions

**Step 2: Wire into AdminDashboard**

Replace the Passphrases tab placeholder with `PassphrasesTab`.

**Step 3: Verify in browser**

Visit `/admin`, switch to Passphrases tab. Add, edit, delete passphrases.

**Step 4: Commit**

```bash
git add csportfolio/components/admin/PassphrasesTab.tsx csportfolio/components/admin/AdminDashboard.tsx
git commit -m "feat(admin): add passphrases tab with CRUD operations"
```

---

### Task 10: Footer Admin Link

**Files:**
- Modify: `components/Footer.tsx`

**Step 1: Add admin icon to footer**

In the copyright bar section of `components/Footer.tsx` (line 78-82), add a small `Settings` icon from lucide-react that links to `/admin`. Place it next to the copyright text.

```tsx
import Link from 'next/link'
import { Settings } from 'lucide-react'

// In the copyright bar div:
<div className="border-t border-zinc-200 dark:border-zinc-900 pt-4 flex items-center justify-center gap-2">
  <p className="text-xs text-zinc-400 dark:text-zinc-300">
    &copy; {new Date().getFullYear()} CS Portfolio. All rights reserved.
  </p>
  <Link href="/admin" aria-label="Admin" className="text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors">
    <Settings className="w-3.5 h-3.5" />
  </Link>
</div>
```

**Step 2: Verify in browser**

Visit homepage, scroll to footer. Small settings icon should appear next to copyright. Clicking it navigates to `/admin/login` (if not logged in) or `/admin` (if logged in).

**Step 3: Commit**

```bash
git add csportfolio/components/Footer.tsx
git commit -m "feat(admin): add admin link icon to footer"
```

---

### Task 11: Build Verification

**Step 1: Run lint**

Run: `cd csportfolio && npm run lint`
Expected: No errors.

**Step 2: Run build**

Run: `cd csportfolio && npm run build`
Expected: Build succeeds.

**Step 3: Commit any fixes if needed**

---

### Task 12: Manual End-to-End Test

**Step 1: Create admin user in Supabase**

Go to Supabase dashboard → Authentication → Users → Add user (email + password).

**Step 2: Test auth flow**

1. Visit `/admin` → redirects to `/admin/login`
2. Enter wrong credentials → shows error
3. Enter correct credentials → redirects to `/admin`
4. Refresh page → stays on `/admin` (session persists)
5. Click "Sign out" → redirects to `/`
6. Visit `/admin` again → redirects to `/admin/login`

**Step 3: Test admin features**

1. Toggle project visible/featured → verify changes persist on refresh
2. Change display_order → verify persists
3. Delete a project → confirm dialog appears, project removed
4. Toggle course available → verify persists
5. Add new course → appears in list
6. Add/edit/delete passphrase → all work

**Step 4: Test footer link**

Click settings icon in footer → navigates to admin.
