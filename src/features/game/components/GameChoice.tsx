import { Button } from "@/components/ui/button";
import type { Option } from "../models/option";

interface GameOptionProps {
    option: Option,
    onClick: (selectedOptionId: string) => void,
}

export function GameChoice({ option, onClick }: GameOptionProps) {
  return (
    <Button variant='outline' onClick={() => onClick(option.id)} className="w-full h-15 p-5 whitespace-normal bg-slate-700">
        <p>{option.text}</p>
    </Button>
  );
}
