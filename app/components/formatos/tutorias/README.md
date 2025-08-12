# Módulo de Tutorías - Formatos

Este módulo contiene todos los componentes necesarios para gestionar las tutorías académicas en el sistema de formatos.

## Componentes

### `TutoriasTable`

Tabla principal que muestra todas las tutorías con acciones de ver, editar y eliminar.

**Props:**

- `tutorias`: Array de tutorías a mostrar
- `isLoading`: Estado de carga
- `isCoordinador`: Si el usuario es coordinador
- `onViewTutoria`: Callback para ver detalles
- `onEditTutoria`: Callback para editar
- `onDeleteTutoria`: Callback para eliminar
- `onRefresh`: Callback para refrescar datos

### `TutoriasFilters`

Componente de filtros para buscar tutorías por cuatrimestre, profesor, carrera y texto libre.

**Props:**

- `onFiltersChange`: Callback cuando cambian los filtros
- `cuatrimestres`: Lista de cuatrimestres disponibles
- `profesores`: Lista de profesores disponibles
- `carreras`: Lista de carreras disponibles
- `isLoading`: Estado de carga

### `TutoriaDetailsModal`

Modal que muestra todos los detalles de una tutoría, incluyendo información de alumnos y botón de exportar PDF.

**Props:**

- `isOpen`: Si el modal está abierto
- `onClose`: Callback para cerrar
- `tutoria`: Datos de la tutoría a mostrar

### `TutoriaEditModal`

Modal para editar tutorías, permite cambiar estado de revisión, fecha de revisión y observaciones.

**Props:**

- `isOpen`: Si el modal está abierto
- `onClose`: Callback para cerrar
- `tutoria`: Tutoría a editar
- `onTutoriaUpdated`: Callback cuando se actualiza

### `TutoriaDeleteModal`

Modal de confirmación para eliminar tutorías.

**Props:**

- `isOpen`: Si el modal está abierto
- `onClose`: Callback para cerrar
- `tutoria`: Tutoría a eliminar
- `onTutoriaDeleted`: Callback cuando se elimina

### `ReportesSection`

Sección de reportes y estadísticas (placeholder para futuras implementaciones).

**Props:**

- `periodoId`: ID del período para filtrar
- `profesorId`: ID del profesor para filtrar

## Funcionalidades

### Filtros

- Por cuatrimestre
- Por profesor
- Por carrera
- Búsqueda de texto libre

### Acciones

- **Ver**: Muestra detalles completos de la tutoría
- **Editar**: Permite modificar estado de revisión y fechas
- **Eliminar**: Elimina la tutoría (solo coordinadores)
- **Exportar PDF**: Genera PDF de la tutoría (desde modal de detalles)

### Estados de Revisión

- Sin revisar
- Revisando
- Revisado
- Aceptado
- Rechazado

### Estados de Tutoría

- En progreso
- Completado

## Uso

```tsx
import {
  TutoriasTable,
  TutoriasFilters,
  TutoriaDetailsModal,
  TutoriaEditModal,
  TutoriaDeleteModal,
  ReportesSection,
} from "~/components/formatos/tutorias";

// En tu componente principal
<TutoriasTable
  tutorias={tutorias}
  isLoading={isLoading}
  isCoordinador={isCoordinador}
  onViewTutoria={handleViewTutoria}
  onEditTutoria={handleEditTutoria}
  onDeleteTutoria={handleDeleteTutoria}
  onRefresh={handleRefresh}
/>;
```

## Notas de Implementación

- Los reportes están marcados como placeholder y se implementarán en el futuro
- El botón de exportar PDF está integrado en el modal de detalles
- La edición solo permite cambiar estados de revisión y fechas
- Los filtros se aplican en tiempo real
- Se incluye manejo de errores y estados de carga
- Soporte completo para roles de coordinador y profesor
