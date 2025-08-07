import { Card, CardContent } from "~/components/ui/Card";

interface SectionHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function SectionHeader({ title, description, icon }: SectionHeaderProps) {
  return (
    <Card className="bg-gradient-to-r from-white to-gray-50 border-l-4 border-l-[var(--utn-primary)] shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          {icon && (
            <div className="text-[var(--utn-primary)] text-2xl mt-1">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}