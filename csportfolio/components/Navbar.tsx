import { Button } from "@/components/ui/button"

export default function Navbar() {
    return (
        <nav className="bg-white dark:bg-zinc-900 shadow">
            <div className="p-8 flex items-center justify-between">
                <h1 className="text-4xl font-bold text-black dark:text-white">Something really cool, and maybe a logo?
                </h1>
                <div className="flex gap-2">
                    <Button variant="upload" className="text-xs dark:active:text-indigo-300 font-semibold tracking-wide uppercase text-indigo-500 dark:text-indigo-300">Upload projects</Button>
                    <Button variant="outline">Search</Button>
                </div>
            </div>

        </nav>
    );
}