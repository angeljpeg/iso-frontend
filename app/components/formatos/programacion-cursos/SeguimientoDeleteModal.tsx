import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { 
  X, 
  Trash2, 
  AlertTriangle,
  User,
  BookOpen,
  Calendar
} from "lucide-react";
import type { SeguimientoCurso } from "~/types/programacion-curso";

interface SeguimientoDeleteModalProps {
  seguimiento: SeguimientoCurso;
  onClose: () => void;
  onSuccess: () => void;
}

export function SeguimientoDeleteModal({ 
  seguimiento, 
  onClose, 
  onSuccess 
}: SeguimientoDeleteModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      
      // Aquí se implementaría la llamada al servicio para eliminar
      // Por ahora solo simulamos la eliminación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el seguimiento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Eliminar Seguimiento
            </h2>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              ¿Estás seguro de que quieres eliminar este seguimiento? Esta acción no se puede deshacer.
            </p>
            
            {/* Información del seguimiento a eliminar */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Profesor</p>
                    <p className="text-sm text-red-700">
                      {seguimiento.cargaAcademica.profesor?.nombre} {seguimiento.cargaAcademica.profesor?.apellido}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Asignatura</p>
                    <p className="text-sm text-red-700">
                      {seguimiento.cargaAcademica.asignatura?.nombre}
                    </p>
                    <p className="text-xs text-red-600">
                      Clave: {seguimiento.cargaAcademica.asignatura?.clave}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Cuatrimestre</p>
                    <p className="text-sm text-red-700">
                      {seguimiento.cuatrimestre.nombre}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Esta acción eliminará:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>El seguimiento completo del curso</li>
              <li>Todos los detalles asociados ({seguimiento.detalles.length} temas)</li>
              <li>El historial de revisiones</li>
              <li>Cualquier notificación relacionada</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            {isLoading ? 'Eliminando...' : 'Eliminar Seguimiento'}
          </Button>
        </div>
      </div>
    </div>
  );
}
