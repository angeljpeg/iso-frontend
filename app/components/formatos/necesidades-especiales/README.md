# Componentes de Necesidades Especiales

Este directorio contiene todos los componentes relacionados con el módulo de Necesidades Especiales del frontend.

## Componentes Disponibles

### 1. NecesidadesEspecialesForm

Formulario completo para crear y editar necesidades especiales.

**Características:**

- Validación en tiempo real
- Campos dinámicos según el tipo de necesidad seleccionado
- Soporte para modo de creación y edición
- Integración con el sistema de validación

**Props:**

- `initialData`: Datos iniciales para edición (opcional)
- `onSubmit`: Función llamada al enviar el formulario
- `onCancel`: Función llamada al cancelar
- `loading`: Estado de carga
- `isEdit`: Indica si está en modo edición

### 2. NecesidadesEspecialesTable

Tabla para mostrar la lista de necesidades especiales con paginación.

**Características:**

- Paginación integrada
- Acciones por fila (ver, editar, eliminar)
- Badges para tipos de necesidades
- Formato de fechas localizado
- Estados de carga y vacío

**Props:**

- `necesidades`: Array de necesidades especiales
- `loading`: Estado de carga
- `onEdit`: Función para editar
- `onDelete`: Función para eliminar
- `onView`: Función para ver detalles
- `currentPage`: Página actual
- `totalPages`: Total de páginas
- `onPageChange`: Función para cambiar página

### 3. NecesidadesEspecialesFilters

Componente de filtros para la búsqueda avanzada.

**Características:**

- Filtros por tipo de necesidad
- Filtros por fecha
- Filtros por programa educativo
- Filtros por profesor
- Búsqueda por texto

### 4. NecesidadesEspecialesModal

Modal para mostrar/editar necesidades especiales.

**Características:**

- Modal responsive
- Formulario integrado
- Manejo de estados de carga
- Validación en tiempo real

### 5. NecesidadesEspecialesCard

Tarjeta para mostrar resumen de necesidades especiales.

**Características:**

- Vista compacta de información
- Badges para tipos de necesidades
- Acciones rápidas
- Diseño responsive

## Uso de los Componentes

### Ejemplo Básico de Formulario

```tsx
import { NecesidadesEspecialesForm } from "./NecesidadesEspecialesForm";

const MiComponente = () => {
  const handleSubmit = (data) => {
    console.log("Datos del formulario:", data);
  };

  const handleCancel = () => {
    console.log("Formulario cancelado");
  };

  return (
    <NecesidadesEspecialesForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={false}
    />
  );
};
```

### Ejemplo de Tabla con Paginación

```tsx
import { NecesidadesEspecialesTable } from "./NecesidadesEspecialesTable";

const MiComponente = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [necesidades, setNecesidades] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const handleEdit = (necesidad) => {
    console.log("Editar:", necesidad);
  };

  const handleDelete = (id) => {
    console.log("Eliminar:", id);
  };

  const handleView = (necesidad) => {
    console.log("Ver:", necesidad);
  };

  return (
    <NecesidadesEspecialesTable
      necesidades={necesidades}
      loading={false}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  );
};
```

## Integración con Hooks

Los componentes están diseñados para trabajar con los hooks personalizados:

- `useNecesidadesEspeciales`: Para obtener y gestionar la lista
- `useNecesidadesEspecialesActions`: Para operaciones CRUD
- `useReportesNecesidadesEspeciales`: Para reportes y estadísticas

## Estilos y Temas

Los componentes utilizan:

- Tailwind CSS para estilos
- Sistema de componentes UI unificado
- Badges con variantes de color según el tipo de necesidad
- Estados de hover y focus consistentes

## Validación

La validación se maneja a través del hook `useNecesidadesEspecialesValidation` que incluye:

- Validación de campos obligatorios
- Validación de tipos de datos
- Validación de lógica de negocio
- Mensajes de error en español

## Responsive Design

Todos los componentes están diseñados para ser responsive:

- Grid adaptativo en formularios
- Tabla con scroll horizontal en móviles
- Botones y controles adaptados a diferentes tamaños de pantalla

## Accesibilidad

Los componentes incluyen:

- Labels apropiados para todos los campos
- Estados de ARIA para loading y errores
- Navegación por teclado
- Contraste adecuado en colores
