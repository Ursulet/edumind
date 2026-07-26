# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json tsconfig.json ./
COPY packages ./packages
COPY apps ./apps

RUN npm install
RUN npm install lightningcss-linux-x64-musl@1.32.0 @tailwindcss/oxide-linux-x64-musl@4.3.3 --no-save
RUN cd apps/api && npx prisma generate
RUN npm run build --workspace=@edumind/web

# ---- Runner Stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/web ./apps/web
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=@edumind/web"]
