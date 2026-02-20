import { Button } from "@/components/ui/button"

export default function Navbar() {
    return (
        <nav className="bg-white dark:bg-zinc-900 shadow">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-black dark:text-white">CS Portfolio</h1>
                <div>
                    <a
                        href="#"
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
                    >
                        Home
                    </a>
                    <Button variant="outline">Button</Button>
                </div>
            </div>
        </nav>
    );
}