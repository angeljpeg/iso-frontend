import { useState, useEffect } from "react";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { useAuthStore } from "~/store/auth";
import { useAsesorias } from "~/hooks/asesorias";
import {
  AsesoriasTable,
  ReportesSection,
} from "~/components/formatos/asesorias";
import {
  AsesoriasFilters,
  type FilterOptions,
} from "~/components/formatos/asesorias";
import { Button } from "~/components/ui/Button";
import {
  RefreshCw,
  FileText,
  Filter as FilterIcon,
  BarChart3,
} from "lucide-react";
import { PDFDownloadLinkComponent } from "~/components/formatos/pdf/PDFDownloader";

export default function AsesoriasPage() {
  const { usuario } = useAuthStore();
  const isCoordinador =
    usuario?.rol === "coordinador" || usuario?.rol === "moderador";

  // Estado para filtros
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showReportes, setShowReportes] = useState(false);

  // Estado de carga inicial
  const [isInitializing, setIsInitializing] = useState(true);

  // Hook para obtener asesorías
  const {
    data: asesoriasResponse,
    isLoading,
    error,
    refetch,
  } = useAsesorias(
    {
      page: 1,
      limit: 100,
      ...filters,
    },
    usuario?.accessToken || "",
    !!usuario
  );

  // Extraer datos de la respuesta
  const asesorias = asesoriasResponse?.data || [];

  // Logs para debugging
  console.log("=== DEBUG ASESORIAS FORMATOS ===");
  console.log("Usuario:", usuario);
  console.log("isCoordinador:", isCoordinador);
  console.log("asesoriasResponse:", asesoriasResponse);
  console.log("asesorias:", asesorias);
  console.log("error:", error);
  console.log("isLoading:", isLoading);
  console.log("isInitializing:", isInitializing);
  console.log("URL actual:", window.location.href);
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
                Inicializando módulo de asesorías...
              </p>
              <div className="mt-4 text-sm text-gray-500">
                <p>
                  Usuario:{" "}
                  {usuario
                    ? `${usuario.nombre} ${usuario.apellido}`
                    : "No autenticado"}
                </p>
                <p>Rol: {usuario?.rol || "N/A"}</p>
                <p>Token: {usuario?.accessToken ? "Presente" : "Ausente"}</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleFiltersChange = (newFilters: FilterOptions) => {
    console.log("🔍 Filtros cambiando:", newFilters);
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    console.log("🔄 Refrescando datos");
    refetch();
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

  const asignaturas = [
    { id: "1", nombre: "Programación Web", carrera: "TIDS" },
    { id: "2", nombre: "Bases de Datos", carrera: "TIDS" },
    { id: "3", nombre: "Desarrollo Móvil", carrera: "TIDS" },
  ];

  const carreras = [
    {
      codigo: "TIDS",
      nombre: "Tecnologías de la Información y Desarrollo de Software",
    },
    { codigo: "TIC", nombre: "Tecnologías de la Información y Comunicaciones" },
  ];

  if (error) {
    console.log("❌ Error en la página:", error);
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
            <p className="text-red-700 mb-2">
              {error.message || String(error)}
            </p>
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

  console.log("✅ Renderizando página principal de asesorías");
  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Registro de Asesorías
              </h1>
              <p className="text-gray-600 mt-1">
                {isCoordinador
                  ? "Gestiona y revisa todas las asesorías académicas"
                  : "Revisa tus asesorías académicas registradas"}
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

              <PDFDownloadLinkComponent
                seguimientos={asesorias as any} // TODO: Adaptar para asesorías
                titulo="Registro de Asesorías - Reporte Completo"
                filtros={filters}
              >
                Exportar PDF
              </PDFDownloadLinkComponent>
            </div>
          </div>
        </div>

        {/* Filtros para coordinadores */}
        {isCoordinador && showFilters && (
          <AsesoriasFilters
            onFiltersChange={handleFiltersChange}
            cuatrimestres={cuatrimestres}
            profesores={profesores}
            asignaturas={asignaturas}
            carreras={carreras}
            isLoading={isLoading}
          />
        )}

        {/* Sección de Reportes para coordinadores */}
        {isCoordinador && showReportes && (
          <div className="mb-8">
            <ReportesSection
              cuatrimestreId={filters.cuatrimestreId}
              profesorId={filters.profesorId}
            />
          </div>
        )}

        {/* Tabla de asesorías */}
        <div className="bg-white rounded-lg border border-gray-200">
          <AsesoriasTable
            asesorias={asesorias}
            isLoading={isLoading}
            isCoordinador={isCoordinador}
            onRefresh={handleRefresh}
          />
        </div>

        {/* Estado vacío */}
        {!isLoading && asesorias.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay asesorías para mostrar
            </h3>
            <p className="text-gray-500 mb-4">
              {isCoordinador
                ? "No se encontraron asesorías con los filtros aplicados."
                : "No tienes asesorías registradas en este momento."}
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
      </div>
    </DashboardLayout>
  );
}
