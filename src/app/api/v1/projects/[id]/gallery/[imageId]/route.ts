import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { projectImage } from "@/db/schema";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, notFound, serverError } from "@/app/api/lib/api-helpers";

type RouteContext = { params: Promise<{ id: string; imageId: string }> };

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id: projectId, imageId } = await params;

    const deleted = await db
      .delete(projectImage)
      .where(and(eq(projectImage.id, imageId), eq(projectImage.projectId, projectId)))
      .returning()
      .then((r) => r[0]);

    if (!deleted) return notFound("Gallery image not found");

    return ok({ id: deleted.id });
  } catch (err) {
    return serverError(err);
  }
}
