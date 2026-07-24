FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
COPY packages ./packages
COPY apps/api ./apps/api
RUN npm install
RUN cd apps/api && npx prisma generate
RUN npm run build --workspace=@educariera/api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api ./apps/api

EXPOSE 4000
CMD ["sh", "-c", "cd apps/api && npx prisma migrate deploy && npx prisma db seed && npm run start"]
