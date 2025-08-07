# 📦 Project Context: React Dashboard App

## 🧠 Propósito

Este proyecto es un **dashboard administrativo** construido con **React** y **React Router (v7.7.1)**. Está diseñado con una arquitectura modular y escalable para una futura expansión a más funcionalidades (como autenticación, usuarios, reportes, etc).

## 🛠️ Tecnologías principales

| Categoría       | Tecnología                             |
| --------------- | -------------------------------------- |
| Lenguaje        | TypeScript                             |
| Framework UI    | React                                  |
| Enrutador       | React Router DOM v7.7.1                |
| Estilos         | Tailwind CSS (opcional) / app.css      |
| Arquitectura    | Basada en `features` por dominio       |
| Estado global   | Zustand (planificado, no implementado) |
| Peticiones HTTP | Axios (planificado, en `/lib`)         |
| Validación      | Zod (planificado)                      |

## 📁 Estructura de carpetas (`/src`)

```txt
/src
│
├── assets/               # Imágenes, íconos, logos
├── components/           # Componentes globales reutilizables
│   └── ui/               # Componentes atómicos (inputs, botones, cards)
├── features/             # Módulos funcionales por dominio
│   └── dashboard/
│       ├── components/   # Componentes específicos del dashboard
│       └── DashboardPage.tsx #
├── hooks/                # Custom hooks generales
├── layouts/              # Layouts como DashboardLayout, AuthLayout
├── lib/                  # Axios, Zod, helpers generales
├── routes/               # Configuraciones de rutas individuales
│   └── Dashboard.tsx     # Ruta del dashboard
├── services/             # Servicios API (por dominio)
├── store/                # Zustand u otro estado global
├── types/                # Tipos globales TypeScript
├── utils/                # Funciones utilitarias generales
├── app.css               # Archivo CSS principal
├── root.tsx              # Root Layout general
└── routes.ts             # Configuración principal de rutas
```

## 🌐 Navegación

- Las rutas se definen en routes.ts (principal) y se separan por módulo en /routes/.
- Se espera usar createBrowserRouter para estructurar layouts y rutas anidadas.
- DashboardLayout se utiliza como contenedor para rutas protegidas del dashboard.

## 🔐 Estado de autenticación

- Aún no implementado, pero está planeado un wrapper tipo ProtectedRoute para proteger rutas con lógica de autenticación.
- Probablemente se utilice JWT + Context API o Zustand.

## 🧱 Componentes esperados

Sidebar, Topbar, Cards, Charts, Table: en construcción o por desarrollar en /components y /features/dashboard/components.

## 🧩 Extensiones planeadas

- Validación con Zod
- Formularios con React Hook Form
- Recharts para gráficas
- Zustand para estado global (por módulo)
- Axios configurado con interceptores
- Loader/Error boundaries

## Reglas de Diseño

1. Identidad visual

   - Colores Institucionales (UTN):
     - primario: #3e9530
     - primary: #3e9530; /_ Verde UTN _/
     - primary-light: #52b342;
     - primary-dark: #2d6e23;
     - secondary: #6b7280; /_ Grises para texto/bordes _/
     - accent: #3b82f6; /_ Azul para links/acciones secundarias _/
     - success: #10b981;
     - warning: #f59e0b;
     - error: #ef4444;
   - Usar tonalidades consistentes con la identidad institucional de la UTN.
   - Evitar combinaciones de colores que dificulten la lectura o generen ruido visual.

2. Font
   - Utilizar Inter como fuente principal.
   - Tamaños de fuente:
     - Encabezados: 24px, 20px, 18px
     - Texto principal: 16px, 14px
     - Botones: 14px
   - Espaciado:
     - Espaciado entre elementos: 16px
     - Espaciado dentro de contenedores: 24px
