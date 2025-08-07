import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import { useCargaAcademica } from "../hooks/useCargaAcademica";
import { useTemas } from "../hooks/useTemas";
import { Button } from "../components/ui/Button";
import { TemaCard } from "../components/TemaCard";
import type { CargaAcademica } from "../types/carga-academica";

export default function ProfesorGrupoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, isAuthenticated } = useAuthStore();
  const { cargasAcademicas, isLoading: isLoadingCargas } = useCargaAcademica();

  // Filtrar las cargas académicas para este grupo específico
  const cargasDelGrupo = cargasAcademicas.filter(
    (carga) => carga.grupo.id === id
  );

  // Obtener la primera asignatura para cargar los temas (asumiendo que un grupo tiene una asignatura)
  const asignaturaId = cargasDelGrupo[0]?.asignatura.id;
  const {
    temas,
    isLoading: isLoadingTemas,
    error: errorTemas,
  } = useTemas(asignaturaId || "");

  // Redirigir si no está autenticado o no es profesor
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (
      usuario?.rol !== "profesor_tiempo_completo" &&
      usuario?.rol !== "profesor_asignatura"
    ) {
      navigate("/dashboard");
      return;
    }
  }, [isAuthenticated, usuario?.rol, navigate]);

  const handleVolver = () => {
    navigate("/profesor");
  };

  const handleTemaClick = (temaId: string) => {
    // Por ahora, redirigir al seguimiento general del grupo
    // En el futuro, esto podría filtrar por tema específico
    navigate(`/seguimiento?grupoId=${id}&temaId=${temaId}`);
  };

  if (
    !isAuthenticated ||
    (usuario?.rol !== "profesor_tiempo_completo" &&
      usuario?.rol !== "profesor_asignatura")
  ) {
    return null;
  }

  const grupo = cargasDelGrupo[0]?.grupo;
  const asignatura = cargasDelGrupo[0]?.asignatura;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleVolver}
                className="mr-4"
              >
                ← Volver
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                {grupo ? grupo.nombreGenerado : "Grupo"}
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {isLoadingCargas ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">
                  Cargando información del grupo...
                </p>
              </div>
            </div>
          ) : cargasDelGrupo.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                <svg
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Grupo no encontrado
              </h3>
              <p className="text-gray-600">
                No se encontró información para este grupo.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Información del grupo */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      🏷️ Grupo
                    </h3>
                    <p className="text-gray-700">{grupo?.nombreGenerado}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      📚 Asignatura
                    </h3>
                    <p className="text-gray-700">{asignatura?.nombre}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      🕒 Periodo
                    </h3>
                    <p className="text-gray-700">
                      {grupo?.cuatrimestreRelacion.nombreGenerado}
                    </p>
                  </div>
                </div>
              </div>

              {/* Temas de la asignatura */}
              <div>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Temas de {asignatura?.nombre}
                  </h2>
                  <p className="text-gray-600">
                    Selecciona un tema para ver su seguimiento
                  </p>
                </div>

                {isLoadingTemas ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Cargando temas...</p>
                    </div>
                  </div>
                ) : errorTemas ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Error al cargar los temas
                        </h3>
                        <p className="text-sm text-red-700 mt-1">
                          {errorTemas}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : temas.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                      <svg
                        className="h-6 w-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay temas disponibles
                    </h3>
                    <p className="text-gray-600">
                      Esta asignatura no tiene temas configurados.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {temas.map((tema) => (
                      <TemaCard
                        key={tema.id}
                        tema={tema}
                        onClick={() => handleTemaClick(tema.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
