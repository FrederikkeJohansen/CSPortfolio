import { Project } from "@/types";
import Image from "next/image";

type ProjectCardProps = {
    project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const imageSrc = project.project_images?.[0]?.image_url ?? null
    const courseName = project.courses?.name ?? null

    return (
        <div className="h-[300px] md:h-[360px] xl:h-[400px] bg-indigo-100 dark:bg-zinc-900 rounded-xl overflow-hidden shadow flex flex-col cursor-pointer">
            {/* Image */}
            <div className="relative w-full h-36 md:h-44 xl:h-48 bg-zinc-200 dark:bg-zinc-700">
                {imageSrc && (
                    <Image
                        src={imageSrc}
                        alt={project.title}
                        fill
                        className="object-cover"
                        priority
                    />
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-1 flex-1 overflow-hidden">
                <p className="text-xs font-semibold tracking-wide uppercase text-indigo-400 dark:text-indigo-400">
                    {courseName && <span>{courseName}</span>}
                    {courseName && project.year && <span> • </span>}
                    {project.year && <span>{project.year}</span>}
                </p>
                <h2 className="font-bold text-xl leading-snug line-clamp-1 text-gray-900 dark:text-white">{project.title}</h2>

                {project.description && (
                    <p className="text-sm text-gray-700 dark:text-zinc-400 line-clamp-2 md:line-clamp-3 leading-relaxed">
                        {project.description}
                    </p>
                )}
                {project.student_creators && (
                    <p className="text-xs text-gray-700 dark:text-zinc-500 mt-auto pt-2 truncate">
                        Created by: {project.student_creators}
                    </p>
                )}
            </div>
        </div>
    )
}