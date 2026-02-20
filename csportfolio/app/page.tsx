import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  // Fetch projects with related data
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      courses(name),
      project_images(image_url, display_order),
      project_filters(
        filters(type, value)
      )
    `)
    .eq('visible', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <main className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
          CS Portfolio Projects
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error.message}
          </div>
        )}

        {!projects || projects.length === 0 ? (
          <p className="text-zinc-600">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <div key={project.id} className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
                {project.project_images && project.project_images.length > 0 && (
                  <img
                    src={project.project_images[0].image_url}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h2 className="text-xl dark:text-white font-bold mb-2">{project.title}</h2>
                <p className="text-sm dark:text-white text-zinc-600 mb-2">{project.courses?.name} • {project.year}</p>
                <p className="text-zinc-700 dark:text-white font-light mb-3">{project.description}</p>
                <p className="text-sm text-zinc-600 dark:text-white">By {project.student_creators}</p>
                <p className="text-sm text-zinc-600 dark:text-white">Video: {project.video_url}</p>

                {/* Featured Badge */}
                {project.featured && (
                  <div className="mt-3">
                    <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-semibold">
                      ⭐ Featured
                    </span>
                  </div>
                )}

                {project.project_filters && project.project_filters.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.project_filters.map((pf: any, idx: number) => (
                      pf.filters ? (
                        <span
                          key={idx}
                          className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-2 py-1 rounded"
                        >
                          {pf.filters.value}
                        </span>
                      ) : null
                    ))}
                  </div>
                )}

              </div>

            ))}
          </div>
        )}
      </main>
    </div>
  );
}
