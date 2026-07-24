FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
COPY packages ./packages
COPY apps/web ./apps/web
COPY apps/api/prisma ./apps/api/prisma
RUN npm install
RUN cd apps/api && npx prisma generate
RUN npm run build --workspace=@educariera/web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/web ./apps/web

EXPOSE 3000
CMD ["npm", "run", "start", "--workspace=@educariera/web"]
