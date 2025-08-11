import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Label } from "~/components/ui/label";
import { X, Save } from "lucide-react";
import type { Asesoria, UpdateAsesoriaDto } from "~/types/asesorias";
import { useUpdateAsesoria } from "~/hooks/asesorias/use-update-asesoria";
import { useAuthStore } from "~/store/auth";

interface AsesoriaEditModalProps {
  asesoria: Asesoria;
  onClose: () => void;
  onSuccess: () => void;
}

export function AsesoriaEditModal({
  asesoria,
  onClose,
  onSuccess,
}: AsesoriaEditModalProps) {
  const updateAsesoriaMutation = useUpdateAsesoria();
  const { accessToken } = useAuthStore();
  const [formData, setFormData] = useState<UpdateAsesoriaDto>({
    temaAsesoria: asesoria.temaAsesoria,
    fecha: asesoria.fecha.split("T")[0], // Solo la fecha, sin la hora
    numeroAlumnos: asesoria.numeroAlumnos,
    nombreAlumno: asesoria.nombreAlumno,
    duracionAsesoria: asesoria.duracionAsesoria,
  });

  const handleInputChange = (
    field: keyof UpdateAsesoriaDto,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (!accessToken) {
        throw new Error("No hay token de autenticación");
      }

      await updateAsesoriaMutation.mutateAsync({
        id: asesoria.id,
        token: accessToken,
        ...formData,
      });

      onSuccess();
    } catch (error) {
      console.error("Error al actualizar la asesoría:", error);
      alert("Error al actualizar la asesoría");
    }
  };

  const hasChanges =
    formData.temaAsesoria !== asesoria.temaAsesoria ||
    formData.fecha !== asesoria.fecha.split("T")[0] ||
    formData.numeroAlumnos !== asesoria.numeroAlumnos ||
    formData.nombreAlumno !== asesoria.nombreAlumno ||
    formData.duracionAsesoria !== asesoria.duracionAsesoria;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Editar Asesoría
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
        <div className="p-6 space-y-6">
          {/* Información de la Asesoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="temaAsesoria">Tema de Asesoría</Label>
                <Input
                  id="temaAsesoria"
                  value={formData.temaAsesoria}
                  onChange={(e) =>
                    handleInputChange("temaAsesoria", e.target.value)
                  }
                  placeholder="Ingrese el tema de la asesoría"
                />
              </div>

              <div>
                <Label htmlFor="nombreAlumno">Nombre del Alumno</Label>
                <Input
                  id="nombreAlumno"
                  value={formData.nombreAlumno}
                  onChange={(e) =>
                    handleInputChange("nombreAlumno", e.target.value)
                  }
                  placeholder="Nombre del alumno"
                />
              </div>

              <div>
                <Label htmlFor="numeroAlumnos">Número de Alumnos</Label>
                <Input
                  id="numeroAlumnos"
                  type="number"
                  min="1"
                  value={formData.numeroAlumnos}
                  onChange={(e) =>
                    handleInputChange("numeroAlumnos", parseInt(e.target.value))
                  }
                  placeholder="1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange("fecha", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="duracionAsesoria">Duración (minutos)</Label>
                <Input
                  id="duracionAsesoria"
                  type="number"
                  min="1"
                  value={formData.duracionAsesoria}
                  onChange={(e) =>
                    handleInputChange(
                      "duracionAsesoria",
                      parseInt(e.target.value)
                    )
                  }
                  placeholder="60"
                />
              </div>
            </div>
          </div>

          {/* Información de Carga Académica (solo lectura) */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Información Académica (No editable)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Profesor
                </Label>
                <p className="text-sm text-gray-900 mt-1">
                  {asesoria.cargaAcademica?.profesor?.nombre}{" "}
                  {asesoria.cargaAcademica?.profesor?.apellido}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Asignatura
                </Label>
                <p className="text-sm text-gray-900 mt-1">
                  {asesoria.cargaAcademica?.asignatura}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Grupo
                </Label>
                <p className="text-sm text-gray-900 mt-1">
                  {asesoria.cargaAcademica?.grupo?.nombreGenerado}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateAsesoriaMutation.isPending}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            {updateAsesoriaMutation.isPending
              ? "Guardando..."
              : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}
