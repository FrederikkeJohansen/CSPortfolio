# Featured Projects Carousel Design

**Date:** 2026-03-04
**Branch:** 58-featured-projects-carousel

## Summary

Replace the existing `FeaturedProjects.tsx` with a polished continuous auto-scroll image strip. Images fade to transparency at the left and right edges using CSS `mask-image`.

## Requirements

- Image-only cards (no title/description overlay)
- Continuous auto-scroll, left-to-right, infinite loop
- Pauses on mouse hover
- Left and right edges fade to transparent using CSS `mask-image`
- No section header/label — seamless visual banner at top of page
- Every project is guaranteed to have at least one image (no null checks needed)
- If fewer than ~6 featured projects exist, duplicate the image list in the DOM to prevent gaps during looping

## Approach

**Embla + CSS `mask-image`**

Use `embla-carousel-react` directly (not the shadcn wrapper) for more control over the container DOM. Apply `mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)` inline on the outer wrapper so the fade is alpha-based and works in both light and dark mode regardless of background colour.

## Card Spec

- Square aspect ratio (~200px wide)
- `rounded-2xl`
- `hover:scale-105` transition
- Wrapped in `<Link href={/projects/[id]}>`
- First image sorted by `display_order`

## Scroll Config

- Plugin: `embla-carousel-auto-scroll`
- Speed: 1
- `stopOnInteraction: false`
- `stopOnMouseEnter: true`
- `loop: true`
- `dragFree: true`

## Files Changed

- `csportfolio/components/FeaturedProjects.tsx` — full rewrite
