"use client"
import { useState, useRef, useEffect } from "react"
import { Course } from "@/types"
import { cn } from "@/lib/utils"

type Props = {
    courses: Course[]
    selectedCourses: string[]
    onToggle: (courseId: string) => void
}

export default function CourseFilterMobile({ courses, selectedCourses, onToggle }: Props) {
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Close only on outside click — not on scroll
    useEffect(() => {
        if (!open) return
        const handlePointerDown = (e: PointerEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("pointerdown", handlePointerDown)
        return () => document.removeEventListener("pointerdown", handlePointerDown)
    }, [open])

    return (
        <div ref={containerRef} className="my-12 max-w-xs mx-auto relative">

            {/* Trigger */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className={cn(
                    "w-full flex justify-between items-center px-5 py-2.5 border-2 border-indigo-500 dark:border-indigo-400 text-sm transition-all",
                    open ? "rounded-t-2xl" : "rounded-full"
                )}
            >
                <span className={cn(
                    "transition-colors",
                    selectedCourses.length > 0 ? "text-black dark:text-zinc-200 font-medium" : ""
                )}>
                    {selectedCourses.length > 0
                        ? `${selectedCourses.length} course${selectedCourses.length > 1 ? "s" : ""} selected`
                        : "Select courses"}
                </span>
                <svg
                    className={cn("w-4 h-4 shrink-0 transition-transform duration-200", open && "rotate-180")}
                    fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown panel */}
            {open && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-black border-2 border-t-0 border-indigo-500 dark:border-indigo-400 rounded-b-2xl overflow-hidden">

                    {/* Header — sits above the scrollable list, always visible */}
                    <div className="flex items-center justify-between px-5 py-2.5 border-b border-indigo-100 dark:border-zinc-700">
                        <span className="text-[10px] font-bold text-indigo-300 dark:text-indigo-300 tracking-[0.15em] uppercase">
                            Courses
                        </span>
                        {selectedCourses.length > 0 && (
                            <button
                                className="text-xs font-medium text-indigo-500 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-300 underline underline-offset-2 transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                View projects
                            </button>
                        )}
                    </div>

                    {/* Scrollable course list */}
                    <ul className="max-h-52 overflow-y-auto py-1">
                        {courses.map(course => {
                            const isSelected = selectedCourses.includes(course.id)
                            return (
                                <li key={course.id}>
                                    <button
                                        className={cn(
                                            "w-full flex items-center gap-3 text-left px-5 py-2.5 text-sm transition-colors hover:bg-indigo-5 dark:hover:bg-indigo-700",
                                        )}
                                        onClick={() => onToggle(course.id)}
                                    >
                                        <span className={isSelected ? "font-bold" : ""}>{course.name}</span>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}
