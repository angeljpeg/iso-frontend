import { useState, useEffect } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { FormSelect } from "~/components/ui/forms/FormSelect";
import { useUsuarios } from "~/hooks/useUsuarios";
import { useGrupos } from "~/hooks/useGrupos";
import { useCarreras } from "~/hooks/useCarreras";
import { Search, X, User, Calendar, Users } from "lucide-react";
import type { Usuario } from "~/types/usuarios";
import type { Grupo } from "~/types/grupos";

interface CargasAcademicasFiltersProps {
  onFilterChange: (filters: {
    profesorId?: string;
    carrera?: string;
    grupoId?: string;
    cuatrimestreId?: string;
    activo?: boolean;
    actual?: boolean;
    esTutor?: boolean;
  }) => void;
  onClearFilters: () => void;
  currentFilters: {
    profesorId?: string;
    carrera?: string;
    grupoId?: string;
    cuatrimestreId?: string;
    activo?: boolean;
    actual?: boolean;
    esTutor?: boolean;
  };
}

export function CargasAcademicasFilters({
  onFilterChange,
  onClearFilters,
  currentFilters,
}: CargasAcademicasFiltersProps) {
  // Estados para búsquedas
  const [profesorSearch, setProfesorSearch] = useState("");
  const [grupoSearch, setGrupoSearch] = useState("");
  const [selectedProfesor, setSelectedProfesor] = useState<Usuario | null>(
    null
  );
  const [selectedGrupo, setSelectedGrupo] = useState<Grupo | null>(null);
  const [selectedCarrera, setSelectedCarrera] = useState<string>(
    currentFilters.carrera || ""
  );
  const [selectedCuatrimestre, setSelectedCuatrimestre] = useState<string>(
    currentFilters.cuatrimestreId || ""
  );
  const [selectedEstado, setSelectedEstado] = useState<string>(
    currentFilters.activo !== undefined ? currentFilters.activo.toString() : ""
  );
  const [selectedActual, setSelectedActual] = useState<string>(
    currentFilters.actual !== undefined ? currentFilters.actual.toString() : ""
  );
  const [selectedEsTutor, setSelectedEsTutor] = useState<string>(
    currentFilters.esTutor !== undefined
      ? currentFilters.esTutor.toString()
      : ""
  );
  const [añoFilter, setAñoFilter] = useState<string>("");

  // Hooks para obtener datos
  const {
    usuarios: profesores,
    isLoading: _isLoadingProfesores,
    updateFilters: updateProfesoresFilters,
  } = useUsuarios({
    search: profesorSearch,
    rol: undefined, // Traer todos los usuarios para filtrar profesores
    limit: 50,
  });

  const {
    grupos,
    isLoading: _isLoadingGrupos,
    updateFilters: updateGruposFilters,
  } = useGrupos({
    search: grupoSearch,
    carrera: selectedCarrera || undefined,
    limit: 50,
  });

  // Nuevo hook para carreras
  const {
    carreras,
    isLoading: _isLoadingCarreras,
    error: _carrerasError,
  } = useCarreras();

  // Filtrar solo profesores
  const profesoresFiltrados = profesores.filter(
    (usuario) =>
      usuario.rol === "profesor_tiempo_completo" ||
      usuario.rol === "profesor_asignatura"
  );

  // Opciones para selects - ahora dinámicas
  const carreraOptions = [
    { value: "", label: "Todas las carreras" },
    ...carreras.map((carrera) => ({
      value: carrera.nombre,
      label: carrera.nombre,
    })),
  ];

  const estadoOptions = [
    { value: "", label: "Todos los estados" },
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
  ];

  // Remover actualOptions ya que no se necesita para checkbox
  // const actualOptions = [
  //   { value: "", label: "Todos los cuatrimestres" },
  //   { value: "true", label: "Solo cuatrimestre actual" },
  //   { value: "false", label: "Cuatrimestres pasados/futuros" },
  // ];

  const añoOptions = [
    { value: "", label: "Todos los años" },
    ...Array.from({ length: 10 }, (_, i) => {
      const año = new Date().getFullYear() - 5 + i;
      return { value: año.toString(), label: año.toString() };
    }),
  ];

  // Efectos para actualizar búsquedas
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateProfesoresFilters({ search: profesorSearch });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [profesorSearch, updateProfesoresFilters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateGruposFilters({
        search: grupoSearch,
        carrera: selectedCarrera || undefined,
      });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [grupoSearch, selectedCarrera, updateGruposFilters]);

  /*   useEffect(() => {
    updateCuatrimestresFilters({
      año: añoFilter ? parseInt(añoFilter) : undefined,
    });
  }, [añoFilter, updateCuatrimestresFilters]); */

  // Handlers
  const handleProfesorSelect = (profesor: Usuario) => {
    setSelectedProfesor(profesor);
    setProfesorSearch(
      `${profesor.nombre} ${profesor.apellido} (${profesor.email})`
    );
    onFilterChange({
      ...currentFilters,
      profesorId: profesor.id,
    });
  };

  const handleGrupoSelect = (grupo: Grupo) => {
    setSelectedGrupo(grupo);
    setGrupoSearch(grupo.nombreGenerado);
    onFilterChange({
      ...currentFilters,
      grupoId: grupo.id,
    });
  };

  const handleCarreraChange = (value: string) => {
    setSelectedCarrera(value);
    onFilterChange({
      ...currentFilters,
      carrera: value || undefined,
    });
  };

  const handleEstadoChange = (value: string) => {
    setSelectedEstado(value);
    onFilterChange({
      ...currentFilters,
      activo: value === "" ? undefined : value === "true",
    });
  };

  const handleActualChange = (value: string) => {
    setSelectedActual(value);
    onFilterChange({
      ...currentFilters,
      actual: value === "" ? undefined : value === "true",
    });
  };

  const handleEsTutorChange = (value: string) => {
    setSelectedEsTutor(value);
    onFilterChange({
      ...currentFilters,
      esTutor: value === "" ? undefined : value === "true",
    });
  };

  const handleClearFilters = () => {
    setProfesorSearch("");
    setGrupoSearch("");
    setSelectedProfesor(null);
    setSelectedGrupo(null);
    setSelectedCarrera("");
    setSelectedCuatrimestre("");
    setSelectedEstado("");
    setSelectedActual("");
    setSelectedEsTutor("");
    setAñoFilter("");
    onClearFilters();
  };

  const hasActiveFilters =
    selectedProfesor ||
    selectedGrupo ||
    selectedCarrera ||
    selectedCuatrimestre ||
    selectedEstado ||
    selectedActual ||
    selectedEsTutor ||
    añoFilter;

  return (
    <div className="p-4 mb-6 bg-white rounded-lg border shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Búsqueda de Profesor */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            <User className="inline mr-1 w-4 h-4" />
            Buscar Profesor
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar por nombre, apellido o email..."
              value={profesorSearch}
              onChange={(e) => setProfesorSearch(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
          </div>
          {profesorSearch &&
            profesoresFiltrados.length > 0 &&
            !selectedProfesor && (
              <div className="overflow-y-auto max-h-40 bg-white rounded-md border border-gray-200 shadow-sm">
                {profesoresFiltrados.map((profesor) => (
                  <button
                    key={profesor.id}
                    onClick={() => handleProfesorSelect(profesor)}
                    className="px-3 py-2 w-full text-left border-b border-gray-100 hover:bg-gray-50 last:border-b-0"
                  >
                    <div className="font-medium">
                      {profesor.nombre} {profesor.apellido}
                    </div>
                    <div className="text-sm text-gray-500">
                      {profesor.email}
                    </div>
                    <div className="text-xs text-blue-600">{profesor.rol}</div>
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* Filtros principales */}
        <div className="grid grid-cols-1 gap-4 items-end md:grid-cols-2 lg:grid-cols-3">
          {/* Carrera */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Carrera
            </label>
            <FormSelect
              options={carreraOptions}
              value={selectedCarrera}
              onChange={(e) => handleCarreraChange(e.target.value)}
              placeholder="Seleccionar carrera"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Estado
            </label>
            <FormSelect
              options={estadoOptions}
              value={selectedEstado}
              onChange={(e) => handleEstadoChange(e.target.value)}
              placeholder="Filtrar por estado"
            />
          </div>

          {/* Es Tutor */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Es Tutor
            </label>
            <FormSelect
              options={[
                { value: "", label: "Todos" },
                { value: "true", label: "Solo tutores" },
                { value: "false", label: "No tutores" },
              ]}
              value={selectedEsTutor}
              onChange={(e) => handleEsTutorChange(e.target.value)}
              placeholder="Filtrar por tutor"
            />
          </div>

          {/* Cuatrimestre Actual */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedActual === "true"}
                onChange={(e) =>
                  handleActualChange(e.target.checked ? "true" : "")
                }
                className="text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Solo cuatrimestre actual
              </span>
            </label>
          </div>
        </div>

        {/* Búsqueda de Grupo */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            <Users className="inline mr-1 w-4 h-4" />
            Buscar Grupo
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar grupo por nombre..."
              value={grupoSearch}
              onChange={(e) => setGrupoSearch(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
          </div>
          {grupoSearch && grupos.length > 0 && !selectedGrupo && (
            <div className="overflow-y-auto max-h-40 bg-white rounded-md border border-gray-200 shadow-sm">
              {grupos.map((grupo) => (
                <button
                  key={grupo.id}
                  onClick={() => handleGrupoSelect(grupo)}
                  className="px-3 py-2 w-full text-left border-b border-gray-100 hover:bg-gray-50 last:border-b-0"
                >
                  <div className="font-medium">{grupo.nombreGenerado}</div>
                  <div className="text-sm text-gray-500">
                    {grupo.carrera} - Cuatrimestre {grupo.cuatrimestre}
                  </div>
                  <div className="text-xs text-blue-600">
                    {grupo.cuatrimestreRelacion?.nombreGenerado}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filtros de Cuatrimestre */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Año */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              <Calendar className="inline mr-1 w-4 h-4" />
              Filtrar por Año
            </label>
            <FormSelect
              options={añoOptions}
              value={añoFilter}
              onChange={(e) => setAñoFilter(e.target.value)}
              placeholder="Seleccionar año"
            />
          </div>

          {/* Cuatrimestre específico */}
          {/* Descomentar y actualizar el hook de cuatrimestres
          const {
            cuatrimestres,
            isLoading: isLoadingCuatrimestres,
            updateFilters: updateCuatrimestresFilters,
          } = useCuatrimestres({
            año: añoFilter ? parseInt(añoFilter) : undefined,
            limit: 50,
          });

          // Descomentar el useEffect para cuatrimestres
          useEffect(() => {
            updateCuatrimestresFilters({
              año: añoFilter ? parseInt(añoFilter) : undefined,
            });
          }, [añoFilter, updateCuatrimestresFilters]);

          // Descomentar el select de cuatrimestre específico
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Cuatrimestre Específico
            </label>
            <FormSelect
              options={[
                { value: "", label: "Todos los cuatrimestres" },
                ...cuatrimestres.map((cuatrimestre) => ({
                  value: cuatrimestre.id,
                  label: `${cuatrimestre.nombreGenerado} (${cuatrimestre.estado})`,
                })),
              ]}
              value={selectedCuatrimestre}
              onChange={(e) => handleCuatrimestreChange(e.target.value)}
              placeholder="Seleccionar cuatrimestre"
            />
          </div> */}
        </div>

        {/* Botón limpiar filtros */}
      </div>
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="px-4"
          >
            <X className="mr-2 w-4 h-4" />
            Limpiar Filtros
          </Button>
        </div>
      )}
    </div>
  );
}
