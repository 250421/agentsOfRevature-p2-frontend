import { createFileRoute } from "@tanstack/react-router";
import { GameChoiceContainer } from "@/features/game/components/GameChoiceContainer";
import { GameText } from "@/features/game/components/GameText";
import { useOptionSelected } from "@/features/game/hooks/useOptionSelected";
import { PageHeader } from "@/components/shared/PageHeader";
import { useGetCurrentScenario } from "@/features/game/hooks/useGetCurrentScenario";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/(protected)/_protected/game")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { data: scenario, isLoading } = useGetCurrentScenario();
  const optionSelected = useOptionSelected();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin"/>
      </div>
    )
  }

  const currentStoryPoint = scenario.storyPoints[scenario.chapterCount - 1];
  
  const handleOptionSelect = (selectedOptionId: string) => {
    optionSelected.mutate({ scenarioId: scenario.id, selectedOptionId });
  };

  return (
    <div>
      <PageHeader primaryText={scenario.title} />
      <div className="container mx-auto max-w-4xl">
        <GameText gameText={currentStoryPoint.text} chapter={scenario.chapterCount}/>
        <GameChoiceContainer
          options={currentStoryPoint.options}
          onOptionSelect={handleOptionSelect}
        />
      </div>
    </div>
  );
}
