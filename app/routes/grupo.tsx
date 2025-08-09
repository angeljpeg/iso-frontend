import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useGrupo } from "../hooks/useGrupo";
import { Button } from "../components/ui/Button";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAsignaturaByNombre } from "../hooks/useAsignaturaByNombre";
import { Card } from "../components/ui/Card";
import { getAllCargaAcademica } from "../services/coordinadores/carga-academica.service";
import type { CargaAcademica } from "../types/carga-academica";

// Componente para mostrar una card de asignatura con datos del backend
function AsignaturaCardWithData({
  nombreAsignatura,
  carrera,
}: {
  nombreAsignatura: string;
  carrera?: string;
}) {
  const { asignatura, isLoading, error } =
    useAsignaturaByNombre(nombreAsignatura);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="mb-2 w-3/4 h-4 bg-gray-200 rounded"></div>
          <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Cargando: {nombreAsignatura}
        </p>
      </Card>
    );
  }

  if (error || !asignatura) {
    return (
      <Card className="p-4 border-red-200">
        <p className="text-sm text-red-600">
          Error al cargar: {nombreAsignatura}
        </p>
        <p className="mt-1 text-xs text-gray-500">{error}</p>
      </Card>
    );
  }

  const handleClick = () => {
    const encodedName = encodeURIComponent(asignatura.nombre);
    navigate(`/asignatura/${encodedName}`);
  };

  return (
    <Card
      className="p-4 transition-shadow duration-200 cursor-pointer hover:shadow-md hover:bg-gray-50"
      onClick={handleClick}
    >
      <h3 className="mb-1 font-semibold text-gray-900">{asignatura.nombre}</h3>
      {carrera && <p className="mb-2 text-sm text-gray-600">{carrera}</p>}
      <p className="text-xs text-gray-500">
        {asignatura.temas?.length || 0} temas • {asignatura.horasProgramadas}{" "}
        horas
      </p>
    </Card>
  );
}

export default function GrupoPage() {
  const { grupoId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, accessToken } = useAuthStore();
  const {
    grupo,
    isLoading: grupoLoading,
    error: grupoError,
  } = useGrupo(grupoId!);

  // Estado para las cargas académicas del profesor logueado
  const [misCargasAcademicas, setMisCargasAcademicas] = useState<
    CargaAcademica[]
  >([]);
  const [cargasLoading, setCargasLoading] = useState(true);
  const [cargasError, setCargasError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Cargar las cargas académicas del profesor logueado
  useEffect(() => {
    const fetchMisCargasAcademicas = async () => {
      if (!accessToken) {
        setCargasError("No hay token de autenticación");
        return;
      }

      try {
        setCargasLoading(true);
        setCargasError(null);
        const data = await getAllCargaAcademica({
          grupoId: grupoId!,
          token: accessToken,
        });
        setMisCargasAcademicas(data.data);
      } catch (err) {
        setCargasError(
          err instanceof Error ? err.message : "Error al cargar mis asignaturas"
        );
      } finally {
        setCargasLoading(false);
      }
    };

    if (isAuthenticated && accessToken) {
      fetchMisCargasAcademicas();
    }
  }, [isAuthenticated, accessToken, grupoId]);

  // Filtrar las cargas académicas que pertenecen al grupo actual
  const cargasDelGrupo = misCargasAcademicas.filter(
    (carga) => carga.grupoId === grupoId
  );

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (!isAuthenticated) {
    return null;
  }

  const isLoading = grupoLoading || cargasLoading;
  const error = grupoError || cargasError;

  return (
    <ProtectedRoute>
      <DashboardLayout title={`Grupo ${grupo?.nombreGenerado || ""}`}>
        <div className="space-y-8">
          {/* Header con información del grupo */}
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900">
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Volver al Dashboard</span>
              </Button>
            </div>

            {grupo && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="mb-1 font-semibold text-gray-900">Carrera</h3>
                  <p className="text-gray-700">{grupo.carrera}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="mb-1 font-semibold text-gray-900">
                    Cuatrimestre
                  </h3>
                  <p className="text-gray-700">
                    {grupo.cuatrimestreRelacion?.nombreGenerado}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="mb-1 font-semibold text-gray-900">
                    Número de Grupo
                  </h3>
                  <p className="text-gray-700">{grupo.numeroGrupo}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sección de Asignaturas */}
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                Mis Asignaturas en este Grupo
              </h2>
              <p className="text-gray-600">
                Selecciona una asignatura para ver sus temas
              </p>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 animate-spin border-utn-primary"></div>
                  <p className="text-gray-600">Cargando asignaturas...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cargasDelGrupo.length === 0 ? (
                  <div className="col-span-full py-12 text-center">
                    <div className="p-8 bg-gray-50 rounded-lg">
                      <svg
                        className="mx-auto mb-4 w-16 h-16 text-gray-400"
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
                      <h4 className="mb-2 text-lg font-semibold text-gray-900">
                        No tienes asignaturas asignadas en este grupo
                      </h4>
                      <p className="text-gray-500">
                        No tienes asignaturas asignadas en este grupo
                        específico.
                      </p>
                    </div>
                  </div>
                ) : (
                  cargasDelGrupo.map((carga) => (
                    <AsignaturaCardWithData
                      key={carga.id}
                      nombreAsignatura={carga.asignatura}
                      carrera={carga.carrera}
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
