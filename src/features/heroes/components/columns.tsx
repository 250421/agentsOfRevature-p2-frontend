"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

export type Hero = {
  id: number
  alias: string
  strength: number
  speed: number
  power: number
  combat: number
}

export const columns: ColumnDef<Hero>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "alias",
        header: "Alias",
    },
    {
        accessorKey: "strength",
        header: "Strength",
    },
    {
        accessorKey: "speed",
        header: "Speed",
    },
    {
        accessorKey: "power",
        header: "Power",
    },
    {
        accessorKey: "combat",
        header: "Combat",
    },
]
