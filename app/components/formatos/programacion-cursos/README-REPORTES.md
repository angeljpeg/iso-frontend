# Componentes de Reportes para Programación de Cursos

Este directorio contiene los componentes necesarios para mostrar reportes y estadísticas del seguimiento de cursos para coordinadores.

## Componentes Principales

### 1. ReportesSection

Componente principal que organiza todos los reportes en pestañas.

**Características:**

- Dashboard con métricas principales
- Reporte de seguimientos
- Reporte de retrasos
- Reporte de completitud
- Gráficas avanzadas

**Uso:**

```tsx
import { ReportesSection } from "~/components/formatos/programacion-cursos";

<ReportesSection cuatrimestreId="123" profesorId="456" />;
```

### 2. ReportesGraficas

Componentes de gráficas individuales usando Recharts.

**Tipos de gráficas disponibles:**

- `GraficaBarras` - Gráficas de barras
- `GraficaPie` - Gráficas circulares
- `GraficaLinea` - Gráficas de línea
- `GraficaArea` - Gráficas de área

**Uso:**

```tsx
import { GraficaBarras, GraficaPie } from "~/components/formatos/programacion-cursos";

<GraficaBarras
  data={datos}
  title="Título de la Gráfica"
  description="Descripción opcional"
  color="#3b82f6"
/>

<GraficaPie
  data={datos}
  title="Distribución"
  colors={["#3b82f6", "#10b981", "#f59e0b"]}
/>
```

### 3. ReportesGraficasAvanzadas

Componente que muestra múltiples gráficas organizadas para análisis completo.

**Características:**

- Gráficas de distribución por estados
- Análisis de retrasos por semana
- Completitud por asignatura y profesor
- Métricas de calidad
- Comparativas visuales

## Hooks Utilizados

### useReporteDashboard

Hook para obtener el reporte consolidado del dashboard.

```tsx
const { reporte, isLoading, error, refresh } = useReporteDashboard();
```

### useReporteGenerico

Hook genérico para diferentes tipos de reportes.

```tsx
const { reporte, isLoading, error, refresh } = useReporteGenerico({
  tipo: "seguimientos", // o "retrasos", "completitud", etc.
  filtros: filtrosBase,
  autoFetch: false,
});
```

## Tipos de Datos

Los componentes esperan datos en el formato definido en `~/types/programacion-curso/reportes.ts`:

- `ReporteDashboard` - Reporte consolidado
- `ReporteSeguimientos` - Reporte de seguimientos
- `ReporteRetrasos` - Reporte de retrasos
- `ReporteCompletitud` - Reporte de completitud

## Funcionalidades

### Dashboard

- Total de seguimientos
- Total de detalles
- Total de retrasos
- Promedio de completitud
- Distribución por estados
- Distribución por completitud

### Seguimientos

- Resumen por estado
- Resumen por cuatrimestre
- Resumen por profesor
- Detalles de seguimientos

### Retrasos

- Análisis de retrasos por semana
- Retrasos por asignatura
- Retrasos por profesor
- Retrasos por tema
- Patrones de retraso

### Completitud

- Distribución de completitud
- Completitud por asignatura
- Completitud por profesor
- Completitud por grupo
- Métricas de calidad

### Gráficas Avanzadas

- Gráficas circulares de distribución
- Gráficas de barras para comparativas
- Gráficas de línea para tendencias
- Gráficas de área para evolución temporal
- Comparativas visuales con barras de progreso

## Personalización

### Colores

Los componentes aceptan colores personalizados:

```tsx
<GraficaBarras color="#ef4444" /> // Rojo
<GraficaPie colors={["#3b82f6", "#10b981", "#f59e0b"]} />
```

### Layout

Usar `GraficasGrid` para organizar múltiples gráficas:

```tsx
<GraficasGrid cols={2}>
  <GraficaBarras data={datos1} title="Gráfica 1" />
  <GraficaPie data={datos2} title="Gráfica 2" />
</GraficasGrid>
```

### Filtros

Los reportes se pueden filtrar por:

- Cuatrimestre
- Profesor
- Asignatura
- Grupo
- Estado
- Fechas
- Y más según el tipo de reporte

## Integración

Para integrar en una página existente:

1. Importar los componentes necesarios
2. Usar los hooks para obtener datos
3. Pasar los datos a los componentes
4. Manejar estados de carga y error

```tsx
import { ReportesSection } from "~/components/formatos/programacion-cursos";

export default function MiPagina() {
  return (
    <div>
      <h1>Mi Página</h1>
      <ReportesSection />
    </div>
  );
}
```

## Dependencias

- `recharts` - Para las gráficas
- `lucide-react` - Para iconos
- Componentes UI de shadcn/ui

## Notas de Implementación

- Los reportes se cargan bajo demanda al cambiar de pestaña
- Se incluyen estados de carga y manejo de errores
- Los datos se convierten automáticamente al formato requerido por las gráficas
- Se incluyen comparativas visuales y métricas de calidad
- Los componentes son responsivos y se adaptan a diferentes tamaños de pantalla
