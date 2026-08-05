import { NextRequest } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { project } from "@/db/schema";
import type { DProject, DProjectInput } from "@/types/dashboard.types";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, serverError } from "@/app/api/lib/api-helpers";
import { compactProjectOrders, nextProjectOrder, reorderProjects } from "./order.utils";

import { fetchProjectWithAssets, toProject } from "./[id]/route";

// ── GET /api/v1/projects ───────────────────────────────────────────────────────

export async function GET() {
  try {
    const rows = await db
      .select({ id: project.id })
      .from(project)
      .orderBy(asc(project.sortOrder));

    const projectsWithAssets = await Promise.all(
      rows.map((r) => fetchProjectWithAssets(r.id))
    );

    // Filter out any nulls just in case, though there shouldn't be any
    return ok<DProject[]>(projectsWithAssets.filter((p): p is DProject => p !== null));
  } catch (err) {
    return serverError(err);
  }
}

// ── POST /api/v1/projects ──────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body: DProjectInput = await req.json();

    // Auto-assign order if not provided or invalid; otherwise clamp to ≥ 0
    const desiredOrder =
      typeof body.sortOrder === "number" && body.sortOrder >= 0
        ? body.sortOrder
        : await nextProjectOrder();

    const [inserted] = await db
      .insert(project)
      .values({
        slug: body.slug,
        title: body.title,
        description: body.description,
        tech: body.tech,
        liveUrl: body.liveUrl ?? null,
        githubUrl: body.githubUrl,
        category: body.category,
        timeline: body.timeline ?? null,
        features: body.features ?? null,
        challenges: body.challenges ?? null,
        learnings: body.learnings ?? null,
        loginEmail: body.loginEmail ?? null,
        loginPassword: body.loginPassword ?? null,
        warningMessage: body.warningMessage ?? null,
        thumbnailAssetId: body.thumbnailAssetId ?? null,
        fullscreenAssetId: body.fullscreenAssetId ?? null,
        sortOrder: await nextProjectOrder(), // Insert at the end initially
      })
      .returning();

    // Move to desired position, which handles shifting other items safely
    await reorderProjects(inserted.id, desiredOrder);

    // Re-fetch with the compacted order so the returned row is accurate
    const allRows = await db.select().from(project).orderBy(asc(project.sortOrder));
    const fresh = allRows.find((r) => r.id === inserted.id) ?? inserted;

    return ok<DProject>(toProject(fresh), 201);
  } catch (err) {
    return serverError(err);
  }
}
