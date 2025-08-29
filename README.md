# LexControl

Plataforma para gestión de procesos judiciales (monorepo con `apps/web` y `apps/api`).

## Requisitos
- Node.js 18+ (recomendado 20)
- npm
- Supabase (DB + Storage)
- Wompi (suscripciones)

## Arranque en local
1) Variables de entorno (API `apps/api/.env`)
   - `DATABASE_URL` (Pooler de Supabase; producción)
   - `DIRECT_URL` (Non‑pooler de Supabase; migraciones)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_ANON_KEY` (opcional en backend)
   - `PORT=3000`
   - `WOMPI_WOMPI_SECRET_KEY`
   - `WOMPI_WOMPI_WEBHOOK_SECRET` (para probar webhooks en local)
   - `WOMPI_WOMPI_PRICE_ID` (precio de suscripción)
   - `BILLING_SUCCESS_URL` y `BILLING_CANCEL_URL`

2) Instalar dependencias
```bash
npm install
```

3) Prisma
```bash
cd apps/api
npx prisma generate
# Primera migración (si ya tienes conexión a DB)
# crea y aplica las migraciones automáticamente
npx prisma migrate dev --name init
```

4) Levantar
```bash
# en paralelo (web + api)
npm run dev
# solo API
cd apps/api && npm run start:dev
# solo Web
cd apps/web && npm run dev
```

5) Salud API
- `GET http://localhost:3000/health`

## Despliegue en Railway (API)
1) Conecta el repo (Deploy from GitHub).
2) Service → Settings:
   - Root Directory: `apps/api`
   - Variables de entorno: mismas que en local.
   - Build Command:
```
npm ci && npm run build && npx prisma generate
```
   - Start Command:
```
npx prisma migrate deploy && npm run start:prod
```
3) Verifica logs y `GET /health`.

### Cron de cobros (suscripciones)
- Variables adicionales en el backend (`apps/api/.env`):
  - `CRON_SECRET` (una clave fuerte para proteger el cron)
  - `BILLING_AMOUNT_CENTS` (ej. `20000` para COP $200.00; ajusta a tu tarifa)
  - `BILLING_CURRENCY` (por defecto `COP`)
- Endpoint cron (protegido por `CRON_SECRET`):
  - `POST https://TU_API/billing/cron/run-due-charges?key=CRON_SECRET`
- Programación en Railway:
  1. Crea un "Scheduled Job" (o service) que ejecute diariamente.
  2. Comando sugerido (con curl):
     ```bash
     curl -X POST "${API_URL}/billing/cron/run-due-charges?key=${CRON_SECRET}"
     ```
  3. Asegura variables `API_URL` y `CRON_SECRET` en el Job.

## Suscripciones ( Wompi )
- Endpoints:
  - `POST /billing/checkout` → crea sesión de Checkout con trial de 30 días.
  - `POST /webhooks/stripe` → procesa eventos y actualiza la suscripción.
- Variables:
  - `WOMPI_WOMPI_SECRET_KEY`, `WOMPI_WOMPI_WEBHOOK_SECRET`, `WOMPI_WOMPI_PRICE_ID`
  - `BILLING_SUCCESS_URL`, `BILLING_CANCEL_URL`

## Estructura
- `apps/web`: Next.js (landing/marketing).
- `apps/api`: NestJS + Prisma (Supabase) + Supabase Storage +  Wompi .

## Notas
- No expongas claves. Usa variables en Railway.
- `SUPABASE_SERVICE_ROLE_KEY` solo backend (bypassa RLS).
