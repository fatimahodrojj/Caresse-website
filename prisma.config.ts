import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma CLI settings (migrations, generate). The app itself connects in
// lib/db.ts. Migrations use the direct (unpooled) Neon connection.
// process.env is read directly so `prisma generate` also works without a
// database configured (e.g. on a fresh install).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL_UNPOOLED,
  },
});
