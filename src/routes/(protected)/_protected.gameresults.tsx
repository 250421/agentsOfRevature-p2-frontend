import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from '@radix-ui/react-separator';

export const Route = createFileRoute('/(protected)/_protected/gameresults')({
  component: RouteComponent,
});

interface GameResultsState {
  closing?: string;
}

function RouteComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { closing } = (location.state || {}) as GameResultsState;

  return (
    <div className="container mx-auto max-w-4xl">
      <PageHeader primaryText={`Calamity Completed`} />
      <Card>
        <CardContent>
          <p>{closing}</p>
        </CardContent>
        <Separator />
        <CardFooter className='flex justify-end'>
          <Button className='text-right' onClick={() => navigate({ to: '/' })}>Return to Calamities</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
