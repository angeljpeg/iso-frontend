import React, { useState, useEffect } from "react";
import { FormModal } from "./form-modal";
import { Input } from "../Input";
import { useAuthStore } from "~/store/auth";
import type { Tema } from "~/types/carga-academica";
import { getAuthHeaders, handleAuthError } from "~/utils/auth";
import { useNavigate } from "react-router";

interface CrearSeguimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tema: Tema | null;
  cargaAcademicaId: string;
  onSeguimientoCreated?: () => void;
}

export function CrearSeguimientoModal({
  isOpen,
  onClose,
  tema,
  cargaAcademicaId,
  onSeguimientoCreated,
}: CrearSeguimientoModalProps) {
  const navigate = useNavigate();
  const { usuario } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar permisos - Solo coordinadores pueden crear seguimientos
  const canCreateSeguimiento = usuario?.rol === "coordinador";

  const [formData, setFormData] = useState({
    cargaAcademicaId: cargaAcademicaId,
    fechaRevision: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canCreateSeguimiento) {
      setError("Solo los coordinadores pueden crear seguimientos");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:3000/programacion-seguimiento-curso",
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
        throw new Error(errorData.message || "Error al crear el seguimiento");
      }

      onClose();
      onSeguimientoCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  if (!canCreateSeguimiento) {
    return (
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        title="Acceso Denegado"
        size="sm"
      >
        <div className="py-4 text-center">
          <p className="mb-4 text-red-600">
            Solo los coordinadores pueden crear seguimientos de curso.
          </p>
          <p className="text-gray-600">
            Los profesores pueden agregar detalles a seguimientos existentes.
          </p>
        </div>
      </FormModal>
    );
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Seguimiento de Curso"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Carga Académica ID
          </label>
          <Input
            value={formData.cargaAcademicaId}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Fecha de Revisión (Opcional)
          </label>
          <Input
            type="date"
            value={formData.fechaRevision}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                fechaRevision: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </FormModal>
  );
}
