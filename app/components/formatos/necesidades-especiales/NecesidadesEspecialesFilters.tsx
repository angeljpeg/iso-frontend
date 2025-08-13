import React, { useState } from "react";
import { Button } from "../../ui/Button";
import { FormInput } from "../../ui/forms/FormInput";
import { FormSelect } from "../../ui/forms/FormSelect";
import { DatePicker } from "../../ui/date-picker";
import { FormCheckbox } from "../../ui/forms/FormCheckbox";

import type { QueryNecesidadesEspecialesDto } from "../../../types/necesidades-especiales";

interface NecesidadesEspecialesFiltersProps {
  filters: QueryNecesidadesEspecialesDto;
  onFiltersChange: (filters: Partial<QueryNecesidadesEspecialesDto>) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

export const NecesidadesEspecialesFilters: React.FC<
  NecesidadesEspecialesFiltersProps
> = ({ filters, onFiltersChange, onClearFilters, loading = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (
    key: keyof QueryNecesidadesEspecialesDto,
    value: any
  ) => {
    onFiltersChange({ [key]: value });
  };

  const handleClearFilters = () => {
    onClearFilters();
  };

  const programasEducativos = [
    "Ingeniería en Sistemas Computacionales",
    "Ingeniería Industrial",
    "Ingeniería Mecánica",
    "Ingeniería Eléctrica",
    "Ingeniería Química",
    "Ingeniería Civil",
    "Licenciatura en Administración",
    "Licenciatura en Contaduría",
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      {/* Filtros básicos siempre visibles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="Nombre del Alumno"
          placeholder="Buscar por nombre..."
          value={filters.nombreAlumno || ""}
          onChange={(value) => handleFilterChange("nombreAlumno", value)}
        />

        <FormInput
          label="Número de Matrícula"
          placeholder="Buscar por matrícula..."
          value={filters.numeroMatricula || ""}
          onChange={(value) => handleFilterChange("numeroMatricula", value)}
        />

        <FormSelect
          label="Programa Educativo"
          value={filters.programaEducativo || ""}
          onChange={(e) =>
            handleFilterChange("programaEducativo", e.target.value)
          }
          options={[
            { value: "", label: "Todos los programas" },
            ...programasEducativos.map((programa) => ({
              value: programa,
              label: programa,
            })),
          ]}
        />
      </div>

      {/* Botón para expandir/contraer filtros avanzados */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          type="button"
        >
          {isExpanded
            ? "Ocultar filtros avanzados"
            : "Mostrar filtros avanzados"}
        </Button>
      </div>

      {/* Filtros avanzados */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormInput
              label="Nombre del Profesor"
              placeholder="Buscar por profesor..."
              value={filters.nombreProfesor || ""}
              onChange={(value) => handleFilterChange("nombreProfesor", value)}
            />

            <FormInput
              label="Fecha Desde"
              type="date"
              value={filters.fechaDesde || ""}
              onChange={(value) => handleFilterChange("fechaDesde", value)}
            />

            <FormInput
              label="Fecha Hasta"
              type="date"
              value={filters.fechaHasta || ""}
              onChange={(value) => handleFilterChange("fechaHasta", value)}
            />
          </div>

          {/* Filtros por tipo de necesidad */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Tipos de Necesidad
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <FormCheckbox
                label="Conductuales"
                checked={filters.excepcionesConductuales || false}
                onChange={(checked) =>
                  handleFilterChange("excepcionesConductuales", checked)
                }
              />
              <FormCheckbox
                label="Comunicacionales"
                checked={filters.excepcionesComunicacionales || false}
                onChange={(checked) =>
                  handleFilterChange("excepcionesComunicacionales", checked)
                }
              />
              <FormCheckbox
                label="Intelectuales"
                checked={filters.excepcionesIntelectuales || false}
                onChange={(checked) =>
                  handleFilterChange("excepcionesIntelectuales", checked)
                }
              />
              <FormCheckbox
                label="Físicas"
                checked={filters.excepcionesFisicas || false}
                onChange={(checked) =>
                  handleFilterChange("excepcionesFisicas", checked)
                }
              />
              <FormCheckbox
                label="Superdotación"
                checked={filters.excepcionesSuperdotacion || false}
                onChange={(checked) =>
                  handleFilterChange("excepcionesSuperdotacion", checked)
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Acciones de filtros */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          {
            Object.values(filters).filter(
              (value) => value !== undefined && value !== "" && value !== false
            ).length
          }{" "}
          filtros activos
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            disabled={loading}
            type="button"
          >
            Limpiar Filtros
          </Button>

          <Button size="sm" disabled={loading} type="submit">
            {loading ? "Aplicando..." : "Aplicar Filtros"}
          </Button>
        </div>
      </div>
    </div>
  );
};
