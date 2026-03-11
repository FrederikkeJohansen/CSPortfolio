"use client"

import { useState } from "react"
import { Project } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

type ProjectCardProps = {
    project: Project
}

/** Card displaying a project thumbnail, course, title, description, and creator. */
export default function ProjectCard({ project }: ProjectCardProps) {
    const [loaded, setLoaded] = useState(false)
    const { id, title, description, year, student_creators, courses, project_images } = project

    // Sort images by display_order to get the primary image first. After, all courses are sorted after created date.
    const sortedImages = [...(project_images ?? [])].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    const imageSrc = sortedImages[0]?.image_url ?? null
    const courseName = courses?.name ?? null
    const courseAvailable = courses?.available !== false

    return (
        <Link href={`/projects/${id}`}>
            <div className="h-[340px] md:h-[360px] xl:h-[400px] bg-indigo-100 dark:bg-zinc-800 rounded-xl overflow-hidden shadow flex flex-col">
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
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className={cn("object-cover transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
                            onLoad={() => setLoaded(true)}
                        />
                    )}
                </div>

                {/* Content */}
                <div className="px-4 pt-3 pb-4 md:p-4 flex flex-col gap-1 flex-1 min-h-0">
                    <p className="text-xs font-semibold tracking-wide uppercase text-indigo-500 dark:text-indigo-300">
                        {courseName && <span className={cn(!courseAvailable && "text-zinc-400 dark:text-zinc-500")}>{courseName}</span>}
                        {courseName && year && <span> • </span>}
                        {year && <span>{year}</span>}
                    </p>
                    <h2 className="font-bold text-xl leading-snug line-clamp-1 text-zinc-900 dark:text-white">{title}</h2>

                    {description && (
                        <p className="text-sm text-zinc-700 dark:text-zinc-200 line-clamp-3 leading-relaxed">
                            {description}
                        </p>
                    )}
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 mt-auto pt-1 md:pt-2 truncate shrink-0">
                        Created by: {student_creators}
                    </p>
                </div>
            </div>
        </Link>
    )
}
