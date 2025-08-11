import { useState, useEffect } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/select";
import { Card } from "~/components/ui/Card";
import { X, Search, Filter as FilterIcon } from "lucide-react";

export interface FilterOptions {
  search?: string;
  profesorId?: string;
  asignaturaId?: string;
  carrera?: string;
  cuatrimestreId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

interface AsesoriasFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  cuatrimestres: Array<{ id: string; nombre: string }>;
  profesores: Array<{ id: string; nombre: string; apellido: string }>;
  asignaturas: Array<{ id: string; nombre: string; carrera: string }>;
  carreras: Array<{ codigo: string; nombre: string }>;
  isLoading: boolean;
}

export function AsesoriasFilters({
  onFiltersChange,
  cuatrimestres,
  profesores,
  asignaturas,
  carreras,
  isLoading,
}: AsesoriasFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
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
    <Card className="p-6 mb-6">
      <div className="space-y-4">
        {/* Filtros básicos */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda por texto */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por tema, alumno..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Filtro por cuatrimestre */}
          <div className="w-full sm:w-64">
            <Select
              value={filters.cuatrimestreId || ""}
              onValueChange={(value) =>
                handleFilterChange("cuatrimestreId", value)
              }
              disabled={isLoading}
            >
              <option value="">Todos los cuatrimestres</option>
              {cuatrimestres.map((cuatrimestre) => (
                <option key={cuatrimestre.id} value={cuatrimestre.id}>
                  {cuatrimestre.nombre}
                </option>
              ))}
            </Select>
          </div>

          {/* Botón para filtros avanzados */}
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center space-x-2"
            disabled={isLoading}
          >
            <FilterIcon className="h-4 w-4" />
            {showAdvancedFilters ? "Ocultar" : "Mostrar"} Filtros
          </Button>

          {/* Botón para limpiar filtros */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>

        {/* Filtros avanzados */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {/* Filtro por profesor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profesor
              </label>
              <Select
                value={filters.profesorId || ""}
                onValueChange={(value) =>
                  handleFilterChange("profesorId", value)
                }
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

            {/* Filtro por asignatura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asignatura
              </label>
              <Select
                value={filters.asignaturaId || ""}
                onValueChange={(value) =>
                  handleFilterChange("asignaturaId", value)
                }
                disabled={isLoading}
              >
                <option value="">Todas las asignaturas</option>
                {asignaturas.map((asignatura) => (
                  <option key={asignatura.id} value={asignatura.id}>
                    {asignatura.nombre} ({asignatura.carrera})
                  </option>
                ))}
              </Select>
            </div>

            {/* Filtro por carrera */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

            {/* Filtro por fecha desde */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha desde
              </label>
              <Input
                type="date"
                value={filters.fechaDesde || ""}
                onChange={(e) =>
                  handleFilterChange("fechaDesde", e.target.value)
                }
                disabled={isLoading}
              />
            </div>

            {/* Filtro por fecha hasta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha hasta
              </label>
              <Input
                type="date"
                value={filters.fechaHasta || ""}
                onChange={(e) =>
                  handleFilterChange("fechaHasta", e.target.value)
                }
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Resumen de filtros activos */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">
                Filtros activos:
              </span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;

                let displayValue = value;
                if (key === "profesorId") {
                  const profesor = profesores.find((p) => p.id === value);
                  displayValue = profesor
                    ? `${profesor.nombre} ${profesor.apellido}`
                    : value;
                } else if (key === "asignaturaId") {
                  const asignatura = asignaturas.find((a) => a.id === value);
                  displayValue = asignatura ? asignatura.nombre : value;
                } else if (key === "carrera") {
                  const carrera = carreras.find((c) => c.codigo === value);
                  displayValue = carrera ? carrera.nombre : value;
                } else if (key === "cuatrimestreId") {
                  const cuatrimestre = cuatrimestres.find(
                    (c) => c.id === value
                  );
                  displayValue = cuatrimestre ? cuatrimestre.nombre : value;
                }

                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {key}: {displayValue}
                    <button
                      onClick={() =>
                        handleFilterChange(key as keyof FilterOptions, "")
                      }
                      className="ml-1.5 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
