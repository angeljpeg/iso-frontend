import { useParams, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/auth";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useGrupo } from "../hooks/useGrupo";
import { AsignaturaCard } from "../components/AsignaturaCard";
import { Button } from "../components/ui/Button";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function GrupoPage() {
  const { grupoId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { grupo, cargasAcademicas, isLoading, error } = useGrupo(grupoId!);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleAsignaturaClick = (asignaturaId: string) => {
    navigate(`/asignatura/${asignaturaId}`);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ProtectedRoute>
      <DashboardLayout title={`Grupo ${grupo?.nombreGenerado || ''}`}>
        <div className="space-y-8">
          {/* Header con información del grupo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  🏷️ {grupo?.nombreGenerado}
                </h1>
                <p className="text-gray-600">
                  Información del grupo y sus asignaturas
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Volver al Dashboard</span>
              </Button>
            </div>

            {grupo && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Carrera</h3>
                  <p className="text-gray-700">{grupo.carrera}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Cuatrimestre</h3>
                  <p className="text-gray-700">{grupo.cuatrimestreRelacion?.nombreGenerado}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Número de Grupo</h3>
                  <p className="text-gray-700">{grupo.numeroGrupo}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sección de Asignaturas */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Asignaturas del Grupo
              </h2>
              <p className="text-gray-600">
                Selecciona una asignatura para ver sus temas
              </p>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-utn-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando asignaturas...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cargasAcademicas.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="bg-gray-50 rounded-lg p-8">
                      <svg
                        className="w-16 h-16 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        No hay asignaturas asignadas
                      </h4>
                      <p className="text-gray-500">
                        Este grupo no tiene asignaturas asignadas.
                      </p>
                    </div>
                  </div>
                ) : (
                  cargasAcademicas.map((carga) => (
                    <AsignaturaCard
                      key={carga.id}
                      asignatura={carga.asignatura}
                      onClick={() => handleAsignaturaClick(carga.asignatura.id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}