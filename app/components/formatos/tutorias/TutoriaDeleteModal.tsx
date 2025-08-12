import React, { useState } from "react";
import { Modal } from "~/components/ui/modal";
import { Button } from "~/components/ui/Button";
import { AlertTriangle, Trash2, X } from "lucide-react";
import type { Tutoria } from "~/types/tutorias";
import { tutoriasService } from "~/services/tutorias.service";
import { useAuthStore } from "~/store/auth";

interface TutoriaDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutoria: Tutoria;
  onTutoriaDeleted: () => void;
}

export function TutoriaDeleteModal({
  isOpen,
  onClose,
  tutoria,
  onTutoriaDeleted,
}: TutoriaDeleteModalProps) {
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!accessToken) {
      alert("No hay token de autenticación");
      return;
    }

    setIsLoading(true);
    try {
      await tutoriasService.delete(tutoria.id, accessToken);
      onTutoriaDeleted();
      onClose();
    } catch (error) {
      console.error("Error al eliminar la tutoría:", error);
      alert("Error al eliminar la tutoría. Por favor, inténtalo de nuevo.");
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
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-3">
              <h2 className="text-xl font-semibold text-gray-900">
                Eliminar Tutoría
              </h2>
            </div>
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

        {/* Contenido */}
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            ¿Estás seguro de que deseas eliminar la siguiente tutoría? Esta
            acción no se puede deshacer.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-800 mb-2">
              Tutoría a eliminar:
            </h3>
            <div className="text-sm text-red-700 space-y-1">
              <p>
                <strong>Cuatrimestre:</strong> {tutoria.cuatrimestre}
              </p>
              <p>
                <strong>Tutor:</strong> {tutoria.nombreTutor}
              </p>
              <p>
                <strong>Grupo:</strong> {tutoria.grupo}
              </p>
              <p>
                <strong>Carrera:</strong> {tutoria.carrera}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(tutoria.fecha).toLocaleDateString("es-ES")}
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Advertencia
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Al eliminar esta tutoría, también se eliminarán todos los
                    detalles asociados y no se podrán recuperar.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            {isLoading ? "Eliminando..." : "Eliminar Tutoría"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
