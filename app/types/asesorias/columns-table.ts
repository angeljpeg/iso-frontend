import type { Asesoria } from "./index";

export interface AsesoriaColumn {
  key: keyof Asesoria;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export const asesoriaColumns: AsesoriaColumn[] = [
  {
    key: "temaAsesoria",
    label: "Tema de Asesoría",
    sortable: true,
    filterable: true,
    width: "25%",
  },
  {
    key: "fecha",
    label: "Fecha",
    sortable: true,
    filterable: true,
    width: "12%",
  },
  {
    key: "nombreAlumno",
    label: "Alumno",
    sortable: true,
    filterable: true,
    width: "15%",
  },
  {
    key: "numeroAlumnos",
    label: "N° Alumnos",
    sortable: true,
    filterable: false,
    width: "10%",
    align: "center",
  },
  {
    key: "duracionAsesoria",
    label: "Duración (min)",
    sortable: true,
    filterable: false,
    width: "12%",
    align: "center",
  },
  {
    key: "cargaAcademica",
    label: "Carga Académica",
    sortable: false,
    filterable: true,
    width: "20%",
  },
  {
    key: "activo",
    label: "Estado",
    sortable: true,
    filterable: true,
    width: "8%",
    align: "center",
  },
];
