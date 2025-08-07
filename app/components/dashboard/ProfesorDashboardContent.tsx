import { useCargaAcademica } from "../../hooks/useCargaAcademica";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/auth";
import { GrupoCard } from "../GrupoCard";
import { FORMATOS_ISO, type FormatoCard } from "../../types/formatos";

export function ProfesorDashboardContent() {
  const navigate = useNavigate();
  const { cargasAcademicas, isLoading, error } = useCargaAcademica();
  const { usuario } = useAuthStore();

  // Filtrar formatos según el rol del usuario
  const formatosDisponibles = FORMATOS_ISO.map((formato) => ({
    ...formato,
    disponible:
      formato.id === "tutorias"
        ? usuario?.rol === "profesor_tiempo_completo"
        : formato.disponible,
  }));

  const handleFormatoClick = (formato: FormatoCard) => {
    if (formato.disponible) {
      navigate(formato.ruta);
    }
  };

  const handleGrupoClick = (grupoId: string) => {
    navigate(`/grupo/${grupoId}`);
  };

  return (
    <div className="space-y-8">
      {/* Sección de Formatos ISO */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Formatos ISO Disponibles
          </h3>
          <p className="text-gray-600">
            Accede a los diferentes formatos de seguimiento y reportes
            académicos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formatosDisponibles.map((formato) => (
            <div
              key={formato.id}
              onClick={() => handleFormatoClick(formato)}
              className={`
                ${formato.color}
                ${
                  formato.disponible
                    ? "cursor-pointer transform hover:scale-105 hover:shadow-md"
                    : "opacity-50 cursor-not-allowed"
                }
                border-2 rounded-lg p-6 transition-all duration-200
              `}
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{formato.icono}</div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {formato.titulo}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    {formato.descripcion}
                  </p>
                  {!formato.disponible && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      No disponible para tu rol
                    </span>
                  )}
                  {formato.disponible && (
                    <div className="flex items-center text-sm text-blue-600 font-medium">
                      Acceder
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Sección de Grupos Asignados */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Grupos Asignados
          </h3>
          <p className="text-gray-600">
            Gestiona el seguimiento de tus asignaturas del cuatrimestre actual
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-utn-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando grupos...</p>
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
                    No hay grupos asignados
                  </h4>
                  <p className="text-gray-500">
                    No tienes grupos asignados para este cuatrimestre.
                  </p>
                </div>
              </div>
            ) : (
              cargasAcademicas.map((carga) => (
                <GrupoCard
                  key={carga.id}
                  cargaAcademica={carga}
                  onClick={() => handleGrupoClick(carga.grupo.id)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
