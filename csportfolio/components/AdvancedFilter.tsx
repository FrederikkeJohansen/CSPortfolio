import { Button } from "@/components/ui/button";
export default function AdvancedFilter() {
    return (
        <div className="mb-2 flex justify-end">
            <Button variant="outline">Advanced Filter (coming soon)</Button>
        </div>
    )
}

/* Contains "Advanced Filters" button (right-aligned)
Manages isOpen state for the sheet. Install the sheet with shadcn
sheet component slides from the rihgt, controlled by isOpen state (in page.tsx I think)
sheet is another component

AdvancedFilter.tsx should contain:

The "Advanced Filters" button
Its own isOpen state (useState)
The Sheet component that slides in
All the filter controls inside the Sheet
Benefits:

Each filter type is self-contained
CourseFilter manages course selection
AdvancedFilter manages software/hardware/materials filtering
Easier to maintain and test separately
*/