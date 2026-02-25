"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { Course, Filter, UploadFormData } from "@/types"

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
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const courseRef = useRef<HTMLDivElement>(null)

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

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setStep(1)
            setFormData(initialFormData)
            setCourseSearch("")
            setError("")
            setSuccess(false)
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
    const validateStep1 = () => {
        if (!formData.title.trim()) return "Title is required"
        if (!formData.description.trim()) return "Description is required"
        const year = parseInt(formData.year)
        if (!formData.year || isNaN(year) || year < 1990 || year > 2300) return "Year must be between 1990 and 2300"
        if (!formData.course_id) return "Please select a course"
        return null
    }

    const validateStep2 = () => {
        if (!formData.student_name.trim()) return "Student name is required"
        if (!formData.student_email.trim() || !formData.student_email.includes("@")) return "Valid email is required"
        const num = formData.student_number.trim()
        const validNumber = /^\d{9}$/.test(num) || /^[Aa][Uu]\d{6}$/.test(num)
        if (!validNumber) return "Student number must be 9 digits or AU followed by 6 digits"
        return null
    }

    const handleNext = () => {
        setError("")
        if (step === 1) {
            const err = validateStep1()
            if (err) { setError(err); return }
        }
        if (step === 2) {
            const err = validateStep2()
            if (err) { setError(err); return }
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
    const inputClass = "border border-gray-300 dark:border-zinc-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800 dark:text-white"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-indigo-50 dark:bg-zinc-900 rounded-2xl p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer text-lg">✕</button>

                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-6">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={cn(
                                "size-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                                s <= step
                                    ? "bg-indigo-500 text-white"
                                    : "bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-zinc-400"
                            )}>
                                {s}
                            </div>
                            {s < 3 && <div className={cn("w-8 h-0.5", s < step ? "bg-indigo-500" : "bg-gray-200 dark:bg-zinc-700")} />}
                        </div>
                    ))}
                    <span className="ml-2 text-xs text-gray-500 dark:text-zinc-400">
                        {step === 1 ? "Project details" : step === 2 ? "Student info" : "Submit"}
                    </span>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 px-3 py-2 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* --- Step 1: Project Details --- */}
                {step === 1 && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-bold dark:text-white">Project details</h2>

                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Title *</label>
                            <input
                                type="text"
                                placeholder="Project title"
                                value={formData.title}
                                onChange={e => update("title", e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Description *</label>
                            <textarea
                                rows={3}
                                placeholder="Short description of the project"
                                value={formData.description}
                                onChange={e => update("description", e.target.value)}
                                className={cn(inputClass, "resize-none")}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Year *</label>
                            <input
                                type="number"
                                placeholder="2024"
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

                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Poster image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => update("poster_file", e.target.files?.[0] ?? null)}
                                className="text-sm dark:text-zinc-300"
                            />
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

                        {/* Course search dropdown */}
                        <div className="flex flex-col gap-1" ref={courseRef}>
                            <label className={labelClass}>Course *</label>
                            {selectedCourse ? (
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
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
                                        placeholder="Search for a course..."
                                        value={courseSearch}
                                        onChange={e => { setCourseSearch(e.target.value); setCourseDropdownOpen(true) }}
                                        onFocus={() => setCourseDropdownOpen(true)}
                                        className={inputClass + " w-full"}
                                    />
                                    {courseDropdownOpen && filteredCourses.length > 0 && (
                                        <ul className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                            {filteredCourses.map(c => (
                                                <li key={c.id}>
                                                    <button
                                                        type="button"
                                                        className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-zinc-700 dark:text-white"
                                                        onClick={() => {
                                                            update("course_id", c.id)
                                                            setCourseSearch(c.name)
                                                            setCourseDropdownOpen(false)
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
                )}

                {/* --- Step 2: Student Info --- */}
                {step === 2 && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-bold dark:text-white">Student information</h2>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 -mt-2">This information is for admin purposes only and will not be displayed publicly.</p>

                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Name *</label>
                            <input
                                type="text"
                                placeholder="Your full name"
                                value={formData.student_name}
                                onChange={e => update("student_name", e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Email *</label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={formData.student_email}
                                onChange={e => update("student_email", e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Student number *</label>
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
                                I confirm that this project does not contain sensitive personal information and I consent to it being displayed on the CS Portfolio platform in accordance with GDPR regulations.
                            </label>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Passphrase *</label>
                            <input
                                type="password"
                                placeholder="Enter the course passphrase"
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
                            className="px-5 py-2 rounded-full text-sm font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting || !formData.consent}
                            className={cn(
                                "px-5 py-2 rounded-full text-sm font-semibold transition-colors",
                                formData.consent && !submitting
                                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            )}
                        >
                            {submitting ? "Submitting..." : "Submit project"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
