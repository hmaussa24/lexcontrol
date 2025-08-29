# Plan de Desarrollo Integral – LexControl

Este documento guía la construcción fase por fase del sistema de gestión de procesos judiciales para despachos, cubriendo backend (API), frontend (web), datos, seguridad, pagos (Wompi), despliegue (Railway) y calidad.

---

## 0) Objetivos y Alcance
- Centralizar procesos, plazos, actuaciones y documentos.
- Asegurar cumplimiento de plazos con recordatorios y calendario.
- Mejorar comunicación con clientes y coordinación del equipo.
- Habilitar suscripción con prueba gratuita de 30 días y cobro automático.

KPIs iniciales:
- % de plazos cumplidos a tiempo
- Duración promedio por tipo de proceso
- Retención (churn) y MRR

---

## 1) Arquitectura
- Monorepo (Turborepo)
  - `apps/api`: NestJS + Prisma (PostgreSQL en Supabase) + Supabase Storage + Wompi (pagos)
  - `apps/web`: Next.js (App Router) + Tailwind + React Query
- Datos: Supabase (DB + Storage)
- Autenticación: JWT email/clave (2FA y SSO en fases posteriores)
- Observabilidad: logs estructurados; métricas/trazas en fase 2/3
- Despliegue: Railway (API) y Vercel/Railway (Web)

---

## 2) Tecnologías
- API: NestJS 11, Prisma 6, TypeScript, Axios, Swagger
- Web: Next.js 14+, Tailwind, React Query, Zod
- DB: PostgreSQL (Supabase); Storage: Supabase Storage (buckets privados)
- Pagos: Wompi (tokenización tarjeta, payment source, cobros y webhook)
- CI/CD: GitHub Actions (fase 2)

---

## 3) Modelo de Datos (actual y ampliaciones)
- Actual: `Organization`, `User`, `Client`, `Case`, `Deadline`
- Billing: `PaymentMethod`, `Subscription` + campos en `Organization`
- Próximo: `Action`, `Document`, `DocumentVersion`, `Hearing`, `Reminder`, `Communication`, `Fee`, `TimeEntry`, `Expense`, `Invoice`, `Payment`

Claves/índices:
- Único `cases(organizationId, expedienteNumber)`
- Índices por `caseId` en plazos/actuaciones/documentos

---

## 4) Seguridad y Tenancy
- Multi-tenant por `organizationId` en todas las tablas
- RBAC básico (roles); ABAC por caso/documento más adelante
- HTTPS; no loggear PII; uso de `SUPABASE_SERVICE_ROLE_KEY` solo backend
- Storage mediante URLs firmadas y permisos por organización

---

## 5) Pagos y Suscripciones (Wompi)
Flujo:
1. Frontend (Wompi.js) → token de tarjeta
2. API: `GET /billing/acceptance-token` → `acceptance_token`
3. API: `POST /billing/payment-source` (token + acceptance) → guarda `PaymentMethod`
4. API: `POST /billing/start-trial` → crea `Subscription` en `TRIALING` (30 días)
5. Fase 2: cron al fin del trial → cobro al `PaymentMethod`
6. Webhook Wompi: actualiza `Subscription` (`ACTIVE`/`PAST_DUE`/`CANCELED`)

Variables API:
- `WOMPI_BASE_URL`, `WOMPI_PUBLIC_KEY`, `WOMPI_PRIVATE_KEY`
- `BILLING_SUCCESS_URL`, `BILLING_CANCEL_URL`

---

## 6) Frontend (Next.js)
Páginas iniciales:
- Landing marketing (hero, beneficios, features, pricing, CTA registro)
- Auth (login/registro)
- Dashboard (casos activos, plazos próximos)
- Casos (lista + detalle con pestañas: General, Plazos, Documentos, Audiencias)
- Calendario (plazos + audiencias)
- Billing (agregar tarjeta, estado de trial/suscripción)

Componentes base y estados de carga con React Query; validación con Zod.

---

## 7) Backend (NestJS)
Módulos:
- `AuthModule`: registro/login, JWT, guards por organización
- `OrganizationsModule`
- `CasesModule`, `DeadlinesModule`
- `DocumentsModule` (Storage + versionado)
- `HearingsModule`
- `BillingModule` (Wompi + cron cobros + webhook)
- `NotificationsModule` (recordatorios/email)

Endpoints mínimos:
- `/cases`, `/deadlines`, `/billing/*`, `/health`, `/auth/*` (fase 1.1)
- Swagger `/docs`

---

## 8) Roadmap por Fases

### Fase 1 – MVP (4–6 semanas)
1.1 Fundacional
- API: Auth (registro/login, JWT), Swagger
- Web: páginas de Auth y layout
- DevOps: Railway con variables, despliegue base API

1.2 Casos y Plazos
- API: CRUD Casos y Plazos (validaciones)
- Web: Listado y detalle de casos; gestión de plazos

1.3 Documentos y Audiencias
- API: subida a Storage (URLs firmadas), metadatos, versionado simple
- API: CRUD Audiencias
- Web: pestañas Documentos/Audiencias

1.4 Billing (Trial + Método de pago)
- API: `acceptance-token`, `payment-source`, `start-trial`
- Web: Pantalla Billing (agregar tarjeta y ver trial)

Criterio aceptación F1: flujo completo de gestión de casos + trial activo.

### Fase 2 – Productización (4–6 semanas)
- Recordatorios (jobs) y notificaciones por email
- Webhook Wompi + cobro al fin del trial y renovaciones
- Búsqueda y métricas en dashboard
- CI/CD con GitHub Actions

### Fase 3 – Escalabilidad y Seguridad
- Roles/permisos avanzados (ABAC)
- Observabilidad (trazas + métricas)
- Hardening (rate limit, CSP, CORS estricto)

### Fase 4 – Integraciones externas
- Calendarios (Google/Microsoft), correo, WhatsApp Business
- Portales judiciales / e-filing según país

---

## 9) Entornos, Variables y Despliegue
- API (Railway):
  - Build: `npm ci && npm run build && npx prisma generate`
  - Start: `npx prisma migrate deploy && npm run start:prod`
- Variables API (resumen):
  - Supabase: `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT`
  - Wompi: `WOMPI_BASE_URL`, `WOMPI_PUBLIC_KEY`, `WOMPI_PRIVATE_KEY`
  - App: `BILLING_SUCCESS_URL`, `BILLING_CANCEL_URL`
- Web: `NEXT_PUBLIC_API_URL` y claves públicas necesarias

---

## 10) Calidad y Pruebas
- Unitarias (servicios), integración (repos/DB), e2e (flujos críticos)
- Mock de Wompi en unitarias; sandbox en integración
- Lint + typecheck en CI

---

## 11) Backlog inmediato
- Web: Landing completa (hero, features, pricing, CTA)
- Web: Pantalla Billing (Wompi flow)
- API: AuthModule
- API: DocumentsModule (Storage)
- API: Webhook Wompi + cron cobro fin trial
- DevOps: CI/CD

---

Nota: Este plan se irá refinando por sprint, manteniendo este archivo como fuente de verdad.
