import { Project } from "@/types";
import Image from "next/image";

type ProjectCardProps = {
    project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const imageSrc = project.project_images?.[0]?.image_url ?? null
    const courseName = project.courses?.name ?? null

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow flex flex-col">
            {/* Image */}
            <div className="relative w-full h-52 bg-zinc-200 dark:bg-zinc-700">
                {imageSrc && (
                    <Image
                        src={imageSrc}
                        alt={project.title}
                        fill
                        className="object-cover"
                    />
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-1">
                <p className="text-sm text-zinc-500">
                    {courseName && <span>{courseName}</span>}
                    {courseName && project.year && <span> • </span>}
                    {project.year && <span>{project.year}</span>}
                </p>
                <h2 className="font-bold text-lg leading-tight">{project.title}</h2>
                {project.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                        {project.description}
                    </p>
                )}
                {project.student_creators && (
                    <p className="text-sm text-zinc-500 mt-1">
                        By: {project.student_creators}
                    </p>
                )}
            </div>
        </div>
    )
}