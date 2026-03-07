# DeliveryFlow

![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![Express](https://img.shields.io/badge/Express-Backend-black)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)

# Delivery PM Tool

Backend-first MVP for software delivery tracking with GitHub-linked visibility.

## Monorepo structure

- `apps/web` — Next.js frontend shell
- `apps/api` — Express API
- `packages/db` — shared database package placeholder
- `packages/shared` — shared package placeholder

## Day 1 status

- Monorepo workspace ready
- Web shell ready
- API foundation ready
- Health check ready
- Root JSON route ready
- 404 JSON handler ready
- Global error handler ready

## Commands

```bash
pnpm dev:web
pnpm dev:api
pnpm build:web
pnpm build:api
```
