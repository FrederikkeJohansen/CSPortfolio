import { getProjectInformationForAdmin, getAllCourses, getPassphrases } from '@/lib/queries'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const [projects, courses, passphrases] = await Promise.all([
    getProjectInformationForAdmin(),
    getAllCourses(),
    getPassphrases(),
  ])

  return <AdminDashboard projects={projects} courses={courses} passphrases={passphrases} />
}
