import { Project } from "@/types";

type ProjectGridProps = {
    projects: Project[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <div key={project.id} className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
                    <p>{project.title}</p>
                    <p>{project.courses?.[0]?.name}</p>
                </div>
            ))}
        </div>
    )
}