import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../store/auth";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/ui/Button";
import { useAsignatura } from "../hooks/asignaturas/useAsignatura";
import { Card } from "../components/ui/Card";
import { getCargaByProfesor } from "../services/carga-academica.service";
import { tutoriasService } from "../services/tutorias.service";
import { CrearTutoriaModal } from "../components/ui/modals/crear-tutoria-modal";
import { AgregarDetalleTutoriaModal } from "../components/ui/modals/agregar-detalle-tutoria-modal";
import { getOneGrupo } from "../services/grupos";
import type { CargaAcademica } from "../types/carga-academica";
import type { Grupo } from "../types/grupos";
import type {
  Tutoria,
  CreateTutoriaDto,
  CreateTutoriaDetalleDto,
} from "../types/tutorias";

// Componente para mostrar una card de asignatura con datos del backend
function AsignaturaCardWithData({
  nombreAsignatura,
  carrera,
  grupoId,
}: {
  nombreAsignatura: string;
  carrera?: string;
  grupoId: string;
}) {
  const { asignatura, isLoading, error } = useAsignatura(nombreAsignatura);
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
    navigate(`/asignatura/${encodedName}?grupoId=${grupoId}`);
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

  // Estado para el grupo
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [grupoLoading, setGrupoLoading] = useState(true);
  const [grupoError, setGrupoError] = useState<string | null>(null);

  // Estado para las cargas académicas del profesor logueado
  const [misCargasAcademicas, setMisCargasAcademicas] = useState<
    CargaAcademica[]
  >([]);
  const [cargasLoading, setCargasLoading] = useState(true);
  const [cargasError, setCargasError] = useState<string | null>(null);

  // Estado para las tutorías
  const [tutorias, setTutorias] = useState<Tutoria[]>([]);
  const [tutoriasLoading, setTutoriasLoading] = useState(false);
  const [tutoriasError, setTutoriasError] = useState<string | null>(null);
  const [tutoriasCargadas, setTutoriasCargadas] = useState(false);

  // Asegurar que tutorias sea siempre un array
  const tutoriasSeguras = Array.isArray(tutorias) ? tutorias : [];

  // Estado para los modales
  const [showCrearTutoriaModal, setShowCrearTutoriaModal] = useState(false);
  const [showAgregarDetalleModal, setShowAgregarDetalleModal] = useState(false);
  const [tutoriaSeleccionada, setTutoriaSeleccionada] =
    useState<Tutoria | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Cargar datos del grupo una sola vez
  useEffect(() => {
    const fetchGrupo = async () => {
      if (!accessToken || !grupoId) return;

      try {
        setGrupoLoading(true);
        setGrupoError(null);
        const response = await getOneGrupo({ token: accessToken, id: grupoId });
        setGrupo(response);
      } catch (err) {
        console.error("Error cargando grupo:", err);
        setGrupoError(
          err instanceof Error ? err.message : "Error al cargar el grupo"
        );
      } finally {
        setGrupoLoading(false);
      }
    };

    if (isAuthenticated && accessToken && grupoId) {
      fetchGrupo();
    }
  }, [isAuthenticated, accessToken, grupoId]);

  // Cargar las cargas académicas del profesor logueado
  useEffect(() => {
    const fetchMisCargasAcademicas = async () => {
      if (!accessToken || !grupoId || !useAuthStore.getState().usuario?.id)
        return;

      try {
        setCargasLoading(true);
        setCargasError(null);

        // Obtener solo las cargas del profesor logueado
        const data = await getCargaByProfesor({
          profesorId: useAuthStore.getState().usuario!.id,
          token: accessToken,
        });

        // Filtrar solo las cargas que pertenecen al grupo actual
        const cargasDelGrupoActual = data.data.filter(
          (carga) => carga.grupoId === grupoId
        );

        setMisCargasAcademicas(cargasDelGrupoActual);
      } catch (err) {
        console.error("Error cargando cargas académicas:", err);
        setCargasError(
          err instanceof Error ? err.message : "Error al cargar mis asignaturas"
        );
      } finally {
        setCargasLoading(false);
      }
    };

    if (isAuthenticated && accessToken && grupoId) {
      fetchMisCargasAcademicas();
    }
  }, [isAuthenticated, accessToken, grupoId]);

  // Las cargas ya están filtradas por grupo y profesor, no necesitamos filtrar de nuevo
  const cargasDelGrupo = misCargasAcademicas;

  // Verificar si el profesor es tutor del grupo
  const esTutorDelGrupo = cargasDelGrupo.some((carga) => carga.esTutor);
  const cargaTutoria = cargasDelGrupo.find((carga) => carga.esTutor);

  // Función para cargar las tutorías del grupo
  const cargarTutorias = useCallback(async () => {
    if (
      !accessToken ||
      !esTutorDelGrupo ||
      !cargaTutoria?.id ||
      tutoriasCargadas
    ) {
      return;
    }

    try {
      setTutoriasLoading(true);
      setTutoriasError(null);
      const response = await tutoriasService.getByCargaAcademica(
        cargaTutoria.id,
        accessToken
      );
      setTutorias(response);
      setTutoriasCargadas(true);
    } catch (err) {
      console.error("Error en cargarTutorias:", err);
      setTutoriasError(
        err instanceof Error ? err.message : "Error al cargar las tutorías"
      );
    } finally {
      setTutoriasLoading(false);
    }
  }, [accessToken, esTutorDelGrupo, cargaTutoria, tutoriasCargadas]);

  // Cargar tutorías solo cuando sea necesario y si el profesor es tutor
  useEffect(() => {
    // Evitar cargar si ya están cargando o si ya se cargaron
    if (
      isAuthenticated &&
      accessToken &&
      grupoId &&
      cargasDelGrupo.length > 0 &&
      esTutorDelGrupo &&
      !tutoriasLoading &&
      !tutoriasCargadas
    ) {
      cargarTutorias();
    }
  }, [
    isAuthenticated,
    accessToken,
    grupoId,
    cargasDelGrupo,
    esTutorDelGrupo,
    cargarTutorias,
  ]);

  // Función para crear una nueva tutoría
  const handleCrearTutoria = async (tutoriaData: CreateTutoriaDto) => {
    if (!accessToken || !cargaTutoria) return;

    try {
      setIsSubmitting(true);
      const response = await tutoriasService.create(tutoriaData, accessToken);
      console.log("Respuesta de crear tutoría:", response);
      setTutorias((prev) => [...prev, response.data]);
      setShowCrearTutoriaModal(false);
      toast.success("Tutoría creada exitosamente");
    } catch (err) {
      console.error("Error al crear tutoría:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear la tutoría";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para recargar las tutorías
  const recargarTutorias = useCallback(async () => {
    setTutoriasCargadas(false);
    await cargarTutorias();
  }, [cargarTutorias]);

  // Función para agregar detalle a una tutoría
  const handleAgregarDetalle = async (detalleData: CreateTutoriaDetalleDto) => {
    if (!accessToken || !tutoriaSeleccionada) return;

    try {
      setIsSubmitting(true);
      const detalleConTutoriaId = {
        ...detalleData,
        tutoriaId: tutoriaSeleccionada.id,
      };
      const response = await tutoriasService.addDetalle(
        detalleConTutoriaId,
        accessToken
      );

      console.log("Respuesta de agregar detalle:", response);

      // Verificar que la respuesta sea válida antes de actualizar
      if (response && response.id) {
        console.log("Detalle creado exitosamente:", response);

        // Recargar las tutorías para obtener datos actualizados
        await recargarTutorias();
      } else {
        console.warn("Respuesta inesperada del backend:", response);
      }

      setShowAgregarDetalleModal(false);
      setTutoriaSeleccionada(null);
    } catch (err) {
      console.error("Error al agregar detalle:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al agregar el detalle";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para abrir el modal de agregar detalle
  const handleTutoriaClick = (tutoria: Tutoria) => {
    setTutoriaSeleccionada(tutoria);
    setShowAgregarDetalleModal(true);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (!isAuthenticated) {
    return null;
  }

  const isLoading = grupoLoading || cargasLoading;
  const error = grupoError || cargasError;

  return (
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
                      No tienes asignaturas asignadas en este grupo específico.
                    </p>
                  </div>
                </div>
              ) : (
                cargasDelGrupo.map((carga) => (
                  <AsignaturaCardWithData
                    key={carga.id}
                    nombreAsignatura={carga.asignatura}
                    carrera={carga.carrera}
                    grupoId={grupoId!}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Sección de Tutorías (solo si el profesor es tutor) */}
        {esTutorDelGrupo && (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="mb-2 text-xl font-bold text-gray-900">
                    📚 Tutorías del Grupo
                  </h2>
                  <p className="text-gray-600">
                    Gestiona las tutorías y agrega detalles de los alumnos
                  </p>
                </div>
                <Button
                  onClick={() => setShowCrearTutoriaModal(true)}
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Nueva Tutoría</span>
                </Button>
              </div>

              {tutoriasLoading && (
                <div className="flex justify-center items-center h-32">
                  <div className="text-center">
                    <div className="mx-auto mb-4 w-8 h-8 rounded-full border-b-2 animate-spin border-utn-primary"></div>
                    <p className="text-gray-600">Cargando tutorías...</p>
                  </div>
                </div>
              )}

              {tutoriasError && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-red-700">{tutoriasError}</p>
                </div>
              )}

              {!tutoriasLoading && !tutoriasError && (
                <div className="space-y-4">
                  {tutoriasSeguras.length === 0 ? (
                    <div className="py-8 text-center">
                      <div className="p-6 bg-gray-50 rounded-lg">
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
                          No hay tutorías registradas
                        </h4>
                        <p className="text-gray-500">
                          Crea tu primera tutoría para comenzar a gestionar el
                          grupo
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {tutoriasSeguras.map((tutoria) => (
                        <Card
                          key={tutoria.id}
                          className="p-4 transition-shadow duration-200 cursor-pointer hover:shadow-md hover:bg-gray-50"
                          onClick={() => handleTutoriaClick(tutoria)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-gray-900">
                              Tutoría del{" "}
                              {new Date(tutoria.fecha).toLocaleDateString(
                                "es-ES"
                              )}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                tutoria.estado === "completado"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {tutoria.estado === "completado"
                                ? "Completada"
                                : "En Progreso"}
                            </span>
                          </div>

                          {tutoria.observaciones && (
                            <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                              {tutoria.observaciones}
                            </p>
                          )}

                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{tutoria.detalles?.length || 0} alumnos</span>
                            <span>Haz clic para agregar detalles</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modales */}
        {showCrearTutoriaModal && grupo && cargaTutoria && (
          <CrearTutoriaModal
            isOpen={showCrearTutoriaModal}
            onClose={() => setShowCrearTutoriaModal(false)}
            onSubmit={handleCrearTutoria}
            isLoading={isSubmitting}
            grupo={grupo}
            nombreTutor={`${cargaTutoria.profesor?.nombre || ""} ${
              cargaTutoria.profesor?.apellido || ""
            }`}
            cargaAcademicaId={cargaTutoria.id}
          />
        )}

        {showAgregarDetalleModal && tutoriaSeleccionada && (
          <AgregarDetalleTutoriaModal
            isOpen={showAgregarDetalleModal}
            onClose={() => {
              setShowAgregarDetalleModal(false);
              setTutoriaSeleccionada(null);
            }}
            onSubmit={handleAgregarDetalle}
            isLoading={isSubmitting}
            tutoriaId={tutoriaSeleccionada.id}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
