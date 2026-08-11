import { NextRequest } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { socialLink } from "@/db/schema";
import type { DSocialLink, IconPlatform, SocialLinkContext } from "@/types/dashboard.types";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, notFound, serverError } from "@/app/api/lib/api-helpers";
import { compactSocialLinkOrders, reorderSocialLinks } from "../../../../../lib/helpers/social-links-order.lib";
import { revalidatePath } from "next/cache";

type RouteContext = { params: Promise<{ id: string }> };

function toSocialLink(row: typeof socialLink.$inferSelect): DSocialLink {
  return {
    id: row.id,
    name: row.name,
    href: row.href,
    iconName: row.iconName,
    iconPlatform: row.iconPlatform as IconPlatform,
    context: row.context as SocialLinkContext,
    sortOrder: row.sortOrder,
  };
}

// ── PATCH /api/v1/social-links/[id] ──────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const body: Partial<DSocialLink> = await req.json();

    const updates: Partial<typeof socialLink.$inferInsert> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.href !== undefined) updates.href = body.href;
    if (body.iconName !== undefined) updates.iconName = body.iconName;
    if (body.iconPlatform !== undefined) updates.iconPlatform = body.iconPlatform;
    if (body.context !== undefined) updates.context = body.context;
    if (body.sortOrder !== undefined) {
      // Handled below safely
    }

    const [updated] = await db
      .update(socialLink)
      .set(updates)
      .where(eq(socialLink.id, id))
      .returning();

    if (!updated) return notFound("Social link not found");

    if (body.sortOrder !== undefined) {
      await reorderSocialLinks(id, body.sortOrder);
    }

    // Re-fetch the row to return the final compacted sortOrder
    const allRows = await db
      .select()
      .from(socialLink)
      .orderBy(asc(socialLink.sortOrder));

    const fresh = allRows.find((r) => r.id === id) ?? updated;
    revalidatePath("/", "layout");
    return ok<DSocialLink>(toSocialLink(fresh));
  } catch (err) {
    return serverError(err);
  }
}

// ── DELETE /api/v1/social-links/[id] ─────────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    const [deleted] = await db
      .delete(socialLink)
      .where(eq(socialLink.id, id))
      .returning();

    if (!deleted) return notFound("Social link not found");

    // Compact remaining orders after deletion so there are no gaps
    await compactSocialLinkOrders();

    revalidatePath("/", "layout");
    return ok<{ id: string }>({ id: deleted.id });
  } catch (err) {
    return serverError(err);
  }
}
