'use client'

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

export default function ProjectImageDisplay({ images, title }: Props) {
    if (!images || images.length === 0) return null

    return (
        <Carousel
            opts={{ align: 'start', loop: true, dragFree: true }}
            plugins={[WheelGesturesPlugin({ wheelDraggingClass: '', forceWheelAxis: 'x' })]}
            className="group mt-4"
        >
            <CarouselContent>
                {images.map((img, i) => (
                    <CarouselItem key={i} className="basis-full md:basis-1/3">
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                            <Image
                                src={img.image_url}
                                alt={`${title} image ${i + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            {images.length > 1 && (
                <>
                    <CarouselPrevious className="left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <CarouselNext className="right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </>
            )}
        </Carousel>
    )
}
