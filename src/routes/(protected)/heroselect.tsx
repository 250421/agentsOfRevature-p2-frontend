import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/heroselect')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(protected)/heroselect"!</div>
}
