import {
  pgTable,
  uuid,
  text,
} from "drizzle-orm/pg-core";
import { assetFile } from "./asset-file.schema";

/**
 * asset — a named logical pointer to a physical `asset_file`.
 *
 * Design philosophy:
 *   - `asset_file` is the canonical physical record (one per Cloudinary upload).
 *   - `asset` is a lightweight named reference that can be reused anywhere.
 *
 * Why separate?
 *   - The same Cloudinary image can appear in multiple projects, the hero
 *     section, and the about page. Instead of storing the same URL N times,
 *     you create ONE `asset_file` and N `asset` rows (or fewer — a single
 *     asset can also be referenced by its UUID from multiple places).
 *
 * Example usage:
 *   asset { id: "abc", name: "Quantipixor OG Image", asset_file_id: "xyz", used_in: "projects" }
 *   project.thumbnail_asset_id = "abc"
 *   project.fullscreen_asset_id = "abc"  ← same asset, no duplicate upload
 *
 * used_in:
 *   A hint string for organisation (e.g. "projects", "hero", "about", "resume").
 *   Not enforced at DB level — purely informational.
 */
export const asset = pgTable("asset", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),              // human-readable label
  assetFileId: uuid("asset_file_id")
    .notNull()
    .references(() => assetFile.id, { onDelete: "restrict" }),
  usedIn: text("used_in"),                   // e.g. "projects", "hero"
});

export type Asset = typeof asset.$inferSelect;
export type NewAsset = typeof asset.$inferInsert;
