"use client"

import { useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"
import Image from "next/image"
import Link from "next/link"
import { Project } from "@/types"

type Props = {
    projects: Project[]
}

const MIN_VISIBLE = 20

function FeaturedImage({ src, alt }: { src: string; alt: string }) {
    const [loaded, setLoaded] = useState(false)

    return (
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800">
            {!loaded && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.4s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/15" />
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                fill
                className={`object-cover transition-[transform,opacity] duration-500 hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
                sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
                draggable={false}
                onLoad={() => setLoaded(true)}
            />
        </div>
    )
}

export default function FeaturedProjects({ projects }: Props) {
    const plugin = useRef(
        AutoScroll({
            speed: 1,
            playOnInit: true,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        })
    )

    const [emblaRef] = useEmblaCarousel(
        { loop: true, dragFree: true, align: "start" },
        [plugin.current]
    )

    if (projects.length === 0) return null

    // Duplicate items until we have at least MIN_VISIBLE to prevent gaps
    const items =
        projects.length < MIN_VISIBLE
            ? Array.from(
                  { length: Math.ceil(MIN_VISIBLE / projects.length) },
                  () => projects
              ).flat()
            : projects

    return (
        <div
            className="mb-6 overflow-hidden -mx-4 sm:-mx-8"
            ref={emblaRef}
        >
            <div className="flex gap-4">
                {items.map((project, i) => {
                    const firstImage = project.project_images
                        .slice()
                        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))[0]

                    return (
                        <Link
                            key={`${project.id}-${i}`}
                            href={`/projects/${project.id}`}
                            className="flex-none w-40 sm:w-48 md:w-56"
                        >
                            <FeaturedImage src={firstImage.image_url} alt={project.title} />
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
