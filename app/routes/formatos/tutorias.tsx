import { useState, useEffect } from "react";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { useAuthStore } from "~/store/auth";
import { useTutorias } from "~/hooks/tutorias-hooks/useTutorias";
import { useUsuarios } from "~/hooks/useUsuarios";
import {
  TutoriasTable,
  ReportesSection,
  TutoriaDetailsModal,
  TutoriaEditModal,
  TutoriaDeleteModal,
} from "~/components/formatos/tutorias/";
import {
  type FilterOptions,
  TutoriasFilters,
} from "~/components/formatos/tutorias/";
import { Button } from "~/components/ui/Button";
import {
  RefreshCw,
  FileText,
  Filter as FilterIcon,
  BarChart3,
  Users,
} from "lucide-react";
import type { Tutoria } from "~/types/tutorias";

export default function TutoriasPage() {
  const { usuario } = useAuthStore();
  const isCoordinador =
    usuario?.rol === "coordinador" || usuario?.rol === "moderador";

  // Estado para filtros
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showReportes, setShowReportes] = useState(false);

  // Estado de carga inicial
  const [isInitializing, setIsInitializing] = useState(true);

  // Estado para modales
  const [selectedTutoria, setSelectedTutoria] = useState<Tutoria | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Hook para obtener tutorías
  const { tutorias, isLoading, error, refetch } = useTutorias({
    periodo: filters.periodo,
    profesorId: filters.profesorId,
    carrera: filters.carrera,
    onlyMyTutorias: !isCoordinador,
  });

  // Hook para obtener profesores
  const { usuarios: profesores, isLoading: isLoadingProfesores } = useUsuarios({
    limit: 100,
  });

  // Filtrar solo profesores
  const profesoresFiltrados = profesores.filter(
    (usuario) =>
      usuario.rol === "profesor_tiempo_completo" ||
      usuario.rol === "profesor_asignatura"
  );

  // Logs para debugging
  console.log("=== DEBUG TUTORIAS FORMATOS ===");
  console.log("Usuario:", usuario);
  console.log("isCoordinador:", isCoordinador);
  console.log("tutorias:", tutorias);
  console.log("error:", error);
  console.log("isLoading:", isLoading);
  console.log("isInitializing:", isInitializing);
  console.log("URL actual:", window.location.href);
  console.log("Profesores obtenidos:", profesoresFiltrados);
  console.log("================================");

  // Efecto para manejar la inicialización
  useEffect(() => {
    console.log("🔄 useEffect ejecutándose - usuario:", usuario);
    if (usuario) {
      console.log(
        "✅ Usuario encontrado, estableciendo isInitializing = false"
      );
      setIsInitializing(false);
    } else {
      console.log("❌ Usuario no encontrado");
    }
  }, [usuario]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    console.log("🔍 Filtros cambiando:", newFilters);
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    console.log("🔄 Refrescando datos");
    refetch();
  };

  // Handlers para modales
  const handleViewTutoria = (tutoria: Tutoria) => {
    setSelectedTutoria(tutoria);
    setIsDetailsModalOpen(true);
  };

  const handleEditTutoria = (tutoria: Tutoria) => {
    setSelectedTutoria(tutoria);
    setIsEditModalOpen(true);
  };

  const handleDeleteTutoria = (tutoria: Tutoria) => {
    setSelectedTutoria(tutoria);
    setIsDeleteModalOpen(true);
  };

  const handleTutoriaUpdated = () => {
    // Refrescar los datos después de una actualización
    refetch();
  };

  const handleTutoriaDeleted = () => {
    // Refrescar los datos después de una eliminación
    refetch();
  };

  // Datos mock para filtros (en producción vendrían de hooks o servicios)
  const cuatrimestres = [
    { id: "1", nombre: "Primer Cuatrimestre 2024" },
    { id: "2", nombre: "Segundo Cuatrimestre 2024" },
    { id: "3", nombre: "Tercer Cuatrimestre 2024" },
  ];

  const carreras = [
    {
      codigo: "TIDS",
      nombre: "Tecnologías de la Información y Desarrollo de Software",
    },
    { codigo: "TIC", nombre: "Tecnologías de la Información y Comunicaciones" },
  ];

  // Mostrar estado de carga inicial
  if (isInitializing) {
    console.log("🔄 Mostrando estado de carga inicial");
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                Inicializando módulo de tutorías...
              </p>
              <div className="mt-4 text-sm text-gray-500">
                <p>
                  Usuario:{" "}
                  {usuario
                    ? `${usuario.nombre} ${usuario.apellido}`
                    : "No autenticado"}
                </p>
                <p>Rol: {usuario?.rol || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    console.log("❌ Error en la página:", error);
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
            <p className="text-red-700 mb-2">{error || String(error)}</p>
            <div className="text-sm text-red-600 mb-3">
              <p>
                <strong>Rol del usuario:</strong> {usuario?.rol}
              </p>
              <p>
                <strong>Es coordinador:</strong> {isCoordinador ? "Sí" : "No"}
              </p>
              <p>
                <strong>ID del usuario:</strong> {usuario?.id}
              </p>
              <p>
                <strong>URL actual:</strong> {window.location.href}
              </p>
            </div>
            <Button onClick={handleRefresh} className="mt-3">
              Reintentar
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  console.log("✅ Renderizando página principal de tutorías");
  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Registro de Tutorías
              </h1>
              <p className="text-gray-600 mt-1">
                {isCoordinador
                  ? "Gestiona y revisa todas las tutorías académicas"
                  : "Revisa tus tutorías académicas registradas"}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {isCoordinador && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2"
                  >
                    <FilterIcon className="h-4 w-4" />
                    {showFilters ? "Ocultar" : "Mostrar"} Filtros
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowReportes(!showReportes)}
                    className="flex items-center space-x-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    {showReportes ? "Ocultar" : "Mostrar"} Reportes
                  </Button>
                </>
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
          <TutoriasFilters
            onFiltersChange={handleFiltersChange}
            cuatrimestres={cuatrimestres}
            profesores={profesoresFiltrados}
            carreras={carreras}
            isLoading={isLoading}
          />
        )}

        {/* Sección de Reportes para coordinadores */}
        {isCoordinador && showReportes && (
          <div className="mb-8">
            <ReportesSection
              periodoId={filters.periodo}
              profesorId={filters.profesorId}
            />
          </div>
        )}

        {/* Tabla de tutorías */}
        <div className="bg-white rounded-lg border border-gray-200">
          <TutoriasTable
            tutorias={tutorias}
            isLoading={isLoading}
            isCoordinador={isCoordinador}
            onViewTutoria={handleViewTutoria}
            onEditTutoria={handleEditTutoria}
            onDeleteTutoria={handleDeleteTutoria}
            onRefresh={handleRefresh}
          />
        </div>

        {/* Estado vacío */}
        {!isLoading && tutorias.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay tutorías para mostrar
            </h3>
            <p className="text-gray-500 mb-4">
              {isCoordinador
                ? "No se encontraron tutorías con los filtros aplicados."
                : "No tienes tutorías registradas en este momento."}
            </p>
            <div className="text-sm text-gray-400 mb-4">
              <p>
                <strong>Rol:</strong> {usuario?.rol}
              </p>
              <p>
                <strong>Usuario ID:</strong> {usuario?.id}
              </p>
              <p>
                <strong>Estado de carga:</strong>{" "}
                {isLoading ? "Cargando..." : "Completado"}
              </p>
              <p>
                <strong>URL actual:</strong> {window.location.href}
              </p>
            </div>
            <Button onClick={handleRefresh} variant="outline">
              Actualizar
            </Button>
          </div>
        )}

        {/* Modales */}
        {selectedTutoria && (
          <>
            <TutoriaDetailsModal
              isOpen={isDetailsModalOpen}
              onClose={() => setIsDetailsModalOpen(false)}
              tutoria={selectedTutoria}
              profesores={profesoresFiltrados}
            />

            <TutoriaEditModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              tutoria={selectedTutoria}
              onTutoriaUpdated={handleTutoriaUpdated}
            />

            <TutoriaDeleteModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              tutoria={selectedTutoria}
              onTutoriaDeleted={handleTutoriaDeleted}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
