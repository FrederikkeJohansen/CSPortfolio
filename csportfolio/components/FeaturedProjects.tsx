export default function FeaturedProjects() {
    return (
        <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Featured Projects</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                        key={i}
                        className="min-w-[200px] h-[200px] bg-zinc-200 dark:bg-zinc-700 rounded-2xl flex-shrink-0"
                    />
                ))}
            </div>
        </div>
    )
}