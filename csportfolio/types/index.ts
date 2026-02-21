export type Course = {
  id: string
  name: string
}

export type Filter = {
  type: string
  value: string
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
  courses: { name: string } | null
  project_images: ProjectImage[]
  project_filters: { filters: Filter }[]
}
