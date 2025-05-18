import { PageHeader } from "@/components/shared/PageHeader";
import { CalamityContainer } from "@/features/calamities/components/CalamityContainer";
import { useGetCalamities } from "@/features/calamities/hooks/useGetCalamities";
import useStore from "@/store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/_protected/")({
  component: Index,
});


function Index() {
  const { data: calamities, isLoading } = useGetCalamities();
  const username = useStore((state) => state.username);

  const pageHeaderProps = {
    primaryText: "Active Calamities",
    secondaryText:
      `Greetings, agent ${username}. Choose your next assignment wisely.`
  };

  return (
    <div>
      <PageHeader {...pageHeaderProps} />
      <hr className="border-slate-500"></hr>
      <CalamityContainer calamities={calamities} isLoading={isLoading}/>
    </div>
  );
}
