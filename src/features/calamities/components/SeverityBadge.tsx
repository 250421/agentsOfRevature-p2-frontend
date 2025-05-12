import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { SeverityLevel } from "../models/data"


interface SeverityBadgeProps {
    severity: SeverityLevel
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
    return (
        <Badge className={cn(
            "",
            {
                "bg-purple-700": severity === "critical",
                "bg-red-600": severity === "high",
                "bg-orange-400": severity === "medium",
                "bg-yellow-400": severity === "low",
            }
        )}>Severity: {severity.toUpperCase()}</Badge>
    )
}