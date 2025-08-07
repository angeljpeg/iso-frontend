Módulo: Programación y Seguimiento del Curso

1. Resumen General del Módulo
   Este módulo permite al profesor registrar semanalmente el avance académico por grupo y asignatura, monitorear el cumplimiento del plan de estudios y justificar retrasos. Los directivos podrán revisar el seguimiento, aprobarlo o rechazarlo, y generar reportes visuales y exportables.

2. Pantallas y Componentes
   2.1 Pantalla para Profesores
   ✅ Funcionalidades:
   Visualizar asignaturas y grupos asignados.

Registrar avance por semana y tema.

Estado del formulario (Borrador, Enviado, Revisado, Aprobado/Rechazado).

Justificar retrasos (si ≥2 semanas de desfase).

Indicador visual de avance y retrasos.

Botón de envío y guardado parcial (autoguardado y manual).

🧩 Componentes:
Tabla o lista de semanas con:

Semana actual y anteriores

Tema esperado (según plan)

Campo de texto o select para avance logrado

Campo de observaciones (opcional)

Alerta visual para semanas en rojo (retraso crítico)

Modal o textarea para justificar retrasos (obligatorio si aplica)

Estado del seguimiento (con badges: "borrador", "enviado", etc.)

Botón “Guardar” (parcial) y “Enviar seguimiento”

📌 Validaciones:
No permitir envío si hay semanas con retrasos sin justificar.

Confirmación antes de enviar.

Desactivar edición al enviar.

2.2 Pantalla para Directores y Coordinadores
✅ Funcionalidades:
Visualizar seguimientos de todos los profesores.

Filtrar por profesor, grupo, cuatrimestre, carrera.

Revisar avances y justificaciones.

Aprobar o rechazar con comentarios.

Ver indicadores visuales (alertas por retraso).

Generar y exportar reportes.

🧩 Componentes:
Filtros y buscador.

Tabla de seguimientos con estado y alertas.

Modal de revisión (con comentario obligatorio en rechazo).

Gráficas o indicadores visuales (avance general, retrasos).

Botón “Exportar” (PDF/Excel).

3. Interacciones y Estados
   Estado Descripción Acciones Disponibles
   Borrador Editable por el profesor. Guardar, Enviar
   Enviado En revisión por el director/coordinador. Solo lectura
   Revisado Puede requerir cambios. Ver comentarios
   Aprobado Cerrado, sin posibilidad de edición. Solo lectura
   Rechazado Editable nuevamente, requiere revisión posterior. Editar, reenviar

4. Indicadores Visuales
   ✅ Verde: Sin retraso

🟡 Amarillo: 1 semana de retraso

🔴 Rojo: ≥2 semanas de retraso (justificación obligatoria)

Badges de estado con colores

5. Notificaciones en UI
   Banner superior o toast:

“Tienes seguimientos sin actualizar esta semana”

“Tu seguimiento fue aprobado/rechazado”

Notificación visual junto a cada seguimiento pendiente.

6. Requerimientos Técnicos Frontend
   Autoguardado cada X segundos o al cambiar campos.

Responsive: usable en laptop, tablet y móvil.

Accesibilidad: uso con teclado y lectores de pantalla básico.

Rendimiento: carga < 2s con 100 registros visibles.

Soporte para roles diferenciados (según token/rol de sesión).

7. KPIs de UX Frontend
   ≤2 clics para registrar avance por semana.

≤5 segundos para filtrar por profesor o grupo.

≥95% de uso móvil sin errores de visualización.
