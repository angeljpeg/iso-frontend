import { useState } from "react";
import { Button } from "../Button";
import { FormInput } from "../forms/FormInput";
import { FormCheckbox } from "../forms/FormCheckbox";
import { RadioGroup } from "../forms/RadioGroup";
import {
  type CreateTutoriaDetalleDto,
  CausaNoAtencion,
  CausaBaja,
  Vulnerabilidad,
  AreaCanalizacion,
} from "../../../types/tutorias";

interface AgregarDetalleTutoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (detalle: CreateTutoriaDetalleDto) => void;
  isLoading?: boolean;
}

export function AgregarDetalleTutoriaModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AgregarDetalleTutoriaModalProps) {
  const [formData, setFormData] = useState<CreateTutoriaDetalleDto>({
    nombreAlumno: "",
    vulnerabilidad: Vulnerabilidad.ACADEMICA,
    areaCanalizacion: AreaCanalizacion.ASESORIA,
    fueAtendido: false,
    presentoMejoria: false,
    causoBaja: false,
    tutoriaId: 0, // Se establecerá cuando se cree la tutoria
  });

  const handleInputChange = (
    field: keyof CreateTutoriaDetalleDto,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      nombreAlumno: "",
      vulnerabilidad: Vulnerabilidad.ACADEMICA,
      areaCanalizacion: AreaCanalizacion.ASESORIA,
      fueAtendido: false,
      presentoMejoria: false,
      causoBaja: false,
      tutoriaId: 0,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Agregar Detalle de Tutoría
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Completa la información del alumno para esta tutoría
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre del Alumno */}
          <FormInput
            label="Nombre del Alumno"
            value={formData.nombreAlumno}
            onChange={(value) => handleInputChange("nombreAlumno", value)}
            required
            placeholder="Ingresa el nombre completo del alumno"
          />

          {/* Tipo de Vulnerabilidad */}
          <RadioGroup
            label="Tipo de Vulnerabilidad"
            value={formData.vulnerabilidad}
            onChange={(value) =>
              handleInputChange("vulnerabilidad", value as Vulnerabilidad)
            }
            options={[
              { value: Vulnerabilidad.ACADEMICA, label: "Académica" },
              { value: Vulnerabilidad.PERSONAL, label: "Personal" },
              { value: Vulnerabilidad.SOCIOECONOMICA, label: "Socioeconómica" },
            ]}
            required
            name="vulnerabilidad"
          />

          {/* Área de Canalización */}
          <RadioGroup
            label="Área de Canalización"
            value={formData.areaCanalizacion}
            onChange={(value) =>
              handleInputChange("areaCanalizacion", value as AreaCanalizacion)
            }
            options={[
              { value: AreaCanalizacion.ASESORIA, label: "Asesoría" },
              { value: AreaCanalizacion.MEDICO, label: "Médico" },
              { value: AreaCanalizacion.PSICOLOGO, label: "Psicólogo" },
              { value: AreaCanalizacion.ESTUDIANTILES, label: "Estudiantiles" },
              { value: AreaCanalizacion.ADMON, label: "Administración" },
              { value: AreaCanalizacion.VINCULACION, label: "Vinculación" },
              {
                value: AreaCanalizacion.DIRECCION_CARRERA,
                label: "Dirección de Carrera",
              },
              { value: AreaCanalizacion.OTRA, label: "Otra" },
            ]}
            required
            name="areaCanalizacion"
          />

          {/* Fue Atendido */}
          <FormCheckbox
            label="¿El alumno fue atendido?"
            checked={formData.fueAtendido}
            onChange={(checked) => handleInputChange("fueAtendido", checked)}
          />

          {/* Causa de No Atención (solo si no fue atendido) */}
          {!formData.fueAtendido && (
            <RadioGroup
              label="Causa de No Atención"
              value={formData.causaNoAtencion || ""}
              onChange={(value) =>
                handleInputChange("causaNoAtencion", value as CausaNoAtencion)
              }
              options={[
                {
                  value: CausaNoAtencion.NO_PERSONAL,
                  label: "No había personal que atendiera en el área",
                },
                {
                  value: CausaNoAtencion.NO_ASISTIO,
                  label: "El alumno no asistió al área canalizada",
                },
              ]}
              required
              name="causaNoAtencion"
            />
          )}

          {/* Presentó Mejora */}
          <FormCheckbox
            label="¿El alumno presentó mejora?"
            checked={formData.presentoMejoria}
            onChange={(checked) =>
              handleInputChange("presentoMejoria", checked)
            }
          />

          {/* Causó Baja */}
          <FormCheckbox
            label="¿El alumno causó baja?"
            checked={formData.causoBaja}
            onChange={(checked) => handleInputChange("causoBaja", checked)}
          />

          {/* Causa de Baja (solo si causó baja) */}
          {formData.causoBaja && (
            <RadioGroup
              label="Causa de la Baja"
              value={formData.causaBaja || ""}
              onChange={(value) =>
                handleInputChange("causaBaja", value as CausaBaja)
              }
              options={[
                { value: CausaBaja.SIN_CAUSA, label: "Sin causa conocida" },
                {
                  value: CausaBaja.INCUMPLIMIENTO,
                  label: "Incumplimiento de expectativas",
                },
                { value: CausaBaja.REPROBACION, label: "Reprobación" },
                {
                  value: CausaBaja.PROBLEMAS_ECONOMICOS,
                  label: "Problemas económicos",
                },
                {
                  value: CausaBaja.MOTIVOS_PERSONALES,
                  label: "Motivos personales",
                },
                { value: CausaBaja.DISTANCIA_UT, label: "Distancia de la UT" },
                {
                  value: CausaBaja.PROBLEMAS_TRABAJO,
                  label: "Problemas de trabajo",
                },
                { value: CausaBaja.CAMBIO_UT, label: "Cambio de UT" },
                { value: CausaBaja.CAMBIO_CARRERA, label: "Cambio de carrera" },
                {
                  value: CausaBaja.FALTAS_REGLAMENTO,
                  label: "Faltas al reglamento escolar",
                },
                { value: CausaBaja.OTRAS_CAUSAS, label: "Otras causas" },
              ]}
              required
              name="causaBaja"
            />
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
              {isLoading ? "Guardando..." : "Guardar Detalle"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
