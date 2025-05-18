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
                "bg-purple-700": severity === "CRITICAL",
                "bg-red-600": severity === "HIGH",
                "bg-orange-400": severity === "MEDIUM",
                "bg-yellow-400": severity === "LOW",
            }
        )}>Severity: {severity.toUpperCase()}</Badge>
    )
}