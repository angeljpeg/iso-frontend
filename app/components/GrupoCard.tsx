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
      role="button"
      tabIndex={0}
      className="overflow-hidden relative p-5 h-full transition-all duration-300 ease-in-out cursor-pointer group hover:border-green-500/50"
    >
      {/* Gradiente de hover */}
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-all duration-300 ease-in-out from-blue-100/30 to-green-100/30 group-hover:opacity-100" />

      <div className="relative z-10 p-2 space-y-4">
        {/* Encabezado */}
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 transition-all duration-300 ease-in-out text-heading-md group-hover:text-primary">
            🏷️ {grupo.nombreGenerado}
          </h3>
          <span className="w-3 h-3 bg-green-500 rounded-full opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100" />
        </div>

        {/* Asignatura */}
        <div className="p-3 bg-gray-50 rounded-lg transition-all duration-300 ease-in-out group-hover:bg-green-50/50">
          <p className="font-medium text-gray-700 text-body-lg">
            📚 {asignatura}
          </p>
        </div>

        {/* Periodo */}
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full" />
          <p className="font-medium text-gray-500 text-body-sm">
            🕒 {grupo.cuatrimestreRelacion.nombreGenerado}
          </p>
        </div>

        {/* Información adicional */}
        <div className="pt-3 border-t border-gray-100 transition-all duration-300 ease-in-out group-hover:border-green-200">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-body-sm">
              Carrera: {grupo.carrera}
            </p>
            <svg
              className="w-4 h-4 opacity-0 transition-all duration-300 ease-in-out text-primary group-hover:opacity-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Card>
  );
}
