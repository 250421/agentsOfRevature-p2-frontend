import type { Option } from "../models/option";
import { GameChoice } from "./GameChoice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameOptionContainerProps {
  options: Option[];
  onOptionSelect: (optionId: string) => void;
}
export function GameChoiceContainer({
  options,
  onOptionSelect,
}: GameOptionContainerProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Choose Your Team's Next Action:</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {options.map((option) => (
          <GameChoice
            key={option.id}
            option={option}
            onClick={onOptionSelect}
          />
        ))}
      </CardContent>
    </Card>
  );
}
