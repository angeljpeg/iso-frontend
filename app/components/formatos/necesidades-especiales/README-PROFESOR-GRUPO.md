# Necesidades Especiales en Página del Profesor

## Descripción

Esta funcionalidad permite a los profesores crear y gestionar las necesidades especiales de los alumnos directamente desde su página de grupo.

## Características

### 1. Crear Necesidades Especiales
- **Botón**: "➕ Crear Necesidades Especiales" ubicado en la sección de Necesidades Especiales
- **Acceso**: Solo para profesores autenticados (profesor_tiempo_completo o profesor_asignatura)
- **Ubicación**: Página del grupo del profesor (`/profesor-grupo/:id`)

### 2. Formulario de Creación
El modal incluye los siguientes campos:

#### Información del Alumno
- **Nombre del Alumno** * (obligatorio)
- **Número de Matrícula** * (obligatorio)
- **Programa Educativo** * (obligatorio, pre-llenado con la asignatura del grupo)
- **Fecha de Registro** * (obligatorio, fecha actual por defecto)
- **Fecha de Revisión** * (obligatorio, fecha actual por defecto)
- **Número de Revisión** * (obligatorio, 1 por defecto)

#### Tipos de Necesidades Especiales
- **Excepciones Conductuales** (checkbox + textarea para especificación)
- **Excepciones Comunicacionales** (checkbox + textarea para especificación)
- **Excepciones Intelectuales** (checkbox + textarea para especificación)
- **Excepciones Físicas** (checkbox + textarea para especificación)
- **Excepciones de Superdotación** (checkbox + textarea para especificación)
- **Otras Necesidades** (textarea opcional)

#### Información del Grupo
- **Grupo**: Nombre del grupo (automático)
- **Asignatura**: Asignatura del grupo (automático)

### 3. Lista de Necesidades Especiales
- **Visualización**: Lista de todas las necesidades especiales registradas en el grupo
- **Información mostrada**:
  - Nombre del alumno
  - Número de matrícula
  - Número de revisión
  - Badges de tipos de necesidades especiales
  - Programa educativo
  - Fechas de registro y revisión
- **Interacción**: Click en cualquier elemento para ver detalles completos

### 4. Modal de Detalles
- **Acceso**: Click en cualquier necesidad especial de la lista
- **Información**: Vista completa de todos los datos de la necesidad especial
- **Acción**: Botón "Cerrar" para volver a la lista

## Flujo de Uso

1. **Acceso**: El profesor navega a su página de grupo
2. **Crear**: Hace click en "➕ Crear Necesidades Especiales"
3. **Llenar Formulario**: Completa la información del alumno y sus necesidades
4. **Validación**: El sistema valida que todos los campos obligatorios estén completos
5. **Envío**: Al hacer click en "Crear Necesidades Especiales" se envía la información
6. **Confirmación**: Mensaje de éxito y cierre automático del modal
7. **Actualización**: La lista se actualiza automáticamente mostrando la nueva necesidad especial

## Validaciones

### Campos Obligatorios
- Nombre del alumno
- Número de matrícula
- Programa educativo
- Fecha de registro
- Fecha de revisión
- Número de revisión
- Al menos un tipo de excepción marcado

### Validaciones Específicas
- Si se marca una excepción, su especificación es obligatoria
- El número de revisión debe ser mayor a 0
- Las fechas deben ser válidas

## Componentes Utilizados

### 1. CreateNecesidadesEspecialesModal
- Modal para crear nuevas necesidades especiales
- Formulario completo con validaciones
- Integración con la API

### 2. NecesidadesEspecialesList
- Lista de necesidades especiales existentes
- Manejo de estados de carga y error
- Integración con modal de detalles

### 3. NecesidadesEspecialesModal
- Modal para ver detalles completos
- Solo lectura (no permite edición)

## Integración con API

### Endpoints Utilizados
- `POST /necesidades-especiales` - Crear nueva necesidad especial
- `GET /necesidades-especiales/carga-academica/:id` - Obtener por grupo

### Autenticación
- Utiliza el `accessToken` del store de autenticación
- Validación automática de sesión

## Estados y Manejo de Errores

### Estados de Carga
- **Loading**: Spinner durante operaciones
- **Success**: Mensaje de confirmación
- **Error**: Mensaje de error con opción de reintentar

### Manejo de Errores
- Validación de formulario en frontend
- Manejo de errores de API
- Mensajes de error descriptivos
- Opción de reintentar operaciones fallidas

## Responsive Design

- **Desktop**: Layout de 2 columnas para formularios
- **Mobile**: Layout de 1 columna para mejor usabilidad
- **Modal**: Scroll vertical para contenido extenso
- **Lista**: Cards responsivos con información condensada

## Consideraciones de UX

- **Pre-llenado**: Campos automáticos cuando es posible
- **Validación en tiempo real**: Errores se muestran inmediatamente
- **Feedback visual**: Estados de carga y confirmación claros
- **Navegación intuitiva**: Botones claros y accesibles
- **Accesibilidad**: Labels apropiados y estructura semántica

## Permisos y Seguridad

- **Acceso**: Solo profesores autenticados
- **Validación**: Verificación de rol en frontend y backend
- **Datos**: Información sensible protegida por autenticación
- **Auditoría**: Todas las operaciones quedan registradas en el sistema
