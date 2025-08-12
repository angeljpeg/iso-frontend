import React, { useState, useEffect } from "react";
import { Modal } from "~/components/ui/modal";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Select } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useEstadiaActions } from "~/hooks/estadias-hooks";
import type { Estadia, EstadiaAlumno } from "~/types/estadias";

interface EstadiaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  estadia: Estadia | null;
  onEstadiaUpdated: () => void;
}

export function EstadiaEditModal({
  isOpen,
  onClose,
  estadia,
  onEstadiaUpdated,
}: EstadiaEditModalProps) {
  const { update, isLoading, error, clearError } = useEstadiaActions();

  const [formData, setFormData] = useState({
    periodo: "",
    observacionesGenerales: "",
    activo: true,
  });

  const [alumnos, setAlumnos] = useState<EstadiaAlumno[]>([]);
  const [newAlumno, setNewAlumno] = useState({
    nombreAlumno: "",
    matricula: "",
    carrera: "",
    observacionesGenerales: "",
  });

  useEffect(() => {
    if (estadia) {
      setFormData({
        periodo: estadia.periodo,
        observacionesGenerales: estadia.observacionesGenerales || "",
        activo: estadia.activo,
      });
      setAlumnos(estadia.alumnos || []);
    }
  }, [estadia]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAlumnoChange = (index: number, field: string, value: string) => {
    const updatedAlumnos = [...alumnos];
    updatedAlumnos[index] = { ...updatedAlumnos[index], [field]: value };
    setAlumnos(updatedAlumnos);
  };

  const addAlumno = () => {
    if (newAlumno.nombreAlumno.trim()) {
      const alumno: EstadiaAlumno = {
        id: `temp-${Date.now()}`,
        nombreAlumno: newAlumno.nombreAlumno,
        matricula: newAlumno.matricula || null,
        carrera: newAlumno.carrera || null,
        estadiaId: estadia?.id || "",
        observacionesGenerales: newAlumno.observacionesGenerales || null,
        activo: true,
        estadia: estadia!,
        progresoMensual: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAlumnos((prev) => [...prev, alumno]);
      setNewAlumno({
        nombreAlumno: "",
        matricula: "",
        carrera: "",
        observacionesGenerales: "",
      });
    }
  };

  const removeAlumno = (index: number) => {
    setAlumnos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!estadia) return;

    try {
      clearError();

      // Actualizar la estadía
      await update(estadia.id, {
        periodo: formData.periodo,
        observacionesGenerales: formData.observacionesGenerales || undefined,
      });

      // Notificar que se actualizó la estadía
      onEstadiaUpdated();
      onClose();
    } catch (err) {
      console.error("Error al actualizar estadía:", err);
    }
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  if (!estadia) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar Estadía"
      size="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Información general de la estadía */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Información General
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <Input
                value={formData.periodo}
                onChange={(e) => handleInputChange("periodo", e.target.value)}
                placeholder="Ej: 2024-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <Select
                value={formData.activo ? "activo" : "inactivo"}
                onValueChange={(value) =>
                  handleInputChange("activo", value === "activo")
                }
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones Generales
            </label>
            <Textarea
              value={formData.observacionesGenerales}
              onChange={(e) =>
                handleInputChange("observacionesGenerales", e.target.value)
              }
              placeholder="Observaciones generales de la estadía..."
              rows={3}
            />
          </div>
        </div>

        {/* Gestión de alumnos */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Alumnos de la Estadía
          </h3>

          {/* Lista de alumnos existentes */}
          {alumnos.length > 0 && (
            <div className="space-y-3">
              {alumnos.map((alumno, index) => (
                <div
                  key={alumno.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">
                      Alumno {index + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAlumno(index)}
                    >
                      Eliminar
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo
                      </label>
                      <Input
                        value={alumno.nombreAlumno}
                        onChange={(e) =>
                          handleAlumnoChange(
                            index,
                            "nombreAlumno",
                            e.target.value
                          )
                        }
                        placeholder="Nombre del alumno"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Matrícula
                      </label>
                      <Input
                        value={alumno.matricula || ""}
                        onChange={(e) =>
                          handleAlumnoChange(index, "matricula", e.target.value)
                        }
                        placeholder="Matrícula del alumno"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Carrera
                      </label>
                      <Input
                        value={alumno.carrera || ""}
                        onChange={(e) =>
                          handleAlumnoChange(index, "carrera", e.target.value)
                        }
                        placeholder="Carrera del alumno"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observaciones
                      </label>
                      <Textarea
                        value={alumno.observacionesGenerales || ""}
                        onChange={(e) =>
                          handleAlumnoChange(
                            index,
                            "observacionesGenerales",
                            e.target.value
                          )
                        }
                        placeholder="Observaciones del alumno"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formulario para agregar nuevo alumno */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900">Agregar Nuevo Alumno</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <Input
                  value={newAlumno.nombreAlumno}
                  onChange={(e) =>
                    setNewAlumno((prev) => ({
                      ...prev,
                      nombreAlumno: e.target.value,
                    }))
                  }
                  placeholder="Nombre del alumno"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matrícula
                </label>
                <Input
                  value={newAlumno.matricula}
                  onChange={(e) =>
                    setNewAlumno((prev) => ({
                      ...prev,
                      matricula: e.target.value,
                    }))
                  }
                  placeholder="Matrícula del alumno"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carrera
                </label>
                <Input
                  value={newAlumno.carrera}
                  onChange={(e) =>
                    setNewAlumno((prev) => ({
                      ...prev,
                      carrera: e.target.value,
                    }))
                  }
                  placeholder="Carrera del alumno"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <Textarea
                  value={newAlumno.observacionesGenerales}
                  onChange={(e) =>
                    setNewAlumno((prev) => ({
                      ...prev,
                      observacionesGenerales: e.target.value,
                    }))
                  }
                  placeholder="Observaciones del alumno"
                  rows={2}
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addAlumno}
              disabled={!newAlumno.nombreAlumno.trim()}
            >
              Agregar Alumno
            </Button>
          </div>
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Actualizando..." : "Actualizar Estadía"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
