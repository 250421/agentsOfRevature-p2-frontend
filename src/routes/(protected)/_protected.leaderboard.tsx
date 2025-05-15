import { LeaderboardTable } from '@/features/leaderboard/components/LeaderboardTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/_protected/leaderboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
  <LeaderboardTable/>
)
}
