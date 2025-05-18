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

const respondDialogProps = {
  title: "Are you absolutely sure?",
  description: "Choosing to accept this mission will begin the game.",
  confirmLabel: "Begin",
};

export function CalamityCard({
  id,
  title,
  location,
  severity,
  description,
  reported,
}: Calamity) {
  const [confirmRespondDialog, RespondDialogComponent] = useConfirm();
  const navigate = useNavigate();

  const handleConfirmRespond = async () => {
    const confirmed = await confirmRespondDialog();

    if (confirmed) {
      navigate({ to: "/heroselect", search: { calamityId: id } });
    }
  };

  return (
    <div className="min-w-min">
      <Card
        className={cn("border-0 border-l-5 bg-slate-800 text-slate-100", {
          "border-l-purple-700": severity === "CRITICAL",
          "border-l-red-600": severity === "HIGH",
          "border-l-orange-400": severity === "MEDIUM",
          "border-l-yellow-400": severity === "LOW",
        })}
      >
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-auto text-amber-300">{title}</CardTitle>
          <p className="text-sm text-slate-400">{reported}</p>
        </CardHeader>
        <Separator className="bg-slate-500"/>
        <CardContent className="flex flex-col gap-y-2">
          <p>
            <strong>Location: </strong>
            <span className="text-sm text-slate-400">{location}</span>
          </p>
          <p>{description}</p>
        </CardContent>
        <Separator className="bg-slate-500"/>
        <CardFooter className="flex flex-row gap-x-2">
          <SeverityBadge severity={severity}></SeverityBadge>
          <Button
            onClick={handleConfirmRespond}
            className="ml-auto bg-green-600"
          >
            RESPOND
          </Button>
          <RespondDialogComponent {...respondDialogProps} />
        </CardFooter>
      </Card>
    </div>
  );
}
