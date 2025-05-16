import { createFileRoute } from "@tanstack/react-router";
import { GameChoiceContainer } from "@/features/game/components/GameChoiceContainer";
import { GameText } from "@/features/game/components/GameText";
import { useOptionSelected } from "@/features/game/hooks/useOptionSelected";
import { PageHeader } from "@/components/shared/PageHeader";
import { useGetCurrentScenario } from "@/features/game/hooks/useGetCurrentScenario";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/(protected)/_protected/game/$scenarioId")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { data: scenario, isLoading } = useGetCurrentScenario();
  const options = scenario.storypoints[scenario.storypoints.chapterNumber - 1].options
  const optionSelected = useOptionSelected();

  const handleOptionSelect = (optionId: string) => {
    optionSelected.mutate({ scenarioId: scenario.id, optionId });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin"/>
      </div>
    )
  }

  return (
    <div>
      <PageHeader primaryText={scenario.title} />
      <div className="container mx-auto max-w-4xl">
        <GameText gameText={scenario.text} />
        <GameChoiceContainer
          options={options}
          onOptionSelect={handleOptionSelect}
        />
      </div>
    </div>
  );
}
