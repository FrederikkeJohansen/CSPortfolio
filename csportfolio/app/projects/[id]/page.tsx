import { supabase } from "@/lib/supabase"
import { Project } from "@/types"
import ProjectImageDisplay from "@/components/ProjectImageDisplay"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import BackButton from "@/components/BackButton"

type Props = {
    params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: Props) {
    const { id } = await params
    const { data, error } = await supabase
        .from('projects')
        .select(`
    id, title, description, year, video_url, poster_url, visible, student_creators,
    courses(id, name, available),
    project_images(image_url, display_order)
  `)
        .eq('id', id)
        .single()  // ← returns one object instead of an array
    const project = data as unknown as Project

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black ">
            <Navbar />
            <div className="px-4 sm:px-8 mb-8">
                <BackButton />
                <div className="mb-4">
                    <ProjectImageDisplay
                        images={project?.project_images ?? []}
                        title={project?.title ?? ""}
                    />
                </div>
                <div className="flex flex-col">
                    <p className="text-xs font-semibold tracking-wide uppercase text-indigo-500 dark:text-indigo-300 mb-1">
                        <span className={project?.courses?.available === false ? "text-zinc-400 dark:text-zinc-500" : ""}>
                            {project?.courses?.name}
                            {project?.courses && project.courses.available === false && (
                                <span className="normal-case"> (course is no longer available)</span>
                            )}
                        </span>
                        <span> • </span> {project?.year}
                    </p>
                    <h1 className="text-2xl md:text-4xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">{project?.title}</h1>

                    <p className="text-sm md:text-base 2xl:text-xl font-medium text-black dark:text-zinc-300 mb-1">{project?.description}</p>
                    <p className="text-sm md:text-base 2xl:text-xl text-black dark:text-white mb-1"><span className="uppercase tracking-wide font-bold text-black dark:text-white">Key Words: </span>Something</p>

                    <p className="text-sm font-bold text-zinc-500 dark:text-zinc-300 mt-4">Created by: {project?.student_creators}</p>

                    <div className="flex flex-row gap-4 text-sm md:text-base font-medium mt-4">
                        {project?.video_url ? (
                            <a href={project.video_url} target="_blank" rel="noopener noreferrer"
                                className="text-indigo-500 dark:text-indigo-200 hover:underline font-bold cursor-pointer">
                                See video
                            </a>
                        ) : (
                            <span title="No video added" className="text-md font-bold text-zinc-400 dark:text-zinc-500 cursor-default">
                                See video
                            </span>
                        )}

                        {project?.poster_url ? (
                            <a href={project.poster_url} target="_blank" rel="noopener noreferrer"
                                className="text-indigo-500 dark:text-indigo-200 hover:underline font-bold cursor-pointer">
                                See poster
                            </a>
                        ) : (
                            <span title="No poster added" className="text-md font-bold text-zinc-400 dark:text-zinc-500 cursor-default">
                                See poster
                            </span>
                        )}
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}