import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("asesorias", "routes/asesorias.tsx"),
  route("tutorias", "routes/tutorias.tsx"),
  route("estadias", "routes/estadias.tsx"),
  route("seguimiento", "routes/seguimiento.tsx"),
  route("seguimientos", "routes/seguimientos.tsx"),

  // PROFESOR
  route("asignatura/:asignaturaId", "routes/asignatura.tsx"),
  route("grupo/:grupoId", "routes/grupo.tsx"),
  route("profesor/estadias/:estadiaId", "routes/profesor/estadias/index.tsx"),
  route(
    "profesor/estadias/progreso-alumno/:estadiaAlumnoId",
    "routes/profesor/estadias/progreso-alumno.tsx"
  ),

  // COORDINADOR
  route(
    "coordinador/gestion-usuarios",
    "routes/coordinador/gestion-usuarios.tsx"
  ),
  route("coordinador/gestion-grupos", "routes/coordinador/gestion-grupos.tsx"),
  route(
    "coordinador/asignacion-cargas",
    "routes/coordinador/asignacion-cargas.tsx"
  ),
  route(
    "coordinador/asignacion-estadias",
    "routes/coordinador/asignacion-estadias.tsx"
  ),
  route(
    "coordinador/asignacion-tutorias",
    "routes/coordinador/asignacion-tutorias.tsx"
  ),

  // FORMATOS
  route("formatos/asesorias", "routes/formatos/asesorias.tsx"),
  route("formatos/estadias", "routes/formatos/estadias.tsx"),
  route("formatos/tutorias", "routes/formatos/tutorias.tsx"),
  route(
    "formatos/programacion-cursos",
    "routes/formatos/programacion-cursos.tsx"
  ),
] satisfies RouteConfig;
