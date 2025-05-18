import { Loader2 } from 'lucide-react';

interface TransitionScreenProps {
  text: string;
}

export function TransitionScreen({ text }: TransitionScreenProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin mb-5" />
      <p className="text-xl font-semibold">{text}</p>
    </div>
  );
};