'use client'

import { Course } from "@/types"

type Props = {
    courses: Course[]
    selectedCourses: string[]
    onToggle: (courseId: string) => void
}

export default function CourseFilter({ courses, selectedCourses, onToggle }: Props) {
    return (
        <div className="my-12 flex flex-wrap gap-2 justify-center w-full 2xl:w-2/3 mx-auto">
            {courses.map(course => {
                const isActive = selectedCourses.includes(course.id)
                return (
                    <button
                        key={course.id}
                        onClick={() => onToggle(course.id)}
                        className={isActive
                            ? "px-4 py-1.5 rounded-full text-xs md:text-base font-normal border-2 border-indigo-500 bg-indigo-500 text-white transition-all active:scale-98"
                            : "px-4 py-1.5 rounded-full text-xs md:text-base font-normal border-2 border-indigo-500 text-black hover:bg-indigo-500 hover:text-white transition-all active:scale-98"
                        }
                    >
                        {course.name}
                    </button>
                )
            })}
        </div>
    )
}