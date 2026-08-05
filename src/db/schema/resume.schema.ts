import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { asset } from "./asset.schema";

/**
 * resume — stores multiple resume PDF versions uploaded to Cloudinary.
 *
 * Only ONE row should have `is_active = true` at any time.
 * The UI always serves the row where `is_active = true` as the download link.
 *
 * Cloudinary path: sadiqul-islam-shakib/pdfs/...
 * (asset_file.folder = "pdfs", resource_type = "raw")
 *
 * Workflow:
 *   1. Upload PDF → creates asset_file + asset row (folder: "pdfs")
 *   2. Insert resume row referencing that asset, is_active: false
 *   3. When activating: set all rows is_active = false, then set chosen row is_active = true
 *
 * asset.used_in should be set to "resume" for clarity.
 */
export const resume = pgTable("resume", {
  id: uuid("id").primaryKey().defaultRandom(),

  /** FK to the asset that holds the Cloudinary PDF reference */
  assetId: uuid("asset_id")
    .notNull()
    .references(() => asset.id, { onDelete: "cascade" }),

  /** Human-readable label, e.g. "Resume 2026 v2 – Full Stack" */
  label: text("label").notNull(),

  /** Only one resume should be active (served to visitors) at a time */
  isActive: boolean("is_active").notNull().default(false),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Resume = typeof resume.$inferSelect;
export type NewResume = typeof resume.$inferInsert;
