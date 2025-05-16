import { PageHeader } from "@/components/shared/PageHeader";
import { CalamityContainer } from "@/features/calamities/components/CalamityContainer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/_protected/")({
  component: Index,
});

const pageHeaderProps = {
  primaryText: "Active Calamities",
  secondaryText:
    "Greetings, agent 'username'. Choose your next assignment wisely.",
};

function Index() {
  return (
    <div>
      <PageHeader {...pageHeaderProps} />
      <hr></hr>
      <CalamityContainer />
    </div>
  );
}
