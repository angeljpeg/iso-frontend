import { useSearchParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import { useCargaAcademica } from "../hooks/useCargaAcademica";
import { useTemas } from "../hooks/useTemas";
import { useSeguimientoIndividual } from "../hooks/useSeguimientoIndividual";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { EstadoBadge } from "../components/ui/EstadoBadge";
import { IndicadorRetraso } from "../components/ui/IndicadorRetraso";
import type { AvanceSemana, NivelRetraso } from "../types/seguimiento";

export default function SeguimientoPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { usuario, isAuthenticated } = useAuthStore();

  const temaId = searchParams.get("temaId");
  const grupoId = searchParams.get("grupoId");
  const seguimientoId = searchParams.get("seguimientoId");

  // Estados para el modal de justificación
  const [modalJustificacion, setModalJustificacion] = useState<{
    isOpen: boolean;
    semana: number;
    temaEsperado: string;
  }>({
    isOpen: false,
    semana: 0,
    temaEsperado: "",
  });

  // Cargar datos del grupo y temas
  const { cargasAcademicas } = useCargaAcademica();
  const cargasDelGrupo = cargasAcademicas.filter(
    (carga) => carga.grupo.id === grupoId
  );
  const asignaturaId = cargasDelGrupo[0]?.asignatura;
  const { temas } = useTemas(asignaturaId || "");

  // Hook para el seguimiento
  const {
    seguimiento,
    isLoading,
    error,
    isSaving,
    hasUnsavedChanges,
    actualizarAvanceSemana,
    enviarSeguimiento,
    guardarManual,
  } = useSeguimientoIndividual(seguimientoId || undefined);

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
    navigate("/dashboard");
  };

  const handleAvanceChange = (
    semana: number,
    campo: keyof AvanceSemana,
    valor: string
  ) => {
    actualizarAvanceSemana(semana, { [campo]: valor });
  };

  const handleJustificarRetraso = (semana: number, temaEsperado: string) => {
    setModalJustificacion({
      isOpen: true,
      semana,
      temaEsperado,
    });
  };

  const handleConfirmarJustificacion = (justificacion: string) => {
    actualizarAvanceSemana(modalJustificacion.semana, {
      justificacionRetraso: justificacion,
    });
  };

  const handleEnviarSeguimiento = async () => {
    if (!seguimiento) return;

    // Validar que no hay retrasos críticos sin justificar
    const retrasosSinJustificar = seguimiento.avancesSemanales.some(
      (avance) =>
        avance.nivelRetraso === "retraso_critico" &&
        !avance.justificacionRetraso
    );

    if (retrasosSinJustificar) {
      alert(
        "No puedes enviar el seguimiento con retrasos críticos sin justificar."
      );
      return;
    }

    if (
      confirm(
        "¿Estás seguro de que quieres enviar este seguimiento para revisión?"
      )
    ) {
      try {
        await enviarSeguimiento();
        alert("Seguimiento enviado exitosamente.");
      } catch (error) {
        alert("Error al enviar el seguimiento: " + (error as Error).message);
      }
    }
  };

  const calcularNivelRetraso = (
    semana: number,
    temaEsperado: string
  ): NivelRetraso => {
    // Lógica simplificada: si no hay avance, es retraso crítico
    const avance = seguimiento?.avancesSemanales.find(
      (a) => a.semana === semana
    );
    if (!avance || !avance.avanceLogrado.trim()) {
      return "retraso_critico";
    }
    return "sin_retraso";
  };

  const grupo = cargasDelGrupo[0]?.grupo;
  const asignatura = cargasDelGrupo[0]?.asignatura;

  if (
    !isAuthenticated ||
    (usuario?.rol !== "profesor_tiempo_completo" &&
      usuario?.rol !== "profesor_asignatura")
  ) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
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
                Seguimiento - {asignatura} - {grupo?.nombreGenerado}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              {seguimiento && <EstadoBadge estado={seguimiento.estado} />}
              {hasUnsavedChanges && (
                <span className="text-sm text-orange-600">
                  💾 Cambios sin guardar
                </span>
              )}
              {isSaving && (
                <span className="text-sm text-blue-600">💾 Guardando...</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
                <p className="text-gray-600">Cargando seguimiento...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-red-400"
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
                    Error al cargar el seguimiento
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Información del seguimiento */}
              <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      📚 Asignatura
                    </h3>
                    <p className="text-gray-700">{asignatura}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      🏷️ Grupo
                    </h3>
                    <p className="text-gray-700">{grupo?.nombreGenerado}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      📅 Periodo
                    </h3>
                    <p className="text-gray-700">
                      {grupo?.cuatrimestreRelacion.nombreGenerado}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabla de seguimiento semanal */}
              <div className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Seguimiento Semanal
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Registra el avance de cada semana según el plan de estudios
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Semana
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Tema Esperado
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Avance Logrado
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Observaciones
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {temas.map((tema) => {
                        const avance = seguimiento?.avancesSemanales.find(
                          (a) => a.semana === tema.semanaProgramada
                        );
                        const nivelRetraso = calcularNivelRetraso(
                          tema.semanaProgramada,
                          tema.nombre
                        );
                        const isEditable =
                          seguimiento?.estado === "borrador" ||
                          seguimiento?.estado === "rechazado";

                        return (
                          <tr
                            key={tema.nombre}
                            className={
                              nivelRetraso === "retraso_critico"
                                ? "bg-red-50"
                                : ""
                            }
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                              Semana {tema.semanaProgramada}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                              {tema.nombre}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Input
                                value={avance?.avanceLogrado || ""}
                                onChange={(e) =>
                                  handleAvanceChange(
                                    tema.semanaProgramada,
                                    "avanceLogrado",
                                    e.target.value
                                  )
                                }
                                placeholder="Describe el avance logrado..."
                                disabled={!isEditable}
                                className={
                                  nivelRetraso === "retraso_critico"
                                    ? "border-red-300"
                                    : ""
                                }
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Input
                                value={avance?.observaciones || ""}
                                onChange={(e) =>
                                  handleAvanceChange(
                                    tema.semanaProgramada,
                                    "observaciones",
                                    e.target.value
                                  )
                                }
                                placeholder="Observaciones opcionales..."
                                disabled={!isEditable}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <IndicadorRetraso nivel={nivelRetraso} />
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {nivelRetraso === "retraso_critico" &&
                                isEditable && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleJustificarRetraso(
                                        tema.semanaProgramada,
                                        tema.nombre
                                      )
                                    }
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                  >
                                    Justificar
                                  </Button>
                                )}
                              {avance?.justificacionRetraso && (
                                <div className="mt-1 text-xs text-gray-500">
                                  ✅ Justificado
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Acciones */}
              {seguimiento &&
                (seguimiento.estado === "borrador" ||
                  seguimiento.estado === "rechazado") && (
                  <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-3">
                        <Button
                          onClick={guardarManual}
                          disabled={isSaving}
                          variant="outline"
                        >
                          {isSaving ? "Guardando..." : "💾 Guardar"}
                        </Button>
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          onClick={handleEnviarSeguimiento}
                          disabled={isSaving}
                        >
                          📤 Enviar Seguimiento
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

              {/* Comentarios del revisor */}
              {seguimiento?.comentariosRevisor && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="mb-2 text-sm font-medium text-blue-800">
                    💬 Comentarios del Revisor
                  </h3>
                  <p className="text-sm text-blue-700">
                    {seguimiento.comentariosRevisor}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
