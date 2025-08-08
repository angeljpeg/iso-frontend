import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { EstadoBadge } from "../ui/EstadoBadge";
import { IndicadorRetraso } from "../ui/IndicadorRetraso";
import { useSeguimientoDirectores } from "../../hooks/useSeguimientoDirectores";
import {
  Users,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  FileText,
  Settings,
} from "lucide-react";
import type { EstadoSeguimiento, NivelRetraso } from "~/types/seguimiento";

export function CoordinadorDashboardContent() {
  const navigate = useNavigate();
  const {
    seguimientos,
    estadisticas,
    notificaciones,
    isLoading,
    isLoadingEstadisticas,
    error,
    aplicarFiltros,
    marcarNotificacionLeida,
  } = useSeguimientoDirectores();

  const [filtros, setFiltros] = useState({
    profesor: "",
    grupo: "",
    carrera: "",
    estado: "",
  });

  // Función para convertir número de semanas a NivelRetraso
  const convertirSemanasANivel = (semanas: number): NivelRetraso => {
    if (semanas === 0) return "sin_retraso";
    if (semanas === 1) return "retraso_leve";
    return "retraso_critico"; // 2 o más semanas
  };

  const handleFiltroChange = (campo: string, valor: string) => {
    const nuevosFiltros = { ...filtros, [campo]: valor };
    setFiltros(nuevosFiltros);

    // Aplicar filtros a la API
    aplicarFiltros({
      profesorId: nuevosFiltros.profesor || undefined,
      estado: (nuevosFiltros.estado as EstadoSeguimiento) || undefined,
    });
  };

  const handleNotificacionClick = async (notificacionId: string) => {
    await marcarNotificacionLeida(notificacionId);
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4 text-red-600">
          <AlertTriangle className="mx-auto mb-2 w-12 h-12" />
          <p className="text-lg font-semibold">Error al cargar los datos</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg">
        <h1 className="mb-2 text-2xl font-bold">Dashboard de Coordinador</h1>
        <p className="text-blue-100">
          Gestión y supervisión de seguimientos académicos
        </p>
      </div>

      {/* Notificaciones Urgentes */}
      {notificaciones && notificaciones.filter((n) => !n.leida).length > 0 && (
        <div className="p-4 bg-red-50 rounded border-l-4 border-red-400">
          <div className="flex items-center">
            <AlertTriangle className="mr-2 w-5 h-5 text-red-400" />
            <h3 className="text-lg font-medium text-red-800">
              Notificaciones Urgentes
            </h3>
          </div>
          <div className="mt-2 space-y-2">
            {notificaciones
              .filter((n) => !n.leida)
              .slice(0, 3)
              .map((notificacion) => (
                <div
                  key={notificacion.id}
                  className="text-red-700 cursor-pointer hover:text-red-900"
                  onClick={() => handleNotificacionClick(notificacion.id)}
                >
                  • {notificacion.mensaje}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoadingEstadisticas ? (
          <div className="col-span-full py-8 text-center">
            <div className="mx-auto w-8 h-8 rounded-full border-b-2 border-blue-600 animate-spin"></div>
            <p className="mt-2 text-gray-600">Cargando estadísticas...</p>
          </div>
        ) : estadisticas ? (
          <>
            <div className="p-6 bg-white rounded-lg border-l-4 border-blue-500 shadow">
              <div className="flex items-center">
                <FileText className="mr-3 w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Seguimientos
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {estadisticas.totalSeguimientos}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg border-l-4 border-yellow-500 shadow">
              <div className="flex items-center">
                <TrendingUp className="mr-3 w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pendientes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {estadisticas.seguimientosPendientes}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg border-l-4 border-green-500 shadow">
              <div className="flex items-center">
                <BookOpen className="mr-3 w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprobados</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {estadisticas.seguimientosAprobados}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg border-l-4 border-red-500 shadow">
              <div className="flex items-center">
                <AlertTriangle className="mr-3 w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Críticos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {estadisticas.retrasosCriticos}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-full py-8 text-center text-gray-500">
            No se pudieron cargar las estadísticas
          </div>
        )}
      </div>

      {/* Tabla de Seguimientos */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Seguimientos Recientes
          </h3>
        </div>

        {/* Filtros */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Input
              placeholder="Buscar profesor..."
              value={filtros.profesor}
              onChange={(e) => handleFiltroChange("profesor", e.target.value)}
            />
            <select
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtros.estado}
              onChange={(e) => handleFiltroChange("estado", e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="borrador">Borrador</option>
              <option value="enviado">Enviado</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
            </select>
            <Input
              placeholder="Filtrar por carrera..."
              value={filtros.carrera}
              onChange={(e) => handleFiltroChange("carrera", e.target.value)}
            />
            <Input
              placeholder="Filtrar por grupo..."
              value={filtros.grupo}
              onChange={(e) => handleFiltroChange("grupo", e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="mx-auto w-8 h-8 rounded-full border-b-2 border-blue-600 animate-spin"></div>
              <p className="mt-2 text-gray-600">Cargando seguimientos...</p>
            </div>
          ) : seguimientos && seguimientos.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Profesor
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Asignatura
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Grupo
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Retraso
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {seguimientos.slice(0, 10).map((seguimiento) => {
                  // Calcular el nivel de retraso basado en los avances semanales
                  const retrasosCriticos = seguimiento.avancesSemanales?.filter(
                    (avance) => avance.nivelRetraso === "retraso_critico"
                  ).length || 0;
                  const retrasosLeves = seguimiento.avancesSemanales?.filter(
                    (avance) => avance.nivelRetraso === "retraso_leve"
                  ).length || 0;
                  
                  let nivelRetraso: NivelRetraso = "sin_retraso";
                  if (retrasosCriticos > 0) {
                    nivelRetraso = "retraso_critico";
                  } else if (retrasosLeves > 0) {
                    nivelRetraso = "retraso_leve";
                  }

                  return (
                    <tr key={seguimiento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {seguimiento.profesor ? 
                            `${seguimiento.profesor.nombre} ${seguimiento.profesor.apellido}` : 
                            "N/A"
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {seguimiento.asignatura?.nombre || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {seguimiento.grupo?.nombreGenerado || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <EstadoBadge estado={seguimiento.estado} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <IndicadorRetraso nivel={nivelRetraso} />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/seguimientos/${seguimiento.id}`)
                          }
                        >
                          Ver Detalle
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No se encontraron seguimientos
            </div>
          )}
        </div>
      </div>

      {/* Configuración Rápida */}
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
          <Settings className="mr-2 w-5 h-5 text-gray-600" />
          Configuración Rápida
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg border border-gray-200">
            <h4 className="mb-2 font-medium text-gray-900">
              Gestión de Usuarios
            </h4>
            <p className="mb-3 text-sm text-gray-600">
              Administra profesores, directores y coordinadores
            </p>
            <Button size="sm" variant="outline">
              Gestionar usuarios →
            </Button>
          </div>

          <div className="p-4 rounded-lg border border-gray-200">
            <h4 className="mb-2 font-medium text-gray-900">
              Asignación de Cargas
            </h4>
            <p className="mb-3 text-sm text-gray-600">
              Asigna profesores a grupos y asignaturas
            </p>
            <Button size="sm" variant="outline">
              Asignar cargas →
            </Button>
          </div>

          <div className="p-4 rounded-lg border border-gray-200">
            <h4 className="mb-2 font-medium text-gray-900">
              Configuración del Sistema
            </h4>
            <p className="mb-3 text-sm text-gray-600">
              Ajustes generales y parámetros del sistema
            </p>
            <Button size="sm" variant="outline">
              Configurar →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
