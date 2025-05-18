import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

export type Hero = {
  id: number;
  name: string;
  powerstats: {
    strength: number;
    speed: number;
    power: number;
    combat: number;
  };
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
        accessorKey: "name",
        header: "Name",
        filterFn: "includesString",
    },
    {
        accessorKey: "powerstats.strength",
        header: "Strength",
    },
    {
        accessorKey: "powerstats.speed",
        header: "Speed",
    },
    {
        accessorKey: "powerstats.power",
        header: "Power",
    },
    {
        accessorKey: "powerstats.combat",
        header: "Combat",
    },
]
