import { Card, CardContent } from "~/components/ui/Card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/Button";
import { ChevronRight } from "lucide-react";
import type { FormatoCard as FormatoCardType } from "~/types/formatos";
import { useNavigate } from "react-router";

interface FormatoCardProps {
  formato: FormatoCardType;
}

export function FormatoCard({ formato }: FormatoCardProps) {
  const navigate = useNavigate();

  const onClick = () => {
    if (formato.disponible) {
      navigate(formato.ruta);
    }
  };

  return (
    <Card
      className={`
        ${formato.color}
        ${
          formato.disponible
            ? "cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            : "opacity-50 cursor-not-allowed"
        }
        border-2 overflow-hidden group
      `}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="text-3xl transition-transform duration-200 group-hover:scale-110">
            {formato.icono}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h4 className="mb-2 text-lg font-semibold text-gray-900">
                {formato.titulo}
              </h4>
              <p className="text-sm leading-relaxed text-gray-600">
                {formato.descripcion}
              </p>
            </div>

            <div className="flex justify-between items-center">
              {!formato.disponible ? (
                <Badge
                  variant="secondary"
                  className="text-gray-800 bg-gray-100"
                >
                  No disponible para tu rol
                </Badge>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto font-medium text-blue-600 transition-transform duration-200 hover:text-blue-700 group-hover:translate-x-1"
                >
                  Acceder
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
