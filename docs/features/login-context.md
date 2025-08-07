# 📁 Feature - Login

## 🎯 Objetivo

Crear una página de inicio de sesión para usuarios del sistema. Debe contar con:

- Validaciones en el formulario.
- Manejo de errores de la API.
- Uso de componentes reutilizables (input, button, etc.).
- Diseño consistente con el resto del dashboard.

## ✅ Requisitos Funcionales

1. Formulario de Login

- Campos: email/usuario y contraseña.
- Validación inmediata de campos (required, formato email, longitud mínima).
- Botón de "Iniciar sesión".

2. Validaciones

- Cliente: usando Zod o React Hook Form.
- Servidor: errores devueltos por la API deben mostrarse claramente (ej: "usuario no encontrado", "contraseña incorrecta").

3. Feedback de UI

- Carga con spinner mientras se autentica.
- Mostrar errores en campos o mensajes globales si falla la API.
- Mostrar toast o alerta en caso de éxito o error global.

4. Redirección

- Al autenticarse, redirigir al dashboard (/dashboard o similar).
- Si ya está logueado, evitar mostrar la página de login (protección desde el layout o ruta).

## 4. 📄 Detalles Técnicos

### 4.1 API de Login

- URL: http://localhost:3000/usuarios/login

- Método: POST

Request Body:

```json
{
  "email": "admin@correo.com",
  "password": "Password123!"
}
```

Response 200:

```json
{
  "accessToken": "JWT_TOKEN",
  "refreshToken": "JWT_REFRESH",
  "usuario": {
    "id": "uuid",
    "email": "admin@correo.com",
    "nombre": "Admin",
    "apellido": "Principal",
    "rol": "coordinador"
  }
}
```

Response error:

```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas"
}
```

### 4.2 API de Refresh Token

- URL: http://localhost:3000/usuarios/refresh

- Método: POST

Request Body:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response 200:

```json
{
  "accessToken": "JWT_TOKEN",
  "refreshToken": "JWT_REFRESH",
  "usuario": {
    "id": "uuid",
    "email": "admin@correo.com",
    "nombre": "Admin",
    "apellido": "Principal",
    "rol": "coordinador"
  }
}
```

Response error:

```json
{
  "statusCode": 401,
  "message": "Refresh token inválido o expirado"
}
```
