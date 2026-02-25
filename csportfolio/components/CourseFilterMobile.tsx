"use client"
import { useState } from "react"
import { Course } from "@/types"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
    courses: Course[]
    selectedCourses: string[]
    onToggle: (courseId: string) => void
}

export default function CourseFilterMobile({ courses, selectedCourses, onToggle }: Props) {
    const [open, setOpen] = useState(false)

    return (
        <div className="my-12 max-w-xs mx-auto">
            <DropdownMenu open={open} onOpenChange={setOpen} modal>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full flex justify-between items-center rounded-full border-indigo-500 border-2">
                        <span>
                            {selectedCourses.length > 0
                                ? `${selectedCourses.length} courses selected`
                                : "Select courses"}
                        </span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side="bottom"
                    avoidCollisions={false}
                    align="center"
                    className="w-full max-w-xs mx-auto mt-2 border border-indigo-500 rounded-xl shadow-lg bg-white max-h-60 overflow-y-auto"
                    onCloseAutoFocus={e => e.preventDefault()}
                >
                    <div className="flex items-center justify-between px-2 py-1.5">
                        <DropdownMenuLabel className="font-bold text-indigo-500 tracking-[0.05em] text-xs p-0">COURSES</DropdownMenuLabel>
                        {selectedCourses.length > 0 && (
                            <button
                                className="text-xs font-medium text-indigo-500 hover:text-indigo-700 transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                View Course Projects
                            </button>
                        )}
                    </div>
                    <DropdownMenuGroup>
                        {courses.map(course => (
                            <DropdownMenuItem
                                key={course.id}
                                onSelect={e => {
                                    e.preventDefault();
                                    onToggle(course.id);
                                }}
                                className={selectedCourses.includes(course.id) ? "font-bold" : ""}
                            >
                                {course.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}