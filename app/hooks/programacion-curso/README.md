# Hooks de Programación Curso

Este directorio contiene todos los hooks personalizados para manejar la funcionalidad de programación y seguimiento de cursos.

## Hooks Disponibles

### 1. `useSeguimientosCurso`

Hook principal para obtener todos los seguimientos de curso con filtros y paginación.

```typescript
import { useSeguimientosCurso } from "~/hooks/programacion-curso";

function MiComponente() {
  const {
    seguimientos,
    isLoading,
    error,
    pagination,
    options,
    updateOptions,
    refresh,
    clearError,
  } = useSeguimientosCurso({
    page: 1,
    limit: 10,
    estado: "borrador",
    cuatrimestreId: "123",
    profesorId: "456",
    carrera: "ingenieria",
    search: "programacion",
  });

  // Actualizar filtros
  const handleFilterChange = (newFilters) => {
    updateOptions(newFilters);
  };

  // Cambiar página
  const handlePageChange = (page) => {
    updateOptions({ page });
  };

  return (
    <div>
      {isLoading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          {seguimientos.map((seguimiento) => (
            <div key={seguimiento.id}>
              {seguimiento.cargaAcademica.asignatura}
            </div>
          ))}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
```

### 2. `useSeguimientoCurso`

Hook para obtener un seguimiento de curso específico por ID.

```typescript
import { useSeguimientoCurso } from "~/hooks/programacion-curso";

function DetalleSeguimiento({ seguimientoId }) {
  const { seguimiento, isLoading, error, refresh, clearError } =
    useSeguimientoCurso(seguimientoId);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!seguimiento) return <p>No se encontró el seguimiento</p>;

  return (
    <div>
      <h2>Seguimiento: {seguimiento.cargaAcademica.asignatura}</h2>
      <p>Estado: {seguimiento.estado}</p>
      <p>Fecha de entrega: {seguimiento.fechaEntregado}</p>
      <button onClick={refresh}>Actualizar</button>
    </div>
  );
}
```

### 3. `useSeguimientoCursoActions`

Hook para las acciones CRUD de seguimientos de curso.

```typescript
import { useSeguimientoCursoActions } from "~/hooks/programacion-curso";

function FormularioSeguimiento() {
  const {
    isLoading,
    error,
    clearError,
    createSeguimiento,
    updateSeguimiento,
    deleteSeguimiento,
    updateEstado,
  } = useSeguimientoCursoActions();

  const handleSubmit = async (data) => {
    const resultado = await createSeguimiento(data);
    if (resultado) {
      // Éxito
      console.log("Seguimiento creado:", resultado);
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    const resultado = await updateEstado(id, nuevoEstado);
    if (resultado) {
      // Éxito
      console.log("Estado actualizado:", resultado);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>Error: {error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
```

### 4. `useSeguimientoDetalles`

Hook para obtener los detalles de un seguimiento de curso.

```typescript
import { useSeguimientoDetalles } from "~/hooks/programacion-curso";

function ListaDetalles({ seguimientoCursoId }) {
  const { detalles, isLoading, error, refresh } =
    useSeguimientoDetalles(seguimientoCursoId);

  if (isLoading) return <p>Cargando detalles...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>Detalles del Seguimiento</h3>
      {detalles.map((detalle) => (
        <div key={detalle.id}>
          <p>Tema: {detalle.tema}</p>
          <p>Semana: {detalle.semanaTerminada}</p>
          <p>Estado: {detalle.estadoAvance}</p>
        </div>
      ))}
      <button onClick={refresh}>Actualizar</button>
    </div>
  );
}
```

### 5. `useSeguimientoDetalleActions`

Hook para las acciones CRUD de detalles de seguimiento.

```typescript
import { useSeguimientoDetalleActions } from "~/hooks/programacion-curso";

function FormularioDetalle() {
  const { isLoading, error, createDetalle, updateDetalle, deleteDetalle } =
    useSeguimientoDetalleActions();

  const handleCreate = async (data) => {
    const resultado = await createDetalle(data);
    if (resultado) {
      console.log("Detalle creado:", resultado);
    }
  };

  return <form onSubmit={handleCreate}>{/* Campos del formulario */}</form>;
}
```

### 6. `useNotificacionesSeguimiento`

Hook para obtener las notificaciones de seguimiento.

```typescript
import { useNotificacionesSeguimiento } from "~/hooks/programacion-curso";

function ListaNotificaciones() {
  const { notificaciones, isLoading, error, pagination, updateOptions } =
    useNotificacionesSeguimiento({
      usuarioId: "123",
      estado: "pendiente",
      tipo: "recordatorio",
    });

  return (
    <div>
      {notificaciones.map((notificacion) => (
        <div key={notificacion.id}>
          <h4>{notificacion.titulo}</h4>
          <p>{notificacion.mensaje}</p>
          <span>{notificacion.estado}</span>
        </div>
      ))}
    </div>
  );
}
```

