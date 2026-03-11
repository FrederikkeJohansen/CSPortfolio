/** Project detail page — displays images, metadata, description, and external links. */
import { getProject } from "@/lib/queries"
import ProjectImageDisplay from "@/components/ProjectImageDisplay"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import BackButton from "@/components/BackButton"
import SearchModal from "@/components/SearchModal"

type Props = {
    params: Promise<{ id: string }>
}

/** Renders a resource link (video/poster) as a clickable anchor or disabled label. */
function ResourceLink({ url, label }: { url: string | null; label: string }) {
    const activeStyle = "text-indigo-500 dark:text-indigo-200 hover:underline font-bold cursor-pointer"
    const disabledStyle = "text-md font-bold text-zinc-400 dark:text-zinc-500 cursor-default"

    if (url) {
        return (
            <a href={url} target="_blank" rel="noopener noreferrer" className={activeStyle}>
                {label}
            </a>
        )
    }
    return (
        <span title={`No ${label.toLowerCase()} added`} className={disabledStyle}>
            {label}
        </span>
    )
}

export default async function ProjectPage({ params }: Props) {
    const { id } = await params
    const project = await getProject(id)

    if (!project) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center text-zinc-500">
                Project not found
            </div>
        )
    }

    const { title, description, year, video_url, poster_url, student_creators, keywords, courses, project_images } = project
    const images = project_images ?? []
    const courseUnavailable = courses?.available === false
    const formattedKeywords = keywords
        ?.map(kw => kw.charAt(0).toUpperCase() + kw.slice(1))
        .join(" • ")

    return (
        <>
            <div className="min-h-screen bg-zinc-50 dark:bg-black">
                <Navbar />
                <div className="px-4 sm:px-8 mb-8">
                    <BackButton />

                    {/* Image carousel */}
                    <div className="mb-4">
                        <ProjectImageDisplay images={images} title={title} />
                    </div>

                    {/* Project details */}
                    <div className="flex flex-col">
                        {/* Course + year label */}
                        <p className="text-xs 2xl:text-sm font-semibold tracking-wide uppercase text-indigo-500 dark:text-indigo-300 mb-1">
                            <span className={courseUnavailable ? "text-zinc-400 dark:text-zinc-500" : ""}>
                                {courses?.name}
                                {courseUnavailable && (
                                    <span className="normal-case"> (course is no longer available)</span>
                                )}
                            </span>
                            <span> • </span> {year}
                        </p>

                        <h1 className="text-2xl md:text-4xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">{title}</h1>
                        <p className="text-sm md:text-base 2xl:text-lg font-medium text-black dark:text-zinc-300 mb-1 whitespace-pre-line">{description}</p>

                        {keywords?.length > 0 && (
                            <p className="text-sm md:text-base 2xl:text-lg text-black dark:text-white mb-1">
                                <span className="uppercase tracking-wide font-bold text-black dark:text-white">Key Words: </span>
                                {formattedKeywords}
                            </p>
                        )}

                        <p className="text-sm font-bold text-zinc-500 dark:text-zinc-300 mt-4">
                            Created by: {student_creators ?? "Anonymous"}
                        </p>

                        {/* External resource links */}
                        <div className="flex flex-row gap-4 text-sm md:text-base 2xl:text-lg font-medium mt-4">
                            <ResourceLink url={video_url} label="See video" />
                            <ResourceLink url={poster_url} label="See poster" />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
            <SearchModal />
        </>
    )
}