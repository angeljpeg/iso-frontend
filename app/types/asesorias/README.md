# Tipos de Asesorías

Este directorio contiene todos los tipos TypeScript relacionados con el módulo de asesorías del sistema ISO.

## Estructura

```
asesorias/
├── index.ts                 # Tipos principales y exportaciones
├── columns-table.ts         # Configuración de columnas para tablas
├── services/                # Interfaces de servicios
│   ├── index.ts            # Exportaciones de servicios
│   ├── create.ts           # Servicio de creación
│   ├── get-all.ts          # Servicio de obtención de todas
│   ├── get-by-id.ts        # Servicio de obtención por ID
│   ├── get-by-carga-academica.ts # Servicio por carga académica
│   ├── update.ts           # Servicio de actualización
│   ├── delete.ts           # Servicio de eliminación
│   ├── test-relations.ts   # Servicio de prueba de relaciones
│   └── consolidated.ts     # Interfaz consolidada de servicios
└── README.md               # Este archivo
```

## Tipos Principales

### Asesoria

Interfaz principal que representa una asesoría en el sistema.

### CreateAsesoriaDto

DTO para la creación de nuevas asesorías.

### UpdateAsesoriaDto

DTO para la actualización de asesorías existentes.

### QueryAsesoriaDto

DTO para consultas y filtros de asesorías.

### AsesoriaResponseDto

DTO para respuestas paginadas de asesorías.

## Servicios

Cada archivo en el directorio `services/` define una interfaz para un servicio específico:

- **CreateAsesoriaService**: Creación de asesorías
- **GetAllAsesoriasService**: Obtención de todas las asesorías
- **GetAsesoriaByIdService**: Obtención por ID
- **GetAsesoriasByCargaAcademicaService**: Obtención por carga académica
- **UpdateAsesoriaService**: Actualización de asesorías
- **DeleteAsesoriaService**: Eliminación de asesorías
- **TestRelationsService**: Prueba de relaciones (endpoint temporal)

### AsesoriasService

Interfaz consolidada que extiende todos los servicios individuales.

## Columnas de Tabla

El archivo `columns-table.ts` define la configuración de columnas para mostrar asesorías en tablas, incluyendo:

- Claves de las columnas
- Etiquetas de visualización
- Configuración de ordenamiento y filtrado
- Ancho y alineación de las columnas

## Uso

```typescript
import type {
  Asesoria,
  CreateAsesoriaDto,
  AsesoriasService,
  asesoriaColumns
} from './types/asesorias';

// Usar tipos en componentes
const asesoria: Asesoria = { ... };

// Usar servicios
const asesoriasService: AsesoriasService = { ... };

// Usar columnas de tabla
const columns = asesoriaColumns;
```

## Relaciones

Las asesorías están relacionadas con:

- **CargaAcademica**: La carga académica asociada
- **Usuario**: El profesor que crea la asesoría (a través de CargaAcademica)
- **Grupo**: El grupo de estudiantes (a través de CargaAcademica)
- **Cuatrimestre**: El período académico (a través de CargaAcademica)
