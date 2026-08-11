import { NextRequest } from "next/server";
import { eq, not } from "drizzle-orm";
import { db } from "@/db";
import { profileImage } from "@/db/schema";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, notFound, serverError } from "@/app/api/lib/api-helpers";
import { cascadeDeleteAsset } from "@/app/api/lib/cascade-delete-asset";
import { revalidatePath } from "next/cache";

// ── PATCH /api/v1/profile-images/[id] ────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const body: { label?: string; isActive?: boolean } = await req.json();

    // If setting to active, deactivate all others first
    if (body.isActive === true) {
      await db
        .update(profileImage)
        .set({ isActive: false })
        .where(not(eq(profileImage.id, id)));
    }

    const updates: Partial<typeof profileImage.$inferInsert> = {};
    if (body.label !== undefined) updates.label = body.label;
    if (body.isActive !== undefined) updates.isActive = body.isActive;

    const [updated] = await db
      .update(profileImage)
      .set(updates)
      .where(eq(profileImage.id, id))
      .returning();

    if (!updated) return notFound("Profile image not found");

    revalidatePath("/", "layout");
    return ok<{ success: true }>({ success: true });
  } catch (err) {
    return serverError(err);
  }
}

// ── DELETE /api/v1/profile-images/[id] ───────────────────────────────────────
// Chain: profile_image row → asset row → asset_file row (if 0 refs) → Cloudinary

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    // 1. Load profile_image to get the linked assetId
    const [pi] = await db
      .select()
      .from(profileImage)
      .where(eq(profileImage.id, id))
      .limit(1);

    if (!pi) return notFound("Profile image not found");

    const assetId = pi.assetId;

    // 2. Delete the profile_image record
    await db.delete(profileImage).where(eq(profileImage.id, id));

    // 3. Cascade: delete asset → asset_file (if 0 refs) → Cloudinary
    const cascade = await cascadeDeleteAsset(assetId);

    revalidatePath("/", "layout");
    return ok({ id, ...cascade });
  } catch (err) {
    return serverError(err);
  }
}
