# Sistema de PDF para Programación de Cursos

Este sistema utiliza `@react-pdf/renderer` para generar PDFs de alta calidad con el formato oficial de la UTN.

## Características

- **PDF Horizontal**: Orientación landscape para mejor aprovechamiento del espacio
- **Sin campos vacíos**: Todos los campos están completos con datos reales o de ejemplo
- **Campos completos**: Incluye justificación y acciones además de los campos básicos
- **Logos oficiales**: UTN e ISO 21001 correctamente posicionados
- **Formato oficial**: Estructura exacta del formulario oficial de la universidad

## Componentes

### ProgramacionCursosDocument

Componente principal que renderiza el PDF con la estructura completa.

### PDFDownloader

Componente que permite descargar el PDF generado programáticamente.

### PDFDownloadLinkComponent

Componente que crea un enlace de descarga directa (recomendado).

## Uso

### Uso básico con enlace de descarga

```tsx
import { PDFDownloadLinkComponent } from "~/components/formatos/pdf";

<PDFDownloadLinkComponent
  seguimientos={seguimientosArray}
  titulo="Programación y Seguimiento de Cursos"
  filtros={filters}
>
  Exportar PDF
</PDFDownloadLinkComponent>;
```

### Uso programático

```tsx
import { PDFDownloader } from "~/components/formatos/pdf";

<PDFDownloader
  seguimientos={seguimientosArray}
  titulo="Programación y Seguimiento de Cursos"
  filtros={filters}
  onDownload={handleDownload}
>
  Descargar PDF
</PDFDownloader>;
```

## Estructura del PDF

### Encabezado

- Logos UTN e ISO 21001
- Título de la universidad
- Subtítulo de la dirección de carrera
- "Programación y seguimiento del curso"

### Información del curso (columna izquierda)

- Asignatura
- Profesor
- Horas por semana
- Grupos a impartir
- Cuatrimestre
- Año

### Sección de dirección de carrera (columna derecha)

- Fecha de entrega
- Fecha de seguimiento de la Dirección
- Fecha de seguimiento final de la Dirección

### Tabla principal

- **PROGRAMACIÓN** (verde): Unidad, TEMAS, Tiempo
- **SEGUIMIENTO** (azul): Avance, Justificación, Acciones, Evidencia, Revisión

### Pie de página

- Código F01PEFA04.00
- Información de revisión

## Dependencias

```bash
npm install @react-pdf/renderer
```

## Notas importantes

1. **Orientación horizontal**: El PDF se genera en formato landscape para mejor legibilidad
2. **Datos reales**: Se utilizan los datos reales de los seguimientos cuando están disponibles
3. **Fallback**: Si no hay datos, se muestran ejemplos para mantener el formato
4. **Logos**: Los logos se cargan desde `/assets/logo-utn.png` y `/assets/iso-21001.png`

## Personalización

Para personalizar el PDF, modifica los estilos en `styles` dentro de `ProgramacionCursosDocument` o ajusta la lógica de generación de datos en las funciones helper.
