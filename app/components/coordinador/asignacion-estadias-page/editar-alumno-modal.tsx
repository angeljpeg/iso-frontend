import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { toast } from "sonner";
import { useEstadiaAlumnoActions } from "~/hooks/estadias-hooks";
import { useCarreras } from "~/hooks/useCarreras";
import { useCargaAcademica } from "~/hooks/useCargaAcademica";
import type { EstadiaAlumno } from "~/types/estadias";
import type { UpdateAlumnoRequest } from "~/types/estadias/services";
import type { Estadia } from "~/types/estadias";

interface EditarAlumnoModalProps {
  isOpen: boolean;
  onClose: () => void;
  alumno: EstadiaAlumno | null;
  estadia?: Estadia; // Agregar la estadía completa para obtener el profesor
  onSuccess: () => void;
}

export const EditarAlumnoModal = ({
  isOpen,
  onClose,
  alumno,
  estadia,
  onSuccess,
}: EditarAlumnoModalProps) => {
  const [formData, setFormData] = useState({
    nombreAlumno: "",
    matricula: "",
    carrera: "",
    observacionesGenerales: "",
  });

  const { update, isLoading, error, clearError } = useEstadiaAlumnoActions();
  const { carreras } = useCarreras();

  // Obtener la carga académica del profesor para determinar su carrera por defecto
  const { cargasAcademicas } = useCargaAcademica({
    profesorId: estadia?.profesorId,
    limit: 100,
  });

  // Actualizar el formulario cuando cambie el alumno seleccionado
  useEffect(() => {
    if (alumno) {
      setFormData({
        nombreAlumno: alumno.nombreAlumno || "",
        matricula: alumno.matricula || "",
        carrera: alumno.carrera || "",
        observacionesGenerales: alumno.observacionesGenerales || "",
      });
    }
  }, [alumno]);

  // Determinar la carrera por defecto del profesor si no hay carrera seleccionada
  useEffect(() => {
    if (
      estadia?.profesorId &&
      cargasAcademicas.length > 0 &&
      !formData.carrera
    ) {
      // Obtener la carrera más común del profesor o la primera disponible
      const carrerasProfesor = cargasAcademicas.map((carga) => carga.carrera);
      const carreraMasComun = carrerasProfesor
        .sort(
          (a, b) =>
            carrerasProfesor.filter((v) => v === a).length -
            carrerasProfesor.filter((v) => v === b).length
        )
        .pop();

      if (carreraMasComun) {
        setFormData((prev) => ({ ...prev, carrera: carreraMasComun }));
      }
    }
  }, [estadia?.profesorId, cargasAcademicas, formData.carrera]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!alumno) return;

    if (!formData.nombreAlumno.trim()) {
      toast.error("El nombre del alumno es obligatorio");
      return;
    }

    try {
      const alumnoData: Omit<UpdateAlumnoRequest, "token" | "id"> = {
        nombreAlumno: formData.nombreAlumno.trim(),
        ...(formData.matricula.trim() && {
          matricula: formData.matricula.trim(),
        }),
        ...(formData.carrera.trim() && { carrera: formData.carrera.trim() }),
        ...(formData.observacionesGenerales.trim() && {
          observacionesGenerales: formData.observacionesGenerales.trim(),
        }),
      };

      await update(alumno.id, alumnoData);
      toast.success("Alumno actualizado exitosamente");
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al actualizar alumno";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  // Opciones para el select de carreras
  const carreraOptions = [
    { value: "", label: "Selecciona una carrera" },
    ...carreras.map((carrera) => ({
      value: carrera.nombre,
      label: carrera.nombre,
    })),
  ];

  if (!isOpen || !alumno) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Editar Alumno</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Alumno *
            </label>
            <input
              type="text"
              value={formData.nombreAlumno}
              onChange={(e) =>
                handleInputChange("nombreAlumno", e.target.value)
              }
              placeholder="Ingresa el nombre completo del alumno"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matrícula
            </label>
            <input
              type="text"
              value={formData.matricula}
              onChange={(e) => handleInputChange("matricula", e.target.value)}
              placeholder="Ingresa la matrícula del alumno"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carrera
            </label>
            <select
              value={formData.carrera}
              onChange={(e) => handleInputChange("carrera", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {carreraOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {estadia?.profesorId && (
              <p className="text-xs text-gray-500 mt-1">
                Carrera por defecto del profesor de la estadía
              </p>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones Generales
            </label>
            <textarea
              value={formData.observacionesGenerales}
              onChange={(e) =>
                handleInputChange("observacionesGenerales", e.target.value)
              }
              placeholder="Observaciones adicionales sobre el alumno"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
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
              disabled={isLoading || !formData.nombreAlumno.trim()}
            >
              <Save className="mr-2 w-4 h-4" />
              {isLoading ? "Actualizando..." : "Actualizar Alumno"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
