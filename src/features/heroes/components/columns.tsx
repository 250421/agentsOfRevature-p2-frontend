"use client"

import type { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
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
