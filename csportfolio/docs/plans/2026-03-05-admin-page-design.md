# Admin Page Design

## Overview

Add a protected admin dashboard to CSPortfolio where admins can manage projects, courses, and passphrases. Authentication via Supabase Auth with Next.js middleware protection.

## Authentication

- **Supabase Auth** with email/password sign-in
- **`@supabase/ssr`** package for cookie-based session management
- **Next.js middleware** protects all `/admin` routes except `/admin/login`
- Admin users created manually in Supabase dashboard (no sign-up page)
- Server Actions verify session as second security layer

### Auth Flow

1. User visits `/admin` → middleware checks cookie session → no session → redirect `/admin/login`
2. User logs in → Supabase sets session cookie → redirect `/admin`
3. Middleware refreshes session on every request
4. Logout clears session → redirect `/`

### New Files

- `lib/supabase-server.ts` — cookie-based Supabase client for server components/actions
- `lib/supabase-middleware.ts` — Supabase client for middleware session refresh
- `middleware.ts` — route protection for `/admin/*`

## Routes

- `/admin/login` — public login page (email + password form)
- `/admin` — protected admin dashboard

## Admin Dashboard

Single page with 3 tabs (shadcn/ui Tabs component):

### Tab 1: Projects (default)

Table with columns: title, course, year, student name, student email, student number, visible (toggle), featured (toggle), display_order (editable), delete button.

- Sorted by `created_at` descending (newest first) so unaccepted projects appear at top
- Fetches ALL projects (not just visible ones)
- Inline toggle switches for `visible` and `featured`
- Number input for `display_order`
- Delete with confirmation dialog

### Tab 2: Courses

Table with columns: name, available (toggle).

- Toggle `available` on/off inline
- "Add Course" button with inline form or small modal

### Tab 3: Passphrases

Table with columns: passphrase value, edit button, delete button.

- Add new passphrase
- Edit existing passphrase inline
- Delete with confirmation dialog

## Mutations (Server Actions)

All actions use authenticated server-side Supabase client. Each verifies session before executing.

### Projects

- `toggleProjectVisible(id, visible)`
- `toggleProjectFeatured(id, featured)`
- `updateDisplayOrder(id, display_order)`
- `deleteProject(id)` — deletes project + associated images from storage and DB

### Courses

- `toggleCourseAvailable(id, available)`
- `createCourse(name)`

### Passphrases

- `createPassphrase(value)`
- `updatePassphrase(id, value)`
- `deletePassphrase(id)`

## Queries

- `getAdminProjects()` — all projects (visible + hidden), ordered by `created_at` desc, includes student info and course relation

## UI

- **Login page:** centered card, email + password fields, error display
- **Dashboard:** simple admin navbar (title + logout), tab bar, tables
- **Styling:** Tailwind + shadcn/ui, consistent with existing app
- **Feedback:** toast/inline messages for actions, AlertDialog for destructive actions
- **Footer:** small subtle icon (Settings/Shield from lucide-react) in copyright bar, links to `/admin`

## shadcn/ui Components Needed

Check and install if missing: Tabs, Switch, Table, AlertDialog, Input, Label
