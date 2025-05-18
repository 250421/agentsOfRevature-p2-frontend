import { PageHeader } from "@/components/shared/PageHeader";
import { CalamityContainer } from "@/features/calamities/components/CalamityContainer";
import { useGetCalamities } from "@/features/calamities/hooks/useGetCalamities";
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
  const { data: calamities, isLoading } = useGetCalamities();
  return (
    <div>
      <PageHeader {...pageHeaderProps} />
      <hr></hr>
      <CalamityContainer calamities={calamities} isLoading={isLoading}/>
    </div>
  );
}
