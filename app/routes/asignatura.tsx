import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAsignatura } from "../hooks/useAsignatura";
import { TemaCard } from "../components/TemaCard";
import { ModalCrearSeguimiento } from "../components/ui/ModalCrearSeguimiento";
import { Button } from "../components/ui/Button";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import type { Tema } from "../types/carga-academica";

export default function AsignaturaPage() {
  const { asignaturaId } = useParams<{ asignaturaId: string }>();
  const navigate = useNavigate();
  const { asignatura, cargaAcademica, isLoading, error } = useAsignatura(
    asignaturaId!
  );

  const [modalSeguimiento, setModalSeguimiento] = useState<{
    isOpen: boolean;
    tema: Tema | null;
  }>({ isOpen: false, tema: null });

  const handleTemaClick = (tema: Tema) => {
    console.log("Tema clicked:", tema.nombre);
  };

  const handleCrearSeguimiento = (tema: Tema) => {
    console.log("🔍 Debug - Creando seguimiento:");
    console.log("- Tema:", tema);
    console.log("- CargaAcademica:", cargaAcademica);
    console.log("- AsignaturaId:", asignaturaId);
    
    setModalSeguimiento({ isOpen: true, tema });
  };

  const handleCloseModal = () => {
    setModalSeguimiento({ isOpen: false, tema: null });
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout title={`Asignatura ${asignatura?.nombre || ""}`}>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-utn-primary mx-auto mb-4"></div>
              <p className="text-utn-secondary text-base">
                Cargando asignatura...
              </p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout title="Error">
          <div className="bg-red-50 border border-utn-error/30 rounded-lg p-6">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-utn-error mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-utn-error">
                  Error al cargar la asignatura
                </h3>
                <p className="text-utn-error/80 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!asignatura) {
    return (
      <ProtectedRoute>
        <DashboardLayout title="Asignatura no encontrada">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">
              Asignatura no encontrada
            </h2>
            <p className="text-utn-secondary mt-2">
              La asignatura solicitada no existe o no tienes permisos para
              verla.
            </p>
            <Button
              onClick={() => navigate("/dashboard")}
              className="mt-4 bg-utn-primary hover:bg-utn-primary-dark text-white"
            >
              Volver al Dashboard
            </Button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout title={`${asignatura.nombre} - ${asignatura.carrera}`}>
        <div className="space-y-6">
          {/* Header con navegación */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  📚 {asignatura.nombre}
                </h1>
                <p className="text-utn-secondary mt-2">
                  🎓 {asignatura.carrera}
                </p>
                {cargaAcademica && (
                  <p className="text-sm text-gray-500 mt-1">
                    Grupo: {cargaAcademica.grupo.nombreGenerado} | Cuatrimestre:{" "}
                    {cargaAcademica.grupo.cuatrimestreRelacion.nombreGenerado}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
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
          </div>

          {/* Temas */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                📋 Temas de la Asignatura
              </h2>
              <p className="text-utn-secondary">
                Selecciona un tema para crear un seguimiento de curso
              </p>
            </div>

            {asignatura.temas && asignatura.temas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {asignatura.temas.map((tema) => (
                  <div
                    key={tema.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col justify-between h-full"
                  >
                    {/* Tarjeta del tema */}
                    <div className="cursor-pointer flex-1">
                      <TemaCard
                        tema={tema}
                        onClick={() => handleTemaClick(tema)}
                      />
                    </div>

                    {/* Botón */}
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCrearSeguimiento(tema);
                        }}
                        className="bg-utn-success hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-utn-success"
                      >
                        📝 Crear seguimiento
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay temas disponibles
                </h3>
                <p className="text-utn-secondary">
                  Esta asignatura aún no tiene temas registrados.
                </p>
              </div>
            )}
          </div>

          {/* Modal */}
          {modalSeguimiento.isOpen &&
            modalSeguimiento.tema &&
            cargaAcademica && (
              <ModalCrearSeguimiento
                isOpen={modalSeguimiento.isOpen}
                onClose={handleCloseModal}
                tema={modalSeguimiento.tema}
                cargaAcademicaId={cargaAcademica?.id || asignaturaId!}
                cuatrimestreId={cargaAcademica?.cuatrimestreId || "1"}
              />
            )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
