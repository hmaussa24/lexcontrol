# Plan funcional de “Casos”

## 1. Estructura y datos del caso
- Partes y contrapartes: demandante/demandado/tercero, abogados contrarios, contactos.
- Colaboradores del caso: roles (responsable, co‑autor, paralegal), fechas desde/hasta.
- Etiquetas y clasificación: subtipo, materia, área, prioridad, tags.
- Estados avanzados y razones: activo, probatorio, apelación, sentencia, archivado (con motivo).
- Relaciones entre casos: vinculados, acumulados, referencias cruzadas.
- Campos clave: valor económico, jurisdicción detallada, número interno del despacho.

## 2. Actuaciones y timeline
- Registro de actuaciones: tipo, fecha, resumen, documento asociado.
- Línea de tiempo unificada: actuaciones, plazos, audiencias, notas.
- Búsqueda y filtros por fecha/tipo/autor.

## 3. Plazos y audiencias integrados
- Crear plazos desde el caso; plantillas por tipo de proceso.
- Audiencias: asistentes, acta, resultado; recordatorios automáticos.

## 4. Documentos del caso
- Carpetas por caso, versionado, previsualización/descarga.
- Visibilidad: “para cliente” vs “interno”.
- Firma digital (integración posterior) y control de acceso por rol.

## 5. Notas internas y comunicación
- Notas privadas con menciones (@usuario) y adjuntos.
- Log de emails/llamadas ligados al caso; captura de correo a buzón (posterior).

## 6. Tareas vinculadas
- To‑dos con asignado, vencimiento y prioridad; checklist por audiencia/etapa.
- Kanban por estado de tarea dentro del caso.

## 7. Finanzas y tiempo
- Tiempos imputados (minutos, usuario, facturable).
- Gastos (concepto, monto, comprobante).
- Honorarios y rentabilidad del caso (resumen).

## 8. Seguridad y permisos
- Visibilidad por equipo/usuario; acceso de cliente (portal) a docs/estado marcados.
- Bitácora de auditoría en caso/actuaciones/documentos.

## 9. UX y productividad
- Resumen del caso: KPIs, próximos vencimientos, últimas actuaciones, docs recientes.
- Atajos: crear plazo/audiencia/documento desde el caso.
- Filtros avanzados (estado, responsable, ciudad, fecha, etiqueta), orden y paginación server‑side.
- Acciones masivas (cambiar responsable/etiquetas).

## 10. Automatización
- Plantillas por tipo de proceso: plazos predefinidos, checklist, documentos modelo.
- Alertas de riesgo: plazos críticos, inactividad, N audiencias sin resultado.

## 11. Integraciones
- Calendario (Google/Microsoft) con enlace al caso.
- Webhooks/notificaciones (estado, nuevos plazos/actuaciones).

## 12. Backlog propuesto (solo Casos)
1) Datos y permisos: partes, colaboradores, etiquetas; filtros y paginación.
2) Timeline completo: actuaciones + notas + documentos recientes.
3) Tareas del caso + checklist; creación rápida de plazo/audiencia/documento.
4) Finanzas y tiempo: registro básico y resumen de rentabilidad.
5) Automatización: plantillas por tipo de proceso; alertas de riesgo.
6) Integraciones: calendario; portal cliente (lectura de estado y docs marcados).

## 13. Criterios de aceptación por entrega
- Cada módulo con CRUD + filtros + auditoría + tests básicos.
- Rendimiento: índices en `case_id`, `organization_id`, fecha; paginación API.
- Seguridad: verificación de `organization_id` en todas las consultas; control de acceso por rol.

## 14. Plan por partes (implementación)

- Parte 1: Resumen y estructura base
  - Página `cases/[id]` con pestañas: Resumen, Partes, Colaboradores, Plazos, Audiencias, Documentos, Tareas, Actuaciones, Notas.
  - Endpoint `GET /cases/:id/summary`: próximos plazos/audiencias, últimos docs/actuaciones, KPIs.
  - Relaciones entre casos: vinculados/acumulados y filtros (1b).

- Parte 2: Partes y Colaboradores
  - Modelos/API: `case_parties`, `case_assignments` (roles, fechas).
  - UI para alta/edición/eliminación y roles.

- Parte 3: Actuaciones y Notas
  - Modelos/API: `actions`, `notes`.
  - Timeline unificado (actuaciones + notas).

- Parte 4: Tareas del caso
  - Modelo/API: `tasks` (asignado, prioridad, vencimiento) + Kanban básico.

- Parte 5: Documentos (mejoras)
  - Subida multipart, previsualización, visibilidad (interno/cliente), etiquetas.
  - Firma digital (5b): flujo de firma y auditoría.

- Parte 6: Plazos y Audiencias integrados
  - Alta rápida desde pestaña del caso; recordatorios.
  - Integración de calendario bidireccional (6b).

- Parte 7: Búsquedas y filtros
  - Búsqueda por expediente/título/estado/responsable/etiquetas; paginación server‑side.

- Parte 8: Permisos y auditoría
  - ABAC por caso/documento; `audit_logs` y exportación.
  - Portal cliente (8b): lectura segura de estado y docs compartidos.

- Parte 9: Finanzas y tiempo
  - Tiempos, gastos, resumen de rentabilidad por caso.

- Parte 10: Automatización
  - Plantillas por tipo de proceso; alertas de riesgo.

### Hitos y aceptación por parte
- Cada parte entrega UI + API documentada (Swagger) + tests básicos.
- Seguridad y performance verificadas (RLS/app-level, índices y paginación).
