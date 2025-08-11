import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import {
  useAsignaturaCompleta,
  useTemasAsignatura,
} from "../hooks/asignaturas";
import { useCargaAcademica } from "../hooks/useCargaAcademica";
import { useSeguimientosByCargaAcademica } from "../hooks/programacion-curso";
import { TemaCard } from "../components/TemaCard";
import { Button } from "../components/ui/Button";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useModal } from "../hooks/use-modal";
import { useModalContext } from "../contexts/modal-context";
import { useAuthStore } from "../store/auth";
import type { Tema } from "../types/temas";
import {
  CrearSeguimientoModal,
  AgregarDetalleModal,
  SeleccionTipoModal,
  CrearAsesoriaModal,
} from "~/components/ui/modals";

export default function AsignaturaPage() {
  const { asignaturaId } = useParams<{ asignaturaId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { usuario } = useAuthStore();

  // Validar que tengamos asignaturaId
  if (!asignaturaId) {
    console.error("❌ No hay asignaturaId");
    return (
      <DashboardLayout title="Error">
        <div className="p-6 bg-red-50 rounded-lg border border-utn-error/30">
          <h3 className="text-lg font-semibold text-utn-error">
            Error: No se especificó la asignatura
          </h3>
          <Button
            onClick={() => navigate("/dashboard")}
            className="mt-4 text-white bg-utn-primary hover:bg-utn-primary-dark"
          >
            Volver al Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Validar que tengamos usuario
  if (!usuario) {
    console.error("❌ No hay usuario autenticado");
    return (
      <DashboardLayout title="Error">
        <div className="p-6 bg-red-50 rounded-lg border border-utn-error/30">
          <h3 className="text-lg font-semibold text-utn-error">
            Error: No hay usuario autenticado
          </h3>
          <Button
            onClick={() => navigate("/login")}
            className="mt-4 text-white bg-utn-primary hover:bg-utn-primary-dark"
          >
            Ir al Login
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Hooks para obtener datos
  const {
    asignatura,
    isLoading: isLoadingAsignatura,
    error: errorAsignatura,
  } = useAsignaturaCompleta(asignaturaId);
  const {
    temas,
    isLoading: isLoadingTemas,
    error: errorTemas,
  } = useTemasAsignatura(asignaturaId);
  // Hook para obtener carga académica relacionada con esta asignatura
  let cargasAcademicas: any[] = [];
  let isLoadingCarga = false;
  let errorCarga: string | null = null;

  try {
    const cargaAcademicaResult = useCargaAcademica({
      asignatura: asignaturaId,
      profesorId: usuario.id,
      actual: true,
      activo: true,
    });
    cargasAcademicas = cargaAcademicaResult.cargasAcademicas;
    isLoadingCarga = cargaAcademicaResult.isLoading;
    errorCarga = cargaAcademicaResult.error;
  } catch (err) {
    console.error("❌ Error en useCargaAcademica:", err);
    errorCarga = "Error al cargar cargas académicas";
  }

  // Obtener el grupo actual de la URL para filtrar la carga académica correcta
  const grupoActual = searchParams.get("grupoId");

  // Filtrar solo la carga académica del grupo actual
  const cargasDelGrupoActual = useMemo(() => {
    if (!grupoActual) {
      // Si no hay grupo específico, mostrar todas las cargas académicas
      return cargasAcademicas;
    }
    return cargasAcademicas.filter((carga) => carga.grupo.id === grupoActual);
  }, [cargasAcademicas, grupoActual]);

  // Hook para obtener seguimientos por carga académica del grupo actual
  const cargaAcademicaId = cargasDelGrupoActual[0]?.id;

  const {
    seguimientos,
    isLoading: isLoadingSeguimientos,
    error: errorSeguimientos,
    refresh: refreshSeguimientos,
  } = useSeguimientosByCargaAcademica({
    cargaAcademicaId: cargaAcademicaId, // Solo pasar si existe
    autoFetch: !!cargaAcademicaId, // Solo autoFetch si hay ID
  });

  // Modal hooks
  const {
    isOpen: isSeleccionOpen,
    openModal: openSeleccion,
    closeModal: closeSeleccion,
  } = useModal();
  const {
    isOpen: isCrearOpen,
    openModal: openCrear,
    closeModal: closeCrear,
  } = useModal();
  const {
    isOpen: isDetalleOpen,
    openModal: openDetalle,
    closeModal: closeDetalleBase,
  } = useModal();

  const {
    isOpen: isAsesoriaOpen,
    openModal: openAsesoria,
    closeModal: closeAsesoria,
  } = useModal();

  // Función personalizada para cerrar el modal con limpieza
  const closeDetalle = () => {
    // Limpiar el estado del detalle existente
    setDetalleExistente(null);
    // Cerrar el modal base
    closeDetalleBase();
  };
  const { showAlert } = useModalContext();

  const [selectedTema, setSelectedTema] = useState<Tema | null>(null);
  const [seguimientoId, setSeguimientoId] = useState<string>("");
  const [detalleExistente, setDetalleExistente] = useState<any>(null);

  const isCoordinador = usuario?.rol === "coordinador";
  const isProfesor =
    usuario?.rol === "profesor_tiempo_completo" ||
    usuario?.rol === "profesor_asignatura";

  // Obtener la primera carga académica del grupo actual
  const cargaAcademica = cargasDelGrupoActual[0];

  // Mostrar advertencia si no hay grupo específico y hay múltiples grupos
  const hayMultiplesGrupos = !grupoActual && cargasAcademicas.length > 1;

  // Log de advertencia cuando hay múltiples grupos
  useEffect(() => {
    if (hayMultiplesGrupos) {
      console.warn(
        "⚠️ Múltiples grupos detectados sin grupo específico. Se recomienda navegar desde la página del grupo."
      );
    }
  }, [hayMultiplesGrupos]);

  // Limpiar estado cuando el componente se desmonte
  useEffect(() => {
    return () => {
      setDetalleExistente(null);
      setSelectedTema(null);
      setSeguimientoId("");
    };
  }, []);

  // Limpiar estado cuando cambie la carga académica (grupo) - TEMPORALMENTE COMENTADO
  /*
  useEffect(() => {
    if (cargasDelGrupoActual.length > 0) {
      const nuevaCargaAcademica = cargasDelGrupoActual[0];
      // Si cambia la carga académica, limpiar el estado del detalle
      if (detalleExistente || seguimientoId) {
        console.log("⚠️ LIMPIANDO ESTADO por cambio de carga académica:", {
          detalleExistente: !!detalleExistente,
          seguimientoId: !!seguimientoId,
          nuevaCargaAcademica: nuevaCargaAcademica.id,
        });
        setDetalleExistente(null);
        setSeguimientoId("");
        setSelectedTema(null);
      }
    }
  }, [cargasDelGrupoActual, detalleExistente, seguimientoId]);
  */

  // Limpiar estado cuando cambie el grupo - TEMPORALMENTE COMENTADO
  /*
  useEffect(() => {
    if (grupoActual) {
      // Si cambia el grupo, limpiar completamente el estado
      console.log("⚠️ LIMPIANDO ESTADO por cambio de grupo:", {
        grupoActual,
        detalleExistente: !!detalleExistente,
        seguimientoId: !!seguimientoId,
        selectedTema: !!selectedTema,
      });
      setDetalleExistente(null);
      setSeguimientoId("");
      setSelectedTema(null);
    }
  }, [grupoActual, detalleExistente, seguimientoId, selectedTema]);
  */

  // Forzar carga de seguimientos cuando cambie la carga académica
  useEffect(() => {
    if (cargaAcademicaId && refreshSeguimientos) {
      // Pequeño delay para asegurar que el hook esté listo
      setTimeout(() => {
        refreshSeguimientos();
      }, 500);
    }
  }, [cargaAcademicaId, refreshSeguimientos]);

  const handleTemaClick = async (tema: Tema) => {
    if (!usuario) return;

    setSelectedTema(tema);
    openSeleccion();
  };

  const handleSeguimientoSelected = () => {
    closeSeleccion();

    if (isCoordinador) {
      openCrear();
    } else if (isProfesor) {
      try {
        // Verificar si ya existe un seguimiento para esta carga académica
        if (cargaAcademica) {
          // Si hay grupo específico, verificar que la carga académica corresponda
          if (grupoActual && cargaAcademica.grupo.id !== grupoActual) {
            console.warn("⚠️ Carga académica no corresponde al grupo actual:", {
              cargaAcademicaGrupo: cargaAcademica.grupo.id,
              grupoActual: grupoActual,
            });
            showAlert(
              "Error: La carga académica no corresponde al grupo actual"
            );
            return;
          }

          if (seguimientos.length > 0) {
            const seguimiento = seguimientos[0];

            // Verificar que el ID sea válido
            if (
              !seguimiento.id ||
              typeof seguimiento.id !== "string" ||
              seguimiento.id.trim() === ""
            ) {
              console.error("❌ ID del seguimiento inválido:", seguimiento.id);
              showAlert("Error: ID del seguimiento inválido");
              return;
            }

            setSeguimientoId(seguimiento.id);

            // Buscar si ya existe un detalle para este tema
            const detalleDelTema = seguimiento.detalles?.find(
              (detalle: any) => detalle.tema === selectedTema?.nombre
            );

            if (detalleDelTema) {
              // Si existe el detalle, pasarlo para edición
              setDetalleExistente(detalleDelTema);
            } else {
              // Si no existe, limpiar para crear nuevo
              setDetalleExistente(null);
            }

            // Agregar un pequeño delay para asegurar que el estado se establezca
            setTimeout(() => {
              openDetalle();
            }, 100);
          } else {
            showAlert(
              "No hay seguimientos creados para esta carga académica. Contacte al coordinador."
            );
          }
        } else {
          showAlert("No se encontró carga académica para esta asignatura");
        }
      } catch (error) {
        console.error("Error al verificar seguimientos:", error);
        showAlert("Error al verificar seguimientos");
      }
    }
  };

  const handleAsesoriaSelected = () => {
    closeSeleccion();
    openAsesoria();
  };

  const handleSeguimientoCreated = () => {
    showAlert("Seguimiento creado correctamente");

    // Refrescar los datos para que se refleje el nuevo seguimiento
    try {
      refreshSeguimientos();
    } catch (error) {
      console.error("Error al refrescar los datos:", error);
      // Mostrar alerta pero no bloquear el flujo
      showAlert(
        "Seguimiento creado correctamente, pero hubo un problema al actualizar la vista"
      );
    }

    closeCrear();
  };

  const handleDetalleCreated = () => {
    if (detalleExistente) {
      showAlert("Detalle guardado correctamente");
    } else {
      showAlert("Detalle agregado correctamente");
    }

    // Refrescar los datos para que se reflejen los cambios sin recargar la página
    try {
      refreshSeguimientos();
    } catch (error) {
      console.error("Error al refrescar los datos:", error);
      // Mostrar alerta pero no bloquear el flujo
      showAlert(
        "Detalle procesado correctamente, pero hubo un problema al actualizar la vista"
      );
    }

    closeDetalle();
  };

  const handleAsesoriaCreated = () => {
    showAlert("Asesoría creada correctamente");
    closeAsesoria();
  };

  // Estados de carga combinados
  const isLoading = isLoadingAsignatura || isLoadingTemas;
  const error = errorAsignatura || errorTemas;

  if (isLoading) {
    return (
      <DashboardLayout
        title={`Asignatura ${asignatura?.nombre || ""}`}
        needsSaludo={false}
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 animate-spin border-utn-primary"></div>
            <p className="text-base text-utn-secondary">
              Cargando asignatura...
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
                Error al cargar la asignatura
              </h3>
              <p className="text-sm text-utn-error/80">{error}</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!asignatura) {
    return (
      <DashboardLayout title="Asignatura no encontrada">
        <div className="py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Asignatura no encontrada
          </h2>
          <p className="mt-2 text-utn-secondary">
            La asignatura solicitada no existe o no tienes permisos para verla.
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="mt-4 text-white bg-utn-primary hover:bg-utn-primary-dark"
          >
            Volver al Dashboard
          </Button>
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
              📚 {asignatura?.nombre}
            </h1>
            {cargaAcademica && (
              <>
                <p className="mt-2 text-utn-secondary">
                  🎓 {cargaAcademica.carrera}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Grupo: {cargaAcademica.grupo.nombreGenerado} | Cuatrimestre:{" "}
                  {cargaAcademica.grupo.cuatrimestreRelacion.nombreGenerado}
                </p>
              </>
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

        {/* Advertencia cuando no hay grupo específico */}
        {hayMultiplesGrupos && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <svg
                className="mr-3 w-5 h-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  Múltiples grupos detectados
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Esta asignatura está asignada a múltiples grupos. Para una
                  mejor experiencia, navega desde la página específica del
                  grupo.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Temas */}
      <div className="space-y-4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            📋 Temas de la Asignatura
          </h2>
          <p className="text-utn-secondary">
            Selecciona un tema para crear un seguimiento de curso
          </p>
        </div>

        {/* Mensaje cuando no hay cargas académicas */}
        {!isLoadingCarga && cargasDelGrupoActual.length === 0 && (
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <svg
                className="mr-3 w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-blue-800">
                  No tienes cargas académicas para esta asignatura
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  {grupoActual
                    ? `No tienes asignaturas asignadas en el grupo ${grupoActual}`
                    : "No tienes asignaturas asignadas para esta asignatura"}
                </p>
              </div>
            </div>
          </div>
        )}

        {temas && temas.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {temas.map((tema: Tema, index: number) => (
              <div
                key={`${tema.nombre}-${tema.unidad}-${index}`}
                className={`flex flex-col justify-between p-4 h-full bg-white rounded-lg border border-gray-200 shadow-sm transition-shadow duration-200 ${
                  cargasDelGrupoActual.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-md cursor-pointer"
                }`}
              >
                <div className="flex-1">
                  <TemaCard tema={tema} onClick={() => handleTemaClick(tema)} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <div className="mb-4 text-6xl text-gray-400">📋</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No hay temas disponibles
            </h3>
            <p className="text-utn-secondary">
              Esta asignatura aún no tiene temas registrados.
            </p>
          </div>
        )}
      </div>

      {/* Modales */}
      <SeleccionTipoModal
        isOpen={isSeleccionOpen}
        onClose={closeSeleccion}
        tema={selectedTema}
        onSeguimientoSelected={handleSeguimientoSelected}
        onAsesoriaSelected={handleAsesoriaSelected}
      />

      {isCoordinador && (
        <CrearSeguimientoModal
          isOpen={isCrearOpen}
          onClose={closeCrear}
          tema={selectedTema!}
          cargaAcademicaId={cargaAcademica?.id || ""}
          onSeguimientoCreated={handleSeguimientoCreated}
        />
      )}

      {isProfesor && selectedTema && seguimientoId && (
        <AgregarDetalleModal
          isOpen={isDetalleOpen}
          onClose={closeDetalle}
          tema={selectedTema}
          seguimientoId={seguimientoId}
          detalleExistenteProp={detalleExistente}
          onDetalleCreated={handleDetalleCreated}
        />
      )}

      <CrearAsesoriaModal
        isOpen={isAsesoriaOpen}
        onClose={closeAsesoria}
        tema={selectedTema}
        cargaAcademicaId={cargaAcademica?.id || ""}
        onAsesoriaCreated={handleAsesoriaCreated}
      />
    </DashboardLayout>
  );
}
