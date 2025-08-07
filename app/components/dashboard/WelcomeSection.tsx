import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/Card";

interface WelcomeSectionProps {
  nombre: string;
  title?: string;
}

export function WelcomeSection({ nombre, title }: WelcomeSectionProps) {
  return (
    <div className="bg-gradient-to-r from-[var(--utn-primary)] to-[var(--utn-primary-light)]">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              ¡Hola, {nombre}! 👋
            </h2>
            <p className="text-white/90 mt-1">
              Bienvenido de nuevo al sistema de gestión ISO
            </p>
            {title && (
              <Badge
                variant="secondary"
                className="mt-2 bg-white/20 text-white border-white/30"
              >
                {title}
              </Badge>
            )}
          </div>
          <div className="hidden sm:block"></div>
        </div>
      </div>
    </div>
  );
}
