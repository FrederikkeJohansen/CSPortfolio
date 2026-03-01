"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { Course, Filter, ImageEntry, UploadFormData } from "@/types"
import ImageManagerModal from "./ImageManagerModal"

type Props = {
    open: boolean
    onClose: () => void
}

const initialFormData: UploadFormData = {
    title: "",
    description: "",
    year: "",
    video_url: "",
    poster_file: null,
    student_creators: "",
    course_id: "",
    selected_filters: [],
    image_files: [],
    primary_image_index: 0,
    student_name: "",
    student_email: "",
    student_number: "",
    passphrase: "",
    consent: false,
}

export default function UploadModal({ open, onClose }: Props) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<UploadFormData>(initialFormData)
    const [courses, setCourses] = useState<Course[]>([])
    const [filters, setFilters] = useState<Filter[]>([])
    const [courseSearch, setCourseSearch] = useState("")
    const [courseDropdownOpen, setCourseDropdownOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [posterLoading, setPosterLoading] = useState(false)
    const [imageModalOpen, setImageModalOpen] = useState(false)
    const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set())
    const courseRef = useRef<HTMLDivElement>(null)
    const courseListRef = useRef<HTMLUListElement>(null)
    const posterInputRef = useRef<HTMLInputElement>(null)
    const errorRef = useRef<HTMLDivElement>(null)

    // Fetch courses and filters when modal opens
    useEffect(() => {
        if (!open) return
        const fetchData = async () => {
            const [coursesRes, filtersRes] = await Promise.all([
                supabase.from("courses").select("id, name").order("name"),
                supabase.from("filters").select("id, type, value").order("type"),
            ])
            if (coursesRes.data) setCourses(coursesRes.data)
            if (filtersRes.data) setFilters(filtersRes.data)
        }
        fetchData()
    }, [open])

    // Close course dropdown on outside click
    useEffect(() => {
        if (!courseDropdownOpen) return
        const handleClick = (e: PointerEvent) => {
            if (courseRef.current && !courseRef.current.contains(e.target as Node)) {
                setCourseDropdownOpen(false)
            }
        }
        document.addEventListener("pointerdown", handleClick)
        return () => document.removeEventListener("pointerdown", handleClick)
    }, [courseDropdownOpen])

    // Scroll highlighted item into view
    useEffect(() => {
        if (highlightedIndex < 0 || !courseListRef.current) return
        const item = courseListRef.current.children[highlightedIndex] as HTMLElement
        item?.scrollIntoView({ block: "nearest" })
    }, [highlightedIndex])

    // Scroll to error when it appears
    useEffect(() => {
        if (error) errorRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, [error])

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setStep(1)
            setFormData(prev => {
                prev.image_files.forEach(img => URL.revokeObjectURL(img.preview))
                return initialFormData
            })
            setCourseSearch("")
            setHighlightedIndex(-1)
            setError("")
            setSuccess(false)
            setImageModalOpen(false)
            setInvalidFields(new Set())
        }
    }, [open])

    const update = (field: keyof UploadFormData, value: UploadFormData[keyof UploadFormData]) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const toggleFilter = (filterId: string) => {
        setFormData(prev => ({
            ...prev,
            selected_filters: prev.selected_filters.includes(filterId)
                ? prev.selected_filters.filter(id => id !== filterId)
                : [...prev.selected_filters, filterId],
        }))
    }

    const selectedCourse = courses.find(c => c.id === formData.course_id)
    const filteredCourses = courses.filter(c =>
        c.name.toLowerCase().includes(courseSearch.toLowerCase())
    )
    const filtersByType = filters.reduce<Record<string, Filter[]>>((acc, f) => {
        if (!acc[f.type]) acc[f.type] = []
        acc[f.type].push(f)
        return acc
    }, {})

    // --- Validation ---
    const formatErrorList = (parts: string[]) => {
        if (parts.length === 1) return `Please enter ${parts[0]}`
        if (parts.length === 2) return `Please enter ${parts[0]} and ${parts[1]}`
        return `Please enter ${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`
    }

    const validateStep1 = (): { error: string | null; fields: Set<string> } => {
        const fields = new Set<string>()
        const parts: string[] = []
        if (!formData.title.trim()) { fields.add("title"); parts.push("title") }
        if (!formData.description.trim()) { fields.add("description"); parts.push("description") }
        const year = parseInt(formData.year)
        if (!formData.year || isNaN(year) || year < 1900 || year > 2200) { fields.add("year"); parts.push("a valid year") }
        if (!formData.course_id) { fields.add("course_id"); parts.push("a course") }
        if (formData.image_files.length === 0) { fields.add("image_files"); parts.push("at least one image") }
        if (parts.length === 0) return { error: null, fields: new Set() }
        return { error: formatErrorList(parts), fields }
    }

    const validateStep2 = (): { error: string | null; fields: Set<string> } => {
        const fields = new Set<string>()
        const parts: string[] = []
        if (!formData.student_name.trim()) { fields.add("student_name"); parts.push("name") }
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        if (!emailRegex.test(formData.student_email.trim())) { fields.add("student_email"); parts.push("a valid email") }
        const num = formData.student_number.trim()
        const validNumber = /^\d{9}$/.test(num) || /^[Aa][Uu]\d{6}$/.test(num)
        if (!validNumber) { fields.add("student_number"); parts.push("a valid student number") }
        if (parts.length === 0) return { error: null, fields: new Set() }
        return { error: formatErrorList(parts), fields }
    }

    const handleNext = () => {
        setError("")
        setInvalidFields(new Set())
        if (step === 1) {
            const { error: err, fields } = validateStep1()
            if (err) { setError(err); setInvalidFields(fields); return }
        }
        if (step === 2) {
            const { error: err, fields } = validateStep2()
            if (err) { setError(err); setInvalidFields(fields); return }
        }
        setStep(prev => prev + 1)
    }

    const handleSubmit = async () => {
        setError("")
        if (!formData.consent) { setError("You must accept the consent to proceed"); return }
        if (!formData.passphrase.trim()) { setError("Passphrase is required"); return }

        setSubmitting(true)
        try {
            // 1. Validate passphrase
            const { data: passphraseMatch } = await supabase
                .from("passphrase")
                .select("id")
                .eq("value", formData.passphrase.trim())
                .eq("active", true)
                .limit(1)

            if (!passphraseMatch || passphraseMatch.length === 0) {
                setError("Invalid passphrase")
                setSubmitting(false)
                return
            }

            // 2. Upload poster if provided
            let posterUrl: string | null = null
            if (formData.poster_file) {
                const fileExt = formData.poster_file.name.split(".").pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
                const { error: uploadError } = await supabase.storage
                    .from("poster")
                    .upload(fileName, formData.poster_file)

                if (uploadError) throw new Error("Failed to upload poster: " + uploadError.message)

                const { data: urlData } = supabase.storage.from("poster").getPublicUrl(fileName)
                posterUrl = urlData.publicUrl
            }

            // 3. Insert project
            const { data: project, error: insertError } = await supabase
                .from("projects")
                .insert({
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                    year: parseInt(formData.year),
                    video_url: formData.video_url.trim() || null,
                    poster_url: posterUrl,
                    student_creators: formData.student_creators.trim() || null,
                    course_id: formData.course_id,
                    student_name: formData.student_name.trim(),
                    student_email: formData.student_email.trim(),
                    student_number: formData.student_number.trim(),
                    visible: false,
                })
                .select("id")
                .single()

            if (insertError) throw new Error("Failed to submit project: " + insertError.message)

            // 4. Link filters
            if (formData.selected_filters.length > 0 && project) {
                const filterRows = formData.selected_filters.map(filterId => ({
                    project_id: project.id,
                    filter_id: filterId,
                }))
                const { error: filterError } = await supabase
                    .from("project_filters")
                    .insert(filterRows)

                if (filterError) throw new Error("Failed to link filters: " + filterError.message)
            }

            // 5. Upload images
            if (formData.image_files.length > 0 && project) {
                const imageRows = []
                for (let i = 0; i < formData.image_files.length; i++) {
                    const img = formData.image_files[i]
                    const fileExt = img.file.name.split(".").pop()
                    const fileName = `${project.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
                    const { error: imgUploadError } = await supabase.storage
                        .from("project-images")
                        .upload(fileName, img.file)

                    if (imgUploadError) throw new Error("Failed to upload image: " + imgUploadError.message)

                    const { data: imgUrlData } = supabase.storage.from("project-images").getPublicUrl(fileName)

                    // Primary image gets display_order 0, rest follow
                    const order = i === formData.primary_image_index ? 0 : (i < formData.primary_image_index ? i + 1 : i)
                    imageRows.push({
                        project_id: project.id,
                        image_url: imgUrlData.publicUrl,
                        display_order: order,
                    })
                }

                const { error: imgInsertError } = await supabase
                    .from("project_images")
                    .insert(imageRows)

                if (imgInsertError) throw new Error("Failed to save image records: " + imgInsertError.message)
            }

            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    if (!open) return null

    // --- Success screen ---
    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <div className="relative bg-indigo-50 dark:bg-zinc-900 rounded-2xl p-8 w-full max-w-lg mx-4 text-center">
                    <h2 className="text-xl font-bold mb-2">Project submitted!</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Your project has been submitted for review. An admin will approve it shortly.
                    </p>
                    <button
                        onClick={onClose}
                        className="bg-indigo-500 text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-indigo-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        )
    }

    // --- Label helper ---
    const labelClass = "text-xs font-semibold uppercase tracking-wide text-black dark:text-zinc-300"
    const inputClass = " border border-zinc-300 dark:border-zinc-600 rounded-sm tracking-wide px-3 py-2 text-sm bg-white dark:bg-zinc-800 dark:text-white"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative bg-zinc-50 dark:bg-zinc-900 rounded-md w-2/3 mx-4 max-h-[90vh] flex flex-col">

                {/* Sticky header */}
                <div className="sticky z-10 bg-zinc-50 dark:bg-zinc-900 rounded-t-md">
                    <button onClick={onClose} className="absolute right-4 text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer text-lg">✕</button>
                    <h2 className="pt-4 text-center text-xl text-indigo-500 font-bold tracking-wide uppercase mb-3">Upload Project</h2>
                    <hr className="border-zinc-300 dark:border-zinc-700" />

                    {/* Step segments */}
                    <div className="flex justify-center items-center tracking-wide ">
                        {[
                            { n: 1, label: "Project details" },
                            { n: 2, label: "Student info" },
                            { n: 3, label: "Submit" },
                        ].map(({ n, label }) => (
                            <div
                                key={n}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm transition-colors",
                                    n === 1 && "rounded-l-md",
                                    n === 3 ? "rounded-r-md" : "border-r border-zinc-300 dark:border-zinc-700",
                                    n === step
                                        ? " text-indigo-500 font-bold"
                                        : n < step
                                            ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-400"
                                            : " text-zinc-400 dark:text-zinc-500"
                                )}
                            >
                                <span className={cn(
                                    "size-5 rounded-sm flex items-center justify-center text-sm shrink-0",
                                    n === step ? "bg-white/20" : "bg-transparent"
                                )}>
                                    {n}
                                </span>
                                {label}
                            </div>
                        ))}
                    </div>
                    <hr className="border-zinc-300 dark:border-zinc-700" />
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto px-8 pb-8 flex-1">

                    {/* Error message */}
                    {error && (
                        <div ref={errorRef} className="mt-4 px-4 py-2 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* --- Step 1: Project Details --- */}
                    {step === 1 && (
                        <div className="">
                            <h2 className="text-lg font-bold text-black dark:text-white pt-4">Project details</h2>
                            <div className="flex flex-col gap-6 ">
                                <div className="flex flex-col gap-1">
                                    <label className={cn(labelClass, invalidFields.has("title") && "text-red-500")}>Title <span className="text-red-500 text-base">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Project title"
                                        value={formData.title}
                                        onChange={e => update("title", e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className={cn(labelClass, invalidFields.has("description") && "text-red-500")}>Description <span className="text-red-500 text-base">*</span></label>
                                    <textarea
                                        rows={8}
                                        placeholder="Description of the project"
                                        value={formData.description}
                                        onChange={e => update("description", e.target.value)}
                                        className={cn(inputClass, "resize-none")}
                                    />
                                </div>

                                {/* Course search dropdown */}
                                <div className="flex flex-col gap-1" ref={courseRef}>
                                    <label className={cn(labelClass, invalidFields.has("course_id") && "text-red-500")}>Course <span className="text-red-500 text-base">*</span></label>
                                    {selectedCourse ? (
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-medium border-2 border-indigo-500 dark:border-indigo-400  dark:text-white text-sm">
                                                {selectedCourse.name}
                                                <button
                                                    type="button"
                                                    onClick={() => { update("course_id", ""); setCourseSearch("") }}
                                                    className="ml-1 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Course name"
                                                value={courseSearch}
                                                onChange={e => {
                                                    setCourseSearch(e.target.value)
                                                    setCourseDropdownOpen(true)
                                                    setHighlightedIndex(-1)
                                                }}
                                                onFocus={() => setCourseDropdownOpen(true)}
                                                onKeyDown={e => {
                                                    if (!courseDropdownOpen || filteredCourses.length === 0) return
                                                    if (e.key === "ArrowDown") {
                                                        e.preventDefault()
                                                        setHighlightedIndex(i => Math.min(i + 1, filteredCourses.length - 1))
                                                    } else if (e.key === "ArrowUp") {
                                                        e.preventDefault()
                                                        setHighlightedIndex(i => Math.max(i - 1, 0))
                                                    } else if (e.key === "Enter" && highlightedIndex >= 0) {
                                                        e.preventDefault()
                                                        const course = filteredCourses[highlightedIndex]
                                                        update("course_id", course.id)
                                                        setCourseSearch(course.name)
                                                        setCourseDropdownOpen(false)
                                                        setHighlightedIndex(-1)
                                                    } else if (e.key === "Escape") {
                                                        setCourseDropdownOpen(false)
                                                        setHighlightedIndex(-1)
                                                    }
                                                }}
                                                className={inputClass + " w-full"}
                                            />
                                            {courseDropdownOpen && filteredCourses.length > 0 && (
                                                <ul ref={courseListRef} className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                                    {filteredCourses.map((c, i) => (
                                                        <li key={c.id}>
                                                            <button
                                                                type="button"
                                                                className={cn(
                                                                    "w-full text-left px-3 py-2 text-sm dark:text-white",
                                                                    i === highlightedIndex
                                                                        ? "bg-indigo-50 dark:bg-zinc-700"
                                                                        : "hover:bg-indigo-50 dark:hover:bg-zinc-700"
                                                                )}
                                                                onClick={() => {
                                                                    update("course_id", c.id)
                                                                    setCourseSearch(c.name)
                                                                    setCourseDropdownOpen(false)
                                                                    setHighlightedIndex(-1)
                                                                }}
                                                            >
                                                                {c.name}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className={cn(labelClass, invalidFields.has("year") && "text-red-500")}>Year <span className="text-red-500 text-base">*</span></label>
                                    <input
                                        type="number"
                                        placeholder={String(new Date().getFullYear())}
                                        min={1990}
                                        max={2300}
                                        value={formData.year}
                                        onChange={e => update("year", e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className={labelClass}>Video URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/video"
                                        value={formData.video_url}
                                        onChange={e => update("video_url", e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                {/* --- Images section --- */}
                                <div className="flex flex-col gap-1">
                                    <label className={cn(labelClass, invalidFields.has("image_files") && "text-red-500")}>Images <span className="text-red-500 text-base">*</span></label>
                                    <div className={cn("flex items-center gap-4", formData.image_files.length === 0 && "bg-white dark:bg-zinc-800")}>
                                        {/* Thumbnail previews (max 4 visible) */}
                                        {formData.image_files.slice(0, 4).map((img, i) => (
                                            <button
                                                key={img.preview}
                                                type="button"
                                                onClick={() => setImageModalOpen(true)}
                                                className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 group"
                                            >
                                                <img src={img.preview} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                                                {i === formData.primary_image_index && (
                                                    <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">★</span>
                                                )}
                                                {/* Overflow indicator on 4th thumbnail */}
                                                {i === 3 && formData.image_files.length > 4 && (
                                                    <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-3xl font-medium">
                                                        +{formData.image_files.length - 4}
                                                    </span>
                                                )}
                                            </button>
                                        ))}

                                        {/* Add / manage button */}
                                        <button
                                            type="button"
                                            onClick={() => setImageModalOpen(true)}
                                            className={cn(
                                                "group rounded-md border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex flex-col items-center justify-center gap-1 hover:border-indigo-400 transition-colors cursor-pointer",
                                                formData.image_files.length === 0 ? "w-full py-8" : "w-20 h-20 shrink-0"
                                            )}
                                        >
                                            <svg
                                                className="w-10 h-10 stroke-zinc-400 dark:stroke-zinc-500 group-hover:stroke-indigo-400 transition-colors"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                strokeWidth={1.5}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M3 9V5a2 2 0 0 1 2-2h9M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9" />
                                                <path d="M5 16l4-4 3 3 3-3 5 5" />
                                                <circle cx="9" cy="7" r="1.5" />
                                                <path d="M18.5 2.5v5" />
                                                <path d="M16 5h5" />
                                            </svg>
                                            <span className="text-sm text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-400 transition-colors">
                                                {formData.image_files.length === 0 ? "Add images" : ""}
                                            </span>
                                        </button>
                                    </div>

                                    {formData.image_files.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setImageModalOpen(true)}
                                            className="text-xs text-indigo-500 dark:text-indigo-400 hover:underline mt-1 self-start"
                                        >
                                            Manage images ({formData.image_files.length})
                                        </button>
                                    )}
                                </div>

                                <ImageManagerModal
                                    open={imageModalOpen}
                                    onClose={() => setImageModalOpen(false)}
                                    images={formData.image_files}
                                    primaryIndex={formData.primary_image_index}
                                    onImagesChange={(images: ImageEntry[]) => update("image_files", images)}
                                    onPrimaryChange={(index: number) => update("primary_image_index", index)}
                                />

                                <div className="flex flex-col gap-1">
                                    <label className={labelClass}>Poster</label>

                                    {/* Drop zone */}
                                    <div
                                        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={e => {
                                            e.preventDefault()
                                            setIsDragging(false)
                                            const file = e.dataTransfer.files[0]
                                            const isValid = file && (file.type.startsWith("image/") || file.type === "application/pdf")
                                            if (isValid && file.size > 10 * 1024 * 1024) {
                                                setError("File must be under 10 MB")
                                            } else if (isValid) {
                                                setError("")
                                                setPosterLoading(true)
                                                update("poster_file", file)
                                                setTimeout(() => setPosterLoading(false), 600)
                                            }
                                        }}
                                        onClick={() => posterInputRef.current?.click()}
                                        className={cn(
                                            "group border-2 border-dashed rounded-md py-8 flex flex-col items-center justify-center gap-1 bg-white dark:bg-zinc-800 transition-colors cursor-pointer",
                                            isDragging
                                                ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                                                : "border-zinc-300 dark:border-zinc-600 hover:border-indigo-400"
                                        )}
                                    >
                                        {posterLoading ? (
                                            <svg className="animate-spin h-6 w-6 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                        ) : (
                                            <>
                                                <svg
                                                    className="w-12 h-12 stroke-zinc-400 dark:stroke-zinc-500 group-hover:stroke-indigo-400 transition-colors"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    strokeWidth={1.5}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                                                    <path d="M14 3v5h5" />
                                                    <path d="M12 17V10" />
                                                    <path d="M9.5 12.5L12 10l2.5 2.5" />
                                                </svg>
                                                <span className="text-sm text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-400 transition-colors">
                                                    Add poster or drag and drop
                                                </span>
                                                <span className="text-xs text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-400 transition-colors">
                                                    1 poster per project, max 10 MB, image or PDF
                                                </span>
                                            </>
                                        )}
                                        <input
                                            ref={posterInputRef}
                                            type="file"
                                            accept="image/*,application/pdf"
                                            className="hidden"
                                            onChange={e => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    if (file.size > 10 * 1024 * 1024) {
                                                        setError("File must be under 10 MB")
                                                        e.target.value = ""
                                                        return
                                                    }
                                                    setError("")
                                                    setPosterLoading(true)
                                                    update("poster_file", file)
                                                    setTimeout(() => setPosterLoading(false), 600)
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Selected file */}
                                    {!posterLoading && formData.poster_file && (
                                        <div className="flex items-center justify-between px-3 py-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-700 dark:text-zinc-300">
                                            <span className="truncate">{formData.poster_file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => update("poster_file", null)}
                                                className="ml-2 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 shrink-0 cursor-pointer"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className={labelClass}>Creators</label>
                                    <input
                                        type="text"
                                        placeholder="Name of creator(s) or group"
                                        value={formData.student_creators}
                                        onChange={e => update("student_creators", e.target.value)}
                                        className={inputClass}
                                    />
                                </div>


                                {/* Filters grouped by type */}
                                {Object.keys(filtersByType).length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <label className={labelClass}>Filters</label>
                                        {Object.entries(filtersByType).map(([type, typeFilters]) => (
                                            <div key={type}>
                                                <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 mb-1">{type}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {typeFilters.map(f => {
                                                        const isChecked = formData.selected_filters.includes(f.id)
                                                        return (
                                                            <label
                                                                key={f.id}
                                                                className={cn(
                                                                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs cursor-pointer border transition-colors",
                                                                    isChecked
                                                                        ? "bg-indigo-500 text-white border-indigo-500"
                                                                        : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border-gray-300 dark:border-zinc-600 hover:border-indigo-400"
                                                                )}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => toggleFilter(f.id)}
                                                                    className="sr-only"
                                                                />
                                                                {f.value}
                                                            </label>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- Step 2: Student Info --- */}
                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <h2 className="text-lg font-bold dark:text-white">Student information </h2>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 -mt-2">This information is for admin purposes only and will not be displayed publicly.</p>

                            <div className="flex flex-col gap-1">
                                <label className={cn(labelClass, invalidFields.has("student_name") && "text-red-500")}>Name <span className="text-red-500 text-base">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    value={formData.student_name}
                                    onChange={e => update("student_name", e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className={cn(labelClass, invalidFields.has("student_email") && "text-red-500")}>Email <span className="text-red-500 text-base">*</span></label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.student_email}
                                    onChange={e => update("student_email", e.target.value)}
                                    className={inputClass}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className={cn(labelClass, invalidFields.has("student_number") && "text-red-500")}>Student number <span className="text-red-500 text-base">*</span></label>
                                <input
                                    type="text"
                                    placeholder="123456789 or AU123456"
                                    value={formData.student_number}
                                    onChange={e => update("student_number", e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    )}

                    {/* --- Step 3: Consent & Passphrase --- */}
                    {step === 3 && (
                        <div className="flex flex-col gap-4">
                            <h2 className="text-lg font-bold dark:text-white">Consent & submit</h2>

                            <div className="flex items-start gap-3 p-4 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                                <input
                                    type="checkbox"
                                    id="consent"
                                    checked={formData.consent}
                                    onChange={e => update("consent", e.target.checked)}
                                    className="mt-1 accent-indigo-500"
                                />
                                <label htmlFor="consent" className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">
                                    I confirm that this submission does not contain sensitive personal data or confidential information. I consent to the storage and public display of the project on the CS Portfolio platform and acknowledge my responsibility for ensuring compliance with applicable data protection regulations, including the GDPR.

                                    <p className=" mt-2 italic">In practice, this means that your submission should not include identifiable images of individuals, personal information (such as names, emails, phone numbers), or any confidential material. If you are unsure whether your project contains personal data, please contact the platform administrators before submitting.</p>
                                    <p className="mt-2">
                                        <a
                                            href="https://www.datatilsynet.dk/regler-og-vejledning/gdpr-univers-for-smaa-virksomheder/grundlaeggende-om-gdpr"
                                            className="text-black dark:text-white hover:text-indigo-600 underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Read about data handling & privacy policy
                                        </a>
                                    </p>
                                </label>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className={labelClass}>Passphrase <span className="text-red-500 text-base">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Enter the passphrase"
                                    value={formData.passphrase}
                                    onChange={e => update("passphrase", e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex justify-between mt-6">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={() => { setStep(prev => prev - 1); setError("") }}
                                className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-zinc-300 border border-gray-300 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Back
                            </button>
                        ) : <div />}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-5 py-2 rounded-full text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors cursor-pointer"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting || !formData.consent || !formData.passphrase.trim()}
                                className={cn(
                                    "px-5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer",
                                    formData.consent && formData.passphrase.trim() && !submitting
                                        ? "bg-indigo-500 text-white hover:bg-indigo-600 "
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                )}
                            >
                                {submitting ? "Submitting..." : "Submit project"}
                            </button>
                        )}
                    </div>
                </div>{/* end scrollable content */}
            </div>{/* end modal panel */}
        </div>
    )
}
