import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAsignatura } from "../hooks/useAsignatura";
import { TemaCard } from "../components/TemaCard";
import { Button } from "../components/ui/Button";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useModal } from "../hooks/use-modal";
import { useModalContext } from "../contexts/modal-context";
import { useAuthStore } from "../store/auth";
import type { Tema } from "../types/temas";
import { getAuthHeaders, handleAuthErrorWithStatus } from "~/utils/auth";
import { API_BASE_URL } from "~/services/api-config";
import { CrearSeguimientoModal } from "~/components/ui/modals/crear-seguimiento-modal";
import { AgregarDetalleModal } from "~/components/ui/modals/agregar-detalle-modal";

export default function AsignaturaPage() {
  const { asignaturaId } = useParams<{ asignaturaId: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuthStore();
  const { asignatura, cargaAcademica, isLoading, error } = useAsignatura(
    asignaturaId!
  );

  // Modal hooks
  const {
    isOpen: isCrearOpen,
    openModal: openCrear,
    closeModal: closeCrear,
  } = useModal();
  const {
    isOpen: isDetalleOpen,
    openModal: openDetalle,
    closeModal: closeDetalle,
  } = useModal();
  const { showAlert } = useModalContext();
  const [selectedTema, setSelectedTema] = useState<Tema | null>(null);
  const [seguimientoId, setSeguimientoId] = useState<string>("");

  const isCoordinador = usuario?.rol === "coordinador";
  const isProfesor =
    usuario?.rol === "profesor_tiempo_completo" ||
    usuario?.rol === "profesor_asignatura";

  const handleTemaClick = async (tema: Tema) => {
    if (!usuario || !cargaAcademica) return;

    setSelectedTema(tema);

    if (isCoordinador) {
      openCrear();
    } else if (isProfesor) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/programacion-seguimiento-curso?cargaAcademicaId=${cargaAcademica.id}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (response.ok) {
          const seguimientos = await response.json();
          if (seguimientos.length > 0) {
            setSeguimientoId(seguimientos[0].id);
            openDetalle();
          } else {
            showAlert(
              "No hay seguimientos creados para esta carga académica. Contacte al coordinador."
            );
          }
        } else {
          handleAuthErrorWithStatus(response.status);
        }
      } catch (error) {
        console.error("Error al verificar seguimientos:", error);
        showAlert("Error al verificar seguimientos");
      }
    }
  };

  const handleSeguimientoCreated = () => {
    showAlert("Seguimiento creado correctamente");
    closeCrear();
  };

  const handleDetalleCreated = () => {
    showAlert("Detalle agregado correctamente");
    closeDetalle();
  };

  if (isLoading) {
    return (
      <DashboardLayout title={`Asignatura ${asignatura?.nombre || ""}`}>
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
    <DashboardLayout>
      {/* Header con navegación */}
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              📚 {asignatura?.nombre}
            </h1>
            <p className="mt-2 text-utn-secondary">
              🎓 {cargaAcademica?.carrera}
            </p>
            {cargaAcademica && (
              <p className="mt-1 text-sm text-gray-500">
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
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            📋 Temas de la Asignatura
          </h2>
          <p className="text-utn-secondary">
            Selecciona un tema para crear un seguimiento de curso
          </p>
        </div>

        {asignatura?.temas && asignatura.temas.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {asignatura.temas.map((tema: Tema, index: number) => (
              <div
                key={`${tema.nombre}-${tema.unidad}-${index}`}
                className="flex flex-col justify-between p-4 h-full bg-white rounded-lg border border-gray-200 shadow-sm transition-shadow duration-200 hover:shadow-md"
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
      {isCoordinador && (
        <CrearSeguimientoModal
          isOpen={isCrearOpen}
          onClose={closeCrear}
          tema={selectedTema!}
          cargaAcademicaId={cargaAcademica?.id || ""}
          onSeguimientoCreated={handleSeguimientoCreated}
        />
      )}

      {isProfesor && (
        <AgregarDetalleModal
          isOpen={isDetalleOpen}
          onClose={closeDetalle}
          tema={selectedTema}
          seguimientoId={seguimientoId}
          onDetalleCreated={handleDetalleCreated}
        />
      )}
    </DashboardLayout>
  );
}
