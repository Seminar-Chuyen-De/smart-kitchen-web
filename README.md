# Smart Kitchen Web

AI-powered cooking web app sử dụng Multi-Agent Architecture.

## Tech Stack
- **Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Clerk
- **AI Core**: Claude Sonnet 4.5
- **Vision**: Google Cloud Vision API

## Cấu trúc thư mục
```
app/          → Routing layer (siêu mỏng, 3-15 dòng/file)
Frontend/     → Components, Hooks, Styles, Contexts
Backend/      → Services, Schemas, Middleware, DB
AI/           → Agents, Prompts, Tools, Workflows
prisma/       → Schema & Migrations
```

## Quick Start

```bash
# 1. Cài dependencies
npm install

# 2. Copy env và điền thông tin
cp .env.example .env

# 3. Generate Prisma client
npm run db:generate

# 4. Chạy migration
npm run db:migrate

# 5. Seed dữ liệu mẫu
npm run db:seed

# 6. Chạy dev server
npm run dev
```

## Path Aliases
```ts
@/frontend/*  → ./Frontend/*
@/backend/*   → ./Backend/*
@/ai/*        → ./AI/*
@/prisma      → ./prisma/client
```
