'use client'

import {
  createPassphrase,
  deletePassphrase,
  togglePassphraseActive,
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
import { useState, useTransition } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  passphrases: { id: string; value: string; active: boolean }[]
}

export function PassphrasesTab({ passphrases }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newValue, setNewValue] = useState('')

  function handleAdd() {
    const trimmed = newValue.trim()
    if (!trimmed) return
    startTransition(async () => {
      await createPassphrase(trimmed)
      setNewValue('')
      setShowAddForm(false)
    })
  }

  function handleToggleActive(id: string, currentValue: boolean) {
    startTransition(async () => {
      await togglePassphraseActive(id, !currentValue)
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
          className="cursor-pointer"
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
            className="cursor-pointer"
            onClick={handleAdd}
            disabled={isPending || !newValue.trim()}
          >
            Add
          </Button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 shadow-sm w-fit">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
              <TableHead className="min-w-[300px] px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100 align-top text-left text-sm uppercase tracking-wide border-r border-zinc-200 dark:border-zinc-700">Value</TableHead>
              <TableHead className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100 align-top text-center text-sm uppercase tracking-wide border-r border-zinc-200 dark:border-zinc-700">Active</TableHead>
              <TableHead className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100 align-top text-center text-sm uppercase tracking-wide">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {passphrases.map((passphrase) => (
              <TableRow
                key={passphrase.id}
                className={cn(
                  passphrase.active
                    ? 'bg-green-50/50 dark:bg-green-950/20'
                    : '',
                  isPending ? 'opacity-60' : '',
                  'hover:bg-white dark:hover:bg-zinc-800/70'
                )}
              >
                <TableCell className="px-4 py-3 text-left font-medium text-zinc-900 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-700">
                  {passphrase.value}
                </TableCell>
                <TableCell className="px-4 py-3 text-center border-r border-zinc-200 dark:border-zinc-700">
                  <Switch
                    checked={passphrase.active}
                    onCheckedChange={() => handleToggleActive(passphrase.id, passphrase.active)}
                    disabled={isPending}
                    className="cursor-pointer"
                  />
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
                </TableCell>
              </TableRow>
            ))}
            {passphrases.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-zinc-500 dark:text-zinc-400 py-10"
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
