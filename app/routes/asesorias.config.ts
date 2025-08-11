// Configuración de rutas para el módulo de asesorías
export const ASESORIAS_ROUTES = {
  // Ruta principal
  MAIN: "/asesorias",

  // Ruta de formatos (la que estamos usando)
  FORMATOS: "/formatos/asesorias",

  // Rutas específicas
  CREATE: "/asesorias/crear",
  EDIT: "/asesorias/editar/:id",
  VIEW: "/asesorias/ver/:id",
  REPORTES: "/asesorias/reportes",
  DASHBOARD: "/asesorias/dashboard",
};

// Configuración de permisos por rol
export const ASESORIAS_PERMISSIONS = {
  // Roles que pueden acceder al módulo completo
  FULL_ACCESS: ["coordinador", "moderador"],

  // Roles que pueden ver todas las asesorías
  VIEW_ALL: ["coordinador", "moderador"],

  // Roles que solo pueden ver sus propias asesorías
  VIEW_OWN: ["profesor_tiempo_completo", "profesor_asignatura"],

  // Roles que pueden crear asesorías
  CREATE: [
    "profesor_tiempo_completo",
    "profesor_asignatura",
    "coordinador",
    "moderador",
  ],

  // Roles que pueden editar asesorías
  EDIT: [
    "profesor_tiempo_completo",
    "profesor_asignatura",
    "coordinador",
    "moderador",
  ],

  // Roles que pueden eliminar asesorías
  DELETE: ["coordinador", "moderador"],

  // Roles que pueden generar reportes
  REPORTS: ["coordinador", "moderador"],
};

// Función para verificar permisos
export const checkAsesoriasPermission = (
  userRole: string | undefined,
  permission: keyof typeof ASESORIAS_PERMISSIONS
): boolean => {
  if (!userRole) return false;

  const allowedRoles = ASESORIAS_PERMISSIONS[permission];
  return allowedRoles.includes(userRole);
};

// Función para obtener la ruta correcta según el rol
export const getAsesoriasRoute = (userRole: string | undefined): string => {
  if (checkAsesoriasPermission(userRole, "FULL_ACCESS")) {
    return ASESORIAS_ROUTES.FORMATOS;
  }

  if (checkAsesoriasPermission(userRole, "VIEW_OWN")) {
    return ASESORIAS_ROUTES.FORMATOS;
  }

  // Por defecto, redirigir al dashboard
  return "/dashboard";
};

// Configuración de navegación
export const ASESORIAS_NAVIGATION = {
  title: "Asesorías",
  description: "Gestión de asesorías académicas",
  icon: "📚",
  color: "blue",
  sections: [
    {
      title: "Registro",
      description: "Gestionar asesorías",
      route: ASESORIAS_ROUTES.FORMATOS,
      icon: "📝",
    },
    {
      title: "Reportes",
      description: "Generar reportes",
      route: ASESORIAS_ROUTES.REPORTES,
      icon: "📊",
      requiresPermission: "REPORTS",
    },
    {
      title: "Dashboard",
      description: "Vista general",
      route: ASESORIAS_ROUTES.DASHBOARD,
      icon: "📈",
      requiresPermission: "REPORTS",
    },
  ],
};
