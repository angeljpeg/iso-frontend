import { useQuery } from "@tanstack/react-query";
import { getAllAsesorias } from "~/services/asesorias.service";
import type { QueryAsesoriaDto, AsesoriaResponseDto } from "~/types/asesorias";

// Datos mock temporales para desarrollo
const mockAsesorias = [
  {
    id: "1",
    temaAsesoria: "Programación Orientada a Objetos",
    fecha: "2024-01-15",
    numeroAlumnos: 5,
    nombreAlumno: "Ana García",
    duracionAsesoria: 90,
    cargaAcademicaId: "1",
    activo: true,
    cargaAcademica: {
      id: "1",
      carrera: "TIDS",
      asignatura: "Programación Web",
      profesor: {
        id: "1",
        nombre: "Juan",
        apellido: "Pérez",
      },
      grupo: {
        id: "1",
        nombreGenerado: "TIDS-2024-1A",
      },
      cuatrimestre: {
        id: "1",
        nombreGenerado: "Primer Cuatrimestre 2024",
      },
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    temaAsesoria: "Bases de Datos Relacionales",
    fecha: "2024-01-16",
    numeroAlumnos: 3,
    nombreAlumno: "Carlos López",
    duracionAsesoria: 60,
    cargaAcademicaId: "2",
    activo: true,
    cargaAcademica: {
      id: "2",
      carrera: "TIDS",
      asignatura: "Bases de Datos",
      profesor: {
        id: "2",
        nombre: "María",
        apellido: "García",
      },
      grupo: {
        id: "2",
        nombreGenerado: "TIDS-2024-1B",
      },
      cuatrimestre: {
        id: "1",
        nombreGenerado: "Primer Cuatrimestre 2024",
      },
    },
    createdAt: "2024-01-16T14:00:00Z",
    updatedAt: "2024-01-16T14:00:00Z",
  },
  {
    id: "3",
    temaAsesoria: "Desarrollo de APIs REST",
    fecha: "2024-01-17",
    numeroAlumnos: 4,
    nombreAlumno: "Luis Martínez",
    duracionAsesoria: 75,
    cargaAcademicaId: "3",
    activo: true,
    cargaAcademica: {
      id: "3",
      carrera: "TIDS",
      asignatura: "Desarrollo Móvil",
      profesor: {
        id: "3",
        nombre: "Carlos",
        apellido: "López",
      },
      grupo: {
        id: "3",
        nombreGenerado: "TIDS-2024-1C",
      },
      cuatrimestre: {
        id: "1",
        nombreGenerado: "Primer Cuatrimestre 2024",
      },
    },
    createdAt: "2024-01-17T16:00:00Z",
    updatedAt: "2024-01-17T16:00:00Z",
  },
];

// Función mock temporal
const getMockAsesorias = async (
  filters: QueryAsesoriaDto
): Promise<AsesoriaResponseDto> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Aplicar filtros básicos
  let filteredAsesorias = [...mockAsesorias];

  if (filters.profesorId) {
    filteredAsesorias = filteredAsesorias.filter(
      (a) => a.cargaAcademica.profesor.id === filters.profesorId
    );
  }

  if (filters.carrera) {
    filteredAsesorias = filteredAsesorias.filter(
      (a) => a.cargaAcademica.carrera === filters.carrera
    );
  }

  if (filters.temaAsesoria) {
    filteredAsesorias = filteredAsesorias.filter((a) =>
      a.temaAsesoria.toLowerCase().includes(filters.temaAsesoria!.toLowerCase())
    );
  }

  // Paginación básica
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedAsesorias = filteredAsesorias.slice(startIndex, endIndex);

  return {
    data: paginatedAsesorias,
    total: filteredAsesorias.length,
    page,
    limit,
  };
};

export const useAsesorias = (
  filters: QueryAsesoriaDto,
  token: string,
  enabled: boolean = true
) => {
  // Usar datos mock temporalmente
  const useMock = true; // Cambiar a false cuando el backend esté listo

  if (useMock) {
    return useQuery({
      queryKey: ["asesorias", "mock", filters],
      queryFn: () => getMockAsesorias(filters),
      enabled: enabled,
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    });
  }

  // Hook real para cuando el backend esté listo
  return useQuery({
    queryKey: ["asesorias", filters],
    queryFn: () => getAllAsesorias({ ...filters, token }),
    enabled: enabled && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useAsesoriasPaginated = (
  page: number = 1,
  limit: number = 10,
  token: string,
  filters?: Omit<QueryAsesoriaDto, "page" | "limit">,
  enabled: boolean = true
) => {
  // Usar datos mock temporalmente
  const useMock = true; // Cambiar a false cuando el backend esté listo

  if (useMock) {
    return useQuery({
      queryKey: ["asesorias", "paginated", "mock", page, limit, filters],
      queryFn: () => getMockAsesorias({ page, limit, ...filters }),
      enabled: enabled,
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    });
  }

  // Hook real para cuando el backend esté listo
  return useQuery({
    queryKey: ["asesorias", "paginated", page, limit, filters],
    queryFn: () => getAllAsesorias({ page, limit, ...filters, token }),
    enabled: enabled && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
