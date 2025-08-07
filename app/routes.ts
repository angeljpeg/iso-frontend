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
  route("grupo/:grupoId", "routes/grupo.tsx"),
  route("asignatura/:asignaturaId", "routes/asignatura.tsx"),
] satisfies RouteConfig;
