'use client'

import { useState } from 'react'
import Image from 'next/image'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import { ProjectImage } from '@/types'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from '@/components/ui/carousel'

type Props = {
    images: ProjectImage[]
    title: string
}

function CarouselImage({ src, alt }: { src: string; alt: string }) {
    const [loaded, setLoaded] = useState(false)

    return (
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800">
            {!loaded && (
                <div className="absolute inset-0 overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.4s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/15" />
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                onLoad={() => setLoaded(true)}
                className={`object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    )
}

export default function ProjectImageDisplay({ images, title }: Props) {
    if (!images || images.length === 0) return null

    return (
        <Carousel
            opts={{ align: 'start', loop: true, dragFree: true }}
            plugins={[WheelGesturesPlugin({ wheelDraggingClass: '', forceWheelAxis: 'x' })]}
            className="group mt-2"
        >
            <CarouselContent>
                {images.map((img, i) => (
                    <CarouselItem key={i} className="basis-full sm:basis-1/2 md:basis-1/3">
                        <CarouselImage
                            src={img.image_url}
                            alt={`${title} image ${i + 1}`}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>

            {images.length > 1 && (
                <>
                    <CarouselPrevious className="dark:bg-zinc-700 hover:dark:text-black left-4 opacity-0 group-hover:opacity-90 transition-opacity duration-200 cursor-pointer" />
                    <CarouselNext className="dark:bg-zinc-700 hover:dark:text-black right-4 opacity-0 group-hover:opacity-90 transition-opacity duration-200 cursor-pointer" />
                </>
            )}
        </Carousel>
    )
}
