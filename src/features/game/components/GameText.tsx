import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface GameTextProps {
  gameText: string,
}

export function GameText({ gameText }: GameTextProps) {
  return (
    <div className="min-w-min">
      <Card className="border-5">
        <CardHeader className="flex flex-row items-center">
          <CardTitle>The Current Situation</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <p>
            {gameText ||
              "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et fugit eveniet temporibus, quod aliquam totam ipsam. Veniam illo nisi voluptates distinctio non at dolor! Nihil dolore est deleniti mollitia autem?"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
