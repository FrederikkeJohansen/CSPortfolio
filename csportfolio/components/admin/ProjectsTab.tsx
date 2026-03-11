'use client'

/** Admin projects tab — table with visibility, featured, ordering, and delete controls. */
import { AdminProject } from '@/types'
import {
  toggleProjectVisible,
  toggleProjectFeatured,
  updateDisplayOrder,
  deleteProject,
  dismissProject,
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
import { cn } from '@/lib/utils'

type Filter = 'all' | 'pending'

type Props = {
  projects: AdminProject[]
}

// Reusable table cell class tokens
const columnBorder = 'border-r border-zinc-200 dark:border-zinc-700'
const tableHeader = 'px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100 align-top text-left text-sm uppercase tracking-wide'
const tableCell = 'px-4 py-3 text-left'
const subLabel = 'font-normal text-[11px] text-zinc-400 dark:text-zinc-500 leading-tight mt-0.5 normal-case tracking-normal'

export function ProjectsTab({ projects }: Props) {
  const [isPending, startTransition] = useTransition()
  const [filter, setFilter] = useState<Filter>('all')

  const pendingCount = projects.filter(p => !p.reviewed).length

  const filtered =
    filter === 'pending'
      ? projects.filter(p => !p.reviewed)
      : projects

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

  function handleDismiss(id: string) {
    startTransition(async () => {
      await dismissProject(id)
    })
  }

  return (
    <div>
      <div className="mb-6 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-5 py-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        All projects are displayed in a grid on the portfolio homepage.
        Only projects marked as <strong className="text-zinc-800 dark:text-zinc-200">visible</strong> are shown to visitors.
        Projects marked as <strong className="text-zinc-800 dark:text-zinc-200">featured</strong> appear in the homepage carousel.
        By default, projects are sorted by upload date (newest first).
        Each project has an <strong className="text-zinc-800 dark:text-zinc-200">order</strong> value that defaults to 500.
        To push a project further down in the grid, give it a number higher than 500.
        To promote a project towards the top, give it a number lower than 500.
      </div>

      <div className="flex items-center gap-2 mb-5">
        {([
          { value: 'all', label: `All (${projects.length})` },
          { value: 'pending', label: `Pending (${pendingCount})` },
        ] as { value: Filter; label: string }[]).map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              'px-3 py-1.5 rounded text-sm transition-colors cursor-pointer',
              filter === value
                ? value === 'pending'
                  ? 'bg-[#E2007A] text-white font-semibold'
                  : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className=" bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
              <TableHead className={cn('min-w-[220px]', tableHeader, columnBorder)}>
                Title
              </TableHead>
              <TableHead className={cn(tableHeader, columnBorder)}>
                Course
              </TableHead>
              <TableHead className={cn(tableHeader, columnBorder)}>
                <div>Visible</div>
                <div className={subLabel}>Shown on portfolio</div>
              </TableHead>
              <TableHead className={cn(tableHeader, columnBorder)}>
                <div>Featured</div>
                <div className={subLabel}>Shown in carousel</div>
              </TableHead>
              <TableHead className={cn('whitespace-nowrap', tableHeader, columnBorder)}>
                Uploaded
              </TableHead>
              <TableHead className={cn(tableHeader, columnBorder)}>
                Student name
              </TableHead>
              <TableHead className={cn(tableHeader, columnBorder)}>
                Student email
              </TableHead>
              <TableHead className={cn('whitespace-nowrap', tableHeader, columnBorder)}>
                Student #
              </TableHead>
              <TableHead className={cn(tableHeader, columnBorder)}>
                Passphrase used
              </TableHead>
              <TableHead className={cn(tableHeader, columnBorder)}>
                <div>Order</div>
                <div className={cn(subLabel, 'whitespace-nowrap')}>Default 500</div>
              </TableHead>
              <TableHead className={cn('whitespace-nowrap', tableHeader, columnBorder)}>
                Last edited by
              </TableHead>
              <TableHead className={cn(tableHeader)}>
                Delete
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                isPending={isPending}
                onToggleVisible={handleToggleVisible}
                onToggleFeatured={handleToggleFeatured}
                onDelete={handleDelete}
                onDismiss={handleDismiss}
              />
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} className="text-center text-zinc-500 dark:text-zinc-400 py-10">
                  No projects are pending.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function ProjectRow({
  project,
  isPending,
  onToggleVisible,
  onToggleFeatured,
  onDelete,
  onDismiss,
}: {
  project: AdminProject
  isPending: boolean
  onToggleVisible: (id: string, currentValue: boolean) => void
  onToggleFeatured: (id: string, currentValue: boolean) => void
  onDelete: (id: string) => void
  onDismiss: (id: string) => void
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

  const rowBg = !project.reviewed
    ? 'bg-[#E2007A]/[0.06] dark:bg-[#E2007A]/[0.10]'
    : project.visible
      ? 'bg-green-100 dark:bg-green-900/40'
      : ''

  return (
    <TableRow className={cn(rowBg, isPending || isUpdatingOrder ? 'opacity-60' : '', 'hover:bg-white dark:hover:bg-zinc-800/70')}>
      <TableCell className={cn(tableCell,'font-medium max-w-[250px]', columnBorder)}>
        <div className="flex items-center gap-2">
          {!project.reviewed && (
            <span className="shrink-0 inline-flex items-center gap-1">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-[#E2007A]/15 text-[#E2007A]">
                Pending
              </span>
              <button
                onClick={() => onDismiss(project.id)}
                disabled={isPending}
                title="Mark as reviewed (keep hidden)"
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 disabled:opacity-50 cursor-pointer"
              >
                ✕
              </button>
            </span>
          )}
          <span className="block truncate" title={project.title}>
            {project.title}
          </span>
        </div>
      </TableCell>
      <TableCell className={cn(tableCell,'text-zinc-800 dark:text-zinc-200 whitespace-nowrap', columnBorder)}>
        {project.courses?.name ?? '—'}
      </TableCell>
      <TableCell className={cn(tableCell,'text-center', columnBorder)}>
        <Switch
          checked={project.visible}
          onCheckedChange={() => onToggleVisible(project.id, project.visible)}
          disabled={isPending}
        />
      </TableCell>
      <TableCell className={cn(tableCell,'text-center', columnBorder)}>
        <Switch
          checked={project.featured}
          onCheckedChange={() => onToggleFeatured(project.id, project.featured)}
          disabled={isPending}
        />
      </TableCell>
      <TableCell className={cn(tableCell,'text-zinc-800 dark:text-zinc-200 whitespace-nowrap', columnBorder)}>
        {formatDate(project.created_at)}
      </TableCell>
      <TableCell className={cn(tableCell,'text-zinc-800 dark:text-zinc-200 whitespace-nowrap', columnBorder)}>
        {project.student_name ?? '—'}
      </TableCell>
      <TableCell className={cn(tableCell,'text-zinc-800 dark:text-zinc-200', columnBorder)}>
        {project.student_email ?? '—'}
      </TableCell>
      <TableCell className={cn(tableCell,'text-zinc-800 dark:text-zinc-200', columnBorder)}>
        {project.student_number ?? '—'}
      </TableCell>
      <TableCell className={cn(tableCell,'text-zinc-800 dark:text-zinc-200 whitespace-nowrap', columnBorder)}>
        {project.passphrase_used ?? '—'}
      </TableCell>
      <TableCell className={cn(tableCell,columnBorder)}>
        <Input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
          onBlur={handleDisplayOrderBlur}
          className="w-20 text-center"
          disabled={isPending || isUpdatingOrder}
        />
      </TableCell>
      <TableCell className={cn(tableCell,'text-zinc-800 dark:text-zinc-200 whitespace-nowrap', columnBorder)}>
        {project.last_edited_by ?? '—'}
      </TableCell>
      <TableCell className={cn(tableCell)}>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950 cursor-pointer"
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete project</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{project.title}&quot;? This action will permanently delete the project and all associated images and cannot be undone.
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
