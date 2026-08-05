import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { asset } from "./asset.schema";

/**
 * profile_image — stores multiple profile photos uploaded to Cloudinary.
 *
 * Only ONE row should have `is_active = true` at any time.
 * The UI always fetches the row where `is_active = true`.
 *
 * Cloudinary path: sadiqul-islam-shakib/images/...
 *
 * Workflow:
 *   1. Upload image → creates asset_file + asset row (folder: "images")
 *   2. Insert profile_image row referencing that asset, is_active: false
 *   3. When activating: set all rows is_active = false, then set chosen row is_active = true
 *
 * asset.used_in should be set to "profile" for clarity.
 */
export const profileImage = pgTable("profile_image", {
  id: uuid("id").primaryKey().defaultRandom(),

  /** FK to the asset that holds the Cloudinary image reference */
  assetId: uuid("asset_id")
    .notNull()
    .references(() => asset.id, { onDelete: "cascade" }),

  /** Human-readable label, e.g. "Professional Photo 2026" */
  label: text("label").notNull(),

  /** Only one profile image should be active at a time */
  isActive: boolean("is_active").notNull().default(false),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ProfileImage = typeof profileImage.$inferSelect;
export type NewProfileImage = typeof profileImage.$inferInsert;
