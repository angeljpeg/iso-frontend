import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/Card";
import { Badge } from "./ui/badge";
import {
  ChevronRightIcon,
  BookOpenIcon,
  CalendarIcon,
  GraduationCapIcon,
} from "lucide-react";
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
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group border-border/50 hover:border-green-500/50 bg-gradient-to-br from-background to-green-50/20"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-green-600 transition-colors duration-200 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {grupo.nombreGenerado}
          </CardTitle>
          <ChevronRightIcon className="w-5 h-5 text-muted-foreground group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Asignatura */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50/50 group-hover:bg-green-100/50 transition-colors duration-200 border border-green-100">
          <BookOpenIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-green-800 truncate">{asignatura}</p>
          </div>
        </div>

        {/* Periodo */}
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-4 h-4 text-green-600" />
          <Badge
            variant="secondary"
            className="text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200"
          >
            {grupo.cuatrimestreRelacion.nombreGenerado}
          </Badge>
        </div>

        {/* Carrera */}
        <div className="flex items-center gap-3">
          <GraduationCapIcon className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700">{grupo.carrera}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-green-100">
        <div className="flex items-center justify-between w-full">
          <Badge
            variant="outline"
            className="text-xs border-green-200 text-green-700 bg-green-50"
          >
            Grupo Activo
          </Badge>
          <div className="flex items-center gap-1 text-xs text-green-600 group-hover:text-green-700 transition-colors duration-200">
            <span>Ver detalles</span>
            <ChevronRightIcon className="w-3 h-3" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
