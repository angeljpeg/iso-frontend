import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Eye,
  Edit,
  Trash2,
  Calendar,
  Users,
  Clock,
  BookOpen,
  User,
} from "lucide-react";
import type { Asesoria } from "~/types/asesorias";
import { AsesoriaDetailsModal } from "./AsesoriaDetailsModal";
import { AsesoriaEditModal } from "./AsesoriaEditModal";
import { AsesoriaDeleteModal } from "./AsesoriaDeleteModal";

interface AsesoriasTableProps {
  asesorias: Asesoria[];
  isLoading: boolean;
  isCoordinador: boolean;
  onRefresh: () => void;
}

export function AsesoriasTable({
  asesorias,
  isLoading,
  isCoordinador,
  onRefresh,
}: AsesoriasTableProps) {
  const [selectedAsesoria, setSelectedAsesoria] = useState<Asesoria | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleViewDetails = (asesoria: Asesoria) => {
    setSelectedAsesoria(asesoria);
    setShowDetailsModal(true);
  };

  const handleEdit = (asesoria: Asesoria) => {
    setSelectedAsesoria(asesoria);
    setShowEditModal(true);
  };

  const handleDelete = (asesoria: Asesoria) => {
    setSelectedAsesoria(asesoria);
    setShowDeleteModal(true);
  };

  const handleModalClose = () => {
    setShowDetailsModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedAsesoria(null);
    onRefresh();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando asesorías...</p>
        </div>
      </div>
    );
  }

  if (asesorias.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay asesorías para mostrar
        </h3>
        <p className="text-gray-500 mb-4">
          {isCoordinador
            ? "No se encontraron asesorías con los filtros aplicados."
            : "No tienes asesorías registradas en este momento."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tema de Asesoría</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Alumno</TableHead>
              <TableHead>Número de Alumnos</TableHead>
              <TableHead>Duración</TableHead>
              {isCoordinador && <TableHead>Profesor</TableHead>}
              {isCoordinador && <TableHead>Asignatura</TableHead>}
              {isCoordinador && <TableHead>Grupo</TableHead>}
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {asesorias.map((asesoria) => (
              <TableRow key={asesoria.id}>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="font-medium text-gray-900 truncate">
                      {asesoria.temaAsesoria}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {new Date(asesoria.fecha).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {asesoria.nombreAlumno}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <Badge variant="secondary">
                      {asesoria.numeroAlumnos} alumno
                      {asesoria.numeroAlumnos !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {asesoria.duracionAsesoria} min
                    </span>
                  </div>
                </TableCell>
                {isCoordinador && (
                  <TableCell>
                    <span className="text-sm text-gray-700">
                      {asesoria.cargaAcademica?.profesor?.nombre}{" "}
                      {asesoria.cargaAcademica?.profesor?.apellido}
                    </span>
                  </TableCell>
                )}
                {isCoordinador && (
                  <TableCell>
                    <span className="text-sm text-gray-700">
                      {asesoria.cargaAcademica?.asignatura}
                    </span>
                  </TableCell>
                )}
                {isCoordinador && (
                  <TableCell>
                    <span className="text-sm text-gray-700">
                      {asesoria.cargaAcademica?.grupo?.nombreGenerado}
                    </span>
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(asesoria)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(asesoria)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(asesoria)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modales */}
      {selectedAsesoria && showDetailsModal && (
        <AsesoriaDetailsModal
          asesoria={selectedAsesoria}
          onClose={handleModalClose}
        />
      )}

      {selectedAsesoria && showEditModal && (
        <AsesoriaEditModal
          asesoria={selectedAsesoria}
          onClose={handleModalClose}
          onSuccess={handleModalClose}
        />
      )}

      {selectedAsesoria && showDeleteModal && (
        <AsesoriaDeleteModal
          asesoria={selectedAsesoria}
          onClose={handleModalClose}
          onSuccess={handleModalClose}
        />
      )}
    </>
  );
}
