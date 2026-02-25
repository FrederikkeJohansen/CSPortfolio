'use client'

import CourseFilterMobile from "./CourseFilterMobile"
import { Course } from "@/types"

type Props = {
    courses: Course[]
    selectedCourses: string[]
    onToggle: (courseId: string) => void
}

export default function CourseFilter({ courses, selectedCourses, onToggle }: Props) {
    return (
        <>
            {/* Mobile Dropdown */}
            <div className="block md:hidden">
                <CourseFilterMobile courses={courses} selectedCourses={selectedCourses} onToggle={onToggle} />
            </div>
            {/* Desktop: Button grid */}
            <div className="hidden md:flex flex-wrap gap-2 justify-center w-full 2xl:w-2/3 mx-auto my-12">
                {courses.map(course => {
                    const isActive = selectedCourses.includes(course.id)
                    return (
                        <button
                            key={course.id}
                            onClick={() => onToggle(course.id)}
                            className={isActive
                                ? "px-4 py-1.5 rounded-full text-xs md:text-base text-black dark:text-zinc-200 font-bold border-2 border-indigo-500 dark:border-indigo-400 bg-indigo-500 text-white transition-all active:scale-98"
                                : "px-4 py-1.5 rounded-full text-xs md:text-base text-black dark:text-zinc-200 font-normal border-2 border-indigo-500 dark:border-indigo-400 hover:bg-indigo-500 hover:text-white transition-all active:scale-98"
                            }
                        >
                            {course.name}
                        </button>
                    )
                })}
            </div>
        </>
    )
}