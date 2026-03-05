import { supabase } from "@/lib/supabase"
import { AdminProject, Course, Project } from "@/types"

const PROJECT_SELECT = `
  id, title, description, year, video_url, poster_url,
  featured, visible, student_creators, keywords,
  display_order, created_at,
  courses(id, name, available),
  project_images(image_url, display_order)
`

export async function getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
        .from("projects")
        .select(PROJECT_SELECT)
        .eq("visible", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Failed to fetch projects:", error)
        return []
    }

    return (data as unknown as Project[]) ?? []
}

export async function getProject(id: string): Promise<Project | null> {
    const { data, error } = await supabase
        .from("projects")
        .select(`
            id, title, description, year, video_url, poster_url,
            visible, student_creators, keywords,
            courses(id, name, available),
            project_images(image_url, display_order)
        `)
        .eq("id", id)
        .single()

    if (error) {
        console.error("Failed to fetch project:", error)
        return null
    }

    return data as unknown as Project
}

export async function getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
        .from("courses")
        .select("id, name, available")
        .order("name", { ascending: true })

    if (error) {
        console.error("Failed to fetch courses:", error)
        return []
    }
    return ((data ?? []) as Course[]).filter(c => c.available)
}

// ── Admin Queries ──

const ADMIN_PROJECT_SELECT = `
  id, title, description, year, video_url, poster_url,
  featured, visible, student_creators, keywords,
  display_order, created_at,
  student_name, student_email, student_number,
  courses(id, name, available),
  project_images(image_url, display_order)
`

export async function getProjectInformationForAdmin(): Promise<AdminProject[]> {
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
