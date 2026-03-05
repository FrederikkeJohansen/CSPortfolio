'use client'

import { Course } from '@/types'
import { toggleCourseAvailable, createCourse } from '@/app/admin/actions'
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
import { useState, useTransition } from 'react'
import { Plus } from 'lucide-react'

type Props = {
  courses: Course[]
}

export function CoursesTab({ courses }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCourseName, setNewCourseName] = useState('')

  function handleToggleAvailable(id: string, currentValue: boolean) {
    startTransition(async () => {
      await toggleCourseAvailable(id, !currentValue)
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
            disabled={isPending || !newCourseName.trim()}
          >
            Add
          </Button>
        </div>
      )}

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[300px]">Name</TableHead>
              <TableHead className="text-center">Available</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow
                key={course.id}
                className={`${
                  course.available
                    ? 'bg-green-50/50 dark:bg-green-950/20'
                    : 'bg-red-50/50 dark:bg-red-950/20'
                } ${isPending ? 'opacity-60' : ''}`}
              >
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                  {course.name}
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={course.available}
                    onCheckedChange={() =>
                      handleToggleAvailable(course.id, course.available)
                    }
                    disabled={isPending}
                  />
                </TableCell>
              </TableRow>
            ))}
            {courses.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center text-zinc-500 dark:text-zinc-400 py-8"
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
