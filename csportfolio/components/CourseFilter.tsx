import { Button } from "@/components/ui/button"
export default function CourseFilter() {
    return (
        <div className="mb-8">
            <div className="flex gap-4 justify-center">
                <Button variant="default" className="bg-blue-500 text-white rounded">Physcom</Button>
                <Button variant="default" className="bg-blue-500 text-white rounded">Noget</Button>
                <Button variant="default" className="bg-blue-500 text-white rounded">HCI</Button>
            </div>
        </div>
    )
}