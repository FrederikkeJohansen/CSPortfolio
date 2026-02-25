export type Course = {
  id: string
  name: string
}

export type Filter = {
  id: string
  type: string
  value: string
}

export type UploadFormData = {
  title: string
  description: string
  year: string
  video_url: string
  poster_file: File | null
  student_creators: string
  course_id: string
  selected_filters: string[]
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
  courses: { id: string; name: string } | null
  project_images: ProjectImage[]
  project_filters: { filters: Filter[] }[]
}
