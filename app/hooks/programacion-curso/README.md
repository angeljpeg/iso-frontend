# Hooks de Programación y Seguimiento de Curso

Este directorio contiene hooks personalizados para manejar la lógica de estado y las operaciones relacionadas con la programación y seguimiento de cursos.

## Hooks de Seguimiento

### `useSeguimientosByProfesor`

Hook para obtener seguimientos filtrados por profesor.

```tsx
const { seguimientos, isLoading, error, pagination, updateOptions } =
  useSeguimientosByProfesor({
    profesorId: "123",
    cuatrimestreId: "456",
    estado: "enviado",
  });
```

### `useSeguimientosCurso`

Hook para obtener todos los seguimientos de curso con paginación.

### `useSeguimientoCurso`

Hook para obtener un seguimiento específico por ID.

### `useSeguimientoCursoActions`

Hook para operaciones CRUD de seguimientos de curso.

### `useSeguimientoDetalles`

Hook para obtener detalles de un seguimiento.

### `useSeguimientoDetalleActions`

Hook para operaciones CRUD de detalles de seguimiento.

## Hooks de Reportes

### `useReporteDashboard`

Hook para obtener el reporte consolidado del dashboard.

```tsx
const { reporte, isLoading, error, refresh } = useReporteDashboard();
```

**Retorna:**

- `reporte`: Datos del reporte consolidado
- `isLoading`: Estado de carga
- `error`: Mensaje de error si existe
- `refresh`: Función para refrescar el reporte
- `lastUpdated`: Fecha de última actualización

### `useReporteGenerico`

Hook genérico para cualquier tipo de reporte. Permite configurar el tipo y filtros.

```tsx
const { reporte, isLoading, error, generarReporte } = useReporteGenerico({
  tipo: "seguimientos",
  filtros: { cuatrimestreId: "123" },
  autoFetch: true,
});
```

**Parámetros:**

- `tipo`: Tipo de reporte ("seguimientos", "avance", "notificaciones", "estadisticas", "retrasos", "completitud")
- `filtros`: Filtros específicos para el tipo de reporte
- `autoFetch`: Si debe ejecutarse automáticamente al montar

### `useReporteSeguimientos`

Hook específico para reportes de seguimientos con gestión de filtros.

```tsx
const { reporte, filtros, updateFiltros, resetFiltros } =
  useReporteSeguimientos({
    cuatrimestreId: "123",
    incluirDetalles: true,
  });

// Actualizar filtros
updateFiltros({ estado: "enviado" });

// Resetear filtros
resetFiltros();
```

### `useReporteRetrasos`

Hook específico para reportes de retrasos con opciones especiales.

```tsx
const {
  reporte,
  filtros,
  toggleIncluirJustificaciones,
  toggleIncluirAccionesCorrectivas,
} = useReporteRetrasos({
  incluirJustificaciones: true,
  incluirAccionesCorrectivas: false,
});

// Toggle opciones
toggleIncluirJustificaciones();
toggleIncluirAccionesCorrectivas();
```

### `useReporteCompletitud`

Hook específico para reportes de completitud con métricas de calidad.

```tsx
const { reporte, filtros, setRangoCompletitud, toggleMetricasCalidad } =
  useReporteCompletitud({
    porcentajeMinimo: 50,
    porcentajeMaximo: 100,
  });

// Establecer rango de completitud
setRangoCompletitud(25, 75);

// Toggle métricas de calidad
toggleMetricasCalidad();
```

## Tipos de Filtros

### `FiltrosReporteSeguimiento`

```tsx
interface FiltrosReporteSeguimiento {
  cuatrimestreId?: string;
  profesorId?: string;
  asignaturaId?: string;
  grupoId?: string;
  estado?: string;
  semana?: number;
  fechaInicio?: string;
  fechaFin?: string;
  conRetrasos?: boolean;
  pendientesRevision?: boolean;
  incluirDetalles?: boolean;
}
```

### `FiltrosReporteRetrasos`

```tsx
interface FiltrosReporteRetrasos {
  cuatrimestreId?: string;
  profesorId?: string;
  asignaturaId?: string;
  grupoId?: string;
  estado?: string;
  tema?: string;
  semana?: number;
  fechaInicio?: string;
  fechaFin?: string;
  incluirJustificaciones?: boolean;
  incluirAccionesCorrectivas?: boolean;
}
```

### `FiltrosReporteCompletitud`

```tsx
interface FiltrosReporteCompletitud {
  cuatrimestreId?: string;
  profesorId?: string;
  asignaturaId?: string;
  grupoId?: string;
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  porcentajeMinimo?: number;
  porcentajeMaximo?: number;
  incluirMetricasCalidad?: boolean;
}
```

## Ejemplos de Uso

### Dashboard con Reporte Consolidado

```tsx
function DashboardComponent() {
  const { reporte, isLoading, error } = useReporteDashboard();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!reporte) return <div>No hay datos</div>;

  return (
    <div>
      <h2>Resumen del Dashboard</h2>
      <p>Total Seguimientos: {reporte.resumen.totalSeguimientos}</p>
      <p>Total Detalles: {reporte.resumen.totalDetalles}</p>
      <p>Total Retrasos: {reporte.resumen.totalRetrasos}</p>
      <p>Promedio Completitud: {reporte.resumen.promedioCompletitud}%</p>
    </div>
  );
}
```

### Reporte de Retrasos con Filtros

```tsx
function ReporteRetrasosComponent() {
  const { reporte, filtros, updateFiltros, isLoading } = useReporteRetrasos({
    cuatrimestreId: "123",
    incluirJustificaciones: true,
  });

  const handleCuatrimestreChange = (cuatrimestreId: string) => {
    updateFiltros({ cuatrimestreId });
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <select onChange={(e) => handleCuatrimestreChange(e.target.value)}>
        <option value="">Seleccionar cuatrimestre</option>
        {/* Opciones */}
      </select>

      {reporte && (
        <div>
          <h3>Total Retrasos: {reporte.totalRetrasos}</h3>
          {/* Resto del reporte */}
        </div>
      )}
    </div>
  );
}
```

## Notas Importantes

1. **Autenticación**: Todos los hooks requieren un token de acceso válido del store de autenticación.

2. **Manejo de Errores**: Los hooks manejan automáticamente errores de autenticación y redirigen al login si es necesario.

3. **Optimización**: Los hooks utilizan `useCallback` y `useMemo` para optimizar el rendimiento y evitar re-renders innecesarios.

4. **Filtros**: Los filtros se pueden actualizar dinámicamente y los reportes se regeneran automáticamente.

5. **Tipado**: Todos los hooks están completamente tipados con TypeScript para mejor experiencia de desarrollo.
