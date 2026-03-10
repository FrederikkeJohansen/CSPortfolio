"use client"

import { useRef, useEffect, useState } from "react"
import { useSearch } from "@/providers/SearchProvider"
import { getProjects } from "@/lib/queries"
import { Project } from "@/types"
import ProjectCard from "@/components/ProjectCard"

type Props = {
    projects?: Project[]
}

export default function SearchModal({ projects: propProjects }: Props) {
    const { isSearchOpen, searchQuery, setSearchQuery, closeSearch } = useSearch()
    const inputRef = useRef<HTMLInputElement>(null)
    const [fetchedProjects, setFetchedProjects] = useState<Project[] | null>(null)

    const projects = propProjects ?? fetchedProjects ?? []

    // Fetch projects if not provided via props (e.g. on detail pages)
    useEffect(() => {
        if (!isSearchOpen || propProjects) return
        if (fetchedProjects) return

        const fetchData = async () => {
            const data = await getProjects()
            if (data.length > 0) setFetchedProjects(data)
        }
        fetchData()
    }, [isSearchOpen, propProjects, fetchedProjects])

    // Focus input when modal opens
    useEffect(() => {
        if (isSearchOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isSearchOpen])

    // Close on Escape
    useEffect(() => {
        if (!isSearchOpen) return
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeSearch()
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isSearchOpen, closeSearch])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isSearchOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => { document.body.style.overflow = "" }
    }, [isSearchOpen])

    if (!isSearchOpen) return null

    const query = searchQuery.toLowerCase().trim()
    const filteredProjects = !query
        ? projects
        : projects.filter(project => {
            const title = project.title?.toLowerCase() ?? ""
            const description = project.description?.toLowerCase() ?? ""
            const creators = project.student_creators?.toLowerCase() ?? ""
            const courseName = project.courses?.name?.toLowerCase() ?? ""
            const year = String(project.year ?? "")
            const keywords = project.keywords ?? []

            return (
                title.includes(query) ||
                description.includes(query) ||
                creators.includes(query) ||
                courseName.includes(query) ||
                year.includes(query) ||
                keywords.some(kw => kw.toLowerCase().includes(query))
            )
        })

    return (
        <div className="fixed inset-0 z-50 bg-zinc-50 dark:bg-zinc-900 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-sm">
                <div className="p-8 flex items-center gap-4">
                    {/* Close button */}
                    <button
                        type="button"
                        onClick={closeSearch}
                        className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>

                    {/* Search input */}
                    <div className="flex-1 flex items-center gap-3 rounded-full border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-colors">
                        <svg
                            className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0"
                            viewBox="0 0 32 32"
                            fill="currentColor"
                        >
                            <path d="M13.46 24.45c-6.29 0-11.389-5.01-11.389-11.2 0-6.19 5.099-11.21 11.389-11.21 6.29 0 11.39 5.02 11.39 11.21 0 6.19-5.1 11.2-11.39 11.2zm18.228 5.8l-8.259-8.13c2.162-2.35 3.491-5.45 3.491-8.87C26.92 5.93 20.894 0 13.46 0 6.026 0 0 5.93 0 13.25c0 7.31 6.026 13.24 13.46 13.24 3.212 0 6.158-1.11 8.472-2.96l8.292 8.16c.405.4 1.06.4 1.464 0 .405-.39.405-1.04 0-1.44z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search by title, keyword, course, creator, year..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="flex-1 h-12 font-normal bg-transparent text-lg text-zinc-800 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-400 outline-none"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery("")
                                    inputRef.current?.focus()
                                }}
                                className="text-zinc-400 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="px-4 sm:px-8 py-8">

                {filteredProjects.length === 0 && query && (
                    <p className="text-center text-zinc-400 dark:text-white text-sm mt-20">
                        No projects found for &ldquo;{searchQuery}&rdquo;
                    </p>
                )}

                {filteredProjects.length > 0 && (
                    <>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                            {query
                                ? `${filteredProjects.length} ${filteredProjects.length === 1 ? "project" : "projects"} found`
                                : `All projects (${filteredProjects.length})`
                            }
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                            {filteredProjects.map(project => (
                                <div key={project.id} onClick={closeSearch}>
                                    <ProjectCard project={project} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
