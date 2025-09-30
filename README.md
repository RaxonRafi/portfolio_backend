# Next Blog Starter

A simple **Blog Application Starter Pack** built with **TypeScript, Express.js**.  
This project is designed for the **Next Level Web Development Bootcamp** to help learners practice Prisma hands-on by building a blog platform.

---

## Features

- TypeScript + Express.js setup
- Modular project structure
- Environment configuration with `dotenv`
- Ready to extend with blog modules (Posts, Users, etc.)

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Apollo-Level2-Web-Dev/next-blog-starter.git
cd next-blog-starter
```

Install dependencies:

```bash
# using npm
npm install

# using yarn
yarn install

# using pnpm
pnpm install
```

Setup environment variables:

```bash
cp .env.example .env
```

### Supabase configuration

Add the following to your `.env` file (create it if missing):

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000
```

Then start the server and verify the health endpoint:

```bash
npm run dev
# in another terminal
curl http://localhost:5000/api/v1/health/supabase
```

If you have not created any table yet, the health endpoint still returns `{ ok: true }` as a connectivity check. For real queries, create a table in Supabase and adjust the code accordingly.

### Cloudinary configuration

Add to `.env`:

```bash
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Upload endpoint (returns URL to store in `thumbnail`):

```bash
curl -F "file=@ ./path/to/image.jpg" http://localhost:5000/api/v1/project/upload/thumbnail
```

### JWT auth

Add to `.env`:

```bash
JWT_SECRET=change_me
JWT_EXPIRES_IN=1d
```

Login:

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"plaintext"}'
```

### Admin seed

On server start, an ADMIN user is created if missing. Set in `.env`:

```bash
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme
ADMIN_NAME=Admin
```

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
