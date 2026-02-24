import { useState } from "react"
import { Course } from "@/types"

type Props = {
    courses: Course[]
    selectedCourses: string[]
    onToggle: (courseId: string) => void
}

export default function CourseFilterMobile({ courses, selectedCourses, onToggle }: Props) {
    const [open, setOpen] = useState(false)

    return (
        <div className="block md:hidden my-12 w-full max-w-xs mx-auto">
            <button
                className="w-full px-4 py-2 border-2 border-indigo-500 rounded-full bg-white text-black flex justify-between items-center"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-controls="course-dropdown"
            >
                <span>
                    {selectedCourses.length > 0
                        ? `${selectedCourses.length} selected`
                        : "Select courses"}
                </span>
                <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div id="course-dropdown" className="mt-2 border border-indigo-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto z-10">
                    {courses.map(course => {
                        const isActive = selectedCourses.includes(course.id)
                        return (
                            <button
                                key={course.id}
                                onClick={() => onToggle(course.id)}
                                className={`w-full text-left px-4 py-2 block ${isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50'} transition-colors`}
                            >
                                {course.name}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
