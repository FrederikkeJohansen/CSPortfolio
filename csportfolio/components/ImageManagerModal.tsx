"use client"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { ImageEntry } from "@/types"

const MAX_IMAGES = 10
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

type Props = {
    open: boolean
    onClose: () => void
    images: ImageEntry[]
    primaryIndex: number
    onImagesChange: (images: ImageEntry[]) => void
    onPrimaryChange: (index: number) => void
}

export default function ImageManagerModal({
    open,
    onClose,
    images,
    primaryIndex,
    onImagesChange,
    onPrimaryChange,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState("")

    if (!open) return null

    const addFiles = (files: FileList | File[]) => {
        setError("")
        const fileArray = Array.from(files)
        const remaining = MAX_IMAGES - images.length
        if (remaining <= 0) {
            setError(`Maximum ${MAX_IMAGES} images allowed`)
            return
        }

        const validFiles: ImageEntry[] = []
        for (const file of fileArray.slice(0, remaining)) {
            if (!file.type.startsWith("image/")) continue
            if (file.size > MAX_FILE_SIZE) {
                setError("Each image must be under 5 MB")
                continue
            }
            validFiles.push({ file, preview: URL.createObjectURL(file) })
        }

        if (fileArray.length > remaining) {
            setError(`Only ${remaining} more image${remaining === 1 ? "" : "s"} allowed`)
        }

        if (validFiles.length > 0) {
            onImagesChange([...images, ...validFiles])
        }
    }

    const removeImage = (index: number) => {
        URL.revokeObjectURL(images[index].preview)
        const updated = images.filter((_, i) => i !== index)
        onImagesChange(updated)

        // Adjust primary index
        if (updated.length === 0) {
            onPrimaryChange(0)
        } else if (index === primaryIndex) {
            onPrimaryChange(0)
        } else if (index < primaryIndex) {
            onPrimaryChange(primaryIndex - 1)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative bg-zinc-50 dark:bg-zinc-900 rounded-md w-2/3 mx-4 max-h-[80vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-zinc-300 dark:border-zinc-700">
                    <h3 className="text-lg font-bold text-black dark:text-white">Project images</h3>
                    <button
                        onClick={onClose}
                        className="text-zinc-800 hover:text-black dark:text-zinc-400 dark:hover:text-white cursor-pointer text-lg"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto px-8 py-8 flex-1">
                    {error && (
                        <div className="mb-4 px-4 py-2 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                        Click the ★ to set the cover image. Max {MAX_IMAGES} images, 5 MB each.
                    </p>

                    {/* Image grid */}
                    <div
                        className={cn(
                            "flex flex-wrap gap-4 p-4 rounded-md border-2 border-dashed transition-colors min-h-[120px]",
                            isDragging
                                ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                                : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800"
                        )}
                        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={e => {
                            e.preventDefault()
                            setIsDragging(false)
                            addFiles(e.dataTransfer.files)
                        }}
                    >
                        {/* Existing images */}
                        {images.map((img, i) => (
                            <div
                                key={img.preview}
                                className="relative w-24 h-24 rounded-md overflow-hidden group"
                            >
                                <img
                                    src={img.preview}
                                    alt={`Image ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />

                                {/* Primary badge / click to set primary */}
                                <button
                                    type="button"
                                    onClick={() => onPrimaryChange(i)}
                                    className={cn(
                                        "absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-opacity",
                                        i === primaryIndex
                                            ? "bg-indigo-500 text-white opacity-100"
                                            : "bg-black/40 text-white opacity-0 group-hover:opacity-100"
                                    )}
                                    title={i === primaryIndex ? "Cover image" : "Set as cover image"}
                                >
                                    ★
                                </button>

                                {/* Delete button */}
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {/* Add tile */}
                        {images.length < MAX_IMAGES && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-24 h-24 rounded-md border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex flex-col items-center justify-center gap-1 text-zinc-400 dark:text-zinc-500 hover:border-indigo-400 hover:text-indigo-400 transition-colors cursor-pointer"
                            >
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                <span className="text-xs">Add</span>
                            </button>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={e => {
                                if (e.target.files) addFiles(e.target.files)
                                e.target.value = ""
                            }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end px-8 py-4 border-t border-zinc-300 dark:border-zinc-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-8 py-2 rounded-full text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}
