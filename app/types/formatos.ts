export interface FormatoCard {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  ruta: string;
  disponible: boolean;
  color: string;
}

export const FORMATOS_ISO: FormatoCard[] = [
  {
    id: "seguimiento",
    titulo: "Seguimiento y Programación de Cursos",
    descripcion:
      "Registra el avance semanal de tus asignaturas y justifica retrasos",
    icono: "📚",
    ruta: "/formatos/programacion-cursos",
    disponible: true,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  },
  {
    id: "asesorias",
    titulo: "Registro de Asesorías",
    descripcion: "Documenta las asesorías académicas brindadas a estudiantes",
    icono: "👥",
    ruta: "/formatos/asesorias",
    disponible: true,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
  },
  {
    id: "tutorias",
    titulo: "Reporte de Tutorías",
    descripcion: "Gestiona y reporta las actividades de tutoría estudiantil",
    icono: "🎓",
    ruta: "/formatos/tutorias",
    disponible: true, // Se determinará dinámicamente según el rol
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
  {
    id: "estadias",
    titulo: "Reporte Mensual de Avances de Estadías",
    descripcion: "Seguimiento mensual del progreso de estudiantes en estadías",
    icono: "📊",
    ruta: "/formatos/estadias",
    disponible: true,
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  },
  {
    id: "necesidades-especiales",
    titulo: "Reporte de Necesidades Especiales",
    descripcion: "Reporte de necesidades especiales de estudiantes",
    icono: "👥",
    ruta: "/formatos/necesidades-especiales",
    disponible: true,
    color: "bg-red-50 border-red-200 hover:bg-red-100",
  },
];
