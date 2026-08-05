/**
 * shared.validation.ts
 *
 * Shared enum tuples used by multiple Zod schemas.
 * These must match the pgEnum values in the DB schemas exactly.
 */

export const ICON_PLATFORMS = ["react-icons", "lucide"] as const;
export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "Programming",
  "Tools",
] as const;
export const SOCIAL_LINK_CONTEXTS = ["header", "footer", "contact"] as const;
export const CLOUDINARY_FOLDERS = ["images", "pdfs"] as const;
export const CLOUDINARY_RESOURCE_TYPES = ["image", "raw", "video"] as const;
