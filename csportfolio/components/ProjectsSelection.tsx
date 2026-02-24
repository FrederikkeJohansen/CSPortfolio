'use client'

import { useState } from "react"
import { Project, Course } from "@/types"
import CourseFilter from "@/components/CourseFilter"
import ProjectGrid from "@/components/ProjectGrid"

type Props = {
    projects: Project[]
    courses: Course[]
}

export default function ProjectsSelection({ projects, courses }: Props) {
    const [selectedCourses, setSelectedCourses] = useState<string[]>([])

    const toggleCourse = (courseId: string) => {
        setSelectedCourses(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)  // remove if already selected
                : [...prev, courseId]                  // add if not selected
        )
    }

    const filteredProjects = selectedCourses.length === 0
        ? projects                                 // no filter = show all
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