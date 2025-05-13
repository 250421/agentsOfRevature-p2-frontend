import { Button } from "@/components/ui/button";
import type { Choice } from "../models/choice";

interface GameChoiceProps {
    choice: Choice,
    onClick: (choiceId: string) => void,
}

export function GameChoice({ choice, onClick }: GameChoiceProps) {
  return (
    <Button variant='outline' onClick={() => onClick(choice.id)}>
        <p>{choice.text}</p>
    </Button>
  );
}
