# Componentes de Programación y Seguimiento de Cursos

Este módulo implementa la funcionalidad para que profesores y coordinadores puedan gestionar y revisar los seguimientos de cursos de manera tabular.

## Componentes Principales

### 1. ProgramacionCursosTable

Tabla principal que muestra los seguimientos de cursos con las siguientes funcionalidades:

- **Visualización**: Muestra información del profesor, asignatura, cuatrimestre, estado y avance
- **Acciones**: Botones para visualizar detalles, editar, eliminar y exportar PDF
- **Permisos**: Los coordinadores pueden editar y eliminar, los profesores solo pueden visualizar

### 2. ProgramacionCursosFilters

Sistema de filtros para coordinadores que incluye:

- **Búsqueda**: Campo de texto para buscar por profesor, asignatura o tema
- **Filtros**: Estado, cuatrimestre, profesor y carrera
- **Filtros activos**: Muestra los filtros aplicados con opción de eliminarlos

### 3. SeguimientoDetailsModal

Modal para visualizar los detalles completos de un seguimiento:

- **Información general**: Profesor, asignatura, cuatrimestre, estado
- **Fechas importantes**: Entrega, revisión y seguimiento final
- **Detalles del seguimiento**: Lista de temas con estado de avance, observaciones, etc.
- **Exportar PDF**: Botón para generar PDF del seguimiento completo

### 4. SeguimientoEditModal

Modal para editar seguimientos (solo coordinadores):

- **Estado del seguimiento**: Cambiar estado y número de revisión
- **Fechas**: Modificar fechas de revisión y seguimiento final
- **Detalles**: Agregar, editar y eliminar temas del seguimiento
- **Campos editables**: Tema, semana, estado de avance, observaciones, etc.

### 5. SeguimientoDeleteModal

Modal de confirmación para eliminar seguimientos:

- **Confirmación**: Muestra información del seguimiento a eliminar
- **Advertencia**: Explica qué se eliminará (seguimiento, detalles, historial)
- **Seguridad**: Solo coordinadores pueden acceder

## Funcionalidades por Rol

### Profesores

- ✅ Ver solo sus seguimientos asignados
- ✅ Visualizar detalles completos
- ✅ Exportar PDF de sus seguimientos
- ❌ No pueden editar o eliminar
- ❌ No tienen acceso a filtros

### Coordinadores/Moderadores

- ✅ Ver todos los seguimientos
- ✅ Acceso completo a filtros y búsqueda
- ✅ Editar cualquier seguimiento
- ✅ Eliminar seguimientos
- ✅ Exportar PDF de cualquier seguimiento
- ✅ Gestión completa de detalles

## Características Técnicas

### Exportación PDF

- **Implementación actual**: PDF básico generado con jsPDF
- **Futuro**: Diseño específico y personalizado para la institución
- **Contenido**: Información completa del seguimiento y sus detalles

### Estado de Avance

- **No iniciado**: Tema pendiente de comenzar
- **En progreso**: Tema en desarrollo activo
- **Completado**: Tema finalizado exitosamente
- **Retrasado**: Tema con retrasos en el cronograma

### Estados del Seguimiento

- **Borrador**: Seguimiento en preparación
- **Enviado**: Seguimiento enviado para revisión
- **Revisado**: Seguimiento revisado por coordinador
- **Aprobado**: Seguimiento aprobado oficialmente
- **Rechazado**: Seguimiento rechazado, requiere correcciones

## Uso

```tsx
import {
  ProgramacionCursosTable,
  ProgramacionCursosFilters,
  SeguimientoDetailsModal,
  SeguimientoEditModal,
  SeguimientoDeleteModal,
} from "~/components/formatos/programacion-cursos";

// En la página principal
<ProgramacionCursosTable
  seguimientos={seguimientos}
  isLoading={isLoading}
  isCoordinador={isCoordinador}
  onRefresh={handleRefresh}
/>;

// Filtros para coordinadores
{
  isCoordinador && (
    <ProgramacionCursosFilters
      onFiltersChange={handleFiltersChange}
      cuatrimestres={cuatrimestres}
      profesores={profesores}
      isLoading={isLoading}
    />
  );
}
```

## Dependencias

- **UI Components**: Button, Badge, FormInput, FormRadioGroup
- **Icons**: Lucide React
- **Hooks**: useSeguimientosCurso, useSeguimientosByProfesor
- **Types**: Tipos de programación de cursos, usuarios y cuatrimestres
- **PDF**: jsPDF (para exportación)

## Notas de Implementación

- Los modales se renderizan condicionalmente según el estado
- La lógica de permisos se basa en el rol del usuario autenticado
- Los filtros solo están disponibles para coordinadores
- La exportación PDF es funcional pero básica, lista para personalización
- Todos los componentes son responsivos y accesibles
