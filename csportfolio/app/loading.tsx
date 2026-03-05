function Shimmer() {
    return (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.4s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/15" />
    )
}

function CardSkeleton() {
    return (
        <div className="h-[300px] md:h-[360px] xl:h-[400px] bg-indigo-100 dark:bg-zinc-900 rounded-xl overflow-hidden shadow flex flex-col">
            <div className="relative w-full h-36 md:h-44 xl:h-48 bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <Shimmer />
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
        </div>
    )
}

export default function Loading() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            {/* Navbar skeleton */}
            <nav className="w-full sticky top-0 z-50 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-sm">
                <div className="px-8 py-4 flex items-center justify-end md:justify-between">
                    <div className="hidden md:block h-4 w-72 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="flex gap-2">
                        <div className="h-9 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                </div>
            </nav>

            <main className="py-8 px-4 sm:px-8">
                {/* Featured carousel skeleton */}
                <div className="mb-6 flex gap-4 overflow-hidden -mx-4 sm:-mx-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="relative flex-none w-40 sm:w-48 md:w-56 aspect-square rounded-2xl bg-zinc-200 dark:bg-zinc-800 overflow-hidden"
                        >
                            <Shimmer />
                        </div>
                    ))}
                </div>

                {/* Hero skeleton */}
                <div className="flex flex-col items-center text-center sm:my-8 lg:my-20 gap-2">
                    <div className="h-8 md:h-10 lg:h-12 w-80 md:w-96 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-4 lg:h-5 w-64 md:w-80 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>

                {/* Project grid skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </main>
        </div>
    )
}
