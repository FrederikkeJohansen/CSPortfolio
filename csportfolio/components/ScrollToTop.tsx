"use client"

/** Small button at the bottom-right that smoothly scrolls back to the top of the page. */
export default function ScrollToTop() {
    return (
        <div className="flex justify-end p-2">
            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-10 h-10 rounded-full bg-transparent flex items-center justify-center cursor-pointer"
                aria-label="Scroll to top"
            >
                <svg
                    className="w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
            </button>
        </div>
    )
}
