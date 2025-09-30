# Portfolio Backend

TypeScript + Express backend for a personal portfolio site with Prisma (Postgres), Supabase connectivity check, Cloudinary uploads, and JWT auth.

## Features

- TypeScript + Express
- Prisma ORM (PostgreSQL)
- JWT auth with httpOnly cookies
- Role-based access control (ADMIN vs USER)
- Cloudinary image uploads
- Modular routes: Users, Posts, Projects

## Getting Started

Install dependencies:

```bash
npm install
```

Create `.env` and fill values:

```bash
PORT=5000

# Database (Supabase Postgres or any Postgres)
DATABASE_URL=
DIRECT_URL=

# Supabase (for health check only)
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# JWT
JWT_SECRET=change_me
# Seconds; e.g., 86400 = 1 day
JWT_EXPIRES_IN=86400

# Admin seeding
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme
ADMIN_NAME=Admin
```

Run migrations and generate client:

```bash
npx prisma migrate dev
npx prisma generate
```

Start dev server:

```bash
npm run dev
```

Supabase health check:

```bash
curl http://localhost:5000/api/v1/health/supabase
```

## API Overview

Base URL: `http://localhost:5000/api/v1`

Auth

- POST `/auth/login` → Sets httpOnly cookie `token` on success
  - Body: `{ "email": string, "password": string }`

Users

- GET `/user` → List users
- GET `/user/:id` → Get user by id
- POST `/user` → Create user
- PATCH `/user/:id` → Update user
- DELETE `/user/:id` → Delete user

Posts

- POST `/post` (ADMIN, multipart) → Create post. Fields: `title`, `content`, optional `tags[]`, optional `thumbnail` (file)
- GET `/post` → List posts
- GET `/post/:id` → Get post
- PATCH `/post/:id` (ADMIN) → Update post (can extend to accept new file)
- DELETE `/post/:id` (ADMIN) → Delete post

Projects

- POST `/project` (ADMIN, multipart) → Create project. Fields: `project_title`, `desc`, `tech_used[]`, `key_features[]`, optional `git_url`, `live_url`, optional `thumbnail` (file)
- GET `/project` → List projects
- GET `/project/:id` → Get project
- PATCH `/project/:id` (ADMIN) → Update project
- DELETE `/project/:id` (ADMIN) → Delete project

## Notes

- Tokens are stored as httpOnly cookies. Include the cookie in subsequent requests.
- Image uploads are handled inside create routes. The server uploads to Cloudinary and stores the returned URL.
- Ensure your DB schema is migrated and Prisma Client regenerated after any schema change.

Run the development server:

```bash
# using npm
npm run dev

# using yarn
yarn dev

# using pnpm
pnpm dev
```

---

## Folder Structure

```
Prisma-Blog/
│── node_modules/          # Dependencies
│── src/
│   ├── app.ts             # Express app configuration
│   ├── server.ts          # Server entry point
│   ├── config/            # Environment & configuration files
│   └── modules/           # Application modules (posts, users, etc.)
│── package.json           # Project metadata & scripts
│── pnpm-lock.yaml         # Lockfile (pnpm)
│── tsconfig.json          # TypeScript configuration
│── README.md              # Documentation
```

---

## Scripts

```bash
# Run in development mode
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start
```

---

## Learning Objective

This starter pack is part of the **Next Level Web Development Bootcamp** curriculum.
By using this project, students will learn how to:

- Connect a Node.js app with Prisma ORM
- Build modular APIs
- Manage environment variables
- Structure scalable backend projects
