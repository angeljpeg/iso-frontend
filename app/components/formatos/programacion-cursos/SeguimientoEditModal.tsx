import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { FormInput } from "~/components/ui/forms/FormInput";
import { FormRadioGroup } from "~/components/ui/forms/FormRadioGroup";
import { Badge } from "~/components/ui/badge";
import { 
  X, 
  Save, 
  Plus, 
  Trash2,
  Edit3
} from "lucide-react";
import type { 
  SeguimientoCurso, 
  EstadoSeguimiento, 
  EstadoAvance,
  UpdateSeguimientoCursoDto,
  UpdateSeguimientoDetalleDto,
  CreateSeguimientoDetalleDto
} from "~/types/programacion-curso";

interface SeguimientoEditModalProps {
  seguimiento: SeguimientoCurso;
  onClose: () => void;
  onSuccess: () => void;
}

export function SeguimientoEditModal({ 
  seguimiento, 
  onClose, 
  onSuccess 
}: SeguimientoEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState<UpdateSeguimientoCursoDto>({
    estado: seguimiento.estado,
    fechaRevision: seguimiento.fechaRevision || undefined,
    fechaSeguimientoFinal: seguimiento.fechaSeguimientoFinal || undefined,
    numeroRevision: seguimiento.numeroRevision,
  });

  const [detalles, setDetalles] = useState(seguimiento.detalles.map(d => ({
    ...d,
    isEditing: false,
    editData: {
      tema: d.tema,
      semanaTerminada: d.semanaTerminada,
      estadoAvance: d.estadoAvance,
      observaciones: d.observaciones || '',
      justificacion: d.justificacion || '',
      acciones: d.acciones || '',
      evidencias: d.evidencias || '',
      retraso: d.retraso,
    }
  })));

  const [newDetalle, setNewDetalle] = useState<CreateSeguimientoDetalleDto>({
    tema: '',
    semanaTerminada: 1,
    seguimientoCursoId: seguimiento.id,
    estadoAvance: 'no_iniciado',
    justificacion: '',
    acciones: '',
    evidencias: '',
  });

  const estados: { value: EstadoSeguimiento; label: string }[] = [
    { value: 'borrador', label: 'Borrador' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'revisado', label: 'Revisado' },
    { value: 'aprobado', label: 'Aprobado' },
    { value: 'rechazado', label: 'Rechazado' },
  ];

  const estadosAvance: { value: EstadoAvance; label: string }[] = [
    { value: 'no_iniciado', label: 'No Iniciado' },
    { value: 'en_progreso', label: 'En Progreso' },
    { value: 'completado', label: 'Completado' },
    { value: 'retrasado', label: 'Retrasado' },
  ];

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Aquí se implementaría la llamada al servicio para actualizar
      // Por ahora solo simulamos el guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los cambios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetalleEdit = (index: number) => {
    setDetalles(prev => prev.map((d, i) => 
      i === index ? { ...d, isEditing: true } : d
    ));
  };

  const handleDetalleSave = (index: number) => {
    setDetalles(prev => prev.map((d, i) => 
      i === index ? { 
        ...d, 
        isEditing: false,
        ...d.editData 
      } : d
    ));
  };

  const handleDetalleCancel = (index: number) => {
    setDetalles(prev => prev.map((d, i) => 
      i === index ? { 
        ...d, 
        isEditing: false,
        editData: {
          tema: d.tema,
          semanaTerminada: d.semanaTerminada,
          estadoAvance: d.estadoAvance,
          observaciones: d.observaciones || '',
          justificacion: d.justificacion || '',
          acciones: d.acciones || '',
          evidencias: d.evidencias || '',
          retraso: d.retraso,
        }
      } : d
    ));
  };

  const handleDetalleDelete = (index: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este detalle?')) {
      setDetalles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleDetalleChange = (index: number, field: string, value: any) => {
    setDetalles(prev => prev.map((d, i) => 
      i === index ? {
        ...d,
        editData: { ...d.editData, [field]: value }
      } : d
    ));
  };

  const handleAddDetalle = () => {
    if (newDetalle.tema.trim()) {
      setDetalles(prev => [...prev, {
        id: `temp-${Date.now()}`,
        tema: newDetalle.tema,
        semanaTerminada: newDetalle.semanaTerminada,
        estadoAvance: newDetalle.estadoAvance,
        observaciones: newDetalle.observaciones || null,
        justificacion: newDetalle.justificacion || null,
        acciones: newDetalle.acciones || null,
        evidencias: newDetalle.evidencias || null,
        retraso: false,
        seguimientoCursoId: seguimiento.id,
        seguimientoCurso: seguimiento,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEditing: false,
        editData: { ...newDetalle }
      }]);
      
      setNewDetalle({
        tema: '',
        semanaTerminada: 1,
        seguimientoCursoId: seguimiento.id,
        estadoAvance: 'no_iniciado',
        justificacion: '',
        acciones: '',
        evidencias: '',
      });
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Edit3 className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Editar Seguimiento
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
          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado del Seguimiento
              </label>
              <FormRadioGroup
                options={estados}
                value={editData.estado || 'borrador'}
                onChange={(value) => setEditData(prev => ({ ...prev, estado: value as EstadoSeguimiento }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Revisión
              </label>
              <FormInput
                type="number"
                value={editData.numeroRevision || 1}
                onChange={(e) => setEditData(prev => ({ ...prev, numeroRevision: parseInt(e.target.value) }))}
                min="1"
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Revisión
              </label>
              <FormInput
                type="date"
                value={editData.fechaRevision ? new Date(editData.fechaRevision).toISOString().split('T')[0] : ''}
                onChange={(e) => setEditData(prev => ({ 
                  ...prev, 
                  fechaRevision: e.target.value ? new Date(e.target.value).toISOString() : undefined 
                }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Seguimiento Final
              </label>
              <FormInput
                type="date"
                value={editData.fechaSeguimientoFinal ? new Date(editData.fechaSeguimientoFinal).toISOString().split('T')[0] : ''}
                onChange={(e) => setEditData(prev => ({ 
                  ...prev, 
                  fechaSeguimientoFinal: e.target.value ? new Date(e.target.value).toISOString() : undefined 
                }))}
              />
            </div>
          </div>

          {/* Detalles del Seguimiento */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Detalles del Seguimiento ({detalles.length} temas)
              </h3>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddDetalle}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                Agregar Tema
              </Button>
            </div>

            {/* Nuevo detalle */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Nuevo Tema</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tema
                  </label>
                  <FormInput
                    type="text"
                    value={newDetalle.tema}
                    onChange={(e) => setNewDetalle(prev => ({ ...prev, tema: e.target.value }))}
                    placeholder="Descripción del tema"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semana Terminada
                  </label>
                  <FormInput
                    type="number"
                    value={newDetalle.semanaTerminada}
                    onChange={(e) => setNewDetalle(prev => ({ ...prev, semanaTerminada: parseInt(e.target.value) }))}
                    min="1"
                    max="20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado de Avance
                  </label>
                  <select
                    value={newDetalle.estadoAvance}
                    onChange={(e) => setNewDetalle(prev => ({ ...prev, estadoAvance: e.target.value as EstadoAvance }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {estadosAvance.map((estado) => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Justificación
                  </label>
                  <FormInput
                    type="text"
                    value={newDetalle.justificacion}
                    onChange={(e) => setNewDetalle(prev => ({ ...prev, justificacion: e.target.value }))}
                    placeholder="Justificación del avance"
                  />
                </div>
              </div>
            </div>

            {/* Lista de detalles existentes */}
            <div className="space-y-4">
              {detalles.map((detalle, index) => (
                <div key={detalle.id} className="border border-gray-200 rounded-lg p-4">
                  {detalle.isEditing ? (
                    // Modo edición
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tema
                          </label>
                          <FormInput
                            type="text"
                            value={detalle.editData.tema}
                            onChange={(e) => handleDetalleChange(index, 'tema', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Semana Terminada
                          </label>
                          <FormInput
                            type="number"
                            value={detalle.editData.semanaTerminada}
                            onChange={(e) => handleDetalleChange(index, 'semanaTerminada', parseInt(e.target.value))}
                            min="1"
                            max="20"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado de Avance
                          </label>
                          <select
                            value={detalle.editData.estadoAvance}
                            onChange={(e) => handleDetalleChange(index, 'estadoAvance', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            {estadosAvance.map((estado) => (
                              <option key={estado.value} value={estado.value}>
                                {estado.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Retraso
                          </label>
                          <input
                            type="checkbox"
                            checked={detalle.editData.retraso}
                            onChange={(e) => handleDetalleChange(index, 'retraso', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Observaciones
                          </label>
                          <textarea
                            value={detalle.editData.observaciones}
                            onChange={(e) => handleDetalleChange(index, 'observaciones', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Acciones
                          </label>
                          <textarea
                            value={detalle.editData.acciones}
                            onChange={(e) => handleDetalleChange(index, 'acciones', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDetalleCancel(index)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDetalleSave(index)}
                        >
                          Guardar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Modo visualización
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {index + 1}
                          </span>
                          <h4 className="font-medium text-gray-900">{detalle.tema}</h4>
                          <Badge className={`${getEstadoAvanceColor(detalle.estadoAvance)} text-white`}>
                            {detalle.estadoAvance}
                          </Badge>
                          {detalle.retraso && (
                            <Badge variant="destructive">Retrasado</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Semana: {detalle.semanaTerminada}</p>
                            {detalle.observaciones && (
                              <p className="text-gray-900">Obs: {detalle.observaciones}</p>
                            )}
                          </div>
                          
                          <div>
                            {detalle.justificacion && (
                              <p className="text-gray-900">Just: {detalle.justificacion}</p>
                            )}
                            {detalle.acciones && (
                              <p className="text-gray-900">Acc: {detalle.acciones}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDetalleEdit(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDetalleDelete(index)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
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
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
}
