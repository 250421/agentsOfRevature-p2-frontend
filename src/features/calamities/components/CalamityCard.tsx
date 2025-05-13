import { SeverityBadge } from "./SeverityBadge";
import { Separator } from "@/components/ui/separator";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Calamity } from "../models/calamity";
import { useConfirm } from "@/hooks/use-confirm";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteCalamity } from "../hooks/useDeleteCalamity";

const respondDialogProps = {
  title: 'Are you absolutely sure?',
  description: 'Choosing to accept this mission will begin the game.',
  confirmLabel: 'Begin',
}

const ignoreDialogProps = {
  title: 'Are you really going to leave these people to their fate?',
  description: 'Ignoring this calamity will remove it from your assignments. You will not be able to view it in the future. Perhaps another agent will save the day...',
  confirmLabel: 'Ignore',
  destructive: true,
}

export function CalamityCard({ id, location, severity, description }: Calamity) {
  const [confirmRespondDialog, RespondDialogComponent] = useConfirm();
  const [confirmIgnoreDialog, IgnoreDialogComponent] = useConfirm();
  const navigate = useNavigate();
  const deleteCalamity = useDeleteCalamity();

  const handleConfirmRespond = async () => {
    const confirmed = await confirmRespondDialog();

    if (confirmed) {
      navigate({ to: '/heroselect', search: { calamityId: id }});
    }
  }

  const handleConfirmIgnore = async () => {
    const confirmed = await confirmIgnoreDialog();

    if (confirmed) {
      deleteCalamity.mutate(id);
    }
  }

  return (
    <div className="min-w-min">
      <Card className={cn(
                  "border-l-5",
                  {
                      "border-l-purple-700": severity === "critical",
                      "border-l-red-600": severity === "high",
                      "border-l-orange-400": severity === "medium",
                      "border-l-yellow-400": severity === "low",
                  }
                  )}>
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
          <Button onClick={handleConfirmRespond} className="ml-auto bg-green-600">RESPOND</Button>
          <RespondDialogComponent {...respondDialogProps} />
          <Button onClick={handleConfirmIgnore} className="bg-red-600">IGNORE</Button>
          <IgnoreDialogComponent {...ignoreDialogProps} />
        </CardFooter>
      </Card>
    </div>
  );
}
