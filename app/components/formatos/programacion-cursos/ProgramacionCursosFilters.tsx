import { useState, useEffect } from "react";
import { Button } from "~/components/ui/Button";
import { FormInput } from "~/components/ui/forms/FormInput";
import { FormRadioGroup } from "~/components/ui/forms/FormRadioGroup";
import { Badge } from "~/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import type { EstadoSeguimiento } from "~/types/programacion-curso";

interface ProgramacionCursosFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  cuatrimestres: Array<{ id: string; nombre: string }>;
  profesores: Array<{ id: string; nombre: string; apellido: string }>;
  isLoading?: boolean;
}

export interface FilterOptions {
  estado?: string;
  cuatrimestreId?: string;
  profesorId?: string;
  search?: string;
  carrera?: string;
}

export function ProgramacionCursosFilters({
  onFiltersChange,
  cuatrimestres,
  profesores,
  isLoading = false,
}: ProgramacionCursosFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const estados: { value: string; label: string }[] = [
    { value: "borrador", label: "Borrador" },
    { value: "enviado", label: "Enviado" },
    { value: "revisado", label: "Revisado" },
    { value: "aprobado", label: "Aprobado" },
    { value: "rechazado", label: "Rechazado" },
  ];

  const carreras = [
    {
      value: "tids",
      label: "Tecnologías de la Información y Desarrollo de Software",
    },
    { value: "tics", label: "Tecnologías de la Información y Comunicaciones" },
    { value: "tia", label: "Tecnologías de la Información Aplicadas" },
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {};
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value !== ""
  );

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value && value !== "")
      .length;
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      {/* Header de filtros */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {getActiveFiltersCount()} activo
              {getActiveFiltersCount() !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Ocultar" : "Mostrar"} Filtros
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda siempre visible */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <FormInput
            type="text"
            placeholder="Buscar por profesor, asignatura o tema..."
            value={filters.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Filtros expandibles */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          {/* Filtro por Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <FormRadioGroup
              options={estados}
              value={filters.estado || ""}
              onChange={(value) => handleFilterChange("estado", value)}
              disabled={isLoading}
            />
          </div>

          {/* Filtro por Cuatrimestre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuatrimestre
            </label>
            <select
              value={filters.cuatrimestreId || ""}
              onChange={(e) =>
                handleFilterChange("cuatrimestreId", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <option value="">Todos los cuatrimestres</option>
              {cuatrimestres.map((cuatrimestre) => (
                <option key={cuatrimestre.id} value={cuatrimestre.id}>
                  {cuatrimestre.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Profesor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profesor
            </label>
            <select
              value={filters.profesorId || ""}
              onChange={(e) => handleFilterChange("profesorId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <option value="">Todos los profesores</option>
              {profesores.map((profesor) => (
                <option key={profesor.id} value={profesor.id}>
                  {profesor.nombre} {profesor.apellido}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Carrera */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carrera
            </label>
            <select
              value={filters.carrera || ""}
              onChange={(e) => handleFilterChange("carrera", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <option value="">Todas las carreras</option>
              {carreras.map((carrera) => (
                <option key={carrera.value} value={carrera.value}>
                  {carrera.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.estado && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                Estado: {estados.find((e) => e.value === filters.estado)?.label}
                <button
                  onClick={() => handleFilterChange("estado", "")}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.cuatrimestreId && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                Cuatrimestre:{" "}
                {
                  cuatrimestres.find((c) => c.id === filters.cuatrimestreId)
                    ?.nombre
                }
                <button
                  onClick={() => handleFilterChange("cuatrimestreId", "")}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.profesorId && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                Profesor:{" "}
                {profesores.find((p) => p.id === filters.profesorId)?.nombre}{" "}
                {profesores.find((p) => p.id === filters.profesorId)?.apellido}
                <button
                  onClick={() => handleFilterChange("profesorId", "")}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.carrera && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                Carrera:{" "}
                {carreras.find((c) => c.value === filters.carrera)?.label}
                <button
                  onClick={() => handleFilterChange("carrera", "")}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.search && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                Búsqueda: "{filters.search}"
                <button
                  onClick={() => handleSearchChange("")}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
