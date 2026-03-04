"use client"

import { useState } from "react"
import { Project } from "@/types";
import Image from "next/image";
import Link from "next/link"
import { cn } from "@/lib/utils"

type ProjectCardProps = {
    project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const [loaded, setLoaded] = useState(false)
    const imageSrc = project.project_images?.[0]?.image_url ?? null
    const courseName = project.courses?.name ?? null
    const courseAvailable = project.courses?.available !== false

    return (
        <Link href={`/projects/${project.id}`}>
            <div className="h-[300px] md:h-[360px] xl:h-[400px] bg-indigo-100 dark:bg-zinc-900 rounded-xl overflow-hidden shadow flex flex-col">
                {/* Image */}
                <div className="relative w-full h-36 md:h-44 xl:h-48 bg-zinc-200 dark:bg-zinc-800">
                    {!loaded && (
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.4s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/15" />
                        </div>
                    )}
                    {imageSrc && (
                        <Image
                            src={imageSrc}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className={cn("object-cover transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
                            onLoad={() => setLoaded(true)}
                        />
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-1 flex-1 overflow-hidden">
                    <p className="text-xs font-semibold tracking-wide uppercase text-indigo-500 dark:text-indigo-300">
                        {courseName && <span className={cn(!courseAvailable && "text-zinc-400 dark:text-zinc-500")}>{courseName}</span>}
                        {courseName && project.year && <span> • </span>}
                        {project.year && <span>{project.year}</span>}
                    </p>
                    <h2 className="font-bold text-xl leading-snug line-clamp-1 text-zinc-900 dark:text-white">{project.title}</h2>

                    {project.description && (
                        <p className="text-sm text-zinc-700 dark:text-zinc-200 line-clamp-2 md:line-clamp-3 leading-relaxed">
                            {project.description}
                        </p>
                    )}
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 mt-auto pt-2 truncate">
                        Created by: {project.student_creators ?? "Anonymous"}
                    </p>
                </div>
            </div>
        </Link>
    )
}
