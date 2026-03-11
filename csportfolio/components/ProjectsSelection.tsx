'use client'

import { useState } from "react"
import { Project, Course } from "@/types"
import CourseFilter from "@/components/CourseFilter"
import ProjectGrid from "@/components/ProjectGrid"

type Props = {
    projects: Project[]
    courses: Course[]
}

/**
 * Container component that manages course-filter state
 * and renders the filter buttons + the filtered project grid.
 */
export default function ProjectsSelection({ projects, courses }: Props) {
    const [selectedCourses, setSelectedCourses] = useState<string[]>([])

    /** Toggle a course ID in/out of the selected set. */
    const toggleCourse = (courseId: string) => {
        setSelectedCourses(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        )
    }

    // Show all projects when no courses are selected
    const filteredProjects = selectedCourses.length === 0
        ? projects // no filter = show all
        : projects.filter(project =>
            project.courses && selectedCourses.includes(project.courses.id)
        )

    return (
        <>
            <CourseFilter
                courses={courses}
                selectedCourses={selectedCourses}
                onToggle={toggleCourse}
            />
            <ProjectGrid projects={filteredProjects} />
        </>
    )
}
