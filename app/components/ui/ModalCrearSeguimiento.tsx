import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "./Button";
import { Input } from "./Input";
import { useAuthStore } from "../../store/auth";
import { getAuthHeaders, handleAuthError } from "../../utils/auth";
import type { Tema } from "../../types/carga-academica";
import type { CreateSeguimientoCursoDto } from "../../types/seguimientos";
import { EstadoAvance } from "../../types/enums";

interface ModalCrearSeguimientoProps {
  isOpen: boolean;
  onClose: () => void;
  tema: Tema;
  cargaAcademicaId: string;
  cuatrimestreId: string;
}

export function ModalCrearSeguimiento({
  isOpen,
  onClose,
  tema,
  cargaAcademicaId,
  cuatrimestreId,
}: ModalCrearSeguimientoProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    semana: 1,
    observacionesProfesor: "",
    justificacionRetraso: "",
    detalles: [
      {
        temaId: "",
        estadoAvance: EstadoAvance.EN_PROGRESO,
        observaciones: "",
        horasProgramadas: tema?.horasProgramadas,
        requiereRecuperacion: false,
      },
    ],
  });

  // Autocompletado basado en el tema seleccionado
  useEffect(() => {
    if (tema && isOpen) {
      setFormData((prev) => ({
        ...prev,
        semana: tema.semanaRecomendada || 1,
        observacionesProfesor: `Seguimiento del tema: ${tema.nombre}`,
        detalles: [
          {
            ...prev.detalles[0],
            temaId: tema.id,
            observaciones: `Desarrollo del tema ${tema.nombre} - Unidad ${tema.unidad}`,
          },
        ],
      }));
    }
  }, [tema, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDetalleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      detalles: [
        {
          ...prev.detalles[0],
          [field]: value,
        },
      ],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const seguimientoData: CreateSeguimientoCursoDto = {
        cargaAcademicaId,
        cuatrimestreId,
        semana: formData.semana,
        observacionesProfesor: formData.observacionesProfesor,
        justificacionRetraso: formData.justificacionRetraso || undefined,
        detalles: formData.detalles.map((detalle) => ({
          ...detalle,
        })),
      };

      const response = await fetch(
        "http://localhost:3000/programacion-seguimiento-curso",
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
          },
          body: JSON.stringify(seguimientoData),
        }
      );

      if (!response.ok) {
        handleAuthError(response.status);
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el seguimiento");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
    onClose();
  };

  const handleNavigation = (route: string) => {
    handleClose();
    navigate(route);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop con transición */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Modal Container */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 px-4 pointer-events-none`}
      >
        <div
          className={`bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto transform transition-all duration-300 ease-out ${
            isOpen
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con gradiente sutil */}

          <div className="sticky top-0 z-10 bg-white shadow-sm px-6 py-4 border-b flex justify-between items-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#3e9530] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-heading-md font-semibold text-gray-900">
                    Crear Seguimiento de Curso
                  </h2>
                  <p className="text-body-sm text-gray-600 mt-1">
                    📖 <strong>{tema.nombre}</strong> • Unidad {tema.unidad}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Contenido del modal con scroll suave */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="p-6">
              {/* Contenido del modal */}
              {success ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-heading-md font-semibold text-gray-900 mb-3">
                    ¡Seguimiento creado exitosamente!
                  </h3>
                  <p className="text-body-sm text-gray-600 mb-8 max-w-md mx-auto">
                    El seguimiento del tema <strong>{tema.nombre}</strong> ha
                    sido registrado correctamente.
                  </p>

                  {/* Botones de navegación con estilo mejorado */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      className="min-w-[140px]"
                    >
                      Cerrar
                    </Button>
                    <Button
                      onClick={() => handleNavigation("/dashboard")}
                      className="min-w-[140px]"
                    >
                      Ir al Dashboard
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleNavigation("/seguimientos")}
                      className="min-w-[140px]"
                    >
                      Ver Seguimientos
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error message con mejor diseño */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                      <svg
                        className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
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
                        <h4 className="text-body-sm font-medium text-red-800">
                          Error al crear el seguimiento
                        </h4>
                        <p className="text-body-sm text-red-600 mt-1">
                          {error}
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Información del tema con mejor diseño */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-gray-100">
                    <h4 className="text-body-lg font-medium text-gray-900 mb-2">
                      📋 Información del Tema
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-sm">
                      <div>
                        <span className="text-gray-600">Tema:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {tema.nombre}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Unidad:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {tema.unidad}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Semana recomendada:
                        </span>
                        <span className="ml-2 font-medium text-gray-900">
                          {tema.semanaRecomendada}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Estado:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {tema.activo ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Formulario con mejor espaciado */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Semana */}
                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Semana *
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.semana}
                        onChange={(e) =>
                          handleInputChange("semana", parseInt(e.target.value))
                        }
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Estado de avance */}
                    <div>
                      <label className="block text-body-sm font-medium text-black mb-2">
                        Estado de Avance *
                      </label>
                      <select
                        value={
                          formData.detalles[0]?.estadoAvance ||
                          EstadoAvance.EN_PROGRESO
                        }
                        onChange={(e) =>
                          handleDetalleChange(
                            "estadoAvance",
                            e.target.value as EstadoAvance
                          )
                        }
                        className="text-black w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e9530]/20 focus:border-[#3e9530] transition-all duration-200"
                        required
                      >
                        <option value={EstadoAvance.NO_INICIADO}>
                          No Iniciado
                        </option>
                        <option value={EstadoAvance.EN_PROGRESO}>
                          En Progreso
                        </option>
                        <option value={EstadoAvance.COMPLETADO}>
                          Completado
                        </option>
                        <option value={EstadoAvance.RETRASADO}>
                          Retrasado
                        </option>
                      </select>
                    </div>
                  </div>
                  Eliminar todo este bloque (líneas 380-420 aproximadamente):
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-body-sm font-medium text-gray-700 mb-2">
                        Horas Programadas *
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        value={formData.detalles[0]?.horasProgramadas || 2}
                        onChange={(e) =>
                          handleDetalleChange(
                            "horasProgramadas",
                            parseFloat(e.target.value)
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                  {/* Observaciones del profesor */}
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Observaciones del Profesor
                    </label>
                    <textarea
                      value={formData.observacionesProfesor}
                      onChange={(e) =>
                        handleInputChange(
                          "observacionesProfesor",
                          e.target.value
                        )
                      }
                      className="text-black w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e9530]/20 focus:border-[#3e9530] transition-all duration-200 resize-none"
                      rows={3}
                      placeholder="Observaciones generales sobre el desarrollo de la clase..."
                    />
                  </div>
                  {/* Observaciones específicas */}
                  <div>
                    <label className="block text-body-sm font-medium text-gray-700 mb-2">
                      Observaciones Específicas del Tema
                    </label>
                    <textarea
                      value={formData.detalles[0]?.observaciones || ""}
                      onChange={(e) =>
                        handleDetalleChange("observaciones", e.target.value)
                      }
                      className="text-black w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e9530]/20 focus:border-[#3e9530] transition-all duration-200 resize-none"
                      rows={3}
                      placeholder="Observaciones específicas sobre este tema..."
                    />
                  </div>
                  {/* Justificación de retraso (condicional) */}
                  {formData.detalles[0]?.estadoAvance ===
                    EstadoAvance.RETRASADO && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <label className="block text-body-sm font-medium text-yellow-800 mb-2">
                        ⚠️ Justificación del Retraso *
                      </label>
                      <textarea
                        value={formData.justificacionRetraso}
                        onChange={(e) =>
                          handleInputChange(
                            "justificacionRetraso",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200 resize-none"
                        rows={3}
                        placeholder="Explica las razones del retraso..."
                        required
                      />
                    </div>
                  )}
                  {/* Checkbox de recuperación */}
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="requiereRecuperacion"
                      checked={
                        formData.detalles[0]?.requiereRecuperacion || false
                      }
                      onChange={(e) =>
                        handleDetalleChange(
                          "requiereRecuperacion",
                          e.target.checked
                        )
                      }
                      className="h-5 w-5 text-[#3e9530] focus:ring-[#3e9530] border-gray-300 rounded transition-all duration-200"
                    />
                    <label
                      htmlFor="requiereRecuperacion"
                      className="text-body-sm text-gray-700 font-medium"
                    >
                      🔄 Este tema requiere recuperación
                    </label>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Footer con botones (solo si no es success) */}
          {!success && (
            <div className="sticky bottom-0 z-10 bg-gray-50 shadow-inner px-6 py-4 border-t flex justify-end gap-3">
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="min-w-[100px]"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  loading={isLoading}
                  onClick={handleSubmit}
                  className="min-w-[140px]"
                >
                  Crear Seguimiento
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
