# Hooks de Asesorías

Este directorio contiene hooks personalizados de React Query para el módulo de asesorías del sistema ISO.

## Estructura

```
asesorias/
├── index.ts                           # Exportaciones principales
├── use-asesorias.ts                   # Hook principal para listar asesorías
├── use-asesoria-by-id.ts              # Hook para obtener asesoría por ID
├── use-asesorias-by-carga-academica.ts # Hook para asesorías por carga académica
├── use-create-asesoria.ts             # Hook para crear asesorías
├── use-update-asesoria.ts             # Hook para actualizar asesorías
├── use-delete-asesoria.ts             # Hook para eliminar asesorías
├── use-search-asesorias.ts            # Hook para búsqueda y filtros
├── use-test-relations.ts              # Hook para probar relaciones
└── README.md                          # Este archivo
```

## Hooks Disponibles

### Hooks de Consulta (Queries)

#### `useAsesorias`

Hook principal para obtener todas las asesorías con filtros y paginación.

```typescript
const { data, isLoading, error } = useAsesorias(filters, token);
```

#### `useAsesoriaById`

Hook para obtener una asesoría específica por ID.

```typescript
const { data: asesoria, isLoading, error } = useAsesoriaById(id, token);
```

#### `useAsesoriasByCargaAcademica`

Hook para obtener asesorías por ID de carga académica.

```typescript
const { data, isLoading, error } = useAsesoriasByCargaAcademica(
  cargaAcademicaId,
  token
);
```

#### `useAsesoriasPaginated`

Hook para obtener asesorías con paginación.

```typescript
const { data, isLoading, error } = useAsesoriasPaginated(
  page,
  limit,
  token,
  filters
);
```

### Hooks de Mutación (Mutations)

#### `useCreateAsesoria`

Hook básico para crear asesorías.

```typescript
const createAsesoria = useCreateAsesoria();
const handleCreate = () => {
  createAsesoria.mutate({ ...data, token });
};
```

#### `useCreateAsesoriaWithOptimisticUpdate`

Hook para crear asesorías con actualización optimista.

```typescript
const createAsesoria = useCreateAsesoriaWithOptimisticUpdate();
// Actualiza la UI inmediatamente, luego sincroniza con el servidor
```

#### `useUpdateAsesoria`

Hook básico para actualizar asesorías.

```typescript
const updateAsesoria = useUpdateAsesoria();
const handleUpdate = () => {
  updateAsesoria.mutate({ id, ...data, token });
};
```

#### `useUpdateAsesoriaWithOptimisticUpdate`

Hook para actualizar asesorías con actualización optimista.

```typescript
const updateAsesoria = useUpdateAsesoriaWithOptimisticUpdate();
// Actualiza la UI inmediatamente, luego sincroniza con el servidor
```

#### `useDeleteAsesoria`

Hook básico para eliminar asesorías.

```typescript
const deleteAsesoria = useDeleteAsesoria();
const handleDelete = () => {
  deleteAsesoria.mutate({ id, token });
};
```

#### `useDeleteAsesoriaWithOptimisticUpdate`

Hook para eliminar asesorías con actualización optimista.

```typescript
const deleteAsesoria = useDeleteAsesoriaWithOptimisticUpdate();
// Actualiza la UI inmediatamente, luego sincroniza con el servidor
```

### Hooks de Búsqueda y Filtros

#### `useSearchAsesorias`

Hook para búsqueda por término de búsqueda.

```typescript
const { data, isLoading, error } = useSearchAsesorias(
  searchTerm,
  token,
  filters,
  page,
  limit
);
```

#### `useAsesoriasCuatrimestreActual`

Hook para obtener asesorías del cuatrimestre actual.

```typescript
const { data, isLoading, error } = useAsesoriasCuatrimestreActual(
  token,
  page,
  limit,
  additionalFilters
);
```

#### `useAsesoriasByProfesor`

Hook para obtener asesorías por profesor.

```typescript
const { data, isLoading, error } = useAsesoriasByProfesor(
  profesorNombre,
  token,
  page,
  limit,
  additionalFilters
);
```

#### `useAsesoriasByAsignatura`

Hook para obtener asesorías por asignatura.

```typescript
const { data, isLoading, error } = useAsesoriasByAsignatura(
  asignaturaNombre,
  token,
  page,
  limit,
  additionalFilters
);
```

#### `useAsesoriasByCarrera`

Hook para obtener asesorías por carrera.

```typescript
const { data, isLoading, error } = useAsesoriasByCarrera(
  carreraNombre,
  token,
  page,
  limit,
  additionalFilters
);
```

### Hooks Especiales

#### `useTestAsesoriasRelations`

Hook para probar relaciones (endpoint temporal del backend).

```typescript
const testRelations = useTestAsesoriasRelations();
const handleTest = () => {
  testRelations.mutate({ token });
};
```

## Características

### Cache y Sincronización

- **Stale Time**: Tiempo antes de considerar los datos obsoletos
- **GC Time**: Tiempo antes de limpiar datos del cache
- **Invalidación automática**: Las mutaciones invalidan queries relacionadas

### Actualizaciones Optimistas

- **Respuesta inmediata**: La UI se actualiza antes de la respuesta del servidor
- **Rollback automático**: En caso de error, se revierte a el estado anterior
- **Sincronización**: Siempre se sincroniza con el servidor al final

### Manejo de Estados

- **Loading**: Estado de carga durante las operaciones
- **Error**: Manejo y logging de errores
- **Success**: Callbacks de éxito para operaciones adicionales

### Configuración de Queries

- **Query Keys**: Claves únicas para el cache de React Query
- **Enabled**: Control de cuándo ejecutar las queries
- **Dependencies**: Control de cuándo re-ejecutar queries

## Uso en Componentes

```typescript
import {
  useAsesorias,
  useCreateAsesoria,
  useUpdateAsesoria,
  useDeleteAsesoria,
} from "~/hooks/asesorias";

const AsesoriasComponent = () => {
  const { data, isLoading, error } = useAsesorias({}, token);
  const createAsesoria = useCreateAsesoria();
  const updateAsesoria = useUpdateAsesoria();
  const deleteAsesoria = useDeleteAsesoria();

  // ... lógica del componente
};
```

## Dependencias

- **@tanstack/react-query**: Para el manejo de estado del servidor
- **~/services/asesorias.service**: Servicios de la API
- **~/types/asesorias**: Tipos TypeScript del módulo
