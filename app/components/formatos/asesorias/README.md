# Componentes de Asesorías

Este directorio contiene los componentes para la gestión y visualización de asesorías académicas, siguiendo el mismo patrón que la página de programación y seguimiento de cursos.

## Componentes

### `AsesoriasTable`

Tabla principal para mostrar las asesorías con funcionalidades de:

- Visualización de datos de asesorías
- Acciones de edición, eliminación y visualización
- Diferentes vistas según el rol del usuario (coordinador vs profesor)
- Estados de carga y vacío

**Props:**

- `asesorias`: Array de asesorías a mostrar
- `isLoading`: Estado de carga
- `isCoordinador`: Si el usuario es coordinador
- `onRefresh`: Función para refrescar los datos

### `AsesoriasFilters`

Componente de filtros avanzados para coordinadores:

- Búsqueda por texto
- Filtros por cuatrimestre, profesor, asignatura, carrera
- Filtros por rango de fechas
- Vista de filtros activos con opción de limpieza

**Props:**

- `onFiltersChange`: Callback cuando cambian los filtros
- `cuatrimestres`: Lista de cuatrimestres disponibles
- `profesores`: Lista de profesores disponibles
- `asignaturas`: Lista de asignaturas disponibles
- `carreras`: Lista de carreras disponibles
- `isLoading`: Estado de carga

### `ReportesSection`

Sección de reportes y estadísticas para coordinadores:

- Métricas principales (total asesorías, alumnos, horas)
- Gráficos de asesorías por mes
- Top asignaturas y profesores
- Exportación a PDF

**Props:**

- `cuatrimestreId`: ID del cuatrimestre para filtrar
- `profesorId`: ID del profesor para filtrar

## Uso

```tsx
import {
  AsesoriasTable,
  AsesoriasFilters,
  ReportesSection,
  type FilterOptions,
} from "~/components/formatos/asesorias";

// En tu componente
const [filters, setFilters] = useState<FilterOptions>({});

<AsesoriasFilters
  onFiltersChange={setFilters}
  cuatrimestres={cuatrimestres}
  profesores={profesores}
  asignaturas={asignaturas}
  carreras={carreras}
  isLoading={isLoading}
/>

<AsesoriasTable
  asesorias={asesorias}
  isLoading={isLoading}
  isCoordinador={isCoordinador}
  onRefresh={handleRefresh}
/>

<ReportesSection
  cuatrimestreId={filters.cuatrimestreId}
  profesorId={filters.profesorId}
/>
```

## Características

- **Responsive**: Diseño adaptativo para diferentes tamaños de pantalla
- **Accesible**: Uso de componentes UI accesibles y semántica HTML correcta
- **Internacionalizado**: Textos en español
- **Consistente**: Sigue el mismo patrón de diseño que otros módulos
- **Extensible**: Fácil de extender con nuevas funcionalidades

## Dependencias

- `@tanstack/react-query` para gestión de estado y caché
- `lucide-react` para iconos
- Componentes UI personalizados del proyecto
- Tipos de TypeScript del módulo de asesorías

## Notas de Implementación

- Los modales de edición y eliminación están temporalmente usando los de seguimientos (TODO: crear modales específicos para asesorías)
- Los datos de filtros son mock por ahora (TODO: integrar con hooks reales)
- La exportación PDF está adaptada temporalmente (TODO: crear generador específico para asesorías)
- Los reportes usan datos mock (TODO: integrar con API de reportes)

## Próximos Pasos

1. Crear modales específicos para asesorías
2. Integrar filtros con hooks reales
3. Crear generador PDF específico para asesorías
4. Implementar API de reportes real
5. Agregar paginación
6. Implementar búsqueda en tiempo real
