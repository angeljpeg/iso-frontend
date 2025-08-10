import { useState, useEffect } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { FormSelect } from "~/components/ui/forms/FormSelect";
import { useCarreras } from "~/hooks/useCarreras";
import { useCuatrimestres } from "~/hooks/useCuatrimestres";
import { Search, X } from "lucide-react";

interface GruposFiltersProps {
  onFilterChange: (filters: {
    search?: string;
    carrera?: string;
    cuatrimestre?: number;
    activo?: boolean;
  }) => void;
  onClearFilters: () => void;
  currentFilters: {
    search?: string;
    carrera?: string;
    cuatrimestre?: number;
    activo?: boolean;
  };
}

export function GruposFilters({
  onFilterChange,
  onClearFilters,
  currentFilters,
}: GruposFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || "");
  const [selectedCarrera, setSelectedCarrera] = useState(
    currentFilters.carrera || ""
  );
  const [selectedCuatrimestre, setSelectedCuatrimestre] = useState(
    currentFilters.cuatrimestre?.toString() || ""
  );
  const [selectedEstado, setSelectedEstado] = useState(
    currentFilters.activo !== undefined ? currentFilters.activo.toString() : ""
  );

  const {
    carreras,
    isLoading: isLoadingCarreras,
    error: carrerasError,
  } = useCarreras();

  // Hook para obtener cuatrimestres del backend
  const {
    cuatrimestres,
    isLoading: isLoadingCuatrimestres,
    error: cuatrimestresError,
  } = useCuatrimestres({
    limit: 50, // Obtener más cuatrimestres para filtros
  });

  // Opciones para selects
  const carreraOptions = [
    { value: "", label: "Todas las carreras" },
    ...carreras.map((carrera) => ({
      value: carrera.nombre,
      label: carrera.nombre,
    })),
  ];

  // Reemplazar opciones hardcodeadas con cuatrimestres reales del backend
  const cuatrimestreOptions = [
    { value: "", label: "Todos los cuatrimestres" },
    ...cuatrimestres.map((cuatrimestre) => ({
      value: cuatrimestre.id,
      label: `${cuatrimestre.nombreGenerado} (${cuatrimestre.estado})`,
    })),
  ];

  const estadoOptions = [
    { value: "", label: "Todos los estados" },
    { value: "true", label: "Activos" },
    { value: "false", label: "Inactivos" },
  ];

  // Efecto para sincronizar filtros externos
  useEffect(() => {
    setSearchTerm(currentFilters.search || "");
    setSelectedCarrera(currentFilters.carrera || "");
    setSelectedCuatrimestre(currentFilters.cuatrimestre?.toString() || "");
    setSelectedEstado(
      currentFilters.activo !== undefined
        ? currentFilters.activo.toString()
        : ""
    );
  }, [currentFilters]);

  const handleSearch = () => {
    const filters: {
      search?: string;
      carrera?: string;
      cuatrimestre?: number;
      activo?: boolean;
    } = {};

    if (searchTerm.trim()) filters.search = searchTerm.trim();
    if (selectedCarrera) filters.carrera = selectedCarrera;
    // Nota: Aquí necesitarías ajustar la lógica si el backend espera el ID del cuatrimestre
    // en lugar del número. Depende de cómo esté implementado el endpoint de grupos.
    if (selectedCuatrimestre) {
      // Si el backend espera el número de cuatrimestre:
      const selectedCuatrimestreObj = cuatrimestres.find(
        (c) => c.id === selectedCuatrimestre
      );
      if (selectedCuatrimestreObj) {
        // Aquí necesitarías extraer el número del cuatrimestre si está disponible
        // Por ahora, mantengo la lógica original pero usando el ID
        filters.cuatrimestre = parseInt(selectedCuatrimestre);
      }
    }
    if (selectedEstado) filters.activo = selectedEstado === "true";

    onFilterChange(filters);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedCarrera("");
    setSelectedCuatrimestre("");
    setSelectedEstado("");
    onClearFilters();
  };

  const hasActiveFilters =
    searchTerm || selectedCarrera || selectedCuatrimestre || selectedEstado;

  return (
    <div className="p-4 space-y-4 bg-white rounded-lg border">
      <div className="flex flex-wrap gap-4">
        {/* Búsqueda por nombre */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Buscar por nombre de grupo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full"
          />
        </div>

        {/* Filtro por carrera */}
        <div className="min-w-[200px]">
          <FormSelect
            value={selectedCarrera}
            onChange={(e) => setSelectedCarrera(e.target.value)}
            options={carreraOptions}
            placeholder="Seleccionar carrera"
            disabled={isLoadingCarreras}
          />
        </div>

        {/* Filtro por cuatrimestre */}
        <div className="min-w-[200px]">
          <FormSelect
            value={selectedCuatrimestre}
            onChange={(e) => setSelectedCuatrimestre(e.target.value)}
            options={cuatrimestreOptions}
            placeholder="Seleccionar cuatrimestre"
            disabled={isLoadingCuatrimestres}
          />
          {isLoadingCuatrimestres && (
            <p className="mt-1 text-xs text-gray-500">
              Cargando cuatrimestres...
            </p>
          )}
        </div>

        {/* Filtro por estado */}
        <div className="min-w-[150px]">
          <FormSelect
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            options={estadoOptions}
            placeholder="Estado"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2">
        <Button onClick={handleSearch} className="flex gap-2 items-center">
          <Search className="w-4 h-4" />
          Buscar
        </Button>

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex gap-2 items-center"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Mensajes de error */}
      {carrerasError && (
        <div className="text-sm text-red-600">
          Error al cargar carreras: {carrerasError}
        </div>
      )}
      {cuatrimestresError && (
        <div className="text-sm text-red-600">
          Error al cargar cuatrimestres: {cuatrimestresError}
        </div>
      )}
    </div>
  );
}
