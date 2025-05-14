"use client"

import type { ColumnDef } from "@tanstack/react-table"

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
