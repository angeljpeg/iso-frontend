import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Textarea } from '../components/ui/textarea';

interface AlumnoEstadia {
  id: string;
  nombre: string;
  avances: {
    mes1: { mostroAvance: boolean; acciones: string };
    mes2: { mostroAvance: boolean; acciones: string };
    mes3: { mostroAvance: boolean; acciones: string };
    mes4: { mostroAvance: boolean; acciones: string };
  };
}

export default function ReporteEstadiasPage() {
  const { usuario } = useAuthStore();
  const [alumnos, setAlumnos] = useState<AlumnoEstadia[]>([
    {
      id: '1',
      nombre: 'Juan Pérez',
      avances: {
        mes1: { mostroAvance: true, acciones: '' },
        mes2: { mostroAvance: false, acciones: 'Se programó reunión de seguimiento' },
        mes3: { mostroAvance: true, acciones: '' },
        mes4: { mostroAvance: false, acciones: 'Pendiente de revisión' }
      }
    },
    {
      id: '2',
      nombre: 'María García',
      avances: {
        mes1: { mostroAvance: true, acciones: '' },
        mes2: { mostroAvance: true, acciones: '' },
        mes3: { mostroAvance: false, acciones: 'Se envió recordatorio por email' },
        mes4: { mostroAvance: true, acciones: '' }
      }
    },
    {
      id: '3',
      nombre: 'Carlos López',
      avances: {
        mes1: { mostroAvance: false, acciones: 'Se contactó al estudiante' },
        mes2: { mostroAvance: true, acciones: '' },
        mes3: { mostroAvance: true, acciones: '' },
        mes4: { mostroAvance: true, acciones: '' }
      }
    }
  ]);

  const [nuevoAlumno, setNuevoAlumno] = useState('');

  const handleAgregarAlumno = () => {
    if (nuevoAlumno.trim()) {
      const nuevoAlumnoObj: AlumnoEstadia = {
        id: Date.now().toString(),
        nombre: nuevoAlumno.trim(),
        avances: {
          mes1: { mostroAvance: false, acciones: '' },
          mes2: { mostroAvance: false, acciones: '' },
          mes3: { mostroAvance: false, acciones: '' },
          mes4: { mostroAvance: false, acciones: '' }
        }
      };
      setAlumnos([...alumnos, nuevoAlumnoObj]);
      setNuevoAlumno('');
    }
  };

  const handleAvanceChange = (alumnoId: string, mes: keyof AlumnoEstadia['avances'], mostroAvance: boolean) => {
    setAlumnos(alumnos.map(alumno => 
      alumno.id === alumnoId 
        ? { 
            ...alumno, 
            avances: { 
              ...alumno.avances, 
              [mes]: { ...alumno.avances[mes], mostroAvance } 
            } 
          }
        : alumno
    ));
  };

  const handleAccionesChange = (alumnoId: string, mes: keyof AlumnoEstadia['avances'], acciones: string) => {
    setAlumnos(alumnos.map(alumno => 
      alumno.id === alumnoId 
        ? { 
            ...alumno, 
            avances: { 
              ...alumno.avances, 
              [mes]: { ...alumno.avances[mes], acciones } 
            } 
          }
        : alumno
    ));
  };

  const handleEliminarAlumno = (alumnoId: string) => {
    setAlumnos(alumnos.filter(alumno => alumno.id !== alumnoId));
  };

  return (
    <DashboardLayout title="Reporte Mensual de Avances de Estadías">
      <div className="space-y-6">
        {/* Header con nombre del profesor */}
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Label htmlFor="profesor-nombre" className="text-lg font-semibold">
              NOMBRE DEL PROFESOR (A):
            </Label>
            <Input
              id="profesor-nombre"
              value={usuario?.nombre || ''}
              readOnly
              className="max-w-md"
            />
          </div>
        </Card>

        {/* Agregar nuevo alumno */}
        <Card className="p-6">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <Label htmlFor="nuevo-alumno">Agregar Nuevo Alumno:</Label>
              <Input
                id="nuevo-alumno"
                value={nuevoAlumno}
                onChange={(e) => setNuevoAlumno(e.target.value)}
                placeholder="Nombre del alumno"
                onKeyPress={(e) => e.key === 'Enter' && handleAgregarAlumno()}
              />
            </div>
            <Button onClick={handleAgregarAlumno} disabled={!nuevoAlumno.trim()}>
              Agregar
            </Button>
          </div>
        </Card>

        {/* Tabla de reporte */}
        <Card className="p-6 overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Nombre del alumno
                  </th>
                  {/* Mes 1 */}
                  <th colSpan={2} className="border border-gray-300 p-3 text-center font-semibold">
                    MES 1: el alumno mostró avance
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Acciones tomadas y por hacer cuando el alumno no presentó avances
                  </th>
                  {/* Mes 2 */}
                  <th colSpan={2} className="border border-gray-300 p-3 text-center font-semibold">
                    MES 2: el alumno mostró avance
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Acciones tomadas cuando el alumno no presentó avances
                  </th>
                  {/* Mes 3 */}
                  <th colSpan={2} className="border border-gray-300 p-3 text-center font-semibold">
                    MES 3: el alumno mostró avance
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Acciones tomadas cuando el alumno no presentó avances
                  </th>
                  {/* Mes 4 */}
                  <th colSpan={2} className="border border-gray-300 p-3 text-center font-semibold">
                    MES 4: el alumno mostró avance
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Acciones tomadas cuando el alumno no presentó avances
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">
                    Acciones
                  </th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2"></th>
                  {/* Mes 1 */}
                  <th className="border border-gray-300 p-2 text-center">Sí</th>
                  <th className="border border-gray-300 p-2 text-center">No</th>
                  <th className="border border-gray-300 p-2"></th>
                  {/* Mes 2 */}
                  <th className="border border-gray-300 p-2 text-center">Sí</th>
                  <th className="border border-gray-300 p-2 text-center">No</th>
                  <th className="border border-gray-300 p-2"></th>
                  {/* Mes 3 */}
                  <th className="border border-gray-300 p-2 text-center">Sí</th>
                  <th className="border border-gray-300 p-2 text-center">No</th>
                  <th className="border border-gray-300 p-2"></th>
                  {/* Mes 4 */}
                  <th className="border border-gray-300 p-2 text-center">Sí</th>
                  <th className="border border-gray-300 p-2 text-center">No</th>
                  <th className="border border-gray-300 p-2"></th>
                  <th className="border border-gray-300 p-2"></th>
                </tr>
              </thead>
              <tbody>
                {alumnos.map((alumno) => (
                  <tr key={alumno.id}>
                    <td className="border border-gray-300 p-3 font-medium">
                      {alumno.nombre}
                    </td>
                    
                    {/* Mes 1 */}
                    <td className="border border-gray-300 p-2 text-center">
                      <Checkbox
                        checked={alumno.avances.mes1.mostroAvance}
                        onChange={(e) => 
                          handleAvanceChange(alumno.id, 'mes1', e.target.checked)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <Checkbox
                        checked={!alumno.avances.mes1.mostroAvance}
                        onChange={(e) => 
                          handleAvanceChange(alumno.id, 'mes1', !e.target.checked)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Textarea
                        value={alumno.avances.mes1.acciones}
                        onChange={(e) => handleAccionesChange(alumno.id, 'mes1', e.target.value)}
                        placeholder="Acciones tomadas..."
                        className="min-h-[60px] resize-none"
                      />
                    </td>

                    {/* Mes 2 */}
                    <td className="border border-gray-300 p-2 text-center">
                      <Checkbox
                        checked={alumno.avances.mes2.mostroAvance}
                        onChange={(e) => 
                          handleAvanceChange(alumno.id, 'mes2', e.target.checked)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <Checkbox
                        checked={!alumno.avances.mes2.mostroAvance}
                        onChange={(e) => 
                          handleAvanceChange(alumno.id, 'mes2', !e.target.checked)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Textarea
                        value={alumno.avances.mes2.acciones}
                        onChange={(e) => handleAccionesChange(alumno.id, 'mes2', e.target.value)}
                        placeholder="Acciones tomadas..."
                        className="min-h-[60px] resize-none"
                      />
                    </td>

                    {/* Mes 3 */}
                    <td className="border border-gray-300 p-2 text-center">
                      <Checkbox
                        checked={alumno.avances.mes3.mostroAvance}
                        onChange={(e) => 
                          handleAvanceChange(alumno.id, 'mes3', e.target.checked)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <Checkbox
                        checked={!alumno.avances.mes3.mostroAvance}
                        onChange={(e) => 
                          handleAvanceChange(alumno.id, 'mes3', !e.target.checked)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Textarea
                        value={alumno.avances.mes3.acciones}
                        onChange={(e) => handleAccionesChange(alumno.id, 'mes3', e.target.value)}
                        placeholder="Acciones tomadas..."
                        className="min-h-[60px] resize-none"
                      />
                    </td>

                    {/* Mes 4 */}
                    <td className="border border-gray-300 p-2 text-center">
                      <Checkbox
                        checked={alumno.avances.mes4.mostroAvance}
                        onChange={(e) => 
                          handleAvanceChange(alumno.id, 'mes4', e.target.checked)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <Checkbox
                        checked={!alumno.avances.mes4.mostroAvance}
                        onChange={(e) => 
                          handleAvanceChange(alumno.id, 'mes4', !e.target.checked)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Textarea
                        value={alumno.avances.mes4.acciones}
                        onChange={(e) => handleAccionesChange(alumno.id, 'mes4', e.target.value)}
                        placeholder="Acciones tomadas..."
                        className="min-h-[60px] resize-none"
                      />
                    </td>

                    <td className="border border-gray-300 p-2 text-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleEliminarAlumno(alumno.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline">
            Guardar Borrador
          </Button>
          <Button>
            Generar Reporte
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
