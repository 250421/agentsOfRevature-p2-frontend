import type { Choice } from "../models/choice";
import { GameChoice } from "./GameChoice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameChoiceContainerProps {
  choices: Choice[];
  onChoiceSelect: (choiceId: string) => void;
}
export function GameChoiceContainer({
  choices,
  onChoiceSelect,
}: GameChoiceContainerProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Choose Your Team's Next Action:</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {choices.map((choice) => (
          <GameChoice
            key={choice.id}
            choice={choice}
            onClick={onChoiceSelect}
          />
        ))}
      </CardContent>
    </Card>
  );
}
