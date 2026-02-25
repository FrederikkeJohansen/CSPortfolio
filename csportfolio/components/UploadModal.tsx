"use client"

type Props = {
    open: boolean
    onClose: () => void
}

export default function UploadModal({ open, onClose }: Props) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            {/* Modal panel */}
            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl p-8 w-full max-w-lg mx-4">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                <h2 className="text-xl font-bold">Upload project</h2>
                <p className="text-sm text-gray-500 mt-1">Form coming soon</p>
            </div>
        </div>
    )
}