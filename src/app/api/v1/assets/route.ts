import { db } from "@/db";
import { asset, assetFile } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { DAsset, DAssetFile, CloudinaryFolder, CloudinaryResourceType } from "@/types/dashboard.types";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, serverError } from "@/app/api/lib/api-helpers";

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

// ── GET /api/v1/assets ────────────────────────────────────────────────────────
// Returns all assets with their joined assetFile relation.

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const rows = await db
      .select()
      .from(asset)
      .leftJoin(assetFile, eq(asset.assetFileId, assetFile.id));

    const result: DAsset[] = rows.map(({ asset: a, asset_file: af }) => ({
      id: a.id,
      name: a.name,
      assetFileId: a.assetFileId,
      usedIn: a.usedIn,
      assetFile: af ? toAssetFile(af) : undefined,
    }));

    return ok<DAsset[]>(result);
  } catch (err) {
    return serverError(err);
  }
}
