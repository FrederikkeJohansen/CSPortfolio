"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import UploadModal from "@/components/UploadModal"


export default function Navbar() {
    const [uploadOpen, setUploadOpen] = useState(false)
    return (
        <>
            <nav className="bg-white dark:bg-zinc-900 shadow">
                <div className="p-8 flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-black dark:text-white">Something really cool, and maybe a logo?
                    </h1>
                    <div className="flex gap-2">
                        <Button variant="upload" onClick={() => setUploadOpen(true)} className="text-xs dark:active:text-indigo-300 font-semibold tracking-wide uppercase text-indigo-500 dark:text-indigo-300">Upload project</Button>
                        <Button variant="outline">Search</Button>
                    </div>
                </div>

            </nav>
            <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />

        </>
    );


}