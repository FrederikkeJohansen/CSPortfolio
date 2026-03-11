/** Centralized TypeScript type definitions matching the Supabase schema. */

export type Course = {
  id: string
  name: string
  available: boolean
}

/** Local image file + preview URL used during the upload flow. */
export type ImageEntry = {
  file: File
  preview: string
}

/** Shape of the multi-step upload form state. */
export type UploadFormData = {
  title: string
  description: string
  year: string
  video_url: string
  poster_file: File | null
  student_creators: string
  course_id: string
  keywords: string[]
  image_files: ImageEntry[]
  primary_image_index: number
  student_name: string
  student_email: string
  student_number: string
  passphrase: string
  consent: boolean
}

export type ProjectImage = {
  image_url: string
  display_order: number | null
}

/** Public project with joined course and images (no student PII). */
export type Project = {
  id: string
  title: string
  description: string
  year: number
  video_url: string | null
  poster_url: string | null
  student_creators: string | null
  featured: boolean
  visible: boolean
  created_at: string
  display_order: number
  // joined relations:
  courses: { id: string; name: string; available: boolean } | null
  project_images: ProjectImage[]
  keywords: string[]
}

/** Admin-only project fields — extends Project with student personal information and review state. */
export type AdminProject = Project & {
  student_name: string | null
  student_email: string | null
  student_number: string | null
  passphrase_used: string | null
  reviewed: boolean
  last_edited_by: string | null
}
