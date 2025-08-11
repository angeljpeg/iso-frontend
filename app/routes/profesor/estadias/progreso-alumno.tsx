import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useProgresoMensual, useEstadiaAlumno } from "~/hooks/estadias-hooks";
import { useProgresoMensualActions } from "~/hooks/estadias-hooks";
import { Button } from "~/components/ui/Button";
import { DashboardLayout } from "~/layouts/DashboardLayout";
import { useModal } from "~/hooks/use-modal";
import { useModalContext } from "~/contexts/modal-context";
import { useAuthStore } from "~/store/auth";
import type { ProgresoMensual, MesType } from "~/types/estadias";
import { CrearProgresoModal } from "~/components/ui/modals/crear-progreso-modal";

export default function EstadiasAlumnoPage() {
  const { estadiaAlumnoId } = useParams<{ estadiaAlumnoId: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuthStore();

  // Hooks para obtener datos
  const {
    progresos,
    isLoading: isLoadingProgresos,
    error: errorProgresos,
    refetch: refreshProgresos,
  } = useProgresoMensual({ estadiaAlumnoId: estadiaAlumnoId! });

  const {
    alumno,
    isLoading: isLoadingAlumno,
    error: errorAlumno,
    refetch: refreshAlumno,
  } = useEstadiaAlumno({ estadiaAlumnoId: estadiaAlumnoId! });

  const {
    create,
    update,
    isLoading: isLoadingActions,
  } = useProgresoMensualActions();

  // Modal hooks
  const {
    isOpen: isCrearOpen,
    openModal: openCrear,
    closeModal: closeCrear,
  } = useModal();

  const { showAlert } = useModalContext();

  const [selectedMes, setSelectedMes] = useState<MesType | null>(null);
  const [progresoExistente, setProgresoExistente] =
    useState<ProgresoMensual | null>(null);

  // Limpiar estado cuando el componente se desmonte
  useEffect(() => {
    return () => {
      setProgresoExistente(null);
      setSelectedMes(null);
    };
  }, []);

  // Colores para cada mes
  const getMesColor = (mes: MesType) => {
    switch (mes) {
      case 1:
        return "bg-gray-50 border-yellow-200 text-gray-800";
      case 2:
        return "bg-gray-50 border-blue-200 text-gray-800";
      case 3:
        return "bg-gray-50 border-green-200 text-gray-800";
      case 4:
        return "bg-gray-50 border-purple-200 text-gray-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  // Colores para los botones de cada mes
  const getMesButtonColor = (mes: MesType) => {
    switch (mes) {
      case 1:
        return "bg-yellow-300 hover:bg-yellow-400 text-black cursor-pointer";
      case 2:
        return "bg-blue-300 hover:bg-blue-400 text-black cursor-pointer";
      case 3:
        return "bg-green-300 hover:bg-green-400 text-black cursor-pointer";
      case 4:
        return "bg-purple-300 hover:bg-purple-400 text-black cursor-pointer";
      default:
        return "bg-gray-300 hover:bg-gray-400 text-black cursor-pointer";
    }
  };

  // Obtener progreso existente para un mes específico
  const getProgresoForMes = (mes: MesType) => {
    return progresos.find((progreso) => progreso.mes === mes);
  };

  // Verificar si se puede crear progreso para un mes específico
  const canCreateProgresoForMes = (mes: MesType) => {
    // El mes 1 siempre se puede crear
    if (mes === 1) return true;

    // Para los meses 2, 3 y 4, verificar que el mes anterior tenga progreso
    const mesAnterior = (mes - 1) as MesType;
    const progresoMesAnterior = getProgresoForMes(mesAnterior);

    return !!progresoMesAnterior;
  };

  // Manejar clic en mes
  const handleMesClick = (mes: MesType) => {
    // Verificar si se puede crear progreso para este mes
    if (!canCreateProgresoForMes(mes)) {
      showAlert(
        "Debes completar el progreso del mes anterior antes de crear uno nuevo"
      );
      return;
    }

    setSelectedMes(mes);
    const progreso = getProgresoForMes(mes);

    if (progreso) {
      setProgresoExistente(progreso);
    } else {
      setProgresoExistente(null);
    }

    openCrear();
  };

  // Manejar progreso creado/actualizado
  const handleProgresoSaved = () => {
    if (progresoExistente) {
      showAlert("Progreso actualizado correctamente");
    } else {
      showAlert("Progreso creado correctamente");
    }

    // Refrescar los datos
    try {
      refreshProgresos();
      refreshAlumno();
    } catch (error) {
      console.error("Error al refrescar los datos:", error);
      showAlert(
        "Progreso procesado correctamente, pero hubo un problema al actualizar la vista"
      );
    }

    closeCrear();
  };

  // Estados de carga combinados
  const isLoading = isLoadingProgresos || isLoadingAlumno || isLoadingActions;
  const error = errorProgresos || errorAlumno;

  // Validar que tenemos el ID del alumno
  if (!estadiaAlumnoId) {
    return (
      <DashboardLayout title="Error">
        <div className="p-6 bg-red-50 rounded-lg border border-utn-error/30">
          <div className="flex items-start">
            <svg
              className="mr-3 w-6 h-6 text-utn-error"
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
                ID de alumno no válido
              </h3>
              <p className="text-sm text-utn-error/80">
                No se pudo identificar al alumno. Por favor, regresa a la lista
                de estadías.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/estadias")}
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
              <span>Volver a Estadías</span>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout
        title={`Progreso del Alumno ${alumno?.nombreAlumno || ""}`}
        needsSaludo={false}
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 animate-spin border-utn-primary"></div>
            <p className="text-base text-utn-secondary">
              Cargando progreso del alumno...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Error">
        <div className="p-6 bg-red-50 rounded-lg border border-utn-error/30">
          <div className="flex items-start">
            <svg
              className="mr-3 w-6 h-6 text-utn-error"
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
                Error al cargar el progreso del alumno
              </h3>
              <p className="text-sm text-utn-error/80">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                refreshProgresos();
                refreshAlumno();
              }}
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Reintentar</span>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Si no hay alumno, mostrar error
  if (!alumno) {
    return (
      <DashboardLayout title="Error">
        <div className="p-6 bg-red-50 rounded-lg border border-utn-error/30">
          <div className="flex items-start">
            <svg
              className="mr-3 w-6 h-6 text-utn-error"
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
                Alumno no encontrado
              </h3>
              <p className="text-sm text-utn-error/80">
                No se pudo encontrar la información del alumno. Por favor,
                regresa a la lista de estadías.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/estadias")}
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
              <span>Volver a Estadías</span>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout needsSaludo={false}>
      {/* Header con navegación */}
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              📊 Progreso del Alumno: {alumno.nombreAlumno}
            </h1>
            <div className="mt-2 space-y-1">
              {alumno.matricula && (
                <p className="text-utn-secondary">
                  🎓 Matrícula: {alumno.matricula}
                </p>
              )}
              {alumno.carrera && (
                <p className="text-utn-secondary">
                  🏫 Carrera: {alumno.carrera}
                </p>
              )}
              <p className="text-sm text-gray-500">
                📅 Estadía: {alumno.estadia.periodo}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(`/profesor/estadias/${alumno.estadia.id}`)}
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
            <span>Volver a Estadías</span>
          </Button>
        </div>
      </div>

      {/* Progreso Mensual */}
      <div className="space-y-4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            📈 Progreso Mensual
          </h2>
          <p className="text-utn-secondary">
            Selecciona un mes para registrar o editar el progreso del alumno
          </p>
        </div>

        {/* Grid de meses - Alineación vertical */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((mes) => {
            const progreso = getProgresoForMes(mes as MesType);
            const hasProgreso = !!progreso;
            const canCreate = canCreateProgresoForMes(mes as MesType);

            return (
              <div
                key={mes}
                className={`p-6 rounded-lg border-2 shadow-sm transition-all duration-200 hover:shadow-md flex flex-col justify-between ${getMesColor(
                  mes as MesType
                )}`}
              >
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    MES {mes}
                  </h3>

                  {hasProgreso ? (
                    <div className="space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">
                          Avance:
                        </span>
                        <span
                          className={`px-3 py-2 rounded-full text-sm font-medium ${
                            progreso.avance === "si"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {progreso.avance === "si" ? "Sí" : "No"}
                        </span>
                      </div>

                      {progreso.fechaEvaluacion && (
                        <div>
                          <span className="font-medium text-gray-800">
                            Fecha:
                          </span>
                          <p className="text-sm text-gray-700">
                            {new Date(
                              progreso.fechaEvaluacion
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {progreso.observaciones && (
                        <div>
                          <span className="font-medium text-gray-800">
                            Observaciones:
                          </span>
                          <p className="text-sm mt-1 text-gray-700">
                            {progreso.observaciones}
                          </p>
                        </div>
                      )}

                      {progreso.accionesTomadas && (
                        <div>
                          <span className="font-medium text-gray-800">
                            Acciones:
                          </span>
                          <p className="text-sm mt-1 text-gray-700">
                            {progreso.accionesTomadas}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-left">
                      <div className="mb-4 text-4xl">📝</div>
                      <p className="text-sm mb-4 text-gray-700">
                        {canCreate
                          ? "No hay progreso registrado para este mes"
                          : "Completa el mes anterior primero"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Botones al final de la card */}
                <div className="mt-auto pt-4">
                  {hasProgreso ? (
                    <Button
                      onClick={() => handleMesClick(mes as MesType)}
                      className={`w-full ${getMesButtonColor(
                        mes as MesType
                      )} opacity-80 hover:opacity-100`}
                    >
                      ✏️ Editar Progreso
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleMesClick(mes as MesType)}
                      disabled={!canCreate}
                      className={`w-full ${getMesButtonColor(
                        mes as MesType
                      )} opacity-80 hover:opacity-100 ${
                        !canCreate ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {canCreate ? "➕ Crear Progreso" : "🔒 Bloqueado"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal para crear/editar progreso */}
      <CrearProgresoModal
        isOpen={isCrearOpen}
        onClose={closeCrear}
        mes={selectedMes}
        estadiaAlumnoId={estadiaAlumnoId!}
        progresoExistente={progresoExistente}
        onProgresoSaved={handleProgresoSaved}
      />
    </DashboardLayout>
  );
}
