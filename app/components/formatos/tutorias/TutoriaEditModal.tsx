import React, { useState } from "react";
import { Modal } from "~/components/ui/modal";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { X, Save, Calendar } from "lucide-react";
import type { Tutoria, EstadoRevision } from "~/types/tutorias";
import { tutoriasService } from "~/services/tutorias.service";
import { useAuthStore } from "~/store/auth";

interface TutoriaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutoria: Tutoria;
  onTutoriaUpdated: () => void;
}

export function TutoriaEditModal({
  isOpen,
  onClose,
  tutoria,
  onTutoriaUpdated,
}: TutoriaEditModalProps) {
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    estadoRevision: tutoria.estadoRevision,
    fechaRevision: tutoria.fechaRevision
      ? tutoria.fechaRevision.split("T")[0]
      : "",
    observaciones: tutoria.observaciones || "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      alert("No hay token de autenticación");
      return;
    }

    setIsLoading(true);
    try {
      const updateData: Partial<Tutoria> = {
        estadoRevision: formData.estadoRevision as EstadoRevision,
        observaciones: formData.observaciones,
      };

      if (formData.fechaRevision) {
        updateData.fechaRevision = new Date(
          formData.fechaRevision
        ).toISOString();
      }

      await tutoriasService.update(tutoria.id, updateData, accessToken);
      onTutoriaUpdated();
      onClose();
    } catch (error) {
      console.error("Error al actualizar la tutoría:", error);
      alert("Error al actualizar la tutoría. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Tutoría</h2>
            <p className="text-gray-600 mt-1">
              Modifica la información de la tutoría
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información de la tutoría (solo lectura) */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Información de la Tutoría
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Cuatrimestre:</span>
                <p className="text-gray-900">{tutoria.cuatrimestre}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Tutor:</span>
                <p className="text-gray-900">{tutoria.nombreTutor}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Grupo:</span>
                <p className="text-gray-900">{tutoria.grupo}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Carrera:</span>
                <p className="text-gray-900">{tutoria.carrera}</p>
              </div>
            </div>
          </div>

          {/* Estado de revisión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado de Revisión *
            </label>
            <Select
              value={formData.estadoRevision}
              onValueChange={(value) =>
                handleInputChange("estadoRevision", value)
              }
              disabled={isLoading}
              required
            >
              <option value="sin revisar">Sin Revisar</option>
              <option value="revisando">Revisando</option>
              <option value="revisado">Revisado</option>
              <option value="aceptado">Aceptado</option>
              <option value="rechazado">Rechazado</option>
            </Select>
          </div>

          {/* Fecha de revisión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Revisión
            </label>
            <div className="relative">
              <Input
                type="date"
                value={formData.fechaRevision}
                onChange={(e) =>
                  handleInputChange("fechaRevision", e.target.value)
                }
                disabled={isLoading}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Deja vacío si no se ha revisado aún
            </p>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <Textarea
              value={formData.observaciones}
              onChange={(e) =>
                handleInputChange("observaciones", e.target.value)
              }
              disabled={isLoading}
              rows={4}
              placeholder="Agrega observaciones sobre la tutoría..."
              className="w-full"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
