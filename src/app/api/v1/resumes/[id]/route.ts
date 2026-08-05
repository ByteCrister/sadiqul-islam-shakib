import { NextRequest } from "next/server";
import { eq, not } from "drizzle-orm";
import { db } from "@/db";
import { resume } from "@/db/schema";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, notFound, serverError } from "@/app/api/lib/api-helpers";
import { cascadeDeleteAsset } from "@/app/api/lib/cascade-delete-asset";

// ── PATCH /api/v1/resumes/[id] ───────────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const body: { label?: string; isActive?: boolean } = await req.json();

    // If setting to active, deactivate all others first
    if (body.isActive === true) {
      await db
        .update(resume)
        .set({ isActive: false })
        .where(not(eq(resume.id, id)));
    }

    const updates: Partial<typeof resume.$inferInsert> = {};
    if (body.label !== undefined) updates.label = body.label;
    if (body.isActive !== undefined) updates.isActive = body.isActive;

    const [updated] = await db
      .update(resume)
      .set(updates)
      .where(eq(resume.id, id))
      .returning();

    if (!updated) return notFound("Resume not found");

    return ok<{ success: true }>({ success: true });
  } catch (err) {
    return serverError(err);
  }
}

// ── DELETE /api/v1/resumes/[id] ──────────────────────────────────────────────
// Chain: resume row → asset row → asset_file row (if 0 refs) → Cloudinary

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    // 1. Load resume to get the linked assetId
    const [r] = await db
      .select()
      .from(resume)
      .where(eq(resume.id, id))
      .limit(1);

    if (!r) return notFound("Resume not found");

    const assetId = r.assetId;

    // 2. Delete the resume record
    await db.delete(resume).where(eq(resume.id, id));

    // 3. Cascade: delete asset → asset_file (if 0 refs) → Cloudinary
    const cascade = await cascadeDeleteAsset(assetId);

    return ok({ id, ...cascade });
  } catch (err) {
    return serverError(err);
  }
}
