import { getProjectInformationForAdmin, getAllCourses, getAllPassphrases } from '@/lib/queries'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export const dynamic = 'force-dynamic'
export default async function AdminPage() {
  const [projects, courses, passphrases] = await Promise.all([
    getProjectInformationForAdmin(),
    getAllCourses(),
    getAllPassphrases(),
  ])

  return <AdminDashboard projects={projects} courses={courses} passphrases={passphrases} />
}
