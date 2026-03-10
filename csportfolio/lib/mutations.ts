import { supabase } from "@/lib/supabase"
import { ImageEntry } from "@/types"

export async function validatePassphrase(passphrase: string): Promise<boolean> {
    const { data, error } = await supabase
        .from("passphrases")
        .select("id")
        .eq("value", passphrase.trim())
        .eq("active", true)
        .limit(1)

    if (error) {
        throw new Error("Failed to validate passphrase: " + error.message)
    }
    return !!data && data.length > 0
}

export async function uploadFile(bucket: string, file: File): Promise<string> {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

    if (error) throw new Error(`Failed to upload to ${bucket}: ${error.message}`)

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return data.publicUrl
}

export async function createProject(project: {
    title: string
    description: string
    year: number
    video_url: string | null
    poster_url: string | null
    student_creators: string | null
    course_id: string
    student_name: string
    student_email: string
    student_number: string
    keywords: string[]
    passphrase_used: string
}): Promise<string> {
    const projectId = crypto.randomUUID()

    const { error } = await supabase
        .from("projects")
        .insert({
            id: projectId,
            ...project,
            visible: false,
        })

    if (error) throw new Error("Failed to submit project: " + error.message)

    return projectId
}

export async function uploadProjectImages(
    projectId: string,
    images: ImageEntry[],
    primaryIndex: number
): Promise<void> {
    if (images.length === 0) return

    const imageRows = []
    for (let i = 0; i < images.length; i++) {
        const img = images[i]
        const fileExt = img.file.name.split(".").pop()
        const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

        const { error } = await supabase.storage
            .from("project-images")
            .upload(fileName, img.file)

        if (error) throw new Error("Failed to upload image: " + error.message)

        const { data } = supabase.storage.from("project-images").getPublicUrl(fileName)

        const order = i === primaryIndex ? 0 : (i < primaryIndex ? i + 1 : i)
        imageRows.push({
            project_id: projectId,
            image_url: data.publicUrl,
            display_order: order,
        })
    }

    const { error } = await supabase
        .from("project_images")
        .insert(imageRows)

    if (error) throw new Error("Failed to save image records: " + error.message)
}
