import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GameChoiceContainer } from "@/features/game/components/GameChoiceContainer";
import { GameText } from "@/features/game/components/GameText";
import { useOptionSelected } from "@/features/game/hooks/useOptionSelected";
import { PageHeader } from "@/components/shared/PageHeader";
import { useGetCurrentScenario } from "@/features/game/hooks/useGetCurrentScenario";
import { Loader2 } from "lucide-react";
import { TransitionScreen } from "@/components/shared/TransitionScreen";

export const Route = createFileRoute("/(protected)/_protected/game")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { data: scenario, isLoading: scenarioIsLoading } = useGetCurrentScenario();
  const optionSelected = useOptionSelected();
  const navigate = useNavigate();

  if (scenarioIsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10" />
      </div>
    );
  }

  if (optionSelected.isPending) {
    if (scenario.chapterCount === 5) {
      return <TransitionScreen text="Game Completed! Loading results..." />;
    }

    return <TransitionScreen text="Advancing to the next chapter..." />;
  }

  if (scenario.chapterCount === 6 || scenario.closing !== null) {
    navigate({ to: '/gameresults', state: { closing: scenario.closing } });
  } else {
    const currentStoryPoint = scenario.storyPoints[scenario.chapterCount - 1];

    const handleOptionSelect = (selectedOptionId: string) => {
      optionSelected.mutate({ scenarioId: scenario.id, selectedOptionId });
    };

    return (
      <div>
        <PageHeader primaryText={scenario.title} />
        <div className="container mx-auto max-w-4xl">
          <GameText gameText={currentStoryPoint.text} chapter={scenario.chapterCount} />
          <GameChoiceContainer
            options={currentStoryPoint.options}
            onOptionSelect={handleOptionSelect}
          />
        </div>
      </div>
    );
  }
}
