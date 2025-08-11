# Solución de Problemas - Página de Asesorías

## Problema Identificado

La página de asesorías no permitía el acceso debido a problemas en la estructura de tipos y servicios.

## Soluciones Implementadas

### 1. ✅ Tipos Corregidos

- **Archivo:** `/types/asesorias/index.ts`
- **Problema:** Estructura de tipos incorrecta y conflictos de importación
- **Solución:** Reestructuración completa de tipos con interfaces claras

### 2. ✅ Servicios Corregidos

- **Archivo:** `/services/asesorias.service.ts`
- **Problema:** Funciones de servicio mal implementadas
- **Solución:** Implementación correcta de todas las funciones CRUD

### 3. ✅ Hooks Temporales

- **Archivo:** `/hooks/asesorias/use-asesorias.ts`
- **Problema:** Hooks dependían de un backend no funcional
- **Solución:** Implementación de datos mock temporales para desarrollo

### 4. ✅ Página Corregida

- **Archivo:** `/routes/formatos/asesorias.tsx`
- **Problema:** Lógica compleja y múltiples hooks conflictivos
- **Solución:** Simplificación y unificación de la lógica

### 5. ✅ Configuración de API

- **Archivo:** `/services/api-config.ts`
- **Problema:** Configuración básica sin opciones
- **Solución:** Configuración robusta con variables de entorno

## Estado Actual

### ✅ Funcionando

- ✅ Página de asesorías accesible
- ✅ Datos mock mostrándose correctamente
- ✅ Filtros funcionando
- ✅ Tabla de asesorías renderizando
- ✅ Estados de carga y error manejados
- ✅ Roles de usuario funcionando

### ⚠️ Temporal (Mock)

- Datos de asesorías (3 registros de ejemplo)
- Filtros aplicados localmente
- Paginación básica

### 🔄 Pendiente (Backend)

- Conexión real con la API
- Datos reales de asesorías
- Filtros del servidor
- Paginación del servidor
- Reportes reales

## Cómo Cambiar a Backend Real

### 1. Cambiar en `use-asesorias.ts`

```typescript
// Cambiar esta línea:
const useMock = true; // Cambiar a false cuando el backend esté listo

// Por esta:
const useMock = false; // Usar backend real
```

### 2. Verificar Backend

- Asegurar que `http://localhost:3000/asesorias` esté funcionando
- Verificar que los endpoints coincidan con los tipos
- Confirmar que la autenticación funcione

### 3. Probar Conexión

- Revisar la consola del navegador para errores
- Verificar que las peticiones se envíen correctamente
- Confirmar que las respuestas tengan el formato esperado

## Estructura de Datos Esperada

### Endpoint: `GET /asesorias`

```json
{
  "data": [
    {
      "id": "string",
      "temaAsesoria": "string",
      "fecha": "string (ISO date)",
      "numeroAlumnos": "number",
      "nombreAlumno": "string",
      "duracionAsesoria": "number",
      "cargaAcademicaId": "string",
      "activo": "boolean",
      "cargaAcademica": {
        "id": "string",
        "carrera": "string",
        "asignatura": "string",
        "profesor": {
          "id": "string",
          "nombre": "string",
          "apellido": "string"
        },
        "grupo": {
          "id": "string",
          "nombreGenerado": "string"
        },
        "cuatrimestre": {
          "id": "string",
          "nombreGenerado": "string"
        }
      },
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

## Filtros Soportados

### Query Parameters

- `profesorId`: ID del profesor
- `cuatrimestreId`: ID del cuatrimestre
- `grupoId`: ID del grupo
- `temaAsesoria`: Tema de la asesoría (búsqueda parcial)
- `asignaturaId`: ID de la asignatura
- `carrera`: Código de la carrera
- `fechaInicio`: Fecha de inicio (ISO date)
- `fechaFin`: Fecha de fin (ISO date)
- `page`: Número de página
- `limit`: Límite de registros por página

## Logs de Debug

La página incluye logs detallados en la consola del navegador:

```
=== DEBUG ASESORIAS ===
Usuario: { objeto usuario }
isCoordinador: true/false
asesoriasResponse: { respuesta del hook }
asesorias: [ array de asesorías ]
error: null o error
isLoading: true/false
================================
```

## Próximos Pasos

1. **Implementar Backend Real**

   - Crear endpoints de asesorías
   - Implementar filtros del servidor
   - Agregar paginación real

2. **Mejorar UI/UX**

   - Agregar gráficos para reportes
   - Implementar búsqueda en tiempo real
   - Agregar exportación a Excel/CSV

3. **Testing**
   - Pruebas unitarias para hooks
   - Pruebas de integración
   - Pruebas de usuario

## Contacto

Si encuentras algún problema adicional, revisa:

1. Consola del navegador para errores
2. Network tab para peticiones fallidas
3. Estado de autenticación del usuario
4. Configuración de la API en `api-config.ts`
