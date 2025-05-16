import { PageHeader } from "@/components/shared/PageHeader";
import { LeaderboardTable } from "@/features/leaderboard/components/LeaderboardTable";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/_protected/leaderboard")({
  component: RouteComponent,
});

const pageHeaderProps = {
  primaryText: "Agent Leaderboard",
  secondaryText:
    "How do you rank against other agents? Your actions decide the future!",
};

function RouteComponent() {
  return (
    <div>
      <PageHeader {...pageHeaderProps} />
      <hr></hr>
      <div className="container mx-auto max-w-6xl">
        <LeaderboardTable />
      </div>
    </div>
  );
}
