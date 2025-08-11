# Hooks de Reportes de Asesorías

Este documento describe los hooks especializados para generar y gestionar reportes de asesorías académicas.

## Hooks Disponibles

### Hooks Básicos de Reportes

#### `useReporteGeneralAsesorias`

Genera un reporte general con resúmenes por diferentes criterios.

```tsx
const { data, isLoading, error, refetch } = useReporteGeneralAsesorias(
  filtros,
  token,
  enabled
);
```

**Parámetros:**

- `filtros`: FiltrosReporteAsesorias
- `token`: Token de autenticación
- `enabled`: Si debe ejecutarse automáticamente

#### `useReporteAsesoriasPorCarrera`

Genera reporte agrupado por carrera con métricas detalladas.

```tsx
const { data, isLoading, error } = useReporteAsesoriasPorCarrera(
  filtros,
  token,
  enabled
);
```

#### `useReporteAsesoriasPorProfesor`

Genera reporte agrupado por profesor con estadísticas individuales.

```tsx
const { data, isLoading, error } = useReporteAsesoriasPorProfesor(
  filtros,
  token,
  enabled
);
```

#### `useReporteAsesoriasPorTema`

Genera reporte agrupado por tema de asesoría.

```tsx
const { data, isLoading, error } = useReporteAsesoriasPorTema(
  filtros,
  token,
  enabled
);
```

#### `useReporteEstadisticasAsesorias`

Genera reporte estadístico con métricas agregadas y agrupaciones.

```tsx
const { data, isLoading, error } = useReporteEstadisticasAsesorias(
  filtros,
  token,
  enabled
);
```

### Hooks Especializados del Dashboard

#### `useReporteDashboardAsesorias`

Hook base para el reporte del dashboard con opciones avanzadas.

```tsx
const { data, isLoading, error, refetch } = useReporteDashboardAsesorias(
  token,
  {
    enabled: true,
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000, // 5 minutos
    onSuccess: (data) => console.log("Reporte generado:", data),
    onError: (error) => console.error("Error:", error),
  }
);
```

#### `useReporteDashboardAsesoriasUI`

Hook con datos transformados para la interfaz de usuario.

```tsx
const {
  data,
  isLoading,
  refrescarDatos,
  estaActualizando,
  ultimaActualizacion,
  tieneDatos,
  esPrimeraCarga,
  puedeRefrescar,
} = useReporteDashboardAsesoriasUI(token, {
  autoRefresh: true,
});
```

**Datos transformados incluyen:**

- Porcentajes para gráficos
- Métricas adicionales calculadas
- Datos ordenados para rankings
- Formato de horas legible

#### `useReporteDashboardAsesoriasConFiltros`

Hook con filtros aplicados en tiempo real.

```tsx
const { data, filtrosAplicados, aplicarFiltros, limpiarFiltros } =
  useReporteDashboardAsesoriasConFiltros(
    token,
    {
      fechaInicio: "2024-01-01",
      fechaFin: "2024-12-31",
      cuatrimestreId: "123",
      carrera: "TIDS",
    },
    { autoRefresh: true }
  );
```

### Hooks Genéricos

#### `useReporteAsesorias`

Hook genérico que maneja cualquier tipo de reporte.

```tsx
const { data, isLoading, error } = useReporteAsesorias(
  "estadisticas", // tipo de reporte
  filtros,
  token,
  true // enabled
);
```

**Tipos disponibles:**

- `"general"`
- `"por-carrera"`
- `"por-profesor"`
- `"por-tema"`
- `"estadisticas"`

#### `useMultiplesReportesAsesorias`

Hook para generar múltiples reportes simultáneamente.

```tsx
const { reportes, isLoading, error, isError, refetch } =
  useMultiplesReportesAsesorias(
    ["general", "estadisticas", "por-carrera"],
    filtros,
    token,
    true
  );
```

## Uso en Componentes

### Ejemplo Básico

```tsx
import { useReporteDashboardAsesoriasUI } from "~/hooks/asesorias";

function DashboardAsesorias() {
  const { usuario } = useAuthStore();

  const {
    data: reporte,
    isLoading,
    error,
    refrescarDatos,
  } = useReporteDashboardAsesoriasUI(usuario?.accessToken || "", {
    autoRefresh: true,
  });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!reporte) return <div>No hay datos</div>;

  return (
    <div>
      <h2>Dashboard de Asesorías</h2>
      <p>Total: {reporte.totalAsesorias}</p>
      <p>Alumnos: {reporte.totalAlumnosAtendidos}</p>
      <p>Horas: {reporte.totalHorasFormateado}</p>

      <button onClick={refrescarDatos}>Actualizar Datos</button>
    </div>
  );
}
```

### Ejemplo con Filtros

```tsx
import { useReporteDashboardAsesoriasConFiltros } from "~/hooks/asesorias";

function DashboardConFiltros() {
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    carrera: "",
  });

  const {
    data: reporte,
    aplicarFiltros,
    limpiarFiltros,
  } = useReporteDashboardAsesoriasConFiltros(token, filtros, {
    autoRefresh: false,
  });

  const handleFiltroChange = (nuevoFiltro: typeof filtros) => {
    setFiltros(nuevoFiltro);
    aplicarFiltros(nuevoFiltro);
  };

  return (
    <div>
      {/* Componentes de filtros */}
      <FiltrosComponent
        filtros={filtros}
        onChange={handleFiltroChange}
        onClear={limpiarFiltros}
      />

      {/* Visualización del reporte */}
      <ReporteVisualizacion data={reporte} />
    </div>
  );
}
```

## Características

- **React Query**: Gestión de estado y caché automática
- **Reintentos**: Reintento automático en caso de error
- **Refresco automático**: Opción de actualización periódica
- **Transformación de datos**: Datos listos para usar en la UI
- **Filtros en tiempo real**: Aplicación de filtros sin recargar
- **Manejo de errores**: Gestión robusta de errores de red
- **Optimización**: Evita consultas innecesarias

## Configuración

### Tiempos de Caché

- **Reportes generales**: 5 minutos (staleTime), 10 minutos (gcTime)
- **Dashboard**: 2 minutos (staleTime), 5 minutos (gcTime)
- **Refresco automático**: Configurable por hook

### Reintentos

- **Intentos**: 3 reintentos automáticos
- **Delay exponencial**: 1s, 2s, 4s (máximo 30s)

### Callbacks

- `onSuccess`: Ejecutado cuando el reporte se genera exitosamente
- `onError`: Ejecutado cuando ocurre un error

## Dependencias

- `@tanstack/react-query`: Gestión de estado y caché
- `~/services/reportes-asesorias.service`: Servicios de la API
- `~/types/asesorias/reportes`: Tipos TypeScript

## Notas de Implementación

- Los hooks están optimizados para evitar re-renders innecesarios
- El caché se invalida automáticamente cuando cambian los filtros
- Los datos se transforman en el cliente para mejor rendimiento
- Soporte completo para TypeScript con tipos estrictos
