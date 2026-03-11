/** Hero banner with tagline and subtitle, displayed above the project grid. */
export default function Hero() {
    return (
        <div className="flex flex-col items-center text-center sm:my-8 lg:my-12">
            <h1 className="text-2xl md:text-3xl lg:text-5xl text-black dark:text-white font-bold tracking-wide">
                Innovate. Create. Inspire
            </h1>
            <p className="text-sm md:text-sm lg:text-lg font-normal text-zinc-800 dark:text-zinc-300">
                Explore student projects from Department of Computer Science at Aarhus University
            </p>
        </div>
    )
}