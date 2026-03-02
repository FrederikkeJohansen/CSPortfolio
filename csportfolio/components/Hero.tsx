import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"], weight: ["900"] })

export default function Hero() {
    return (
        <div className="flex flex-col items-center text-center sm:my-8 lg:my-20">
            <h1 className="text-2xl md:text-3xl lg:text-5xl text-black dark:text-white text-black font-bold tracking-wide">Innovate. Create. Inspire</h1>
            <p className="text-sm md:text-sm lg:text-lg font-normal text-zinc-800 dark:text-zinc-300">
                Explore student projects from Department of Computer Science at Aarhus University
            </p>
        </div>
    )
}