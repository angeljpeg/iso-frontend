import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/auth";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useSeguimientos } from "~/hooks/useSeguimientos";
import type { SeguimientosFiltros } from "~/types/seguimientos";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export default function Seguimientos() {
  const navigate = useNavigate();
  const { usuario, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Solo redirigir si ya se hidrato el estado y no está autenticado
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Mostrar loading mientras se hidrata el estado
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-utn-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Evitar flash de contenido
  }

  // Determinar filtros iniciales según el rol
  const filtrosIniciales: SeguimientosFiltros = {
    page: 1,
    limit: 10,
    // Si es profesor, solo sus seguimientos
    ...(usuario?.rol === "profesor_tiempo_completo" ||
    usuario?.rol === "profesor_asignatura"
      ? { profesorId: usuario.id }
      : {}),
  };

  const { seguimientos, loading, error, pagination, refetch } =
    useSeguimientos(filtrosIniciales);

  const isCoordinador =
    usuario?.rol === "director" || usuario?.rol === "coordinador";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Funciones de utilidad
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No enviado";
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      borrador:
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800",
      enviado:
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
      revision:
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800",
      aprobado:
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
      rechazado:
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800",
    };
    return badges[estado as keyof typeof badges] || badges.borrador;
  };

  const getRetrasoIndicator = (tieneRetrasos: boolean, diasRetraso: number) => {
    if (!tieneRetrasos) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✓ Al día
        </span>
      );
    }

    if (diasRetraso >= 7) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          🚨 Crítico ({diasRetraso}d)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        ⚠️ Retraso ({diasRetraso}d)
      </span>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Seguimientos Académicos
              </h1>
              <p className="text-gray-600 mt-1">
                {isCoordinador
                  ? "Gestiona y revisa los seguimientos de todos los profesores"
                  : "Consulta tus seguimientos académicos del cuatrimestre"}
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ← Volver al Dashboard
            </button>
          </div>

          {/* Filtros para coordinadores */}
          {isCoordinador && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Filtros
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profesor
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                    disabled
                  >
                    <option>Todos los profesores</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                    disabled
                  >
                    <option>Todos los estados</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semana
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                    disabled
                  >
                    <option>Todas las semanas</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    className="w-full bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
                    disabled
                  >
                    Aplicar Filtros
                  </button>
                </div>
              </div>
              <div className="mt-4 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
                ⚠️ Los filtros están en desarrollo y serán implementados
                próximamente
              </div>
            </div>
          )}

          {/* Tabla de Seguimientos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Lista de Seguimientos
              </h3>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-utn-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando seguimientos...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={() => refetch()}
                    className="mt-2 text-red-600 hover:text-red-800 underline"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {isCoordinador && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Profesor
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asignatura
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grupo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Semana
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Retrasos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Envío
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {seguimientos.map((seguimiento) => (
                      <tr key={seguimiento.id} className="hover:bg-gray-50">
                        {isCoordinador && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {seguimiento.cargaAcademica.profesor.nombre}{" "}
                              {seguimiento.cargaAcademica.profesor.apellido}
                            </div>
                            <div className="text-sm text-gray-500">
                              {seguimiento.cargaAcademica.profesor.rol.replace(
                                "_",
                                " "
                              )}
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {seguimiento.cargaAcademica.asignatura.nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            {seguimiento.cargaAcademica.asignatura.carrera}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {seguimiento.cargaAcademica.grupo.nombreGenerado}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Semana {seguimiento.semana}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getEstadoBadge(seguimiento.estado)}>
                            {seguimiento.estado.charAt(0).toUpperCase() +
                              seguimiento.estado.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRetrasoIndicator(
                            seguimiento.tieneRetrasosCriticos,
                            seguimiento.diasRetraso
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(seguimiento.fechaEnvio)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-utn-primary hover:text-utn-primary-dark mr-3"
                            onClick={() =>
                              navigate(`/seguimiento?id=${seguimiento.id}`)
                            }
                          >
                            Ver Detalle
                          </button>
                          {isCoordinador &&
                            seguimiento.estado === "enviado" && (
                              <button
                                className="text-green-600 hover:text-green-900"
                                disabled
                              >
                                Revisar
                              </button>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {seguimientos.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No se encontraron seguimientos
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm border">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  disabled={pagination.page <= 1}
                  onClick={() => refetch({ page: pagination.page - 1 })}
                >
                  Anterior
                </button>
                <button
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => refetch({ page: pagination.page + 1 })}
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    a{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}
                    </span>{" "}
                    de <span className="font-medium">{pagination.total}</span>{" "}
                    resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => refetch({ page: pagination.page - 1 })}
                      disabled={pagination.page <= 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      Página {pagination.page} de {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => refetch({ page: pagination.page + 1 })}
                      disabled={pagination.page >= pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
