import { Card } from "./ui/Card";
import type { Tema } from "../types/carga-academica";

interface TemaCardProps {
  tema: Tema;
  onClick: (tema: Tema) => void;
}

export function TemaCard({ tema, onClick }: TemaCardProps) {
  const handleClick = () => {
    onClick(tema);
  };
  return (
    <Card
      className="h-full group hover:border-[#3e9530]/50 relative overflow-hidden"
      variant="elevated"
    >
      {/* Efecto de gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-green-50/30 opacity-0 group-hover:opacity-100 transition-smooth" />

      <div className="space-y-4 relative z-10">
        {/* Nombre del tema */}
        <div className="flex items-start justify-between">
          <h3 className="text-heading-md font-semibold text-gray-900 group-hover:text-[#3e9530] transition-smooth">
            📖 {tema.nombre}
          </h3>
          <div className="w-3 h-3 bg-[#3e9530] rounded-full opacity-0 group-hover:opacity-100 transition-smooth" />
        </div>

        {/* Unidad */}
        <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-green-50/50 transition-smooth">
          <p className="text-body-lg text-gray-700 font-medium">
            📚 Unidad {tema.unidad}
          </p>
        </div>

        {/* Semana recomendada */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-[#3b82f6] rounded-full" />
          <p className="text-body-sm text-[#6b7280] font-medium">
            📅 Semana {tema.semanaRecomendada}
          </p>
        </div>

        {/* Descripción si existe */}
        {tema.descripcion && (
          <div className="pt-3 border-t border-gray-100 group-hover:border-green-200 transition-smooth">
            <p className="text-body-sm text-[#6b7280] line-clamp-3">
              {tema.descripcion}
            </p>
          </div>
        )}

        {/* Estado */}
        <div className="pt-3 border-t border-gray-100 group-hover:border-green-200 transition-smooth">
          <div className="flex items-center justify-between">
            <p className="text-body-sm text-[#6b7280]">
              Estado: {tema.activo ? "Activo" : "Inactivo"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
