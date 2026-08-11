import { NextRequest } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { project, asset, assetFile } from "@/db/schema";
import type { DProject, DAsset, DAssetFile, CloudinaryFolder, CloudinaryResourceType } from "@/types/dashboard.types";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, notFound, serverError } from "@/app/api/lib/api-helpers";
import { compactProjectOrders, reorderProjects } from "../../../../../lib/helpers/projects-order.lib";
import { revalidatePath } from "next/cache";

type RouteContext = { params: Promise<{ id: string }> };

/** Revalidate all public pages that display project data. */
function revalidateProjectPages(slug?: string | null) {
  revalidatePath("/", "page");
  revalidatePath("/projects", "page");
  revalidatePath("/about", "page");
  if (slug) {
    revalidatePath(`/projects/${slug}`, "page");
  }
  // Revalidate the dynamic segment layout too
  revalidatePath("/projects/[slug]", "page");
}

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

export function toProject(row: typeof project.$inferSelect): DProject {
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

/** Fetch a project row and join thumbnailAsset + fullscreenAsset URLs */
export async function fetchProjectWithAssets(projectId: string): Promise<DProject | null> {
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
      const joinedAsset: DAsset = { id: a.id, name: a.name, assetFileId: a.assetFileId, usedIn: a.usedIn, assetFile: af ? toAssetFile(af) : undefined };
      base.thumbnailAsset = joinedAsset;
    }
  }

  // Join fullscreen asset
  if (row.fullscreenAssetId) {
    const [a] = await db.select().from(asset).where(eq(asset.id, row.fullscreenAssetId)).limit(1);
    if (a) {
      const [af] = await db.select().from(assetFile).where(eq(assetFile.id, a.assetFileId)).limit(1);
      const joinedAsset: DAsset = { id: a.id, name: a.name, assetFileId: a.assetFileId, usedIn: a.usedIn, assetFile: af ? toAssetFile(af) : undefined };
      base.fullscreenAsset = joinedAsset;
    }
  }

  return base;
}

// ── PATCH /api/v1/projects/[id] ───────────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const body: Partial<DProject> = await req.json();

    const updates: Partial<typeof project.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (body.slug !== undefined) updates.slug = body.slug;
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.tech !== undefined) updates.tech = body.tech;
    if (body.liveUrl !== undefined) updates.liveUrl = body.liveUrl;
    if (body.githubUrl !== undefined) updates.githubUrl = body.githubUrl;
    if (body.category !== undefined) updates.category = body.category;
    if (body.timeline !== undefined) updates.timeline = body.timeline;
    if (body.features !== undefined) updates.features = body.features;
    if (body.challenges !== undefined) updates.challenges = body.challenges;
    if (body.learnings !== undefined) updates.learnings = body.learnings;
    if (body.loginEmail !== undefined) updates.loginEmail = body.loginEmail;
    if (body.loginPassword !== undefined) updates.loginPassword = body.loginPassword;
    if (body.warningMessage !== undefined) updates.warningMessage = body.warningMessage;
    if (body.thumbnailAssetId !== undefined) updates.thumbnailAssetId = body.thumbnailAssetId;
    if (body.fullscreenAssetId !== undefined) updates.fullscreenAssetId = body.fullscreenAssetId;
    // We strip sortOrder from the direct update payload to handle it via the safer reorder utility
    if (body.sortOrder !== undefined) {
      // sortOrder will be handled after the main update
    }

    const updated = await db
      .update(project)
      .set(updates)
      .where(eq(project.id, id))
      .returning()
      .then((r) => r[0]);

    if (!updated) return notFound("Project not found");

    // Handle reordering if requested
    if (body.sortOrder !== undefined) {
      await reorderProjects(id, body.sortOrder);
    }

    // Return with joined asset URLs so the UI can display images immediately
    const enriched = await fetchProjectWithAssets(updated.id);

    // Revalidate frontend pages so changes appear immediately
    revalidateProjectPages(enriched?.slug ?? updated.slug);

    return ok<DProject>(enriched ?? toProject(updated));
  } catch (err) {
    return serverError(err);
  }
}

// ── DELETE /api/v1/projects/[id] ──────────────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    const deleted = await db
      .delete(project)
      .where(eq(project.id, id))
      .returning()
      .then((r) => r[0]);

    if (!deleted) return notFound("Project not found");

    // Compact after deletion to close the gap
    await compactProjectOrders();

    // Revalidate frontend pages so deletion is reflected immediately
    revalidateProjectPages(deleted.slug);

    return ok<{ id: string }>({ id: deleted.id });
  } catch (err) {
    return serverError(err);
  }
}
