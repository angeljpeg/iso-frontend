import { Card, CardContent } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-red-900 mb-2">
              Error al cargar los datos
            </h4>
            <p className="text-red-700 mb-4">{error}</p>
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}