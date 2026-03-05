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
