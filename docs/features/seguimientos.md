Entidad Seguimientos

Seguimiento Curso:

- id: uuid
- cargaAcademicaId: uuid
- cuatrimestreId: uuid
- semana: number
- estado: string
- observacionesProfesor: string
- observacionesDirector: string
- justificacionRetraso: string
- tieneRetrasosCriticos: boolean
- diasRetraso: number
- revisadoPorId: uuid
- fechaRevision: Date
- fechaEnvio: Date
- cargaAcademica: CargaAcademica
- cuatrimestre: Cuatrimestre
- revisadoPor: Usuario
- detalles: SeguimientoDetalle[]
- createdAt: Date
- updatedAt: Date

Seguimiento Detalles:

- id: uuid
- temaId: string
- estadoAvance:
- porcentajeAvance: number
- observaciones: string
- horasImpartidas: number
- horasProgramadas: number
- requiereRecuperacion: boolean
- seguimientoCurso: SeguimientoCurso
- tema: Tema
- createdAt: Date
- updatedAt: Date

Endpoint:

- Get All (https://localhost:3000/seguimientos)

  Params
  page: number
  limit: number
  cuatrimestreId: string (Si no tiene traera por defecto los actuales)
  profesorId: string (Si no tiene traera por defecto los del profesor logueado)
  estado: string
  semana: number
  conRetrasos: booleano

Response:

```json
{
  "data": [
    {
      "id": "4e85e32a-d35c-4407-bced-16cb8167a70c",
      "cargaAcademicaId": "b20550d3-c036-42fa-959b-aaf89b3d736a",
      "cuatrimestreId": "c3623577-79f6-42d6-ba1d-ab039f67146f",
      "semana": 4,
      "estado": "enviado",
      "observacionesProfesor": "Sin incidencias.",
      "observacionesDirector": null,
      "justificacionRetraso": null,
      "tieneRetrasosCriticos": false,
      "diasRetraso": 0,
      "revisadoPorId": null,
      "fechaRevision": null,
      "fechaEnvio": null,
      "cargaAcademica": {
        "id": "b20550d3-c036-42fa-959b-aaf89b3d736a",
        "profesorId": "5165e19a-d564-4cf0-9026-97d0b95ea3a8",
        "asignaturaId": "b68c9c81-e57d-47c2-99e1-e0d265fd96ab",
        "grupoId": "8f0b24bd-2624-413d-9acc-b0aa30091cd0",
        "cuatrimestreId": "c3623577-79f6-42d6-ba1d-ab039f67146f",
        "activo": true,
        "profesor": {
          "id": "5165e19a-d564-4cf0-9026-97d0b95ea3a8",
          "email": "profesorPTC@correo.com",
          "password": "$2b$10$jy5LhcqC6ue47r0x79kZo.U6O9bsIWT7pfnD.cvCGYnV8b/1JbkgO",
          "nombre": "Profesor",
          "apellido": "Tiempo Completo",
          "rol": "profesor_tiempo_completo",
          "activo": true,
          "resetPasswordToken": null,
          "resetPasswordExpires": null,
          "createdAt": "2025-08-07T00:53:06.150Z",
          "updatedAt": "2025-08-07T00:53:06.150Z"
        },
        "asignatura": {
          "id": "b68c9c81-e57d-47c2-99e1-e0d265fd96ab",
          "nombre": "Bases de Datos",
          "carrera": "Ingeniería en Sistemas",
          "activo": true,
          "createdAt": "2025-08-07T00:53:06.167Z",
          "updatedAt": "2025-08-07T00:53:06.167Z"
        },
        "grupo": {
          "id": "8f0b24bd-2624-413d-9acc-b0aa30091cd0",
          "carrera": "Tecnologías de la Información",
          "cuatrimestre": 2,
          "numeroGrupo": 2,
          "nombreGenerado": "TI 2 - 2",
          "activo": true,
          "cuatrimestreId": "c3623577-79f6-42d6-ba1d-ab039f67146f",
          "createdAt": "2025-08-07T00:53:06.196Z",
          "updatedAt": "2025-08-07T00:53:06.196Z"
        },
        "createdAt": "2025-08-07T00:53:06.204Z",
        "updatedAt": "2025-08-07T00:53:06.204Z"
      },
      "cuatrimestre": {
        "id": "c3623577-79f6-42d6-ba1d-ab039f67146f",
        "fechaInicio": "2025-05-20",
        "fechaFin": "2025-08-30",
        "nombreGenerado": "Mayo 2025 - Agosto 2025",
        "activo": true,
        "createdAt": "2025-08-07T00:53:06.184Z",
        "updatedAt": "2025-08-07T00:53:06.184Z"
      },
      "detalles": [],
      "createdAt": "2025-08-07T00:53:06.265Z",
      "updatedAt": "2025-08-07T00:53:06.265Z"
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```
