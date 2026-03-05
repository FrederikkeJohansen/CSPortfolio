'use client'

import { AdminProject } from '@/types'
import { Course } from '@/types'
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

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Admin Dashboard</h1>
        <Button variant="outline" size="sm" onClick={handleSignOut}>Sign out</Button>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="projects">
          <TabsList>
            <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
            <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
            <TabsTrigger value="passphrases">Passphrases ({passphrases.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            <ProjectsTab projects={projects} />
          </TabsContent>
          <TabsContent value="courses">
            <CoursesTab courses={courses} />
          </TabsContent>
          <TabsContent value="passphrases">
            <PassphrasesTab passphrases={passphrases} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
