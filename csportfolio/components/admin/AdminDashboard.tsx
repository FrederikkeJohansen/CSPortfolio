'use client'

import { AdminProject } from '@/types'
import { Course } from '@/types'
import { signOut } from '@/app/admin/actions'
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
            <p className="text-zinc-600 dark:text-zinc-400 py-4">Projects tab coming next...</p>
          </TabsContent>
          <TabsContent value="courses">
            <p className="text-zinc-600 dark:text-zinc-400 py-4">Courses tab coming next...</p>
          </TabsContent>
          <TabsContent value="passphrases">
            <p className="text-zinc-600 dark:text-zinc-400 py-4">Passphrases tab coming next...</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
