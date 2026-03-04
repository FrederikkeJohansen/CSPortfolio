# Featured Projects Carousel Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite `FeaturedProjects.tsx` as a continuous auto-scrolling image strip with CSS mask-image fade on both edges.

**Architecture:** Use `useEmblaCarousel` directly (not the shadcn wrapper) with the `embla-carousel-auto-scroll` plugin. Apply `mask-image` inline on the outer wrapper for alpha-based edge fading. Duplicate the image list when fewer than 6 projects exist to prevent gaps.

**Tech Stack:** Next.js 16, React 19, TypeScript, `embla-carousel-react`, `embla-carousel-auto-scroll`, Tailwind CSS v4, `next/image`, `next/link`

---

### Task 1: Rewrite FeaturedProjects.tsx

**Files:**
- Modify: `csportfolio/components/FeaturedProjects.tsx`

**Step 1: Replace the file contents with the new implementation**

```tsx
"use client"

import { useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"
import Image from "next/image"
import Link from "next/link"
import { Project } from "@/types"

type Props = {
    projects: Project[]
}

const MIN_VISIBLE = 6

export default function FeaturedProjects({ projects }: Props) {
    const plugin = useRef(
        AutoScroll({
            speed: 1,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        })
    )

    const [emblaRef] = useEmblaCarousel(
        { loop: true, dragFree: true, align: "start" },
        [plugin.current]
    )

    if (projects.length === 0) return null

    // Duplicate items until we have at least MIN_VISIBLE to prevent gaps
    const items =
        projects.length < MIN_VISIBLE
            ? Array.from(
                  { length: Math.ceil(MIN_VISIBLE / projects.length) },
                  () => projects
              ).flat()
            : projects

    return (
        <div className="mb-6 overflow-hidden" ref={emblaRef}
            style={{
                maskImage:
                    "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}
        >
            <div className="flex gap-4">
                {items.map((project, i) => {
                    const firstImage = project.project_images
                        .slice()
                        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))[0]

                    return (
                        <Link
                            key={`${project.id}-${i}`}
                            href={`/projects/${project.id}`}
                            className="flex-none w-40 sm:w-48 md:w-56"
                        >
                            <div className="relative aspect-square overflow-hidden rounded-2xl">
                                <Image
                                    src={firstImage.image_url}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-300 hover:scale-105"
                                    sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
                                    draggable={false}
                                />
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
```

**Step 2: Start the dev server and visually verify**

```bash
cd csportfolio && npm run dev
```

Open `http://localhost:3000` and check:
- [ ] Images scroll continuously from right to left
- [ ] Scrolling pauses when hovering over the strip
- [ ] Left and right edges fade to transparent (not to white/black)
- [ ] Clicking a card navigates to the correct project page
- [ ] Works in both light and dark mode (edges should be transparent, not coloured)
- [ ] No console errors

**Step 3: Run lint**

```bash
cd csportfolio && npm run lint
```

Expected: no errors.

**Step 4: Commit**

```bash
git add csportfolio/components/FeaturedProjects.tsx
git commit -m "feat: rewrite FeaturedProjects as auto-scroll strip with mask-image fade"
```
