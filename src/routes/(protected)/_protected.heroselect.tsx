'use client'

import { createFileRoute } from '@tanstack/react-router'
import { useQuery }          from '@tanstack/react-query'
import { columns, type Hero } from '@/features/heroes/components/columns'
import { DataTable }         from '@/features/heroes/components/data-table'
import { PaginationControls } from '@/components/shared/PaginationControls'
import { usePagination }      from '@/hooks/usePagination'

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
  const { data: heroes = [], isLoading } = useQuery<Hero[], Error>({
    queryKey:   ['heroes'],
    queryFn:    fetchHeroes,
    staleTime:  1000 * 60 * 15, // cache, last number is minutes
  })

  // paginate 5 heroes per page:
  const {
    displayedItems,
    handlePrevPage,
    handleNextPage,
    canPrevPage,
    canNextPage,
  } = usePagination<Hero>({ allItems: heroes, itemsPerPage: 15 })

  if (isLoading) return <div>Loading…</div>

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Select 3 Heroes</h1>

      {/* pagination buttons */}
      <div className="flex items-center mb-2 gap-2">
        <PaginationControls
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          canPrevPage={canPrevPage}
          canNextPage={canNextPage}
        />
        <span className="text-sm text-gray-600">
          Page {Math.floor(heroes.indexOf(displayedItems[0]!) / 5) + 1} of{' '}
          {Math.ceil(heroes.length / 5)}
        </span>
      </div>
      
      {/* only the current page of heroes goes into the table */}
      <DataTable columns={columns} data={displayedItems} />
    </div>
  )
}
