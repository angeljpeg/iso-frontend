import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  Download,
  Calendar,
  User,
  BookOpen,
  Clock,
} from "lucide-react";
import type {
  SeguimientoCurso,
  EstadoSeguimiento,
  EstadoAvance,
} from "~/types/programacion-curso";
import { SeguimientoDetailsModal } from "./SeguimientoDetailsModal";
import { SeguimientoEditModal } from "./SeguimientoEditModal";
import { SeguimientoDeleteModal } from "./SeguimientoDeleteModal";

interface ProgramacionCursosTableProps {
  seguimientos: SeguimientoCurso[];
  isLoading: boolean;
  isCoordinador: boolean;
  onRefresh: () => void;
}

export function ProgramacionCursosTable({
  seguimientos,
  isLoading,
  isCoordinador,
  onRefresh,
}: ProgramacionCursosTableProps) {
  const [selectedSeguimiento, setSelectedSeguimiento] =
    useState<SeguimientoCurso | null>(null);
  const [modalType, setModalType] = useState<
    "details" | "edit" | "delete" | null
  >(null);

  const handleViewDetails = (seguimiento: SeguimientoCurso) => {
    setSelectedSeguimiento(seguimiento);
    setModalType("details");
  };

  const handleEdit = (seguimiento: SeguimientoCurso) => {
    setSelectedSeguimiento(seguimiento);
    setModalType("edit");
  };

  const handleDelete = (seguimiento: SeguimientoCurso) => {
    setSelectedSeguimiento(seguimiento);
    setModalType("delete");
  };

  const handleExportPDF = async (seguimiento: SeguimientoCurso) => {
    try {
      // TODO: Implementar exportación a PDF
      // Por ahora, mostramos un mensaje de funcionalidad en desarrollo
      alert("Funcionalidad de exportación a PDF en desarrollo");

      // Código comentado para futura implementación:
      // const { jsPDF } = await import("jspdf");
      // const doc = new jsPDF();
      //
      // // Título
      // doc.setFontSize(20);
      // doc.text("Seguimiento de Curso", 20, 20);
      //
      // // Información básica
      // doc.setFontSize(12);
      // doc.text(
      //   `Profesor: ${seguimiento.cargaAcademica.profesor?.nombre} ${seguimiento.cargaAcademica.profesor?.apellido}`,
      //   20,
      //   40
      // );
      // doc.text(
      //   `Asignatura: ${seguimiento.cargaAcademica.asignatura}`,
      //   20,
      //   50
      // );
      // doc.text(`Cuatrimestre: ${seguimiento.cuatrimestre.nombreGenerado}`, 20, 60);
      // doc.text(`Estado: ${seguimiento.estado}`, 20, 70);
      //
      // // Detalles
      // if (seguimiento.detalles.length > 0) {
      //   doc.text("Detalles del Seguimiento:", 20, 90);
      //   let yPosition = 100;
      //
      //   seguimiento.detalles.forEach((detalle, index) => {
      //     if (yPosition > 250) {
      //       doc.addPage();
      //       yPosition = 20;
      //     }
      //
      //     doc.text(`Tema ${index + 1}: ${detalle.tema}`, 25, yPosition);
      //     doc.text(`Semana: ${detalle.semanaTerminada}`, 25, yPosition + 8);
      //     doc.text(`Estado: ${detalle.estadoAvance}`, 25, yPosition + 16);
      //
      //     if (detalle.observaciones) {
      //       doc.text(
      //         `Observaciones: ${detalle.observaciones}`,
      //         25,
      //         yPosition + 24
      //       );
      //       yPosition += 32;
      //     } else {
      //       yPosition += 24;
      //     }
      //   });
      // }
      //
      // // Guardar PDF
      // doc.save(`seguimiento-${seguimiento.id}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF");
    }
  };

  const closeModal = () => {
    setSelectedSeguimiento(null);
    setModalType(null);
  };

  const getEstadoColor = (estado: EstadoSeguimiento) => {
    switch (estado) {
      case "borrador":
        return "bg-gray-500";
      case "enviado":
        return "bg-blue-500";
      case "revisado":
        return "bg-yellow-500";
      case "aprobado":
        return "bg-green-500";
      case "rechazado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEstadoAvanceColor = (estado: EstadoAvance) => {
    switch (estado) {
      case "no_iniciado":
        return "bg-gray-500";
      case "en_progreso":
        return "bg-blue-500";
      case "completado":
        return "bg-green-500";
      case "retrasado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (seguimientos.length === 0) {
    return (
      <div className="text-center p-8">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No hay seguimientos
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          No se encontraron seguimientos de cursos para mostrar.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profesor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asignatura
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cuatrimestre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Entrega
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {seguimientos.map((seguimiento) => (
              <tr key={seguimiento.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm font-medium text-gray-900">
                      {seguimiento.cargaAcademica.profesor?.nombre}{" "}
                      {seguimiento.cargaAcademica.profesor?.apellido}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {seguimiento.cargaAcademica.asignatura}
                  </div>
                  <div className="text-sm text-gray-500">
                    {/* La clave de asignatura no está disponible en el tipo actual */}
                    {/* TODO: Agregar clave de asignatura al tipo CargaAcademica si es necesario */}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">
                      {seguimiento.cuatrimestre.nombreGenerado}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    className={`${getEstadoColor(
                      seguimiento.estado
                    )} text-white`}
                  >
                    {seguimiento.estado}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    {seguimiento.detalles.slice(0, 3).map((detalle, index) => (
                      <Badge
                        key={detalle.id}
                        variant="outline"
                        className={`${getEstadoAvanceColor(
                          detalle.estadoAvance
                        )} text-white text-xs`}
                      >
                        Sem {detalle.semanaTerminada}: {detalle.estadoAvance}
                      </Badge>
                    ))}
                    {seguimiento.detalles.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{seguimiento.detalles.length - 3} más
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">
                      {seguimiento.fechaEntregado
                        ? new Date(
                            seguimiento.fechaEntregado
                          ).toLocaleDateString("es-ES")
                        : "Pendiente"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(seguimiento)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {isCoordinador && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(seguimiento)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(seguimiento)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPDF(seguimiento)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {selectedSeguimiento && modalType === "details" && (
        <SeguimientoDetailsModal
          seguimiento={selectedSeguimiento}
          onClose={closeModal}
        />
      )}

      {selectedSeguimiento && modalType === "edit" && (
        <SeguimientoEditModal
          seguimiento={selectedSeguimiento}
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            onRefresh();
          }}
        />
      )}

      {selectedSeguimiento && modalType === "delete" && (
        <SeguimientoDeleteModal
          seguimiento={selectedSeguimiento}
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            onRefresh();
          }}
        />
      )}
    </>
  );
}
