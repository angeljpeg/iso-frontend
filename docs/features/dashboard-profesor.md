# 📁 Feature - Login

## 1. 🎯 Objetivo

Crear la vista del Dashboard para profesores. Debe contar con:

## 2. ✅ Requisitos Funcionales

- Mostrar todos los grupos asignados al profesor en el cuatrimestre activo.
- Cada grupo debe ser un elemento clicable que redirige a un apartado único para dicho grupo (puede estar vacío por ahora).
- Si dentro de las cargas academicas del profesor se repiten los grupos, no debe haber doble tarjeta, solo una.
- En la vista del grupo se deben mostrar las asignaturas de cada grupo, junto con sus temas.
- Cada tema debe ser un elemento clicable que redirige a una página nueva (ruta /seguimiento) (esta página puede estar vacía por ahora).

## 3. 🎨 Reglas Visuales y de UX (Experiencia de Usuario)

### 3.1 📌 Diseño General

- El diseño debe ser limpio, ordenado y accesible.
- Utilizar una tarjeta visual por cada grupo asignado.
- Mostrar los grupos en un layout responsivo tipo grid o lista, con buen espacio entre elementos.
- Si no hay grupos asignados, mostrar un mensaje claro:
  No tienes grupos asignados este cuatrimestre.

### 3.2 🧾 Contenido de cada tarjeta de grupo

Cada tarjeta debe mostrar claramente:

- 🏷️ Nombre del grupo: usar el campo grupo.nombreGenerado
  Ejemplo: TI 1 - 2
- 📚 Asignatura: usar asignatura.nombre
  Ejemplo: Programación I
- 🕒 Periodo: usar grupo.cuatrimestreRelacion.nombreGenerado
  Ejemplo: Mayo 2025 - Agosto 2025

### 3.3 🖱️ Interacción

- Al hacer clic en una tarjeta de grupo, se debe navegar a la ruta correspondiente al grupo.
  Por ejemplo: /profesor/grupo/:id
- Puedes pasar el grupoId o el cargaAcademicaId como parámetro en la URL, dependiendo de tu diseño futuro.
- Las tarjetas deben tener hover animado, sombreado suave o cambio de color para mejorar la experiencia visual.
- Incluir un botón de “Volver” en las vistas individuales de grupo (aunque estén vacías).

## 4. 📄 Detalles Técnicos

### 4.1 API de Cargas Academicas

- URL: http://localhost:3000/carga-academica/mi-carga?actual=true

- Método: GET

Response 200:

```json
[
  {
    "id": "8788ad79-9e45-4ba0-bff9-8bd07307dc74",
    "profesorId": "54ebd44f-84f6-42ff-aa4e-b8cd67f7a4d0",
    "asignaturaId": "9583cd5c-3fd6-43e7-b678-a2557e29e98d",
    "grupoId": "10dd4cd6-d07b-4b94-8077-8e478dd7f6ac",
    "cuatrimestreId": "805fded4-3755-40c5-991d-8b89dda3087f",
    "activo": true,
    "asignatura": {
      "id": "9583cd5c-3fd6-43e7-b678-a2557e29e98d",
      "nombre": "Programación I",
      "carrera": "Ingeniería en Sistemas",
      "activo": true,
      "createdAt": "2025-07-30T22:55:17.138Z",
      "updatedAt": "2025-07-30T22:55:17.138Z"
    },
    "grupo": {
      "id": "10dd4cd6-d07b-4b94-8077-8e478dd7f6ac",
      "carrera": "Tecnologías de la Información",
      "cuatrimestre": 2,
      "numeroGrupo": 1,
      "nombreGenerado": "TI 1 - 2",
      "activo": true,
      "cuatrimestreId": "805fded4-3755-40c5-991d-8b89dda3087f",
      "cuatrimestreRelacion": {
        "id": "805fded4-3755-40c5-991d-8b89dda3087f",
        "fechaInicio": "2025-05-20",
        "fechaFin": "2025-08-30",
        "nombreGenerado": "Mayo 2025 - Agosto 2025",
        "activo": true,
        "createdAt": "2025-07-30T22:55:17.156Z",
        "updatedAt": "2025-07-30T22:55:17.156Z"
      },
      "createdAt": "2025-07-30T22:55:17.164Z",
      "updatedAt": "2025-07-30T22:55:17.164Z"
    },
    "createdAt": "2025-07-30T22:55:17.176Z",
    "updatedAt": "2025-07-30T22:55:17.176Z"
  }
]
```

Response error:

```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas"
}
```

## 5. 🔐 Control de Acceso

- Esta vista solo debe ser accesible por usuarios con rol de profesor autenticado.
- Si no es profesor, redirigir al login o al dashboard correspondiente a su rol.

## 6. Entidades

### 6.1 Asignatura

```json
    {
        id: string
        nombre: string
        carrera: string
        activo: boolean
        temas: Tema[]
        createdAt: Date
        updatedAt: Date
    }
```

### 6.2 Tema

```json
    {
        id: string
        nombre: string
        unidad: number
        semanaRecomendada: number
        asignaturaId: string
        activo: boolean
        createdAt: Date
        updatedAt: Date
    }
```

### 6.3 Grupo

```json
    {
        id: string
        carrera: string
        cuatrimestre: number
        numeroGrupo: number
        nombreGenerado: string
        cuatrimestreId: string
        activo: boolean
        createdAt: Date
        updatedAt: Date
    }
```

### 6.4 Cuatrimestre

```json
    {
        id: string
        fechaInicio: Date
        fechaFin: Date
        nombreGenerado: string
        grupos: Grupo[]
        activo: boolean
        createdAt: Date
        updatedAt: Date
    }
```
