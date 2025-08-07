import { Card, CardContent } from "~/components/ui/Card";
import { BookOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  description, 
  icon = <BookOpen className="w-16 h-16" /> 
}: EmptyStateProps) {
  return (
    <Card className="border-dashed border-2 border-gray-200">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-gray-400 mb-6">
          {icon}
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h4>
        <p className="text-gray-500 max-w-md leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}