### 7. `useNotificacionSeguimientoActions`

Hook para las acciones CRUD de notificaciones.

```typescript
import { useNotificacionSeguimientoActions } from "~/hooks/programacion-curso";

function GestionNotificaciones() {
  const { createNotificacion, marcarLeida, deleteNotificacion } =
    useNotificacionSeguimientoActions();

  const handleMarcarLeida = async (id) => {
    const resultado = await marcarLeida(id);
    if (resultado) {
      console.log("Notificación marcada como leída");
    }
  };

  return <div>{/* UI para gestionar notificaciones */}</div>;
}
```

### 8. Hooks Especializados

#### `useSeguimientosByProfesor`

```typescript
import { useSeguimientosByProfesor } from "~/hooks/programacion-curso";

const { seguimientos, isLoading, error } = useSeguimientosByProfesor({
  profesorId: "123",
  cuatrimestreId: "456",
  estado: "enviado",
});
```

#### `useSeguimientosByCuatrimestre`

```typescript
import { useSeguimientosByCuatrimestre } from "~/hooks/programacion-curso";

const { seguimientos, isLoading, error } = useSeguimientosByCuatrimestre({
  cuatrimestreId: "123",
  estado: "aprobado",
  carrera: "ingenieria",
});
```

#### `useSeguimientosByCargaAcademica`

```typescript
import { useSeguimientosByCargaAcademica } from "~/hooks/programacion-curso";

const { seguimientos, isLoading, error } = useSeguimientosByCargaAcademica({
  cargaAcademicaId: "123",
  estado: "revisado",
});
```

## Características Comunes

Todos los hooks comparten las siguientes características:

- **Manejo de estado de carga**: `isLoading` para mostrar indicadores de carga
- **Manejo de errores**: `error` para mostrar mensajes de error
- **Actualización automática**: `autoFetch` para cargar datos automáticamente
- **Paginación**: Soporte para paginación con `page`, `limit`, `total`, `totalPages`
- **Filtros**: Capacidad de filtrar por diferentes criterios
- **Actualización manual**: Función `refresh()` para recargar datos
- **Limpieza de errores**: Función `clearError()` para limpiar mensajes de error
- **Navegación automática**: Redirección automática a login si no hay token válido

## Opciones de Configuración

La mayoría de hooks aceptan opciones de configuración:

- `autoFetch`: Si es `true`, los datos se cargan automáticamente (por defecto: `true`)
- `page`: Número de página para paginación (por defecto: `1`)
- `limit`: Número de elementos por página (por defecto: `10`)

## Manejo de Errores

Los hooks manejan automáticamente:

- Errores de autenticación (redirección a login)
- Errores de red
- Errores del servidor
- Validación de parámetros requeridos

## Ejemplos de Uso en Componentes

### Componente con Múltiples Hooks

```typescript
import {
  useSeguimientosCurso,
  useSeguimientoCursoActions,
  useNotificacionesSeguimiento,
} from "~/hooks/programacion-curso";

function DashboardSeguimientos() {
  // Hook para listar seguimientos
  const { seguimientos, isLoading, updateOptions } = useSeguimientosCurso();

  // Hook para acciones
  const { createSeguimiento, updateSeguimiento } = useSeguimientoCursoActions();

  // Hook para notificaciones
  const { notificaciones } = useNotificacionesSeguimiento({
    estado: "pendiente",
    limit: 5,
  });

  return <div>{/* UI del dashboard */}</div>;
}
```

### Hook Personalizado Combinado

```typescript
import { useSeguimientosCurso } from "~/hooks/programacion-curso";

function useSeguimientosPendientes() {
  const { seguimientos, isLoading, error } = useSeguimientosCurso({
    estado: "pendiente",
    autoFetch: true,
  });

  const seguimientosPendientes = useMemo(
    () => seguimientos.filter((s) => s.estado === "pendiente"),
    [seguimientos]
  );

  return {
    seguimientosPendientes,
    isLoading,
    error,
    total: seguimientosPendientes.length,
  };
}
```

## Notas Importantes

1. **Tokens de Autenticación**: Todos los hooks requieren un token válido del store de autenticación
2. **Dependencias**: Los hooks se actualizan automáticamente cuando cambian las opciones
3. **Memoización**: Las opciones se memoizan para evitar re-renders innecesarios
4. **Navegación**: Redirección automática a login en caso de errores de autenticación
5. **Paginación**: Reset automático de página cuando cambian los filtros
6. **Error Handling**: Manejo consistente de errores en todos los hooks
