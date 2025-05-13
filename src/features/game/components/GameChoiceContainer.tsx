import type { Choice } from "../models/choice";
import { GameChoice } from "./GameChoice";

interface GameChoiceContainerProps {
  choices: Choice[],
  onChoiceSelect: (choiceId: string) => void,
}
export function GameChoiceContainer({ choices, onChoiceSelect }: GameChoiceContainerProps) {
  return (
    <div>
      <h1>Choose Your Team's Next Action:</h1>
      {choices.map((choice) => (
        <GameChoice key={choice.id} choice={choice} onClick={onChoiceSelect}/>
      ))}
    </div>
  );
}
