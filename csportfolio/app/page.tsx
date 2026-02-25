import { supabase } from "@/lib/supabase";
import { Project, Course } from "@/types";
import Navbar from "@/components/Navbar";
import FeaturedProjects from "@/components/FeaturedProjects";
import Hero from "@/components/Hero";
import CourseFilter from "@/components/CourseFilter";
import AdvancedFilter from "@/components/AdvancedFilter";
import ProjectGrid from "@/components/ProjectGrid";
import ProjectsSelection from "@/components/ProjectsSelection";
import Footer from "@/components/Footer";

export default async function Home() {
  // Fetch courses for filter options
  const { data: courses } = await supabase.from('courses').select('id, name').order('name', { ascending: true });
  // Fetch projects with related data
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
  id, title, description, year, video_url, poster_url,
  featured, visible, student_creators,
  display_order, created_at,
  courses(id, name),
  project_images(image_url, display_order),
  project_filters(filters(type, value))
`)
    .eq('visible', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Failed to fetch projects:', error)
  }
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navbar />
      <main className="p-8">
        <FeaturedProjects />
        <Hero />
        <ProjectsSelection
          projects={(projects as unknown as Project[]) ?? []}
          courses={courses ?? []}
        />
      </main>
      <Footer />
    </div>
  );
}
