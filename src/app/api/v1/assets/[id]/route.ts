import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { asset } from "@/db/schema";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, notFound, serverError } from "@/app/api/lib/api-helpers";
import { cascadeDeleteAsset } from "@/app/api/lib/cascade-delete-asset";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    // Verify asset exists first
    const [existingAsset] = await db
      .select()
      .from(asset)
      .where(eq(asset.id, id))
      .limit(1);

    if (!existingAsset) return notFound("Asset not found");

    // Full cascade: asset → asset_file (if no remaining refs) → Cloudinary
    const result = await cascadeDeleteAsset(id);

    return ok(result);
  } catch (err) {
    return serverError(err);
  }
}
