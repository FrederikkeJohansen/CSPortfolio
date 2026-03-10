'use client'

import { AdminProject } from '@/types'
import {
  toggleProjectVisible,
  toggleProjectFeatured,
  updateDisplayOrder,
  deleteProject,
} from '@/app/admin/actions'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useTransition, useState } from 'react'
import { Trash2 } from 'lucide-react'

type Props = {
  projects: AdminProject[]
}

export function ProjectsTab({ projects }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleToggleVisible(id: string, currentValue: boolean) {
    startTransition(async () => {
      await toggleProjectVisible(id, !currentValue)
    })
  }

  function handleToggleFeatured(id: string, currentValue: boolean) {
    startTransition(async () => {
      await toggleProjectFeatured(id, !currentValue)
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteProject(id)
    })
  }

  return (
    <div className="mt-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Title</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Student #</TableHead>
            <TableHead>Passphrase</TableHead>
            <TableHead className="text-center">Visible</TableHead>
            <TableHead className="text-center">Featured</TableHead>
            <TableHead className="text-center">Order</TableHead>
            <TableHead className="text-center">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              isPending={isPending}
              onToggleVisible={handleToggleVisible}
              onToggleFeatured={handleToggleFeatured}
              onDelete={handleDelete}
            />
          ))}
          {projects.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="text-center text-zinc-500 dark:text-zinc-400 py-8">
                No projects found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function ProjectRow({
  project,
  isPending,
  onToggleVisible,
  onToggleFeatured,
  onDelete,
}: {
  project: AdminProject
  isPending: boolean
  onToggleVisible: (id: string, currentValue: boolean) => void
  onToggleFeatured: (id: string, currentValue: boolean) => void
  onDelete: (id: string) => void
}) {
  const [displayOrder, setDisplayOrder] = useState(String(project.display_order))
  const [isUpdatingOrder, startOrderTransition] = useTransition()

  function handleDisplayOrderBlur() {
    const parsed = parseInt(displayOrder, 10)
    if (isNaN(parsed) || parsed === project.display_order) return
    startOrderTransition(async () => {
      await updateDisplayOrder(project.id, parsed)
    })
  }

  const rowBg = project.visible
    ? 'bg-green-50/50 dark:bg-green-950/20'
    : 'bg-red-50/50 dark:bg-red-950/20'

  return (
    <TableRow className={`${rowBg} ${isPending || isUpdatingOrder ? 'opacity-60' : ''}`}>
      <TableCell className="font-medium max-w-[250px]">
        <span className="block truncate" title={project.title}>
          {project.title}
        </span>
      </TableCell>
      <TableCell className="text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
        {project.courses?.name ?? '—'}
      </TableCell>
      <TableCell className="text-zinc-600 dark:text-zinc-400">
        {project.year}
      </TableCell>
      <TableCell className="text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
        {project.student_name ?? '—'}
      </TableCell>
      <TableCell className="text-zinc-600 dark:text-zinc-400">
        {project.student_email ?? '—'}
      </TableCell>
      <TableCell className="text-zinc-600 dark:text-zinc-400">
        {project.student_number ?? '—'}
      </TableCell>
      <TableCell className="text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
        {project.passphrase_used ?? '—'}
      </TableCell>
      <TableCell className="text-center">
        <Switch
          checked={project.visible}
          onCheckedChange={() => onToggleVisible(project.id, project.visible)}
          disabled={isPending}
        />
      </TableCell>
      <TableCell className="text-center">
        <Switch
          checked={project.featured}
          onCheckedChange={() => onToggleFeatured(project.id, project.featured)}
          disabled={isPending}
        />
      </TableCell>
      <TableCell className="text-center">
        <Input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
          onBlur={handleDisplayOrderBlur}
          className="w-20 mx-auto text-center"
          disabled={isPending || isUpdatingOrder}
        />
      </TableCell>
      <TableCell className="text-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950" disabled={isPending}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete project</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{project.title}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(project.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  )
}
