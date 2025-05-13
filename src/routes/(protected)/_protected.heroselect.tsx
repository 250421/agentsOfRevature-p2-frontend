'use client'

import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { columns, type Hero } from '@/features/heroes/components/columns'
import { DataTable } from '@/features/heroes/components/data-table'

async function fetchHeroes(): Promise<Hero[]> {
  const ids = Array.from({ length: 20 }, (_, i) => i + 1)

  const rows = await Promise.all(
    ids.map(async (id) => {
      const res  = await fetch(`/external/api/${id}`)
      const json = await res.json()
      if (json.response === 'error') {
        // “skip failed lookups”
        return null
      }
      return {
        id: Number(json.id),
        alias: json.name,
        strength: Number(json.powerstats.strength),
        speed: Number(json.powerstats.speed),
        power: Number(json.powerstats.power),
        combat: Number(json.powerstats.combat),
      }
    }),
  )

  return rows.filter((r): r is Hero => r !== null)
}

export const Route = createFileRoute('/(protected)/_protected/heroselect')({
  component: RouteComponent,
})

export function RouteComponent() {
  const { data: heroes = [], isLoading } = useQuery<Hero[], Error>({
    queryKey: ['heroes'],
    queryFn: fetchHeroes,
  })
  
  if (isLoading) return <div>Loading…</div>

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={heroes} />
    </div>
  )
}
