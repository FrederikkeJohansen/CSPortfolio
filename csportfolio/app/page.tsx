import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import FeaturedProjects from "@/components/FeaturedProjects";

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
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="p-8">
        <FeaturedProjects />
      </main>
    </div>
  );
}
