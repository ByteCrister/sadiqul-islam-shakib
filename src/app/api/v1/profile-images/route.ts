import { db } from "@/db";
import { profileImage, asset, assetFile } from "@/db/schema";
import { eq } from "drizzle-orm";
import type {
  DProfileImage,
  DAsset,
  DAssetFile,
  CloudinaryFolder,
  CloudinaryResourceType,
} from "@/types/dashboard.types";
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

// ── GET /api/v1/profile-images ────────────────────────────────────────────────
// Returns all profile images with asset + assetFile joined.

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const rows = await db
      .select()
      .from(profileImage)
      .leftJoin(asset, eq(profileImage.assetId, asset.id))
      .leftJoin(assetFile, eq(asset.assetFileId, assetFile.id));

    const result: DProfileImage[] = rows.map(
      ({ profile_image: pi, asset: a, asset_file: af }) => {
        const joinedAsset: DAsset | undefined = a
          ? {
              id: a.id,
              name: a.name,
              assetFileId: a.assetFileId,
              usedIn: a.usedIn,
              assetFile: af ? toAssetFile(af) : undefined,
            }
          : undefined;

        return {
          id: pi.id,
          assetId: pi.assetId,
          label: pi.label,
          isActive: pi.isActive,
          createdAt: pi.createdAt.toISOString(),
          asset: joinedAsset,
        };
      }
    );

    return ok<DProfileImage[]>(result);
  } catch (err) {
    return serverError(err);
  }
}

// ── POST /api/v1/profile-images ───────────────────────────────────────────────

export async function POST(req: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body: { assetId: string; label: string } = await req.json();

    if (!body.assetId) return new Response("assetId is required", { status: 400 });
    if (!body.label) return new Response("label is required", { status: 400 });

    const [inserted] = await db
      .insert(profileImage)
      .values({
        assetId: body.assetId,
        label: body.label,
        isActive: false, // Default to inactive, let user activate it explicitly
      })
      .returning();

    // Re-fetch with asset joins to match GET response format
    const rows = await db
      .select()
      .from(profileImage)
      .where(eq(profileImage.id, inserted.id))
      .leftJoin(asset, eq(profileImage.assetId, asset.id))
      .leftJoin(assetFile, eq(asset.assetFileId, assetFile.id));

    const row = rows[0];
    const joinedAsset: DAsset | undefined = row.asset
      ? {
          id: row.asset.id,
          name: row.asset.name,
          assetFileId: row.asset.assetFileId,
          usedIn: row.asset.usedIn,
          assetFile: row.asset_file ? toAssetFile(row.asset_file) : undefined,
        }
      : undefined;

    const result: DProfileImage = {
      id: row.profile_image.id,
      assetId: row.profile_image.assetId,
      label: row.profile_image.label,
      isActive: row.profile_image.isActive,
      createdAt: row.profile_image.createdAt.toISOString(),
      asset: joinedAsset,
    };

    return ok<DProfileImage>(result, 201);
  } catch (err) {
    return serverError(err);
  }
}
