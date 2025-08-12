import React, { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/select";
import { Filter as FilterIcon, X } from "lucide-react";

export interface FilterOptions {
  periodo?: string;
  profesorId?: string;
  carrera?: string;
  search?: string;
}

interface TutoriasFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  cuatrimestres: Array<{ id: string; nombre: string }>;
  profesores: Array<{ id: string; nombre: string; apellido: string }>;
  carreras: Array<{ codigo: string; nombre: string }>;
  isLoading: boolean;
}

export function TutoriasFilters({
  onFiltersChange,
  cuatrimestres,
  profesores,
  carreras,
  isLoading,
}: TutoriasFiltersProps) {
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

  const hasActiveFilters = Object.values(filters).some((value) => value);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FilterIcon className="h-5 w-5 mr-2" />
          Filtros de Búsqueda
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar Filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por cuatrimestre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cuatrimestre
          </label>
          <Select
            value={filters.periodo || ""}
            onValueChange={(value) => handleFilterChange("periodo", value)}
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

        {/* Filtro por profesor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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

        {/* Filtro de búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Búsqueda
          </label>
          <Input
            type="text"
            placeholder="Buscar tutorías..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>
      </div>

      {/* Resumen de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Filtros activos:</p>
          <div className="flex flex-wrap gap-2">
            {filters.periodo && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Cuatrimestre:{" "}
                {cuatrimestres.find((c) => c.id === filters.periodo)?.nombre}
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
            {filters.search && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Búsqueda: {filters.search}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
