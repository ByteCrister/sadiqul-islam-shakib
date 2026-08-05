import { db } from "@/db";
import { resume, asset, assetFile } from "@/db/schema";
import { eq, not } from "drizzle-orm";
import type {
  DResume,
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

// ── GET /api/v1/resumes ───────────────────────────────────────────────────────
// Returns all resume rows with nested asset + assetFile relations joined.

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const rows = await db
      .select()
      .from(resume)
      .leftJoin(asset, eq(resume.assetId, asset.id))
      .leftJoin(assetFile, eq(asset.assetFileId, assetFile.id));

    const result: DResume[] = rows.map(
      ({ resume: r, asset: a, asset_file: af }) => {
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
          id: r.id,
          assetId: r.assetId,
          label: r.label,
          isActive: r.isActive,
          createdAt: r.createdAt.toISOString(),
          asset: joinedAsset,
        };
      }
    );

    return ok<DResume[]>(result);
  } catch (err) {
    return serverError(err);
  }
}

// ── POST /api/v1/resumes ──────────────────────────────────────────────────────

export async function POST(req: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body: { assetId: string; label: string } = await req.json();

    if (!body.assetId) return new Response("assetId is required", { status: 400 });
    if (!body.label) return new Response("label is required", { status: 400 });

    const [inserted] = await db
      .insert(resume)
      .values({
        assetId: body.assetId,
        label: body.label,
        isActive: true, // New upload is automatically set as the active resume
      })
      .returning();

    // Deactivate all other resumes now that the new one is active
    await db
      .update(resume)
      .set({ isActive: false })
      .where(not(eq(resume.id, inserted.id)));

    // Re-fetch with asset joins to match GET response format
    const rows = await db
      .select()
      .from(resume)
      .where(eq(resume.id, inserted.id))
      .leftJoin(asset, eq(resume.assetId, asset.id))
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

    const result: DResume = {
      id: row.resume.id,
      assetId: row.resume.assetId,
      label: row.resume.label,
      isActive: row.resume.isActive,
      createdAt: row.resume.createdAt.toISOString(),
      asset: joinedAsset,
    };

    return ok<DResume>(result, 201);
  } catch (err) {
    return serverError(err);
  }
}
