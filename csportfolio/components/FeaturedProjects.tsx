"use client"

import { useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"
import Image from "next/image"
import Link from "next/link"
import { Project } from "@/types"

type Props = {
    projects: Project[]
}

const MIN_VISIBLE = 6

export default function FeaturedProjects({ projects }: Props) {
    const plugin = useRef(
        AutoScroll({
            speed: 1,
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
            className="mb-6 overflow-hidden"
            ref={emblaRef}
            style={{
                maskImage:
                    "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}
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
                            <div className="relative aspect-square overflow-hidden rounded-2xl">
                                <Image
                                    src={firstImage.image_url}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-300 hover:scale-105"
                                    sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
                                    draggable={false}
                                />
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
