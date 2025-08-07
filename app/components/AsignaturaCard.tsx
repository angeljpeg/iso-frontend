import { Card } from "./ui/Card";
import type { Asignatura } from "../types/carga-academica";

interface AsignaturaCardProps {
  asignatura: Asignatura;
  carrera: string;
  onClick: () => void;
}

export function AsignaturaCard({
  asignatura,
  carrera,
  onClick,
}: AsignaturaCardProps) {
  return (
    <Card
      onClick={onClick}
      className="h-full group hover:border-[#3e9530]/50 relative overflow-hidden"
    >
      {/* Efecto de gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-green-50/30 opacity-0 group-hover:opacity-100 transition-smooth" />

      <div className="space-y-4 relative z-10">
        {/* Nombre de la asignatura */}
        <div className="flex items-start justify-between">
          <h3 className="text-heading-md font-semibold text-gray-900 group-hover:text-[#3e9530] transition-smooth">
            📚 {asignatura.nombre}
          </h3>
          <div className="w-3 h-3 bg-[#3e9530] rounded-full opacity-0 group-hover:opacity-100 transition-smooth" />
        </div>

        {/* Carrera */}
        <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-green-50/50 transition-smooth">
          <p className="text-body-lg text-gray-700 font-medium">🎓 {carrera}</p>
        </div>

        {/* Número de temas */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-[#3b82f6] rounded-full" />
          <p className="text-body-sm text-[#6b7280] font-medium">
            📋 {asignatura.temas?.length || 0} temas
          </p>
        </div>
      </div>
    </Card>
  );
}
