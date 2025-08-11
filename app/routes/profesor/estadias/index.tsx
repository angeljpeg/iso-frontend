import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "~/store/auth";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { getEstadiasByProfesor } from "~/services/estadias";
import type { Estadia, EstadiaAlumno } from "~/types/estadias";

// Componente para mostrar una card de alumno de estadía
function AlumnoEstadiaCard({
  alumno,
  estadia,
  onClick,
}: {
  alumno: EstadiaAlumno;
  estadia: Estadia;
  onClick: () => void;
}) {
  const progresoCount = alumno.progresoMensual?.length || 0;
  const hasObservaciones =
    alumno.observacionesGenerales &&
    alumno.observacionesGenerales.trim() !== "";

  return (
    <Card
      className="p-4 transition-shadow duration-200 cursor-pointer hover:shadow-md hover:bg-gray-50"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="mb-1 font-semibold text-gray-900">
            {alumno.nombreAlumno}
          </h3>
          {alumno.matricula && (
            <p className="text-sm text-gray-600">
              Matrícula: {alumno.matricula}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {estadia.periodo}
          </span>
        </div>
      </div>

      {alumno.carrera && (
        <p className="mb-2 text-sm text-gray-600">{alumno.carrera}</p>
      )}

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{progresoCount} evaluaciones mensuales</span>
        {hasObservaciones && (
          <span className="text-amber-600">📝 Con observaciones</span>
        )}
      </div>

      {hasObservaciones && (
        <p className="mt-2 text-xs text-gray-600 line-clamp-2">
          {alumno.observacionesGenerales}
        </p>
      )}
    </Card>
  );
}

// Componente para mostrar una estadía con sus alumnos
function EstadiaCard({
  estadia,
  onAlumnoClick,
}: {
  estadia: Estadia;
  onAlumnoClick: (alumno: EstadiaAlumno) => void;
}) {
  const alumnosCount = estadia.alumnos?.length || 0;
  const hasObservaciones =
    estadia.observacionesGenerales &&
    estadia.observacionesGenerales.trim() !== "";

  return (
    <div className="space-y-4">
      {/* Header de la estadía */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              📚 Estadía {estadia.periodo}
            </h3>
            <p className="text-sm text-gray-600">
              {alumnosCount} alumno{alumnosCount !== 1 ? "s" : ""} asignado
              {alumnosCount !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {estadia.periodo}
            </span>
          </div>
        </div>

        {hasObservaciones && (
          <div className="mt-3 p-3 bg-white rounded border border-blue-100">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Observaciones generales:</span>{" "}
              {estadia.observacionesGenerales}
            </p>
          </div>
        )}
      </div>

      {/* Grid de alumnos */}
      {alumnosCount > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {estadia.alumnos.map((alumno) => (
            <AlumnoEstadiaCard
              key={alumno.id}
              alumno={alumno}
              estadia={estadia}
              onClick={() => onAlumnoClick(alumno)}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 bg-gray-50 rounded-lg text-center">
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <h4 className="mb-2 text-lg font-semibold text-gray-900">
            No hay alumnos asignados
          </h4>
          <p className="text-gray-500">
            Esta estadía no tiene alumnos asignados aún.
          </p>
        </div>
      )}
    </div>
  );
}

export default function EstadiasPage() {
  const navigate = useNavigate();
  const { isAuthenticated, accessToken } = useAuthStore();

  // Estado para las estadías del profesor
  const [estadias, setEstadias] = useState<Estadia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Cargar las estadías del profesor logueado
  useEffect(() => {
    const fetchMisEstadias = async () => {
      if (!accessToken) {
        setError("No hay token de autenticación");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await getEstadiasByProfesor({
          token: accessToken,
        });
        setEstadias(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar mis estadías"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && accessToken) {
      fetchMisEstadias();
    }
  }, [isAuthenticated, accessToken]);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleAlumnoClick = (alumno: EstadiaAlumno) => {
    // Aquí puedes navegar a una página de detalle del alumno o abrir un modal
    console.log("Alumno seleccionado:", alumno);
    // Por ahora solo navegamos a la página de progreso del alumno
    navigate(`/profesor/estadias/progreso-alumno/${alumno.id}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout needsSaludo={false} title="Mis Estadías">
      <div className="space-y-8">
        {/* Header con información general */}
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                📚 Mis Estadías
              </h1>
              <p className="text-gray-600">
                Gestiona tus estadías y revisa el progreso de tus alumnos
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

          {/* Resumen de estadías */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="mb-1 font-semibold text-blue-900">
                Total de Estadías
              </h3>
              <p className="text-2xl font-bold text-blue-700">
                {estadias.length}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="mb-1 font-semibold text-green-900">
                Total de Alumnos
              </h3>
              <p className="text-2xl font-bold text-green-700">
                {estadias.reduce(
                  (total, estadia) => total + (estadia.alumnos?.length || 0),
                  0
                )}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="mb-1 font-semibold text-purple-900">
                Períodos Activos
              </h3>
              <p className="text-2xl font-bold text-purple-700">
                {new Set(estadias.map((e) => e.periodo)).size}
              </p>
            </div>
          </div>
        </div>

        {/* Sección de Estadías */}
        <div className="space-y-6">
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 animate-spin border-utn-primary"></div>
                <p className="text-gray-600">Cargando estadías...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {estadias.length === 0 ? (
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    <h4 className="mb-2 text-lg font-semibold text-gray-900">
                      No tienes estadías asignadas
                    </h4>
                    <p className="text-gray-500">
                      No tienes estadías asignadas como profesor responsable.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {estadias.map((estadia) => (
                    <EstadiaCard
                      key={estadia.id}
                      estadia={estadia}
                      onAlumnoClick={handleAlumnoClick}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
