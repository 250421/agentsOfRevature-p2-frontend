import { SeverityBadge } from "./SeverityBadge";
import { Separator } from "@/components/ui/separator";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Calamity } from "./CalamityContainer";
import { Button } from "@/components/ui/button";


export function CalamityCard({ location, severity, description }: Calamity) {
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-auto">Card Title</CardTitle>
          <p>Reported: 15m ago</p>
        </CardHeader>
        <Separator/>
        <CardContent className="flex flex-col gap-y-2">
          <p><strong>Location: </strong>{location}</p>
          <p>{description}</p>
        </CardContent>
        <Separator/>
        <CardFooter className="flex flex-row gap-x-2">
          <SeverityBadge severity={severity}></SeverityBadge>
          <Button className="ml-auto bg-green-600">RESPOND</Button>
          <Button className="bg-red-600">IGNORE</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
