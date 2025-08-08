import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { FormSelect } from "~/components/ui/forms/FormSelect";
import { RolUsuarioEnum, type RolUsuarioType } from "~/types/usuarios";
import { Search, X } from "lucide-react";

interface UsuariosFiltersProps {
  onSearch: (search: string) => void;
  onFilterChange: (filters: { rol?: RolUsuarioType; activo?: boolean }) => void;
  onClearFilters: () => void;
  currentFilters: {
    search: string;
    rol?: RolUsuarioType;
    activo?: boolean;
  };
}

export function UsuariosFilters({
  onSearch,
  onFilterChange,
  onClearFilters,
  currentFilters,
}: UsuariosFiltersProps) {
  const [searchValue, setSearchValue] = useState(currentFilters.search);
  const [selectedRol, setSelectedRol] = useState<RolUsuarioType | "">(
    currentFilters.rol || ""
  );
  const [selectedEstado, setSelectedEstado] = useState<string>(
    currentFilters.activo !== undefined ? currentFilters.activo.toString() : ""
  );

  const rolOptions = [
    { value: "", label: "Todos los roles" },
    { value: RolUsuarioEnum.COORDINADOR, label: "Coordinador" },
    { value: RolUsuarioEnum.MODERADOR, label: "Moderador" },
    {
      value: RolUsuarioEnum.PROFESOR_TIEMPO_COMPLETO,
      label: "Profesor Tiempo Completo",
    },
    { value: RolUsuarioEnum.PROFESOR_ASIGNATURA, label: "Profesor Asignatura" },
  ];

  const estadoOptions = [
    { value: "", label: "Todos los estados" },
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
  ];

  const handleSearch = () => {
    onSearch(searchValue);
  };

  const handleRolChange = (value: string) => {
    setSelectedRol(value as RolUsuarioType | "");
    onFilterChange({
      rol: value ? (value as RolUsuarioType) : undefined,
      activo: selectedEstado ? selectedEstado === "true" : undefined,
    });
  };

  const handleEstadoChange = (value: string) => {
    setSelectedEstado(value);
    onFilterChange({
      rol: selectedRol || undefined,
      activo: value === "" ? undefined : value === "true",
    });
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setSelectedRol("");
    setSelectedEstado("");
    onClearFilters();
  };

  const hasActiveFilters = searchValue || selectedRol || selectedEstado;

  return (
    <div className="p-4 mb-6 bg-white rounded-lg border shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Búsqueda */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Buscar por nombre, apellido o email..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
          </div>
          <Button onClick={handleSearch} className="px-6">
            <Search className="mr-2 w-4 h-4" />
            Buscar
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="px-4"
            >
              <X className="mr-2 w-4 h-4" />
              Limpiar
            </Button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <FormSelect
              options={rolOptions}
              value={selectedRol}
              onChange={(e) => handleRolChange(e.target.value)}
              placeholder="Filtrar por rol"
            />
          </div>
          <div className="flex-1">
            <FormSelect
              options={estadoOptions}
              value={selectedEstado}
              onChange={(e) => handleEstadoChange(e.target.value)}
              placeholder="Filtrar por estado"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
