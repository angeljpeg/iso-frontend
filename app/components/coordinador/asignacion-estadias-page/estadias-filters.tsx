import { useState, useEffect, useCallback } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { FormSelect } from "~/components/ui/forms/FormSelect";
import { useUsuarios } from "~/hooks/useUsuarios";
import { useCarreras } from "~/hooks/useCarreras";
import { Search, X, User, Calendar, GraduationCap } from "lucide-react";
import type { Usuario } from "~/types/usuarios";

interface EstadiasFiltersProps {
  onFilterChange: (filters: {
    profesorId?: string;
    periodo?: string;
    carrera?: string;
  }) => void;
  onClearFilters: () => void;
  currentFilters: {
    profesorId?: string;
    periodo?: string;
    carrera?: string;
  };
}

export function EstadiasFilters({
  onFilterChange,
  onClearFilters,
  currentFilters,
}: EstadiasFiltersProps) {
  const [profesorSearch, setProfesorSearch] = useState("");
  const [selectedProfesor, setSelectedProfesor] = useState<Usuario | null>(
    null
  );
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>(
    currentFilters.periodo || ""
  );
  const [selectedCarrera, setSelectedCarrera] = useState<string>(
    currentFilters.carrera || ""
  );

  const { usuarios: profesores, updateFilters: updateProfesoresFilters } =
    useUsuarios({
      search: profesorSearch,
      limit: 50,
    });

  const { carreras, isLoading: carrerasLoading } = useCarreras();

  // Debug: verificar que el componente se esté renderizando
  console.log(
    "EstadiasFilters render - carreras:",
    carreras?.length || 0,
    "loading:",
    carrerasLoading
  );
  console.log("Carreras data:", carreras);
  console.log("Carreras loading state:", carrerasLoading);

  // Estado temporal para debug
  const [carrerasTemp] = useState([
    {
      codigo: "TIDS",
      nombre: "Tecnologías de la Información y Desarrollo de Software",
    },
    { codigo: "TEST", nombre: "Carrera de Prueba" },
  ]);

  // Filtrar solo profesores
  const profesoresFiltrados = profesores.filter(
    (usuario) =>
      usuario.rol === "profesor_tiempo_completo" ||
      usuario.rol === "profesor_asignatura"
  );

  // Opciones para períodos (puedes ajustar según tus necesidades)
  const periodoOptions = [
    { value: "", label: "Todos los períodos" },
    { value: "2024-1", label: "2024-1" },
    { value: "2024-2", label: "2024-2" },
    { value: "2024-3", label: "2024-3" },
    { value: "2025-1", label: "2025-1" },
    { value: "2025-2", label: "2025-2" },
    { value: "2025-3", label: "2025-3" },
  ];

  // Opciones para carreras
  const carreraOptions = [
    { value: "", label: "Todas las carreras" },
    ...(carreras || []).map((carrera) => ({
      value: carrera.codigo,
      label: carrera.nombre,
    })),
  ];

  // Fallback temporal para debug
  if (!carreras || carreras.length === 0) {
    console.log("No hay carreras cargadas, usando fallback");
    carreraOptions.push(
      { value: "test1", label: "Carrera de Prueba 1" },
      { value: "test2", label: "Carrera de Prueba 2" }
    );
  }

  // Actualizar búsqueda de profesores
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateProfesoresFilters({ search: profesorSearch });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [profesorSearch, updateProfesoresFilters]);

  // Aplicar filtros cuando cambien las selecciones - FIXED
  const applyFilters = useCallback(() => {
    onFilterChange({
      profesorId: selectedProfesor?.id || "",
      periodo: selectedPeriodo,
      carrera: selectedCarrera,
    });
  }, [selectedProfesor, selectedPeriodo, selectedCarrera, onFilterChange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleProfesorSelect = (profesor: Usuario) => {
    setSelectedProfesor(profesor);
    setProfesorSearch(`${profesor.nombre} ${profesor.apellido}`);
  };

  const handleClearProfesor = () => {
    setSelectedProfesor(null);
    setProfesorSearch("");
  };

  const handleClearAll = () => {
    setSelectedProfesor(null);
    setProfesorSearch("");
    setSelectedPeriodo("");
    setSelectedCarrera("");
    onClearFilters();
  };

  const hasActiveFilters =
    selectedProfesor || selectedPeriodo || selectedCarrera;

  return (
    <div className="p-4 space-y-4 bg-white rounded-lg border">
      <div className="flex gap-2 items-center text-sm font-medium text-gray-700">
        <Search className="w-4 h-4" />
        Filtros de Búsqueda
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Filtro por Profesor */}
        <div className="space-y-2">
          <label className="flex gap-2 items-center text-sm font-medium text-gray-700">
            <User className="w-4 h-4" />
            Profesor
          </label>
          <div className="relative">
            <Input
              placeholder="Buscar profesor..."
              value={profesorSearch}
              onChange={(e) => setProfesorSearch(e.target.value)}
              className="pr-8"
            />
            {selectedProfesor && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 p-0 w-6 h-6 -translate-y-1/2"
                onClick={handleClearProfesor}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          {profesorSearch &&
            !selectedProfesor &&
            profesoresFiltrados.length > 0 && (
              <div className="overflow-auto absolute z-10 w-full max-h-60 bg-white rounded-md border border-gray-200 shadow-lg">
                {profesoresFiltrados.map((profesor) => (
                  <button
                    key={profesor.id}
                    className="px-3 py-2 w-full text-left border-b border-gray-100 hover:bg-gray-50 last:border-b-0"
                    onClick={() => handleProfesorSelect(profesor)}
                  >
                    <div className="font-medium">
                      {profesor.nombre} {profesor.apellido}
                    </div>
                    <div className="text-sm text-gray-500">
                      {profesor.email}
                    </div>
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* Filtro por Carrera */}
        <div className="space-y-2">
          <label className="flex gap-2 items-center text-sm font-medium text-gray-700">
            <GraduationCap className="w-4 h-4" />
            Carrera
            {carrerasLoading && (
              <span className="text-xs text-gray-500">(Cargando...)</span>
            )}
          </label>

          {/* Select temporal para debug */}
          <select
            value={selectedCarrera}
            onChange={(e) => setSelectedCarrera(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={carrerasLoading}
          >
            <option value="">Seleccionar carrera</option>
            {carreraOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* FormSelect original comentado temporalmente */}
          {/*
          <FormSelect
            options={carreraOptions}
            value={selectedCarrera}
            onChange={(e) => setSelectedCarrera(e.target.value)}
            placeholder="Seleccionar carrera"
            disabled={carrerasLoading}
          />
          */}
        </div>

        {/* Filtro por Período */}
        <div className="space-y-2">
          <label className="flex gap-2 items-center text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4" />
            Período
          </label>
          <FormSelect
            options={periodoOptions}
            value={selectedPeriodo}
            onChange={(e) => setSelectedPeriodo(e.target.value)}
            placeholder="Seleccionar período"
          />
        </div>

        {/* Botón para limpiar filtros */}
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={handleClearAll}
            disabled={!hasActiveFilters}
            className="w-full"
          >
            <X className="mr-2 w-4 h-4" />
            Limpiar Filtros
          </Button>
        </div>
      </div>

      {/* Indicadores de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-xs text-gray-500">Filtros activos:</span>
          {selectedProfesor && (
            <span className="inline-flex gap-1 items-center px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
              Profesor: {selectedProfesor.nombre} {selectedProfesor.apellido}
              <button onClick={handleClearProfesor}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCarrera && (
            <span className="inline-flex gap-1 items-center px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full">
              Carrera:{" "}
              {carreras?.find((c) => c.codigo === selectedCarrera)?.nombre ||
                selectedCarrera}
              <button onClick={() => setSelectedCarrera("")}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedPeriodo && (
            <span className="inline-flex gap-1 items-center px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
              Período: {selectedPeriodo}
              <button onClick={() => setSelectedPeriodo("")}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
