import { eq, count } from "drizzle-orm";
import { db } from "@/db";
import { asset, assetFile } from "@/db/schema";
import { removeAsset, type CloudinaryFolder } from "@/lib/cloudinary/cloudinary.lib";

/**
 * Retry a DB operation up to `maxAttempts` times on transient connection errors.
 */
async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3, delayMs = 1500): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      const isTransient =
        err?.message?.includes("Connect Timeout") ||
        err?.message?.includes("fetch failed") ||
        err?.code === "UND_ERR_CONNECT_TIMEOUT";

      if (!isTransient || attempt === maxAttempts) throw err;
      console.warn(`[DB] Transient error on attempt ${attempt}/${maxAttempts}, retrying in ${delayMs}ms…`, err.message);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

/**
 * Cascade-deletes an asset record and — if no other assets still reference
 * the same asset_file — also deletes the asset_file row and removes the
 * physical file from Cloudinary.
 *
 * Deletion chain:
 *   1. Delete `asset` row by assetId
 *   2. Count remaining `asset` rows that share the same `assetFileId`
 *   3. If 0 remain → delete `asset_file` row → call Cloudinary destroy
 */
export async function cascadeDeleteAsset(assetId: string): Promise<{
  deletedAssetId: string;
  deletedAssetFileId: string | null;
  cloudinaryRemoved: boolean;
}> {
  // 1. Load the asset to get its assetFileId
  const [existingAsset] = await withRetry(() =>
    db.select().from(asset).where(eq(asset.id, assetId)).limit(1)
  );

  if (!existingAsset) {
    return { deletedAssetId: assetId, deletedAssetFileId: null, cloudinaryRemoved: false };
  }

  // 2. Delete the logical asset record
  const [deleted] = await withRetry(() =>
    db.delete(asset).where(eq(asset.id, assetId)).returning()
  );

  if (!deleted) {
    return { deletedAssetId: assetId, deletedAssetFileId: null, cloudinaryRemoved: false };
  }

  // 3. Count remaining assets still referencing the same asset_file
  const [{ remaining }] = await withRetry(() =>
    db.select({ remaining: count() }).from(asset).where(eq(asset.assetFileId, deleted.assetFileId))
  );

  if (Number(remaining) > 0) {
    return { deletedAssetId: deleted.id, deletedAssetFileId: null, cloudinaryRemoved: false };
  }

  // 4. No other assets — delete the asset_file record
  const [deletedFile] = await withRetry(() =>
    db.delete(assetFile).where(eq(assetFile.id, deleted.assetFileId)).returning()
  );

  if (!deletedFile) {
    return { deletedAssetId: deleted.id, deletedAssetFileId: deleted.assetFileId, cloudinaryRemoved: false };
  }

  // 5. Remove physical file from Cloudinary
  try {
    await removeAsset(deletedFile.cloudinaryPublicId, deletedFile.folder as CloudinaryFolder);
  } catch {
    console.warn("[cascadeDeleteAsset] Cloudinary removal failed for:", deletedFile.cloudinaryPublicId);
  }

  return {
    deletedAssetId: deleted.id,
    deletedAssetFileId: deletedFile.id,
    cloudinaryRemoved: true,
  };
}
