'use client'

import { createFileRoute } from '@tanstack/react-router'
import { useQuery }        from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  flexRender,
} from '@tanstack/react-table'
import { useState }         from 'react'
import { Checkbox }         from '@/components/ui/checkbox'
import { PaginationControls } from '@/components/shared/PaginationControls'
import { usePagination }    from '@/hooks/usePagination'
import { columns, type Hero } from '@/features/heroes/components/columns'

async function fetchHeroes(): Promise<Hero[]> {
  const ids = Array.from({ length: 731 }, (_, i) => i + 1)
  const rows = await Promise.all(
    ids.map(async (id) => {
      const res  = await fetch(`/external/api/${id}`)
      if (!res.ok) return null
      const json = await res.json()
      if (json.response === 'error') return null

      return {
        id:       Number(json.id),
        alias:    json.name,
        strength: Number(json.powerstats.strength),
        speed:    Number(json.powerstats.speed),
        power:    Number(json.powerstats.power),
        combat:   Number(json.powerstats.combat),
      } as Hero
    }),
  )
  return rows.filter((r): r is Hero => r !== null)
}

export const Route = createFileRoute('/(protected)/_protected/heroselect')({
  component: RouteComponent,
})

export function RouteComponent() {
  // fetch all heroes
  const { data: heroes = [], isLoading } = useQuery<Hero[], Error>({
    queryKey:   ['heroes'],
    queryFn:    fetchHeroes,
    staleTime:  1000 * 60 * 15,
  })

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

  const table = useReactTable<Hero>({
    data: heroes,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection:   true,
    getCoreRowModel:      getCoreRowModel(),
  })

  // pagination
  const allRows = table.getRowModel().rows
  const {
    displayedItems: pageRows,
    handlePrevPage,
    handleNextPage,
    canPrevPage,
    canNextPage,
  } = usePagination({
    allItems:    allRows,
    itemsPerPage: 15,
  })

  if (isLoading) return <div>Loading…</div>

  // calculate # rows selected
  const selectedCount = table.getSelectedRowModel().rows.length

  return (
    <div className="container mx-auto py-10 space-y-4">
      <h1 className="text-2xl font-bold">Select Heroes</h1>

      {/* show # rows selected */}
      <div className="text-sm text-gray-700">
        {selectedCount} hero{selectedCount === 1 ? '' : 'es'} selected
      </div>

      {/* 🗸 pagination controls */}
      <PaginationControls
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        canPrevPage={canPrevPage}
        canNextPage={canNextPage}
      />

      <table className="min-w-full border-collapse border">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} className="p-2 border">
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {pageRows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
