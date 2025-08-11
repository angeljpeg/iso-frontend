import { useState, useEffect } from "react";
import { Button } from "../Button";
import { Modal } from "../modal";
import { FormInput } from "../forms/FormInput";
import { useAuthStore } from "~/store/auth";
import { createAsesoria } from "~/services/asesorias.service";
import type { Tema } from "~/types/temas";
import type { CreateAsesoriaDto } from "~/types/asesorias";

interface CrearAsesoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tema: Tema | null;
  cargaAcademicaId: string;
  onAsesoriaCreated: () => void;
}

export function CrearAsesoriaModal({
  isOpen,
  onClose,
  tema,
  cargaAcademicaId,
  onAsesoriaCreated,
}: CrearAsesoriaModalProps) {
  const { accessToken } = useAuthStore();
  const [formData, setFormData] = useState<CreateAsesoriaDto>({
    cargaAcademicaId: "",
    temaAsesoria: "",
    fecha: "",
    numeroAlumnos: 1,
    nombreAlumno: "",
    duracionAsesoria: 60,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && tema && cargaAcademicaId) {
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        cargaAcademicaId,
        temaAsesoria: tema.nombre,
        fecha: today,
        numeroAlumnos: 1,
        nombreAlumno: "",
        duracionAsesoria: 60,
      });
    }
  }, [isOpen, tema, cargaAcademicaId]);

  const handleInputChange = (
    field: keyof CreateAsesoriaDto,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombreAlumno.trim()) {
      alert("Por favor ingresa el nombre del alumno");
      return;
    }

    if (!accessToken) {
      alert("No tienes autorización para crear asesorías");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createAsesoria({
        ...formData,
        token: accessToken,
      });

      console.log("Asesoría creada exitosamente:", response);

      onAsesoriaCreated();
      onClose();
    } catch (error) {
      console.error("Error al crear asesoría:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al crear la asesoría. Por favor intenta de nuevo.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!tema) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">👥</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Crear Nueva Asesoría
          </h2>
          <p className="text-utn-secondary">
            Tema: <span className="font-semibold">{tema.nombre}</span>
          </p>
        </div>

        <div className="space-y-5">
          <FormInput
            label="Tema de Asesoría"
            value={formData.temaAsesoria}
            onChange={(e) => handleInputChange("temaAsesoria", e.target.value)}
            placeholder="Tema de la asesoría"
            disabled
            className="bg-gray-50"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => handleInputChange("fecha", e.target.value)}
              required
            />

            <FormInput
              label="Duración (minutos)"
              type="number"
              value={formData.duracionAsesoria}
              onChange={(e) =>
                handleInputChange(
                  "duracionAsesoria",
                  parseInt(e.target.value) || 60
                )
              }
              min={15}
              max={240}
              step={15}
              required
            />
          </div>

          <FormInput
            label="Nombre del Alumno"
            value={formData.nombreAlumno}
            onChange={(e) => handleInputChange("nombreAlumno", e.target.value)}
            placeholder="Nombre completo del alumno"
            required
          />

          <FormInput
            label="Número de Alumnos"
            type="number"
            value={formData.numeroAlumnos}
            onChange={(e) =>
              handleInputChange("numeroAlumnos", parseInt(e.target.value) || 1)
            }
            min={1}
            max={10}
            required
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creando...</span>
              </div>
            ) : (
              "Crear Asesoría"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
