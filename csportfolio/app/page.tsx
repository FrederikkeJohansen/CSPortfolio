/**
 * Homepage — server component that fetches all visible projects and courses,
 * then renders the featured carousel, hero, course-filtered grid, and search overlay.
 */
import { getProjects, getCourses } from "@/lib/queries";
import Navbar from "@/components/Navbar";
import FeaturedProjects from "@/components/FeaturedProjects";
import Hero from "@/components/Hero";
import ProjectsSelection from "@/components/ProjectsSelection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SearchModal from "@/components/SearchModal";

export default async function Home() {
  // Fetch projects and courses in parallel for faster page load
  const [allProjects, courses] = await Promise.all([
    getProjects(),
    getCourses(),
  ]);

  const featuredProjects = allProjects.filter(p => p.featured);

  return (
    <>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <Navbar />
        <main className="py-8 px-4 sm:px-8">
          <FeaturedProjects projects={featuredProjects} />
          <Hero />
          <ProjectsSelection projects={allProjects} courses={courses} />
        </main>
        <ScrollToTop />
        <Footer />
      </div>
      {/* Search modal sits outside main layout to overlay the full viewport */}
      <SearchModal projects={allProjects} />
    </>
  );
}
