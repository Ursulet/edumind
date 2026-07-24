# ADR-001: Monorepo Architecture & Modular Monolith

## Status
Accepted

## Context
EduCarieră requires a flexible, multi-app system managing public funnel, parent portal, psychologist workspace, director workspace, and control center.

## Decision
We adopt a **Monorepo** using npm workspaces (`apps/*`, `packages/*`):
- `apps/web`: Next.js 16 App Router for frontend UI
- `apps/api`: NestJS 11 REST API with `/api/v1` prefix
- `apps/worker`: Node.js background process for async domain events & notifications
- Shared `packages/` for `types`, `ui`, `validation`, `api-client`, `config`, `eslint-config`, `tsconfig`.

Domain logic will be structured as a **Modular Monolith** to prevent premature complexity of microservices while ensuring clear separation of boundaries.

## Consequences
- Single repository for atomic updates across UI, API, and domain types.
- Strict enforcement of backend authorization & zero direct client database access.
