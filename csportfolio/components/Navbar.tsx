"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import UploadModal from "@/components/UploadModal"
import SearchBar from "@/components/SearchBar"

/** Sticky top navigation bar with upload button and search icon. */
export default function Navbar() {
    const [uploadOpen, setUploadOpen] = useState(false)
    return (
        <>

            <nav className="w-full sticky top-0 z-50 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-sm">
                <div className="px-8 py-4 flex items-center justify-end md:justify-between">
                    <p className="hidden md:block text-sm font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 select-none">
                        Student project portfolio - upload & explore
                    </p>
                    <div className="flex gap-2 items-center">
                        <Button variant="upload" onClick={() => setUploadOpen(true)} className="text-xs dark:active:text-indigo-300 font-semibold tracking-wide uppercase text-indigo-500 dark:text-indigo-300">Upload project</Button>
                        <SearchBar />
                    </div>
                </div>
            </nav>
            <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
        </>
    );
}