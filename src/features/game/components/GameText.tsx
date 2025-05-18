import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface GameTextProps {
  gameText: string,
  chapter: number,
}

export function GameText({ gameText, chapter }: GameTextProps) {
  return (
    <div className="min-w-min bg-slate-800">
      <Card className="border mb-10">
        <CardHeader>
          <CardTitle className="flex justify-between text-md">
            <span>The Current Situation</span>
            <span>Chapter {chapter}/5</span>
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <p className="text-md leading-relaxed">
            {gameText}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
