import { Card, CardContent } from "~/components/ui/Card";
import { Skeleton } from "~/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Cargando..." }: LoadingStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-12 w-12 text-[var(--utn-primary)] animate-spin mb-4" />
        <p className="text-gray-600 font-medium">{message}</p>
        <div className="mt-6 space-y-3 w-full max-w-md">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
}