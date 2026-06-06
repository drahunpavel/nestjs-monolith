## Tech Stack

- **Node.js** 24
- **NestJS** 11
- **TypeScript** 5
- **PostgreSQL** + **Prisma** 7
- **MongoDB** + **Mongoose**
- **Redis** + ioredis
- **Elasticsearch** 9
- **MinIO** (S3-compatible storage) + AWS SDK
- **Stripe** (payments & webhooks)
- **Passport** (Local, JWT, Google OAuth)
- **Socket.IO** (WebSockets)
- **Swagger** (API docs)
- **Docker** & **Docker Compose**
- **Pino** (logging)
- **class-validator** / **class-transformer**

## Getting Started

```bash
npm install
docker compose up -d postgres redis elasticsearch mongo minio
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

- API: http://localhost:3000/api
- Swagger: http://localhost:3000/docs

## Docker

```bash
docker compose --env-file .env.production.local build
docker compose --env-file .env.production.local up -d
docker compose exec app npx prisma migrate deploy
```

Env files:
- `.env` — local development
- `.env.production.local` — Docker runtime

## Scripts

```bash
npm run start:dev    # development
npm run build        # build
npm run start:prod   # production
npm run test         # tests
```
