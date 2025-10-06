import { Button } from '@/components/ui/button';

interface ErrorBoxProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBox({ message, onRetry }: ErrorBoxProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/50 bg-destructive/5 p-4 text-destructive">
      <p className="text-sm font-medium">{message}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} className="border-destructive text-destructive">
          Retry
        </Button>
      )}
    </div>
  );
}
