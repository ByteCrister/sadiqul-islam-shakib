import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { project, asset, assetFile, projectImage } from "@/db/schema";
import type {
  DProject,
  DAsset,
  DAssetFile,
  CloudinaryFolder,
  CloudinaryResourceType,
} from "@/types/dashboard.types";

// ─── Helpers (mirrors logic in /api/v1/projects/[id]/route.ts) ────────────────

function toAssetFile(row: typeof assetFile.$inferSelect): DAssetFile {
  return {
    id: row.id,
    cloudinaryPublicId: row.cloudinaryPublicId,
    folder: row.folder as CloudinaryFolder,
    url: row.url,
    resourceType: row.resourceType as CloudinaryResourceType,
    format: row.format,
    bytes: row.bytes,
    width: row.width,
    height: row.height,
    checksum: row.checksum,
    altText: row.altText,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toProject(row: typeof project.$inferSelect): DProject {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    tech: (row.tech as string[]) ?? [],
    liveUrl: row.liveUrl,
    githubUrl: row.githubUrl,
    category: row.category,
    timeline: row.timeline,
    features: (row.features as string[] | null) ?? null,
    challenges: (row.challenges as string[] | null) ?? null,
    learnings: (row.learnings as string[] | null) ?? null,
    loginEmail: row.loginEmail,
    loginPassword: row.loginPassword,
    warningMessage: row.warningMessage,
    thumbnailAssetId: row.thumbnailAssetId,
    fullscreenAssetId: row.fullscreenAssetId,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** Fetch a single project row and join its thumbnail + fullscreen assets. */
async function fetchProjectWithAssets(projectId: string): Promise<DProject | null> {
  const [row] = await db
    .select()
    .from(project)
    .where(eq(project.id, projectId))
    .limit(1);

  if (!row) return null;

  const base = toProject(row);

  // Join thumbnail asset
  if (row.thumbnailAssetId) {
    const [a] = await db.select().from(asset).where(eq(asset.id, row.thumbnailAssetId)).limit(1);
    if (a) {
      const [af] = await db.select().from(assetFile).where(eq(assetFile.id, a.assetFileId)).limit(1);
      const joinedAsset: DAsset = {
        id: a.id,
        name: a.name,
        assetFileId: a.assetFileId,
        usedIn: a.usedIn,
        assetFile: af ? toAssetFile(af) : undefined,
      };
      base.thumbnailAsset = joinedAsset;
    }
  }

  // Join fullscreen asset
  if (row.fullscreenAssetId) {
    const [a] = await db.select().from(asset).where(eq(asset.id, row.fullscreenAssetId)).limit(1);
    if (a) {
      const [af] = await db.select().from(assetFile).where(eq(assetFile.id, a.assetFileId)).limit(1);
      const joinedAsset: DAsset = {
        id: a.id,
        name: a.name,
        assetFileId: a.assetFileId,
        usedIn: a.usedIn,
        assetFile: af ? toAssetFile(af) : undefined,
      };
      base.fullscreenAsset = joinedAsset;
    }
  }

  return base;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Fetch all projects ordered by sortOrder, with joined assets. */
export async function getProjects(): Promise<DProject[]> {
  try {
    const rows = await db
      .select({ id: project.id })
      .from(project)
      .orderBy(asc(project.sortOrder));

    const projects = await Promise.all(rows.map((r) => fetchProjectWithAssets(r.id)));
    return projects.filter((p): p is DProject => p !== null);
  } catch (error) {
    console.error("[projects.handler] getProjects error:", error);
    return [];
  }
}

/** Find a single project by its slug. */
export async function getProjectBySlug(slug: string): Promise<DProject | null> {
  try {
    const [row] = await db
      .select({ id: project.id })
      .from(project)
      .where(eq(project.slug, slug))
      .limit(1);

    if (!row) return null;
    return fetchProjectWithAssets(row.id);
  } catch (error) {
    console.error("[projects.handler] getProjectBySlug error:", error);
    return null;
  }
}

/** Fetch the gallery images for a specific project. */
export async function getProjectGallery(projectId: string) {
  try {
    const rows = await db
      .select()
      .from(projectImage)
      .leftJoin(asset, eq(projectImage.assetId, asset.id))
      .leftJoin(assetFile, eq(asset.assetFileId, assetFile.id))
      .where(eq(projectImage.projectId, projectId))
      .orderBy(asc(projectImage.sortOrder));

    return rows.map((row) => ({
      id: row.project_image.id,
      projectId: row.project_image.projectId,
      assetId: row.project_image.assetId,
      sortOrder: row.project_image.sortOrder,
      asset: row.asset
        ? {
            id: row.asset.id,
            name: row.asset.name,
            usedIn: row.asset.usedIn,
            assetFile: row.asset_file
              ? {
                  id: row.asset_file.id,
                  url: row.asset_file.url,
                  format: row.asset_file.format,
                  bytes: row.asset_file.bytes,
                  width: row.asset_file.width,
                  height: row.asset_file.height,
                }
              : null,
          }
        : null,
    }));
  } catch (error) {
    console.error("[projects.handler] getProjectGallery error:", error);
    return [];
  }
}
