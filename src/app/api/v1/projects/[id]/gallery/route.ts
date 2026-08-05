import { NextRequest } from "next/server";
import { eq, asc } from "drizzle-orm";
import { db } from "@/db";
import { projectImage, asset, assetFile } from "@/db/schema";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, badRequest, serverError } from "@/app/api/lib/api-helpers";

type RouteContext = { params: Promise<{ id: string }> };

// ── GET /api/v1/projects/[id]/gallery ─────────────────────────────────────────

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id: projectId } = await params;

    const rows = await db
      .select()
      .from(projectImage)
      .leftJoin(asset, eq(projectImage.assetId, asset.id))
      .leftJoin(assetFile, eq(asset.assetFileId, assetFile.id))
      .where(eq(projectImage.projectId, projectId))
      .orderBy(asc(projectImage.sortOrder));

    const result = rows.map((row) => ({
      id: row.project_image.id,
      projectId: row.project_image.projectId,
      assetId: row.project_image.assetId,
      sortOrder: row.project_image.sortOrder,
      asset: row.asset ? {
        id: row.asset.id,
        name: row.asset.name,
        usedIn: row.asset.usedIn,
        assetFile: row.asset_file ? {
          id: row.asset_file.id,
          url: row.asset_file.url,
          format: row.asset_file.format,
          bytes: row.asset_file.bytes,
          width: row.asset_file.width,
          height: row.asset_file.height,
        } : null,
      } : null,
    }));

    return ok(result);
  } catch (err) {
    return serverError(err);
  }
}

// ── POST /api/v1/projects/[id]/gallery ────────────────────────────────────────

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id: projectId } = await params;
    const body = await req.json();

    if (!body.assetId) {
      return badRequest("Missing assetId");
    }

    // Get current max sortOrder
    const existing = await db
      .select({ sortOrder: projectImage.sortOrder })
      .from(projectImage)
      .where(eq(projectImage.projectId, projectId))
      .orderBy(asc(projectImage.sortOrder));

    const nextSortOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder + 1 : 0;

    const inserted = await db
      .insert(projectImage)
      .values({
        projectId,
        assetId: body.assetId,
        sortOrder: nextSortOrder,
      })
      .returning()
      .then((r) => r[0]);

    // Fetch full details to return
    const row = await db
      .select()
      .from(projectImage)
      .leftJoin(asset, eq(projectImage.assetId, asset.id))
      .leftJoin(assetFile, eq(asset.assetFileId, assetFile.id))
      .where(eq(projectImage.id, inserted.id))
      .then(r => r[0]);
      
    return ok({
      id: row.project_image.id,
      projectId: row.project_image.projectId,
      assetId: row.project_image.assetId,
      sortOrder: row.project_image.sortOrder,
      asset: row.asset ? {
        id: row.asset.id,
        name: row.asset.name,
        usedIn: row.asset.usedIn,
        assetFile: row.asset_file ? {
          id: row.asset_file.id,
          url: row.asset_file.url,
        } : null,
      } : null,
    }, 201);
  } catch (err) {
    return serverError(err);
  }
}
