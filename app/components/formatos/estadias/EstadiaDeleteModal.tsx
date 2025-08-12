import React, { useState } from "react";
import { Modal } from "~/components/ui/modal";
import { Button } from "~/components/ui/Button";
import { useEstadiaActions } from "~/hooks/estadias-hooks";
import type { Estadia } from "~/types/estadias";

interface EstadiaDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  estadia: Estadia | null;
  onEstadiaDeleted: () => void;
}

export function EstadiaDeleteModal({
  isOpen,
  onClose,
  estadia,
  onEstadiaDeleted,
}: EstadiaDeleteModalProps) {
  const { remove, isLoading, error, clearError } = useEstadiaActions();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleDelete = async () => {
    if (!estadia || !isConfirmed) return;

    try {
      clearError();

      await remove(estadia.id);

      // Notificar que se eliminó la estadía
      onEstadiaDeleted();
      onClose();
    } catch (err) {
      console.error("Error al eliminar estadía:", err);
    }
  };

  const handleClose = () => {
    clearError();
    setIsConfirmed(false);
    onClose();
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsConfirmed(e.target.checked);
  };

  if (!estadia) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Eliminar Estadía"
      size="lg"
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Advertencia */}
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Acción Irreversible
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Esta acción eliminará permanentemente la estadía y todos sus
                  datos asociados. Esta operación no se puede deshacer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles de la estadía a eliminar */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Estadía a Eliminar
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Período:</span> {estadia.periodo}
            </div>
            <div>
              <span className="font-medium">Profesor:</span>{" "}
              {estadia.profesor?.nombre || "N/A"}
            </div>
            <div>
              <span className="font-medium">Alumnos:</span>{" "}
              {estadia.alumnos?.length || 0}
            </div>
            <div>
              <span className="font-medium">Estado:</span>{" "}
              <span
                className={estadia.activo ? "text-green-600" : "text-red-600"}
              >
                {estadia.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div>
              <span className="font-medium">Fecha de Creación:</span>{" "}
              {new Date(estadia.createdAt).toLocaleDateString("es-ES")}
            </div>
          </div>
        </div>

        {/* Impacto de la eliminación */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-900 mb-2">
            Impacto de la Eliminación
          </h3>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Se eliminarán todos los registros de alumnos asociados</li>
            <li>• Se eliminará todo el progreso mensual registrado</li>
            <li>• Se perderán todas las observaciones y comentarios</li>
            <li>• No se podrán recuperar los datos eliminados</li>
          </ul>
        </div>

        {/* Confirmación */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="confirm-delete"
            checked={isConfirmed}
            onChange={handleConfirmChange}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="confirm-delete" className="text-sm text-gray-700">
            He leído y entiendo que esta acción es irreversible. Confirmo que
            deseo eliminar esta estadía y todos sus datos asociados.
          </label>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
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
            disabled={!isConfirmed || isLoading}
          >
            {isLoading ? "Eliminando..." : "Eliminar Estadía"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
