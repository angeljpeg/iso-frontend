import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/select";
import { Card } from "~/components/ui/Card";
import { X, Filter as FilterIcon } from "lucide-react";

export interface FilterOptions {
  periodo?: string;
  profesorId?: string;
  carrera?: string;
  nombreAlumno?: string;
  matricula?: string;
}

interface EstadiasFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  cuatrimestres: Array<{ id: string; nombre: string }>;
  profesores: Array<{ id: string; nombre: string; apellido: string }>;
  carreras: Array<{ codigo: string; nombre: string }>;
  isLoading?: boolean;
}

export function EstadiasFilters({
  onFiltersChange,
  cuatrimestres,
  profesores,
  carreras,
  isLoading,
}: EstadiasFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {};
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ""
  );

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FilterIcon className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por período */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Período
          </label>
          <Select
            value={filters.periodo || ""}
            onValueChange={(value) => handleFilterChange("periodo", value)}
            disabled={isLoading}
          >
            <option value="">Todos los períodos</option>
            {cuatrimestres.map((cuatrimestre) => (
              <option key={cuatrimestre.id} value={cuatrimestre.nombre}>
                {cuatrimestre.nombre}
              </option>
            ))}
          </Select>
        </div>

        {/* Filtro por profesor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profesor
          </label>
          <Select
            value={filters.profesorId || ""}
            onValueChange={(value) => handleFilterChange("profesorId", value)}
            disabled={isLoading}
          >
            <option value="">Todos los profesores</option>
            {profesores.map((profesor) => (
              <option key={profesor.id} value={profesor.id}>
                {profesor.nombre} {profesor.apellido}
              </option>
            ))}
          </Select>
        </div>

        {/* Filtro por carrera */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carrera
          </label>
          <Select
            value={filters.carrera || ""}
            onValueChange={(value) => handleFilterChange("carrera", value)}
            disabled={isLoading}
          >
            <option value="">Todas las carreras</option>
            {carreras.map((carrera) => (
              <option key={carrera.codigo} value={carrera.codigo}>
                {carrera.nombre}
              </option>
            ))}
          </Select>
        </div>

        {/* Filtro por nombre del alumno */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Alumno
          </label>
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            value={filters.nombreAlumno || ""}
            onChange={(e) => handleFilterChange("nombreAlumno", e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Filtro por matrícula */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matrícula
          </label>
          <Input
            type="text"
            placeholder="Buscar por matrícula..."
            value={filters.matricula || ""}
            onChange={(e) => handleFilterChange("matricula", e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>
      </div>

      {/* Resumen de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">
              Filtros activos:
            </span>
            {filters.periodo && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Período: {filters.periodo}
              </span>
            )}
            {filters.profesorId && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Profesor:{" "}
                {profesores.find((p) => p.id === filters.profesorId)?.nombre}{" "}
                {profesores.find((p) => p.id === filters.profesorId)?.apellido}
              </span>
            )}
            {filters.carrera && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Carrera:{" "}
                {carreras.find((c) => c.codigo === filters.carrera)?.nombre}
              </span>
            )}
            {filters.nombreAlumno && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Alumno: {filters.nombreAlumno}
              </span>
            )}
            {filters.matricula && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Matrícula: {filters.matricula}
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
