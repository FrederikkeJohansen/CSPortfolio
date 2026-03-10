"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

type Props = {
    text: string
    /** Max collapsed height in px (default 160 ≈ ~8 lines) */
    maxHeight?: number
    className?: string
}

export default function ExpandableDescription({ text, maxHeight = 160, className }: Props) {
    const [expanded, setExpanded] = useState(false)
    const [needsExpand, setNeedsExpand] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current) {
            setNeedsExpand(ref.current.scrollHeight > maxHeight)
        }
    }, [text, maxHeight])

    return (
        <div>
            <div
                ref={ref}
                className={cn(
                    "whitespace-pre-line overflow-hidden transition-[max-height] duration-300 ease-in-out",
                    className
                )}
                style={{ maxHeight: expanded ? `${ref.current?.scrollHeight ?? 9999}px` : `${maxHeight}px` }}
            >
                {text}
            </div>
            {needsExpand && (
                <button
                    type="button"
                    onClick={() => setExpanded(prev => !prev)}
                    className="mt-1 text-sm font-semibold text-indigo-500 dark:text-indigo-300 hover:underline cursor-pointer"
                >
                    {expanded ? "Show less" : "Read more"}
                </button>
            )}
        </div>
    )
}
