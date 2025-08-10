import { useState, useEffect } from "react";
import { X, Plus, Edit, Trash2, Users } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/badge";
import { toast } from "sonner";
import { useEstadiaAlumnoActions } from "~/hooks/estadias-hooks";
import { useEstadias } from "~/hooks/estadias-hooks";
import { CrearAlumnoModal } from "./crear-alumno-modal";
import { EditarAlumnoModal } from "./editar-alumno-modal";
import type { Estadia, EstadiaAlumno } from "~/types/estadias";

interface GestionarAlumnosModalProps {
  isOpen: boolean;
  onClose: () => void;
  estadia: Estadia | null;
  onSuccess: () => void;
}

export const GestionarAlumnosModal = ({
  isOpen,
  onClose,
  estadia,
  onSuccess,
}: GestionarAlumnosModalProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState<EstadiaAlumno | null>(
    null
  );
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>(
    {}
  );

  const { remove } = useEstadiaAlumnoActions();
  const { refetch } = useEstadias({
    profesorId: estadia?.profesorId || undefined,
    periodo: estadia?.periodo || undefined,
  });

  const handleEdit = (alumno: EstadiaAlumno) => {
    setSelectedAlumno(alumno);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (alumnoId: string) => {
    setLoadingActions((prev) => ({ ...prev, [alumnoId]: true }));

    try {
      await remove(alumnoId);
      toast.success("Alumno eliminado exitosamente");
      onSuccess();
      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al eliminar alumno";
      toast.error(errorMessage);
    } finally {
      setLoadingActions((prev) => ({ ...prev, [alumnoId]: false }));
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    onSuccess();
    refetch();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedAlumno(null);
    onSuccess();
    refetch();
  };

  if (!isOpen || !estadia) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold">
                  Gestionar Alumnos - Estadía
                </h2>
                <p className="text-sm text-muted-foreground">
                  Profesor: {estadia.profesor.nombre}{" "}
                  {estadia.profesor.apellido} | Período: {estadia.periodo}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-medium">Alumnos Asignados</h3>
                <p className="text-sm text-muted-foreground">
                  {estadia.alumnos?.length || 0} alumno(s) asignado(s)
                </p>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="mr-2 w-4 h-4" />
                Agregar Alumno
              </Button>
            </div>

            {/* Alumnos List */}
            <div className="space-y-4">
              {estadia.alumnos && estadia.alumnos.length > 0 ? (
                estadia.alumnos.map((alumno) => (
                  <Card key={alumno.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-lg">
                            {alumno.nombreAlumno}
                          </h4>
                          <Badge
                            variant={alumno.activo ? "default" : "secondary"}
                          >
                            {alumno.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          {alumno.matricula && (
                            <div>
                              <span className="font-medium">Matrícula:</span>{" "}
                              {alumno.matricula}
                            </div>
                          )}
                          {alumno.carrera && (
                            <div>
                              <span className="font-medium">Carrera:</span>{" "}
                              {alumno.carrera}
                            </div>
                          )}
                        </div>
                        {alumno.observacionesGenerales && (
                          <div className="mt-2">
                            <span className="font-medium text-sm">
                              Observaciones:
                            </span>
                            <p className="text-sm text-muted-foreground mt-1">
                              {alumno.observacionesGenerales}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(alumno)}
                          disabled={loadingActions[alumno.id]}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(alumno.id)}
                          disabled={loadingActions[alumno.id]}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No hay alumnos asignados
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comienza agregando el primer alumno a esta estadía
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 w-4 h-4" />
                    Agregar Primer Alumno
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CrearAlumnoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        estadiaId={estadia.id}
        estadia={estadia}
        onSuccess={handleCreateSuccess}
      />

      <EditarAlumnoModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAlumno(null);
        }}
        alumno={selectedAlumno}
        estadia={estadia}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};
