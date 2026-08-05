import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

import { env } from "../config/env";

/**
 * Neon serverless HTTP client — optimal for Next.js serverless/edge functions.
 *
 * Uses the HTTP transport (neon-http) which works correctly in:
 *   - Next.js App Router API routes
 *   - Server Components
 *   - Edge Runtime
 *
 * (Note: fetchConnectionCache is enabled by default in newer @neondatabase/serverless versions)
 *
 * The `schema` import enables Drizzle's relational query API (db.query.*).
 */

const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });

export type DB = typeof db;
