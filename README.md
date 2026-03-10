# DeliveryFlow

![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![Express](https://img.shields.io/badge/Express-Backend-black)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)

# Delivery PM Tool

Backend-first MVP for software delivery tracking with GitHub-linked visibility, built as a pnpm monorepo.

## Monorepo structure

- `apps/web` — Next.js frontend shell
- `apps/api` — Express API with standardized responses, validation, and error handling
- `packages/db` — shared Prisma + PostgreSQL package (schema, migrations, generated client)
- `packages/shared` — shared package placeholder

## status

- Monorepo workspace ready
- Web shell ready
- API foundation ready
- Health and root JSON routes ready
- API version route (`/api/v1`) ready
- Request ID and request logger middleware ready
- Request validation and global error handling ready
- Prisma database package and initial migration ready
- Project routes ready:
  - `GET /api/v1/projects` (supports optional `?limit=...`, max `100`)
  - `GET /api/v1/projects/:projectId`
  - `POST /api/v1/projects`
  - `PATCH /api/v1/projects/:projectId`
  - `DELETE /api/v1/projects/:projectId`
- Task routes ready:
  - `GET /api/v1/projects/:projectId/tasks`
  - `GET /api/v1/projects/:projectId/tasks/:taskId`
  - `POST /api/v1/projects/:projectId/tasks`
  - Error contracts: `PROJECT_NOT_FOUND`, `TASK_NOT_FOUND`, `TASK_CODE_ALREADY_EXISTS`
- DB scripts, project-flow script, task runtime script, and API HTTP tests ready

## Commands

```bash
pnpm dev:web
pnpm dev:api
pnpm build:web
pnpm build:api
pnpm lint:web
pnpm --dir packages/db generate
pnpm --dir packages/db build
pnpm --dir apps/api test:db
pnpm --dir apps/api test:project-flow
pnpm --dir apps/api test
pnpm --dir apps/api test:project-http
pnpm --dir apps/api test:watch
```
