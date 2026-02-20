export default function ProjectGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6"
                >
                    <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-700 rounded-lg mb-4" />
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded mb-2 w-3/4" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded mb-3 w-1/2" />
                    <div className="h-16 bg-zinc-200 dark:bg-zinc-700 rounded mb-3" />
                </div>
            ))}
        </div>
    )
}