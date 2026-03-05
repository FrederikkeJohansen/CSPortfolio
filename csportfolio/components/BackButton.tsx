import Link from 'next/link'

export default function BackButton() {
    return (
        <Link
            href="/"
            className="inline-flex items-center gap-1 mt-2 text-xs xl:text-sm text-zinc-500 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
            </svg>
            All projects
        </Link>
    )
}
