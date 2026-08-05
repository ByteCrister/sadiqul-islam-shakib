/**
 * Barrel export for all Drizzle ORM schemas.
 *
 * Import order matters for enum re-use:
 *   1. asset-file  — defines cloudinaryFolderEnum, cloudinaryResourceTypeEnum
 *   2. asset       — references asset_file
 *   3. skill       — defines iconPlatformEnum, skillCategoryEnum (shared by others)
 *   4. experience, counter, social-link — use iconPlatformEnum
 *   5. site-config — simple key-value (user_name, nav_words, hero_words)
 *   6. profile-image, resume — reference asset; active/inactive pattern
 *   7. project     — references asset
 *   8. project-image — references project + asset
 *
 * NOTE: nav_item is NOT exported — nav items are hardcoded in
 *   src/utils/params/parameter.header.ts and require no DB table.
 */

// Asset system
export * from "./asset-file.schema";
export * from "./asset.schema";

// Shared enums + skills
export * from "./skill.schema";

// About section
export * from "./experience.schema";
export * from "./counter.schema";

// Social links
export * from "./social-link.schema";

// Global site config (text key-values only)
export * from "./site-config.schema";

// Profile & resume — Cloudinary assets with active/inactive flag
export * from "./profile-image.schema";
export * from "./resume.schema";

// Projects
export * from "./project.schema";
export * from "./project-image.schema";

// User (Admin)
export * from "./user.schema";
