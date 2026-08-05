/**
 * dashboard.types.ts
 *
 * Pure TypeScript types for all portfolio dashboard entities.
 * These mirror the Drizzle DB schemas but are decoupled from the ORM
 * so they can be safely imported in client-side stores and components.
 */

// ─── Shared Enums ────────────────────────────────────────────────────────────

export type IconPlatform = "react-icons" | "lucide";

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Database"
  | "Programming"
  | "Tools";

export type SocialLinkContext = "header" | "footer" | "contact";

export type CloudinaryFolder = "images" | "pdfs";

export type CloudinaryResourceType = "image" | "raw" | "video";

// ─── User ─────────────────────────────────────────────────────────────────────

export interface DUser {
  id: string;
  name: string;
  email: string;
  /** Password is never sent to the client — omitted from fetch responses */
  createdAt: string;
  updatedAt: string;
}

// ─── Asset File ───────────────────────────────────────────────────────────────

export interface DAssetFile {
  id: string;
  cloudinaryPublicId: string;
  folder: CloudinaryFolder;
  url: string;
  resourceType: CloudinaryResourceType;
  format: string;
  bytes: number;
  width: number | null;
  height: number | null;
  checksum: string;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Asset ────────────────────────────────────────────────────────────────────

export interface DAsset {
  id: string;
  name: string;
  assetFileId: string;
  usedIn: string | null;
  /** Joined asset file — populated when fetched with relation */
  assetFile?: DAssetFile;
}

// ─── Profile Image ────────────────────────────────────────────────────────────

export interface DProfileImage {
  id: string;
  assetId: string;
  label: string;
  isActive: boolean;
  createdAt: string;
  asset?: DAsset;
}

// ─── Resume ───────────────────────────────────────────────────────────────────

export interface DResume {
  id: string;
  assetId: string;
  label: string;
  isActive: boolean;
  createdAt: string;
  asset?: DAsset;
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface DProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  tech: string[];
  liveUrl: string | null;
  githubUrl: string;
  category: string;
  timeline: string | null;
  features: string[] | null;
  challenges: string[] | null;
  learnings: string[] | null;
  loginEmail: string | null;
  loginPassword: string | null;
  warningMessage: string | null;
  thumbnailAssetId: string | null;
  fullscreenAssetId: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  /** Joined relations — populated when fetched */
  thumbnailAsset?: DAsset;
  fullscreenAsset?: DAsset;
}

// ─── Skill ────────────────────────────────────────────────────────────────────

export interface DSkill {
  id: string;
  name: string;
  category: SkillCategory;
  iconName: string;
  iconPlatform: IconPlatform;
  sortOrder: number;
}

// ─── Experience ───────────────────────────────────────────────────────────────

export interface DExperience {
  id: string;
  role: string;
  org: string | null;
  period: string;
  description: string;
  points: string[];
  iconName: string;
  iconPlatform: IconPlatform;
  sortOrder: number;
}

// ─── Social Link ──────────────────────────────────────────────────────────────

export interface DSocialLink {
  id: string;
  name: string;
  href: string;
  iconName: string;
  iconPlatform: IconPlatform;
  context: SocialLinkContext;
  sortOrder: number;
}

// ─── Site Config ──────────────────────────────────────────────────────────────

export interface DSiteConfig {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
}

// ─── Counter ──────────────────────────────────────────────────────────────────

export interface DCounter {
  id: string;
  label: string;
  value: number;
  iconName: string;
  iconPlatform: IconPlatform;
  sortOrder: number;
}

// ─── Form input types (Omit server-generated fields) ─────────────────────────

export type DProjectInput = Omit<DProject, "id" | "createdAt" | "updatedAt" | "thumbnailAsset" | "fullscreenAsset">;
export type DSkillInput = Omit<DSkill, "id">;
export type DExperienceInput = Omit<DExperience, "id">;
export type DSocialLinkInput = Omit<DSocialLink, "id">;
export type DSiteConfigInput = Pick<DSiteConfig, "key" | "value">;
export type DCounterInput = Omit<DCounter, "id">;

// ─── API Response wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
