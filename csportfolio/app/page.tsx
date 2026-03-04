import { supabase } from "@/lib/supabase";
import { Project } from "@/types";
import Navbar from "@/components/Navbar";
import FeaturedProjects from "@/components/FeaturedProjects";
import Hero from "@/components/Hero";
import ProjectsSelection from "@/components/ProjectsSelection";
import Footer from "@/components/Footer";
import SearchModal from "@/components/SearchModal";

export default async function Home() {
  // Fetch courses for filter options
  const { data: coursesData } = await supabase.from('courses').select('id, name, available').order('name', { ascending: true });
  const courses = (coursesData ?? []).filter(c => c.available);
  // Fetch projects with related data
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
  id, title, description, year, video_url, poster_url,
  featured, visible, student_creators, keywords,
  display_order, created_at,
  courses(id, name, available),
  project_images(image_url, display_order)
`)
    .eq('visible', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Failed to fetch projects:', error)
  }
  const allProjects = (projects as unknown as Project[]) ?? [];
  return (
    <>
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <Navbar />
        <main className="py-8 px-4 sm:px-8">
          <FeaturedProjects />
          <Hero />
          <ProjectsSelection
            projects={allProjects}
            courses={courses ?? []}
          />
        </main>
        <Footer />
      </div>
      <SearchModal projects={allProjects} />
    </>
  );
}
