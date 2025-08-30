# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS builder
COPY package.json ./
# Si no hay package-lock.json, usa npm install
RUN npm install
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/dist ./dist
# Prisma schema para migraciones/generate en runtime
COPY --from=builder /app/prisma ./prisma
COPY package.json ./
RUN npm install --omit=dev
EXPOSE 3000
CMD ["node","dist/main.js"]


