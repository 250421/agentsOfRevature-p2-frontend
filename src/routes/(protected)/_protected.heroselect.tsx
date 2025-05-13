import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/_protected/heroselect')({
  component: RouteComponent,
})

// function RouteComponent() {
//   return <div>Hello "/(protected)/heroselect"!</div>
// }
import { columns, type Hero } from '@/features/heroes/components/columns'
import { DataTable } from '@/features/heroes/components/data-table'

async function getData(): Promise<Hero[]> {
  // Fetch data from your API here.
  return [
    {
      id: 0,
      alias: '',
      strength: 0,
      speed: 0,
      power: 0,
      combat: 0
    },
    // ...
  ]
}

export default async function RouteComponent() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
