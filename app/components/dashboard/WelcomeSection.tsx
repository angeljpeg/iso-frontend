import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/Card";

interface WelcomeSectionProps {
  nombre: string;
  title?: string;
}

export function WelcomeSection({ nombre, title }: WelcomeSectionProps) {
  return (
    <div className="bg-gradient-to-r from-utn-primary to-utn-primary-light">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              ¡Hola, {nombre}! 👋
            </h2>
            <p className="text-utn-primary-light/90 mt-1">
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
          <div className="hidden sm:block">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <div className="p-4 text-center">
                <p className="text-white/90 text-sm font-medium">
                  Fecha actual
                </p>
                <p className="text-white text-lg font-bold capitalize">
                  {new Date().toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}