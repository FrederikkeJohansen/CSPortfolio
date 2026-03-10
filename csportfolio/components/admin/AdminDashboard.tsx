'use client'

import { AdminProject, Course } from '@/types'
import { signOut } from '@/app/admin/actions'
import { ProjectsTab } from '@/components/admin/ProjectsTab'
import { CoursesTab } from '@/components/admin/CoursesTab'
import { PassphrasesTab } from '@/components/admin/PassphrasesTab'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Props = {
  projects: AdminProject[]
  courses: Course[]
  passphrases: { id: string; value: string; active: boolean }[]
}

export function AdminDashboard({ projects, courses, passphrases }: Props) {
  const router = useRouter()
  const pendingCount = projects.filter(p => !p.reviewed).length

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <Tabs defaultValue="projects" className="min-h-screen bg-gray-50 dark:bg-black flex flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-3 flex items-center gap-6">
        <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100 shrink-0">Admin</h1>
        <TabsList className="flex-1">
          <TabsTrigger value="projects" className="relative">
            Projects
            {pendingCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-[#E2007A] text-white text-xs font-bold px-1.5 min-w-[18px] h-[18px]">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
          <TabsTrigger value="passphrases">Passphrases</TabsTrigger>
        </TabsList>
        <Button variant="outline" size="sm" onClick={handleSignOut} className="shrink-0">Sign out</Button>
      </header>
      <main className="flex-1 px-6 py-6">
        <TabsContent value="projects" className="mt-0">
          <ProjectsTab projects={projects} />
        </TabsContent>
        <TabsContent value="courses" className="mt-0">
          <CoursesTab courses={courses} />
        </TabsContent>
        <TabsContent value="passphrases" className="mt-0">
          <PassphrasesTab passphrases={passphrases} />
        </TabsContent>
      </main>
    </Tabs>
  )
}
