import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Load .env.local for local development
config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required in .env.local");
}

export default defineConfig({
  /**
   * Schema files — Drizzle Kit will introspect all *.schema.ts files
   * inside src/db/schema/ to generate migrations and push changes.
   */
  schema: "./src/db/schema/*.schema.ts",

  /**
   * Output directory for SQL migration files.
   * Using `drizzle-kit push` for initial setup skips generating these,
   * but the directory is configured for when you switch to migrations.
   */
  out: "./drizzle/migrations",

  dialect: "postgresql",

  dbCredentials: {
    url: process.env.DATABASE_URL,
  },

  /**
   * Verbose logging — shows exactly which SQL is being applied.
   */
  verbose: true,
  strict: true,
});
