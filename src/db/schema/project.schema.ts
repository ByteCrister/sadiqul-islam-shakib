import {
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { asset } from "./asset.schema";

/**
 * project — maps to `projects` array in parameter.projects.ts
 *
 * Images (thumbnail / fullscreen / gallery) are stored as asset IDs.
 * This means:
 *   - The same Cloudinary image can be reused across projects.
 *   - To update a project image, update the `asset` → `asset_file` row,
 *     and all projects referencing that asset automatically get the new URL.
 *
 * tech / features / challenges / learnings are JSONB string arrays.
 *
 * loginCredentials from the original interface → split into
 *   login_email + login_password columns (nullable).
 */
export const project = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),

  tech: jsonb("tech").$type<string[]>().notNull().default([]),

  liveUrl: text("live_url"),
  githubUrl: text("github_url").notNull(),
  category: text("category").notNull(),
  timeline: text("timeline"),

  features: jsonb("features").$type<string[]>(),
  challenges: jsonb("challenges").$type<string[]>(),
  learnings: jsonb("learnings").$type<string[]>(),

  // Optional demo credentials
  loginEmail: text("login_email"),
  loginPassword: text("login_password"),
  warningMessage: text("warning_message"),

  // Asset references — FK to asset.id (nullable)
  thumbnailAssetId: uuid("thumbnail_asset_id").references(() => asset.id, {
    onDelete: "set null",
  }),
  fullscreenAssetId: uuid("fullscreen_asset_id").references(() => asset.id, {
    onDelete: "set null",
  }),

  sortOrder: integer("sort_order").notNull().default(0),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;
