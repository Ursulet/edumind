# ðŸš€ Ghid Deployment Coolify â€” EduMind / EduCarierÄƒ

Platforma **EduMind (EduCarierÄƒ)** este 100% pregÄƒtitÄƒ pentru deployment automat Ã®n **Coolify**.

---

## ðŸ› ï¸ OpÈ›iunea 1: Deployment prin Docker Compose (RECOMANDAT PENTRU MONOREPO)

Aceasta este cea mai simplÄƒ metodÄƒ. Coolify va ridica automat stiva completÄƒ: PostgreSQL 16 + Redis 7 + API NestJS + Web Next.js + Worker Ã®ntr-un singur stack.

### PaÈ™i Ã®n Coolify:
1. ÃŽn Coolify Dashboard, apÄƒsaÈ›i pe **+ New Service**.
2. SelectaÈ›i **Docker Compose**.
3. ConectaÈ›i repository-ul GitHub: `https://github.com/Ursulet/edumind.git` (ramura `main`).
4. SelectaÈ›i fiÈ™ierul compose: `docker-compose.coolify.yml`.
5. SalvaÈ›i È™i apÄƒsaÈ›i pe **Deploy**.

Baza de date PostgreSQL 16 È™i migraÈ›iile Prisma (`npx prisma migrate deploy` & `npx prisma db seed`) se vor executa automat la pornirea containerului de API.

---

## ðŸ› ï¸ OpÈ›iunea 2: Deployment ca Servicii Separate Ã®n Coolify

DacÄƒ doriÈ›i servicii separate gestionate individual Ã®n Coolify:

### 1. Baza de Date PostgreSQL 16
- AdÄƒugaÈ›i o bazÄƒ de date **PostgreSQL 16** din Coolify.
- NotaÈ›i conexiunea: `postgresql://postgres:PAROLA@HOST:5432/educariera?schema=public`.

### 2. Redis 7
- AdÄƒugaÈ›i o instanÈ›Äƒ **Redis 7** din Coolify.
- NotaÈ›i conexiunea: `redis://HOST:6379`.

### 3. API NestJS (`apps/api`)
- Build Pack: **Dockerfile** (path: `apps/api/Dockerfile`) sau **Nixpacks** (base dir: `apps/api`).
- Port: `4000`.
- Variabile de mediu (Environment Variables):
  ```env
  DATABASE_URL=postgresql://postgres:PAROLA@HOST:5432/educariera?schema=public
  REDIS_URL=redis://HOST:6379
  JWT_SECRET=cheie-secreta-productie
  PORT=4000
  ```

### 4. Web Next.js (`apps/web`)
- Build Pack: **Dockerfile** (path: `apps/web/Dockerfile`) sau **Nixpacks** (base dir: `apps/web`).
- Port: `3000`.
- Variabile de mediu:
  ```env
  NEXT_PUBLIC_API_URL=https://domeniu-api.ro/api/v1
  DATABASE_URL=postgresql://postgres:PAROLA@HOST:5432/educariera?schema=public
  ```

### 5. Worker (`apps/worker`)
- Build Pack: **Dockerfile** (path: `apps/worker/Dockerfile`).
- Variabile de mediu:
  ```env
  DATABASE_URL=postgresql://postgres:PAROLA@HOST:5432/educariera?schema=public
  REDIS_URL=redis://HOST:6379
  SMTP_HOST=mail.domeniu.ro
  SMTP_PORT=587
  SMTP_USER=no-reply@domeniu.ro
  SMTP_PASS=parola-smtp
  ```

---

## ðŸ”‘ Chei de Verificare & SÄƒnÄƒtate ProducÈ›ie

- **Health Check Endpoint**: `GET https://domeniu-api.ro/api/v1/health` -> RÄƒspunde cu `{ "status": "ok" }`.
- **MigraÈ›ii & Seeding**:
  - Dintr-un terminal din containerul de API sau din interfaÈ›a Coolify, puteÈ›i rula oricÃ¢nd:
    ```bash
    npx prisma migrate deploy
    npx prisma db seed
    ```
- **Login Admin IniÈ›ial**:
  - Email: `owner@edumind.ro` sau utilizatorul creat prin seed.

