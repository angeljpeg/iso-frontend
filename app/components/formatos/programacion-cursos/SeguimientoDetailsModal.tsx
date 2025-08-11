import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/badge";
import { 
  X, 
  User, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Download
} from "lucide-react";
import type { SeguimientoCurso, EstadoSeguimiento, EstadoAvance } from "~/types/programacion-curso";

interface SeguimientoDetailsModalProps {
  seguimiento: SeguimientoCurso;
  onClose: () => void;
}

export function SeguimientoDetailsModal({ seguimiento, onClose }: SeguimientoDetailsModalProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      // Por ahora, creamos un PDF simple con jsPDF
      // En el futuro, esto se reemplazará con el diseño específico
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(20);
      doc.text('Seguimiento de Curso - Detalles', 20, 20);
      
      // Información básica
      doc.setFontSize(12);
      doc.text(`Profesor: ${seguimiento.cargaAcademica.profesor?.nombre} ${seguimiento.cargaAcademica.profesor?.apellido}`, 20, 40);
      doc.text(`Asignatura: ${seguimiento.cargaAcademica.asignatura?.nombre}`, 20, 50);
      doc.text(`Clave: ${seguimiento.cargaAcademica.asignatura?.clave}`, 20, 60);
      doc.text(`Cuatrimestre: ${seguimiento.cuatrimestre.nombre}`, 20, 70);
      doc.text(`Estado: ${seguimiento.estado}`, 20, 80);
      doc.text(`Número de Revisión: ${seguimiento.numeroRevision}`, 20, 90);
      
      // Fechas
      if (seguimiento.fechaEntregado) {
        doc.text(`Fecha de Entrega: ${new Date(seguimiento.fechaEntregado).toLocaleDateString('es-ES')}`, 20, 100);
      }
      if (seguimiento.fechaRevision) {
        doc.text(`Fecha de Revisión: ${new Date(seguimiento.fechaRevision).toLocaleDateString('es-ES')}`, 20, 110);
      }
      if (seguimiento.fechaSeguimientoFinal) {
        doc.text(`Fecha de Seguimiento Final: ${new Date(seguimiento.fechaSeguimientoFinal).toLocaleDateString('es-ES')}`, 20, 120);
      }
      
      // Detalles
      if (seguimiento.detalles.length > 0) {
        doc.text('Detalles del Seguimiento:', 20, 140);
        let yPosition = 150;
        
        seguimiento.detalles.forEach((detalle, index) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.text(`Tema ${index + 1}: ${detalle.tema}`, 25, yPosition);
          doc.text(`Semana Terminada: ${detalle.semanaTerminada}`, 25, yPosition + 8);
          doc.text(`Estado de Avance: ${detalle.estadoAvance}`, 25, yPosition + 16);
          doc.text(`Retraso: ${detalle.retraso ? 'Sí' : 'No'}`, 25, yPosition + 24);
          
          if (detalle.observaciones) {
            doc.text(`Observaciones: ${detalle.observaciones}`, 25, yPosition + 32);
            yPosition += 40;
          } else {
            yPosition += 32;
          }
          
          if (detalle.justificacion) {
            doc.text(`Justificación: ${detalle.justificacion}`, 25, yPosition + 8);
            yPosition += 16;
          }
          
          if (detalle.acciones) {
            doc.text(`Acciones: ${detalle.acciones}`, 25, yPosition + 8);
            yPosition += 16;
          }
          
          if (detalle.evidencias) {
            doc.text(`Evidencias: ${detalle.evidencias}`, 25, yPosition + 8);
            yPosition += 16;
          }
        });
      }
      
      // Guardar PDF
      doc.save(`seguimiento-detallado-${seguimiento.id}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const getEstadoColor = (estado: EstadoSeguimiento) => {
    switch (estado) {
      case 'borrador': return 'bg-gray-500';
      case 'enviado': return 'bg-blue-500';
      case 'revisado': return 'bg-yellow-500';
      case 'aprobado': return 'bg-green-500';
      case 'rechazado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEstadoAvanceColor = (estado: EstadoAvance) => {
    switch (estado) {
      case 'no_iniciado': return 'bg-gray-500';
      case 'en_progreso': return 'bg-blue-500';
      case 'completado': return 'bg-green-500';
      case 'retrasado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEstadoIcon = (estado: EstadoAvance) => {
    switch (estado) {
      case 'completado': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'retrasado': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'en_progreso': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Detalles del Seguimiento
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Generando...' : 'Exportar PDF'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Profesor</p>
                  <p className="text-sm text-gray-900">
                    {seguimiento.cargaAcademica.profesor?.nombre} {seguimiento.cargaAcademica.profesor?.apellido}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Asignatura</p>
                  <p className="text-sm text-gray-900">
                    {seguimiento.cargaAcademica.asignatura?.nombre}
                  </p>
                  <p className="text-xs text-gray-500">
                    Clave: {seguimiento.cargaAcademica.asignatura?.clave}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Cuatrimestre</p>
                  <p className="text-sm text-gray-900">{seguimiento.cuatrimestre.nombre}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 flex items-center justify-center">
                  <Badge className={`${getEstadoColor(seguimiento.estado)} text-white`}>
                    {seguimiento.estado}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <p className="text-sm text-gray-900">Revisión #{seguimiento.numeroRevision}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fechas Importantes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500">Fecha de Entrega</p>
                <p className="text-sm text-gray-900">
                  {seguimiento.fechaEntregado 
                    ? new Date(seguimiento.fechaEntregado).toLocaleDateString('es-ES')
                    : 'Pendiente'
                  }
                </p>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500">Fecha de Revisión</p>
                <p className="text-sm text-gray-900">
                  {seguimiento.fechaRevision 
                    ? new Date(seguimiento.fechaRevision).toLocaleDateString('es-ES')
                    : 'Pendiente'
                  }
                </p>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500">Seguimiento Final</p>
                <p className="text-sm text-gray-900">
                  {seguimiento.fechaSeguimientoFinal 
                    ? new Date(seguimiento.fechaSeguimientoFinal).toLocaleDateString('es-ES')
                    : 'Pendiente'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Detalles del Seguimiento */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Detalles del Seguimiento ({seguimiento.detalles.length} temas)
            </h3>
            
            {seguimiento.detalles.length > 0 ? (
              <div className="space-y-4">
                {seguimiento.detalles.map((detalle, index) => (
                  <div key={detalle.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {index + 1}
                        </span>
                        <h4 className="font-medium text-gray-900">{detalle.tema}</h4>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getEstadoIcon(detalle.estadoAvance)}
                        <Badge className={`${getEstadoAvanceColor(detalle.estadoAvance)} text-white`}>
                          {detalle.estadoAvance}
                        </Badge>
                        {detalle.retraso && (
                          <Badge variant="destructive">Retrasado</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Semana Terminada</p>
                        <p className="text-gray-900">{detalle.semanaTerminada}</p>
                      </div>
                      
                      {detalle.observaciones && (
                        <div>
                          <p className="font-medium text-gray-700">Observaciones</p>
                          <p className="text-gray-900">{detalle.observaciones}</p>
                        </div>
                      )}
                      
                      {detalle.justificacion && (
                        <div>
                          <p className="font-medium text-gray-700">Justificación</p>
                          <p className="text-gray-900">{detalle.justificacion}</p>
                        </div>
                      )}
                      
                      {detalle.acciones && (
                        <div>
                          <p className="font-medium text-gray-700">Acciones</p>
                          <p className="text-gray-900">{detalle.acciones}</p>
                        </div>
                      )}
                      
                      {detalle.evidencias && (
                        <div>
                          <p className="font-medium text-gray-700">Evidencias</p>
                          <p className="text-gray-900">{detalle.evidencias}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>No hay detalles de seguimiento registrados</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
