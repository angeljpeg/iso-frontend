import { useState, useEffect } from "react";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { useAuthStore } from "~/store/auth";
import { useSeguimientosCurso } from "~/hooks/programacion-curso/useSeguimientosCurso";
import { useSeguimientosByProfesor } from "~/hooks/programacion-curso/useSeguimientosByProfesor";
import { ProgramacionCursosTable } from "~/components/formatos/programacion-cursos/ProgramacionCursosTable";
import {
  ProgramacionCursosFilters,
  type FilterOptions,
} from "~/components/formatos/programacion-cursos/ProgramacionCursosFilters";
import { Button } from "~/components/ui/Button";
import { RefreshCw, FileText, Filter as FilterIcon } from "lucide-react";


export default function ProgramacionCursosPage() {
  const { usuario } = useAuthStore();
  const isCoordinador =
    usuario?.rol === "coordinador" || usuario?.rol === "moderador";

  // Estado para filtros
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);

  // Hook para coordinadores (todos los seguimientos)
  const {
    seguimientos: seguimientosCoordinador,
    isLoading: isLoadingCoordinador,
    error: errorCoordinador,
    pagination: paginationCoordinador,
    updateOptions: updateOptionsCoordinador,
    refresh: refreshCoordinador,
  } = useSeguimientosCurso({
    autoFetch: isCoordinador,
    page: 1,
    limit: 10,
  });

  // Hook para profesores (solo sus seguimientos)
  const {
    seguimientos: seguimientosProfesor,
    isLoading: isLoadingProfesor,
    error: errorProfesor,
    pagination: paginationProfesor,
    updateOptions: updateOptionsProfesor,
    refresh: refreshProfesor,
  } = useSeguimientosByProfesor({
    profesorId: isCoordinador ? undefined : usuario?.id,
    autoFetch: !isCoordinador && !!usuario?.id,
  });

  // Datos y estado según el rol
  const seguimientos = isCoordinador
    ? seguimientosCoordinador
    : seguimientosProfesor;
  const isLoading = isCoordinador ? isLoadingCoordinador : isLoadingProfesor;
  const error = isCoordinador ? errorCoordinador : errorProfesor;
  const pagination = isCoordinador ? paginationCoordinador : paginationProfesor;

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);

    if (isCoordinador) {
      updateOptionsCoordinador({
        estado: newFilters.estado,
        cuatrimestreId: newFilters.cuatrimestreId,
        profesorId: newFilters.profesorId,
        carrera: newFilters.carrera,
        search: newFilters.search,
      });
    } else {
      updateOptionsProfesor({
        estado: newFilters.estado,
        cuatrimestreId: newFilters.cuatrimestreId,
      });
    }
  };

  const handleRefresh = () => {
    if (isCoordinador) {
      refreshCoordinador();
    } else {
      refreshProfesor();
    }
  };

  const handlePageChange = (page: number) => {
    if (isCoordinador) {
      updateOptionsCoordinador({ page });
    } else {
      updateOptionsProfesor({ page });
    }
  };

  // Datos mock para filtros (en producción vendrían de hooks o servicios)
  const cuatrimestres = [
    { id: "1", nombre: "Primer Cuatrimestre 2024" },
    { id: "2", nombre: "Segundo Cuatrimestre 2024" },
    { id: "3", nombre: "Tercer Cuatrimestre 2024" },
  ];

  const profesores = [
    { id: "1", nombre: "Juan", apellido: "Pérez" },
    { id: "2", nombre: "María", apellido: "García" },
    { id: "3", nombre: "Carlos", apellido: "López" },
  ];

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
            <Button onClick={handleRefresh} className="mt-3">
              Reintentar
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Programación y Seguimiento de Cursos
              </h1>
              <p className="text-gray-600 mt-1">
                {isCoordinador
                  ? "Gestiona y revisa todos los seguimientos de cursos"
                  : "Revisa tus seguimientos de cursos asignados"}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {isCoordinador && (
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <FilterIcon className="h-4 w-4" />
                  {showFilters ? "Ocultar" : "Mostrar"} Filtros
                </Button>
              )}

              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Actualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros para coordinadores */}
        {isCoordinador && showFilters && (
          <ProgramacionCursosFilters
            onFiltersChange={handleFiltersChange}
            cuatrimestres={cuatrimestres}
            profesores={profesores}
            isLoading={isLoading}
          />
        )}

        {/* Información de paginación */}
        {pagination && pagination.total > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Mostrando {(pagination.page - 1) * pagination.limit + 1} a{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              de {pagination.total} resultados
            </p>

            {pagination.totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  Anterior
                </Button>

                <span className="text-sm text-gray-700">
                  Página {pagination.page} de {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Tabla de seguimientos */}
        <div className="bg-white rounded-lg border border-gray-200">
          <ProgramacionCursosTable
            seguimientos={seguimientos}
            isLoading={isLoading}
            isCoordinador={isCoordinador}
            onRefresh={handleRefresh}
          />
        </div>

        {/* Estado vacío */}
        {!isLoading && seguimientos.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay seguimientos para mostrar
            </h3>
            <p className="text-gray-500 mb-4">
              {isCoordinador
                ? "No se encontraron seguimientos de cursos con los filtros aplicados."
                : "No tienes seguimientos de cursos asignados en este momento."}
            </p>
            <Button onClick={handleRefresh} variant="outline">
              Actualizar
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
