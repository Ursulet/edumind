# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json tsconfig.json ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN npm install
RUN cd apps/api && npx prisma generate
RUN npm run build --workspace=@educariera/api

# ---- Runner Stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api ./apps/api

EXPOSE 4000

# Run migrations + seed (tolerant) then start compiled JS directly
CMD ["sh", "-c", "cd apps/api && (npx prisma migrate deploy || true) && (npx prisma db seed || true) && node dist/src/main.js"]
