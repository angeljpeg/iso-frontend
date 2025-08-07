import { Card } from "./ui/Card";
import type { CargaAcademica } from "../types/carga-academica";

interface GrupoCardProps {
  cargaAcademica: CargaAcademica;
  onClick: () => void;
}

export function GrupoCard({ cargaAcademica, onClick }: GrupoCardProps) {
  const { grupo, asignatura } = cargaAcademica;

  return (
    <Card 
      onClick={onClick} 
      isClickable={true} 
      className="h-full group hover:border-[#3e9530]/50 relative overflow-hidden"
      variant="elevated"
    >
      {/* Efecto de gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-green-50/30 opacity-0 group-hover:opacity-100 transition-smooth" />
      
      <div className="space-y-4 relative z-10">
        {/* Nombre del grupo */}
        <div className="flex items-start justify-between">
          <h3 className="text-heading-md font-semibold text-gray-900 group-hover:text-[#3e9530] transition-smooth">
            🏷️ {grupo.nombreGenerado}
          </h3>
          <div className="w-3 h-3 bg-[#3e9530] rounded-full opacity-0 group-hover:opacity-100 transition-smooth" />
        </div>

        {/* Asignatura */}
        <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-green-50/50 transition-smooth">
          <p className="text-body-lg text-gray-700 font-medium">📚 {asignatura.nombre}</p>
        </div>

        {/* Periodo */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-[#3b82f6] rounded-full" />
          <p className="text-body-sm text-[#6b7280] font-medium">
            🕒 {grupo.cuatrimestreRelacion.nombreGenerado}
          </p>
        </div>

        {/* Información adicional */}
        <div className="pt-3 border-t border-gray-100 group-hover:border-green-200 transition-smooth">
          <div className="flex items-center justify-between">
            <p className="text-body-sm text-[#6b7280]">Carrera: {grupo.carrera}</p>
            <div className="opacity-0 group-hover:opacity-100 transition-smooth">
              <svg className="w-4 h-4 text-[#3e9530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
