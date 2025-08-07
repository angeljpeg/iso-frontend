import { Card, CardContent } from "~/components/ui/Card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/Button";
import { ChevronRight } from "lucide-react";
import type { FormatoCard as FormatoCardType } from "~/types/formatos";

interface FormatoCardProps {
  formato: FormatoCardType;
  onClick: (formato: FormatoCardType) => void;
}

export function FormatoCard({ formato, onClick }: FormatoCardProps) {
  return (
    <Card
      className={`
        ${formato.color}
        ${formato.disponible
          ? "cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          : "opacity-50 cursor-not-allowed"
        }
        border-2 overflow-hidden group
      `}
      onClick={() => formato.disponible && onClick(formato)}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
            {formato.icono}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {formato.titulo}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {formato.descripcion}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              {!formato.disponible ? (
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  No disponible para tu rol
                </Badge>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium group-hover:translate-x-1 transition-transform duration-200"
                >
                  Acceder
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}