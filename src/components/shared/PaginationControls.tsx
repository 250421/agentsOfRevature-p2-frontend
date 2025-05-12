import { StepBack, StepForward } from "lucide-react"
import { Button } from "../ui/button"

interface PaginationControlsProps {
    handlePrevPage: () => void,
    handleNextPage: () => void,
    canPrevPage: boolean,
    canNextPage: boolean,
}

export function PaginationControls({
    handlePrevPage,
    handleNextPage,
    canPrevPage,
    canNextPage,
}: PaginationControlsProps) {
    return (
        <div>
            <Button variant="outline" onClick={handlePrevPage} disabled={!canPrevPage}>
                <StepBack />
            </Button>
            <Button variant="outline" onClick={handleNextPage} disabled={!canNextPage}>
                <StepForward />
            </Button>
        </div>
    )
}