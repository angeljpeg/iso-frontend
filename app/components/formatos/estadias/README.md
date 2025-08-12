# Página de Estadías - Formatos

Esta página permite gestionar y revisar las estadías académicas de los estudiantes, siguiendo el mismo patrón de diseño que las páginas de asesorías y programación de cursos.

## Componentes

### EstadiasFilters

Componente de filtros que permite a los coordinadores filtrar las estadías por:

- Período académico
- Profesor responsable
- Carrera del estudiante
- Nombre del alumno
- Matrícula del estudiante

### EstadiasTable

Tabla principal que muestra todas las estadías con:

- Información del período
- Profesor responsable
- Número de alumnos
- Estado de la estadía
- Fecha de creación
- Acciones (ver, editar, eliminar) para coordinadores

### EstadiaDetailsModal

Modal que muestra información detallada de una estadía:

- Información general (período, profesor, estado)
- Lista completa de alumnos con sus datos
- Progreso mensual de cada alumno
- Observaciones generales

### EstadiaEditModal

Modal para editar estadías existentes:

- Modificar información general
- Gestionar lista de alumnos (agregar/eliminar/editar)
- Actualizar observaciones
- Cambiar estado de la estadía

### EstadiaDeleteModal

Modal de confirmación para eliminar estadías:

- Advertencia sobre la acción irreversible
- Información de la estadía a eliminar
- Impacto de la eliminación
- Confirmación requerida

### ReportesSection

Componente placeholder para reportes futuros:

- Botón de reportes visible pero sin funcionalidad
- Descripción de funcionalidades planificadas
- Información sobre filtros aplicados

## Funcionalidades

### Para Coordinadores

- ✅ Ver todas las estadías del sistema
- ✅ Filtrar estadías por múltiples criterios
- ✅ Ver detalles completos de cada estadía
- ✅ Editar estadías existentes
- ✅ Eliminar estadías (con confirmación)
- ✅ Acceso al botón de reportes (sin funcionalidad aún)
- ✅ Exportar a PDF

### Para Profesores

- ✅ Ver sus estadías asignadas
- ✅ Ver detalles de sus estadías
- ❌ Editar estadías (solo coordinadores)
- ❌ Eliminar estadías (solo coordinadores)

## Estado de Desarrollo

- ✅ **Completado**: Estructura básica y componentes
- ✅ **Completado**: Filtros y tabla de datos
- ✅ **Completado**: Modales de gestión
- ✅ **Completado**: Botón de reportes (placeholder)
- ❌ **Pendiente**: Funcionalidad de reportes
- ❌ **Pendiente**: Integración con backend
- ❌ **Pendiente**: Validaciones de formularios
- ❌ **Pendiente**: Manejo de errores avanzado

## Próximos Pasos

1. **Implementar funcionalidad de reportes**:

   - Gráficas de progreso de alumnos
   - Estadísticas por período
   - Métricas de rendimiento
   - Exportación de datos

2. **Integración con backend**:

   - Conectar con API de estadías
   - Implementar CRUD completo
   - Manejo de estados de carga

3. **Mejoras de UX**:
   - Validaciones en tiempo real
   - Mensajes de confirmación
   - Notificaciones de éxito/error

## Dependencias

- `@/hooks/estadias-hooks` - Hooks para gestión de datos
- `@/types/estadias` - Tipos TypeScript
- `@/components/ui/*` - Componentes de UI base
- `@/layouts/DashboardLayout` - Layout principal

## Notas de Implementación

- La página sigue el mismo patrón de diseño que asesorías y programación de cursos
- Los modales están preparados para futuras integraciones con el backend
- El sistema de filtros es extensible para agregar más criterios
- La tabla es responsive y maneja estados de carga/error
- Los reportes están marcados como "en desarrollo" con un placeholder atractivo
