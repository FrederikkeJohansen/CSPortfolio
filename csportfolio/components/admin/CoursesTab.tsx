'use client'

/** Admin courses tab — CRUD table for managing available courses. */
import { Course } from '@/types'
import { toggleCourseAvailable, createCourse, updateCourseName, deleteCourse } from '@/app/admin/actions'
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
import { useState, useTransition } from 'react'
import { Plus, Pencil, Check, Trash2 } from 'lucide-react'

import { cn } from '@/lib/utils'

type Props = {
  courses: Course[]
}

export function CoursesTab({ courses }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCourseName, setNewCourseName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')

  function handleToggleAvailable(id: string, currentValue: boolean) {
    startTransition(async () => {
      await toggleCourseAvailable(id, !currentValue)
    })
  }

  function handleStartEdit(id: string, currentName: string) {
    setEditingId(id)
    setEditingValue(currentName)
  }

  function handleSaveEdit(id: string) {
    const trimmed = editingValue.trim()
    if (!trimmed) return
    startTransition(async () => {
      await updateCourseName(id, trimmed)
      setEditingId(null)
      setEditingValue('')
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteCourse(id)
    })
  }

  function handleAddCourse() {
    const name = newCourseName.trim()
    if (!name) return
    startTransition(async () => {
      await createCourse(name)
      setNewCourseName('')
      setShowAddForm(false)
    })
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => setShowAddForm((prev) => !prev)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {showAddForm && (
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
          <Input
            placeholder="Course name"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddCourse()
            }}
            disabled={isPending}
            className="max-w-sm"
          />
          <Button
            size="sm"
            onClick={handleAddCourse}
            className='cursor-pointer'
            disabled={isPending || !newCourseName.trim()}
          >
            Add
          </Button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 shadow-sm w-fit">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
              <TableHead className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100 align-top text-left text-sm uppercase tracking-wide border-r border-zinc-200 dark:border-zinc-700">Name</TableHead>
              <TableHead className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100 align-top text-center text-sm uppercase tracking-wide border-r border-zinc-200 dark:border-zinc-700">Available</TableHead>
              <TableHead className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100 align-top text-right text-sm uppercase tracking-wide border-r border-zinc-200 dark:border-zinc-700">Edit</TableHead>
              <TableHead className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100 align-top text-center text-sm uppercase tracking-wide">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow
                key={course.id}
                className={cn(
                  course.available
                    ? 'bg-green-50/50 dark:bg-green-950/20'
                    : '',
                  isPending ? 'opacity-60' : '',
                  'hover:bg-white dark:hover:bg-zinc-800/70'
                )}
              >
                <TableCell className="px-4 py-3 text-left font-medium text-zinc-900 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-700">
                  {editingId === course.id ? (
                    <Input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(course.id)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      disabled={isPending}
                      className="max-w-sm"
                    />
                  ) : (
                    course.name
                  )}
                </TableCell>
                <TableCell className="px-4 py-3 text-center border-r border-zinc-200 dark:border-zinc-700">
                  <Switch
                    checked={course.available}
                    onCheckedChange={() =>
                      handleToggleAvailable(course.id, course.available)
                    }
                    disabled={isPending}
                    className="cursor-pointer"
                  />
                </TableCell>
                <TableCell className="px-4 py-3 text-right border-r border-zinc-200 dark:border-zinc-700">
                  {editingId === course.id ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveEdit(course.id)}
                      disabled={isPending || !editingValue.trim()}
                      className="cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartEdit(course.id, course.name)}
                      disabled={isPending}
                      className="cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
                <TableCell className="px-4 py-3 text-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete course</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{course.name}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(course.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
            {courses.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-zinc-500 dark:text-zinc-400 py-10"
                >
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
