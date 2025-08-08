import React, { useState, useEffect } from "react";
import { FormModal } from "./form-modal";
import { Input } from "../Input";
import { EstadoAvance } from "~/types/enums";
import type { Tema } from "~/types/carga-academica";
import { getAuthHeaders, handleAuthError } from "~/utils/auth";
import { useNavigate } from "react-router";

interface AgregarDetalleModalProps {
  isOpen: boolean;
  onClose: () => void;
  tema: Tema | null;
  seguimientoId: string;
  onDetalleCreated?: () => void;
}

export function AgregarDetalleModal({
  isOpen,
  onClose,
  tema,
  seguimientoId,
  onDetalleCreated,
}: AgregarDetalleModalProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    tema: "",
    semanaTerminada: 1,
    estadoAvance: EstadoAvance.EN_PROGRESO,
    observaciones: "",
    justificacion: "",
    acciones: "",
    evidencias: "",
  });

  useEffect(() => {
    if (tema && isOpen) {
      setFormData((prev) => ({
        ...prev,
        tema: tema.nombre,
        semanaTerminada: tema.semanaProgramada || 1,
        observaciones: `Desarrollo del tema ${tema.nombre} - Unidad ${tema.unidad}`,
      }));
    }
  }, [tema, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/programacion-seguimiento-curso/${seguimientoId}/detalles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError(navigate);
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al agregar el detalle");
      }

      onClose();
      onDetalleCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar Detalle al Seguimiento"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Tema
          </label>
          <Input
            value={formData.tema}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, tema: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Semana Terminada
          </label>
          <Input
            type="number"
            min="1"
            value={formData.semanaTerminada}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                semanaTerminada: parseInt(e.target.value),
              }))
            }
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Estado del Avance
          </label>
          <select
            value={formData.estadoAvance}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                estadoAvance: e.target.value as EstadoAvance,
              }))
            }
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value={EstadoAvance.NO_INICIADO}>No Iniciado</option>
            <option value={EstadoAvance.EN_PROGRESO}>En Progreso</option>
            <option value={EstadoAvance.COMPLETADO}>Completado</option>
            <option value={EstadoAvance.RETRASADO}>Retrasado</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Observaciones
          </label>
          <textarea
            value={formData.observaciones}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                observaciones: e.target.value,
              }))
            }
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        {formData.estadoAvance === EstadoAvance.RETRASADO && (
          <>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Justificación del Retraso
              </label>
              <textarea
                value={formData.justificacion}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    justificacion: e.target.value,
                  }))
                }
                className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                maxLength={500}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Acciones a Tomar
              </label>
              <textarea
                value={formData.acciones}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, acciones: e.target.value }))
                }
                className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                maxLength={500}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Evidencias
              </label>
              <textarea
                value={formData.evidencias}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    evidencias: e.target.value,
                  }))
                }
                className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                maxLength={500}
              />
            </div>
          </>
        )}
      </div>
    </FormModal>
  );
}
