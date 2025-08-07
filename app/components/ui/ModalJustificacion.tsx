import { useState } from "react";
import { Button } from "./Button";

interface ModalJustificacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (justificacion: string) => void;
  semana: number;
  temaEsperado: string;
}

export function ModalJustificacion({
  isOpen,
  onClose,
  onConfirm,
  semana,
  temaEsperado,
}: ModalJustificacionProps) {
  const [justificacion, setJustificacion] = useState("");

  const handleConfirm = () => {
    if (justificacion.trim()) {
      onConfirm(justificacion.trim());
      setJustificacion("");
      onClose();
    }
  };

  const handleCancel = () => {
    setJustificacion("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Justificar Retraso - Semana {semana}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Tema esperado: <strong>{temaEsperado}</strong>
          </p>
          <p className="text-sm text-red-600 mb-4">
            ⚠️ La justificación es obligatoria para retrasos de 2 o más semanas.
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="justificacion"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Justificación del retraso *
          </label>
          <textarea
            id="justificacion"
            value={justificacion}
            onChange={(e) => setJustificacion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Describe las razones del retraso..."
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!justificacion.trim()}>
            Confirmar Justificación
          </Button>
        </div>
      </div>
    </div>
  );
}
