'use client'

import {
  createPassphrase,
  updatePassphrase,
  deletePassphrase,
} from '@/app/admin/actions'
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

type Props = {
  passphrases: { id: string; value: string; active: boolean }[]
}

export function PassphrasesTab({ passphrases }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newValue, setNewValue] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')

  function handleAdd() {
    const trimmed = newValue.trim()
    if (!trimmed) return
    startTransition(async () => {
      await createPassphrase(trimmed)
      setNewValue('')
      setShowAddForm(false)
    })
  }

  function handleStartEdit(id: string, currentValue: string) {
    setEditingId(id)
    setEditingValue(currentValue)
  }

  function handleSaveEdit(id: string) {
    const trimmed = editingValue.trim()
    if (!trimmed) return
    startTransition(async () => {
      await updatePassphrase(id, trimmed)
      setEditingId(null)
      setEditingValue('')
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deletePassphrase(id)
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
          Add Passphrase
        </Button>
      </div>

      {showAddForm && (
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
          <Input
            placeholder="Passphrase value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
            }}
            disabled={isPending}
            className="max-w-sm"
          />
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={isPending || !newValue.trim()}
          >
            Add
          </Button>
        </div>
      )}

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[300px]">Value</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {passphrases.map((passphrase) => (
              <TableRow
                key={passphrase.id}
                className={`${
                  passphrase.active
                    ? 'bg-green-50/50 dark:bg-green-950/20'
                    : 'bg-red-50/50 dark:bg-red-950/20'
                } ${isPending ? 'opacity-60' : ''}`}
              >
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                  {editingId === passphrase.id ? (
                    <Input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(passphrase.id)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      disabled={isPending}
                      className="max-w-sm"
                    />
                  ) : (
                    passphrase.value
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      passphrase.active
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {passphrase.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {editingId === passphrase.id ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveEdit(passphrase.id)}
                        disabled={isPending || !editingValue.trim()}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleStartEdit(passphrase.id, passphrase.value)
                        }
                        disabled={isPending}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isPending}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete passphrase</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this passphrase? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(passphrase.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {passphrases.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-zinc-500 dark:text-zinc-400 py-8"
                >
                  No passphrases found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
