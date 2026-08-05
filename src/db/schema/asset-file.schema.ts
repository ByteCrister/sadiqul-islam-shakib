import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// Cloudinary folder enum — maps to the actual Cloudinary folder paths
export const cloudinaryFolderEnum = pgEnum("cloudinary_folder", [
  "images",
  "pdfs",
]);

// Cloudinary resource type enum
export const cloudinaryResourceTypeEnum = pgEnum("cloudinary_resource_type", [
  "image",
  "raw",
  "video",
]);

/**
 * asset_file — the canonical physical file record.
 *
 * One row = one actual file upload to Cloudinary.
 * The `checksum` (SHA-256) enables deduplication: before uploading, check if
 * a file with the same checksum already exists and reuse it instead.
 *
 * Multiple `asset` rows can reference the same `asset_file`, enabling
 * the same physical file to be reused in multiple contexts (projects,
 * hero, about, etc.) without redundant uploads.
 */
export const assetFile = pgTable("asset_file", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Cloudinary identifiers
  cloudinaryPublicId: text("cloudinary_public_id").notNull().unique(),
  folder: cloudinaryFolderEnum("folder").notNull(),

  // Delivery URL
  url: text("url").notNull(),

  // Cloudinary metadata
  resourceType: cloudinaryResourceTypeEnum("resource_type")
    .notNull()
    .default("image"),
  format: text("format").notNull(), // e.g. "jpg", "png", "pdf"
  bytes: integer("bytes").notNull(), // file size in bytes

  // Image-specific (null for PDFs)
  width: integer("width"),
  height: integer("height"),

  // SHA-256 hex digest of the original file content — used for deduplication
  checksum: text("checksum").notNull().unique(),

  // Accessibility / UX
  altText: text("alt_text"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type AssetFile = typeof assetFile.$inferSelect;
export type NewAssetFile = typeof assetFile.$inferInsert;
