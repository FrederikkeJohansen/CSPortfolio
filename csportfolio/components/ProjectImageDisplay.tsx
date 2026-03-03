'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ProjectImage } from '@/types'

type Props = {
    images: ProjectImage[]
    title: string
}

export default function ProjectImageDisplay({ images, title }: Props) {
    const [startIndex, setStartIndex] = useState(0)
    const [visibleCount, setVisibleCount] = useState(3)

    useEffect(() => {
        function updateCount() {
            setVisibleCount(window.innerWidth >= 768 ? 3 : 1)
        }
        updateCount()
        window.addEventListener('resize', updateCount)
        return () => window.removeEventListener('resize', updateCount)
    }, [])

    if (!images || images.length === 0) return null

    const maxStart = Math.max(0, images.length - visibleCount)
    const canGoPrev = startIndex > 0
    const canGoNext = startIndex < maxStart

    function prev() {
        setStartIndex(i => Math.max(0, i - 1))
    }

    function next() {
        setStartIndex(i => Math.min(maxStart, i + 1))
    }

    const visibleImages = images.slice(startIndex, startIndex + visibleCount)

    return (
        <div className="relative group mt-4">
            {/* Image grid — always shows exactly 1 (mobile) or 3 (desktop) full images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {visibleImages.map((img, i) => (
                    <div
                        key={startIndex + i}
                        className="relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800"
                    >
                        <Image
                            src={img.image_url}
                            alt={`${title} image ${startIndex + i + 1}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Navigation buttons — hidden until hover */}
            {images.length > visibleCount && (
                <>
                    <button
                        onClick={prev}
                        disabled={!canGoPrev}
                        className={`absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm ${canGoPrev
                            ? 'bg-white/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-white hover:bg-white dark:hover:bg-zinc-700 shadow-lg'
                            : 'bg-white/40 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-600 cursor-default'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button
                        onClick={next}
                        disabled={!canGoNext}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm ${canGoNext
                            ? 'bg-white/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-white hover:bg-white dark:hover:bg-zinc-700 shadow-lg'
                            : 'bg-white/40 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-600 cursor-default'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    )
}
