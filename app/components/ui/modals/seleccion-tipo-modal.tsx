import { Button } from "../Button";
import { Modal } from "../modal";
import type { Tema } from "~/types/temas";

interface SeleccionTipoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tema: Tema | null;
  onSeguimientoSelected: () => void;
  onAsesoriaSelected: () => void;
}

export function SeleccionTipoModal({
  isOpen,
  onClose,
  tema,
  onSeguimientoSelected,
  onAsesoriaSelected,
}: SeleccionTipoModalProps) {
  if (!tema) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-utn-primary/10 rounded-full flex items-center justify-center">
            <span className="text-3xl">📚</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¿Qué quieres crear?
          </h2>
          <p className="text-utn-secondary">
            Has seleccionado el tema:{" "}
            <span className="font-semibold">{tema.nombre}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Elige el tipo de registro que deseas crear
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <Button
            onClick={onSeguimientoSelected}
            className="h-32 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-blue-300 text-blue-800"
          >
            <span className="text-4xl">📊</span>
            <div className="text-center">
              <div className="font-semibold text-lg">Seguimiento de Curso</div>
              <div className="text-sm opacity-80">
                Registra el progreso y avance del tema
              </div>
            </div>
          </Button>

          <Button
            onClick={onAsesoriaSelected}
            className="h-32 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 hover:border-green-300 text-green-800"
          >
            <span className="text-4xl">👥</span>
            <div className="text-center">
              <div className="font-semibold text-lg">Asesoría</div>
              <div className="text-sm opacity-80">
                Registra una sesión de asesoría individual
              </div>
            </div>
          </Button>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" onClick={onClose} className="px-6">
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
