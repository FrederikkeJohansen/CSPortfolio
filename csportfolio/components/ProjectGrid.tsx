import { Project } from "@/types";
import ProjectCard from "./ProjectCard";

type ProjectGridProps = {
    projects: Project[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    )
}