import React, { useState, useEffect } from "react";
import { FormModal } from "./form-modal";
import { Input } from "../Input";
import { Button } from "../Button";
import { useProgresoMensualActions } from "~/hooks/estadias-hooks";
import type {
  MesType,
  AvanceAlumnoType,
  ProgresoMensual,
} from "~/types/estadias";

interface CrearProgresoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mes: MesType | null;
  estadiaAlumnoId: string;
  progresoExistente?: ProgresoMensual | null;
  onProgresoSaved?: () => void;
}

export function CrearProgresoModal({
  isOpen,
  onClose,
  mes,
  estadiaAlumnoId,
  progresoExistente,
  onProgresoSaved,
}: CrearProgresoModalProps) {
  const { create, update, isLoading, error, clearError } =
    useProgresoMensualActions();

  const [formData, setFormData] = useState({
    mes: mes || 1,
    avance: "" as AvanceAlumnoType | "",
    accionesTomadas: "",
    fechaEvaluacion: "",
    observaciones: "",
  });

  // Opciones para el select de avance
  const avanceOptions = [
    { value: "si", label: "Sí" },
    { value: "no", label: "No" },
  ];

  // Opciones para el select de mes
  const mesOptions = [
    { value: 1, label: "Mes 1" },
    { value: 2, label: "Mes 2" },
    { value: 3, label: "Mes 3" },
    { value: 4, label: "Mes 4" },
  ];

  // Inicializar formulario cuando cambie el progreso existente
  useEffect(() => {
    if (progresoExistente) {
      setFormData({
        mes: progresoExistente.mes,
        avance: progresoExistente.avance || "",
        accionesTomadas: progresoExistente.accionesTomadas || "",
        fechaEvaluacion: progresoExistente.fechaEvaluacion
          ? new Date(progresoExistente.fechaEvaluacion)
              .toISOString()
              .split("T")[0]
          : "",
        observaciones: progresoExistente.observaciones || "",
      });
    } else {
      setFormData({
        mes: mes || 1,
        avance: "",
        accionesTomadas: "",
        fechaEvaluacion: "",
        observaciones: "",
      });
    }
  }, [progresoExistente, mes]);

  // Limpiar error cuando se abra/cierre el modal
  useEffect(() => {
    if (isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.avance) {
      alert("Por favor selecciona si hubo avance o no");
      return;
    }

    try {
      const progresoData = {
        estadiaAlumnoId,
        mes: formData.mes as MesType,
        avance: formData.avance as AvanceAlumnoType,
        accionesTomadas: formData.accionesTomadas || undefined,
        fechaEvaluacion: formData.fechaEvaluacion || undefined,
        observaciones: formData.observaciones || undefined,
      };

      if (progresoExistente) {
        // Actualizar progreso existente
        await update(progresoExistente.id, progresoData);
      } else {
        // Crear nuevo progreso
        await create(progresoData);
      }

      onProgresoSaved?.();
    } catch (err) {
      console.error("Error al guardar progreso:", err);
      // El error ya se maneja en el hook
    }
  };

  const handleClose = () => {
    setFormData({
      mes: mes || 1,
      avance: "",
      accionesTomadas: "",
      fechaEvaluacion: "",
      observaciones: "",
    });
    clearError();
    onClose();
  };

  const isEditing = !!progresoExistente;
  const title = isEditing
    ? "Editar Progreso Mensual"
    : "Crear Progreso Mensual";

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        {/* Mes - Solo título, no editable */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mes {formData.mes}
          </label>
        </div>

        {/* Avance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿El alumno tuvo avance en este mes? *
          </label>
          <select
            value={formData.avance}
            onChange={(e) => handleInputChange("avance", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-utn-primary/20 focus:border-utn-primary"
          >
            <option value="">Selecciona una opción</option>
            {avanceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha de Evaluación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Evaluación
          </label>
          <Input
            type="date"
            value={formData.fechaEvaluacion}
            onChange={(e) =>
              handleInputChange("fechaEvaluacion", e.target.value)
            }
            placeholder="Selecciona una fecha"
          />
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones
          </label>
          <textarea
            value={formData.observaciones}
            onChange={(e) => handleInputChange("observaciones", e.target.value)}
            placeholder="Describe el progreso del alumno en este mes..."
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-utn-primary/20 focus:border-utn-primary resize-vertical"
          />
        </div>

        {/* Acciones Tomadas (solo si no hay avance) */}
        {formData.avance === "no" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Acciones Tomadas
            </label>
            <textarea
              value={formData.accionesTomadas}
              onChange={(e) =>
                handleInputChange("accionesTomadas", e.target.value)
              }
              placeholder="Describe las acciones tomadas para apoyar al alumno..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-utn-primary/20 focus:border-utn-primary resize-vertical"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </FormModal>
  );
}
