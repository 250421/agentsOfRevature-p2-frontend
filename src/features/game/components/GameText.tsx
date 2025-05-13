import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface GameTextProps {
  gameText: string,
}

export function GameText({ gameText }: GameTextProps) {
  return (
    <div className="min-w-min">
      <Card className="border mb-10">
        <CardHeader>
          <CardTitle className="text-md">The Current Situation</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <p className="text-md leading-relaxed">
            {gameText ||
              "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et fugit eveniet temporibus, quod aliquam totam ipsam. Veniam illo nisi voluptates distinctio non at dolor! Nihil dolore est deleniti mollitia autem?"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
