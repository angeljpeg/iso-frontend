import React, { useState, useEffect } from "react";
import { FormModal } from "./form-modal";
import { Input } from "../Input";
import { EstadoAvance } from "~/types/enums";
import type { Tema } from "~/types/carga-academica";
import type { CreateSeguimientoCursoDto } from "~/types/seguimientos";
import { getAuthHeaders, handleAuthError } from "~/utils/auth";
import { useNavigate } from "react-router";

interface CrearSeguimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tema: Tema | null;
  cargaAcademicaId: string;
  cuatrimestreId: string;
  onSeguimientoCreated?: () => void; // Agregar esta prop
}

export function CrearSeguimientoModal({
  isOpen,
  onClose,
  tema,
  cargaAcademicaId,
  cuatrimestreId,
  onSeguimientoCreated,
}: CrearSeguimientoModalProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    semana: 1,
    observacionesProfesor: "",
    justificacionRetraso: "",
    detalles: {
      temaId: "",
      estadoAvance: EstadoAvance.EN_PROGRESO,
      observaciones: "",
      horasProgramadas: 2,
      requiereRecuperacion: false,
    },
  });

  // Autocompletar datos cuando se abre el modal
  useEffect(() => {
    if (tema && isOpen) {
      setFormData((prev) => ({
        ...prev,
        semana: tema.semanaProgramada || 1,
        observacionesProfesor: `Seguimiento del tema: ${tema.nombre}`,
        detalles: {
          ...prev.detalles,
          temaId: `${tema.nombre}-${tema.unidad}`,
          observaciones: `Desarrollo del tema ${tema.nombre} - Unidad ${tema.unidad}`,
        },
      }));
    }
  }, [tema, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDetalleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      detalles: {
        ...prev.detalles,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const seguimientoData: CreateSeguimientoCursoDto = {
        semana: formData.semana,
        observacionesProfesor: formData.observacionesProfesor,
        justificacionRetraso: formData.justificacionRetraso,
        cargaAcademicaId,
        cuatrimestreId,
        detalles: [formData.detalles],
      };

      const response = await fetch("/api/seguimientos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(seguimientoData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError(navigate);
          return;
        }
        throw new Error("Error al crear el seguimiento");
      }

      // Éxito - cerrar modal y mostrar mensaje
      // Después del éxito:
      onClose();
      onSeguimientoCreated?.(); // Llamar callback si existe
      console.log("Seguimiento creado exitosamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setFormData({
      semana: 1,
      observacionesProfesor: "",
      justificacionRetraso: "",
      detalles: {
        temaId: "",
        estadoAvance: EstadoAvance.EN_PROGRESO,
        observaciones: "",
        horasProgramadas: 2,
        requiereRecuperacion: false,
      },
    });
    onClose();
  };

  if (!tema) return null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title="Crear Seguimiento de Curso"
      description={`📖 ${tema.nombre} • Unidad ${tema.unidad}`}
      submitText="Crear Seguimiento"
      cancelText="Cancelar"
      isLoading={isLoading}
      size="2xl"
    >
      {error && (
        <div className="p-3 mb-4 bg-red-50 rounded-md border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Información del tema */}
      <div className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-100">
        <h4 className="mb-2 text-lg font-medium text-gray-900">
          📋 Información del Tema
        </h4>
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <span className="text-gray-600">Semana programada:</span>
            <span className="ml-2 font-medium text-gray-900">
              {tema.semanaProgramada}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Unidad:</span>
            <span className="ml-2 font-medium text-gray-900">
              {tema.unidad}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Primera fila - Semana y Horas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Semana *
            </label>
            <Input
              type="number"
              value={formData.semana}
              onChange={(e) =>
                handleInputChange("semana", parseInt(e.target.value))
              }
              min={1}
              max={20}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Horas Programadas *
            </label>
            <Input
              type="number"
              value={formData.detalles.horasProgramadas}
              onChange={(e) =>
                handleDetalleChange(
                  "horasProgramadas",
                  parseInt(e.target.value)
                )
              }
              min={1}
              max={10}
              required
              className="w-full"
            />
          </div>
        </div>

        {/* Estado de Avance */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Estado de Avance *
          </label>
          <select
            value={formData.detalles.estadoAvance}
            onChange={(e) =>
              handleDetalleChange(
                "estadoAvance",
                e.target.value as EstadoAvance
              )
            }
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value={EstadoAvance.NO_INICIADO}>No Iniciado</option>
            <option value={EstadoAvance.EN_PROGRESO}>En Progreso</option>
            <option value={EstadoAvance.COMPLETADO}>Completado</option>
            <option value={EstadoAvance.RETRASADO}>Retrasado</option>
          </select>
        </div>

        {/* Observaciones del Profesor */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Observaciones del Profesor
          </label>
          <textarea
            value={formData.observacionesProfesor}
            onChange={(e) =>
              handleInputChange("observacionesProfesor", e.target.value)
            }
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Observaciones sobre el desarrollo del tema..."
          />
        </div>

        {/* Observaciones Adicionales */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Observaciones del Detalle
          </label>
          <textarea
            value={formData.detalles.observaciones}
            onChange={(e) =>
              handleDetalleChange("observaciones", e.target.value)
            }
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Observaciones adicionales sobre el progreso..."
          />
        </div>

        {/* Justificación de Retraso - Solo si está retrasado */}
        {formData.detalles.estadoAvance === EstadoAvance.RETRASADO && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Justificación del Retraso *
            </label>
            <textarea
              value={formData.justificacionRetraso}
              onChange={(e) =>
                handleInputChange("justificacionRetraso", e.target.value)
              }
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Explique las razones del retraso..."
              required
            />
          </div>
        )}

        {/* Checkbox de Recuperación */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="requiereRecuperacion"
            checked={formData.detalles.requiereRecuperacion}
            onChange={(e) =>
              handleDetalleChange("requiereRecuperacion", e.target.checked)
            }
            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
          />
          <label
            htmlFor="requiereRecuperacion"
            className="text-sm font-medium text-gray-700"
          >
            Requiere recuperación
          </label>
        </div>
      </div>
    </FormModal>
  );
}
