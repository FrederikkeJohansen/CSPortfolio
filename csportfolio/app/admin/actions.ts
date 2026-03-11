'use server'

/**
 * Server Actions for admin CRUD (create, read, update, delete) operations on projects, courses, and passphrases.
 * Every mutation first verifies authentication via requireAuth(), to ensure only authorized users can modify data, then uses
 * the service-role client to bypass RLS. All actions revalidate /admin on success.
 */
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

/** Verify the caller is authenticated and return an admin Supabase client + user email. */
async function requireAuth() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return { supabase: createSupabaseAdminClient(), email: user.email ?? 'unknown' }
}

// ── Projects ──

export async function toggleProjectVisible(id: string, visible: boolean) {
  const { supabase, email } = await requireAuth()
  const update = visible
    ? { visible, reviewed: true, last_edited_by: email }
    : { visible, last_edited_by: email }
  const { error } = await supabase.from('projects').update(update).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function dismissProject(id: string) {
  const { supabase, email } = await requireAuth()
  const { error } = await supabase.from('projects').update({ reviewed: true, last_edited_by: email }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function toggleProjectFeatured(id: string, featured: boolean) {
  const { supabase, email } = await requireAuth()
  const { error } = await supabase.from('projects').update({ featured, last_edited_by: email }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updateDisplayOrder(id: string, displayOrder: number) {
  const { supabase, email } = await requireAuth()
  const { error } = await supabase.from('projects').update({ display_order: displayOrder, last_edited_by: email }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function deleteProject(id: string) {
  const { supabase } = await requireAuth()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

// ── Courses ──

export async function toggleCourseAvailable(id: string, available: boolean) {
  const { supabase } = await requireAuth()
  const { error } = await supabase.from('courses').update({ available }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function createCourse(name: string) {
  const { supabase } = await requireAuth()
  const { error } = await supabase.from('courses').insert({ name, available: true })
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updateCourseName(id: string, name: string) {
  const { supabase } = await requireAuth()
  const { error } = await supabase.from('courses').update({ name }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function deleteCourse(id: string) {
  const { supabase } = await requireAuth()
  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

// ── Passphrases ──

export async function createPassphrase(value: string) {
  const { supabase } = await requireAuth()
  const { error } = await supabase.from('passphrases').insert({ value, active: true })
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function deletePassphrase(id: string) {
  const { supabase } = await requireAuth()
  const { error } = await supabase.from('passphrases').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function togglePassphraseActive(id: string, active: boolean) {
  const { supabase } = await requireAuth()
  const { error } = await supabase.from('passphrases').update({ active }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
}

export async function checkUserExists(email: string): Promise<boolean> {
  const supabase = createSupabaseAdminClient()
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  if (error) return false
  return users.some(u => u.email?.toLowerCase() === email.toLowerCase())
}
