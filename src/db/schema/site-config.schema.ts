import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * site_config — key-value store for simple text/JSON global settings.
 *
 * Scope: text-only global settings that don't warrant a full table.
 * Profile images and resumes have their own dedicated tables
 * (profile_image, resume) with proper Cloudinary asset relations.
 *
 * Keys in use:
 *   "user_name"   → "Sadiqul Islam Shakib"
 *   "nav_words"   → JSON: ["Sadiqul Islam Shakib", "Full Stack Developer", ...]
 *   "hero_words"  → JSON: ["modern, scalable apps with React.", ...]
 *
 * value is always stored as text — parse JSON where needed.
 */
export const siteConfig = pgTable("site_config", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type SiteConfig = typeof siteConfig.$inferSelect;
export type NewSiteConfig = typeof siteConfig.$inferInsert;
