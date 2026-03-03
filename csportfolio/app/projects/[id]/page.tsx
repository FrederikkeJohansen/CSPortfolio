import { supabase } from "@/lib/supabase"

type Props = {
    params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: Props) {
    const { id } = await params
    const { data: project, error } = await supabase
        .from('projects')
        .select(`
    id, title, description, year, video_url, poster_url, visible, student_creators,
    courses(id, name),
    project_images(image_url, display_order),
    project_filters(filters(type, value))
  `)
        .eq('id', id)
        .single()  // ← returns one object instead of an array
    console.log("project", project)
    console.log("error", error)
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            <h1 className="text-3xl font-bold text-center pt-20">Project ID: {project?.title}</h1>


        </div>
    )
}