FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
COPY packages ./packages
COPY apps ./apps
RUN rm -f package-lock.json && npm install
RUN npm run build --workspace=@edumind/worker

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/worker ./apps/worker

CMD ["node", "apps/worker/dist/index.js"]
