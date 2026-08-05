import { NextRequest } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { experience } from "@/db/schema";
import type { DExperience, IconPlatform } from "@/types/dashboard.types";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, notFound, serverError } from "@/app/api/lib/api-helpers";
import { compactExperienceOrders, reorderExperiences } from "../order.utils";

type RouteContext = { params: Promise<{ id: string }> };

function toExperience(row: typeof experience.$inferSelect): DExperience {
  return {
    id: row.id,
    role: row.role,
    org: row.org,
    period: row.period,
    description: row.description,
    points: (row.points as string[]) ?? [],
    iconName: row.iconName,
    iconPlatform: row.iconPlatform as IconPlatform,
    sortOrder: row.sortOrder,
  };
}

// ── PATCH /api/v1/experiences/[id] ────────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const body: Partial<DExperience> = await req.json();

    const updates: Partial<typeof experience.$inferInsert> = {};
    if (body.role !== undefined) updates.role = body.role;
    if (body.org !== undefined) updates.org = body.org;
    if (body.period !== undefined) updates.period = body.period;
    if (body.description !== undefined) updates.description = body.description;
    if (body.points !== undefined) updates.points = body.points;
    if (body.iconName !== undefined) updates.iconName = body.iconName;
    if (body.iconPlatform !== undefined) updates.iconPlatform = body.iconPlatform;
    if (body.sortOrder !== undefined) {
      // Handled below safely
    }

    const [updated] = await db
      .update(experience)
      .set(updates)
      .where(eq(experience.id, id))
      .returning();

    if (!updated) return notFound("Experience not found");

    if (body.sortOrder !== undefined) {
      await reorderExperiences(id, body.sortOrder);
    }

    const allRows = await db
      .select()
      .from(experience)
      .orderBy(asc(experience.sortOrder));

    const fresh = allRows.find((r) => r.id === id) ?? updated;
    return ok<DExperience>(toExperience(fresh));
  } catch (err) {
    return serverError(err);
  }
}

// ── DELETE /api/v1/experiences/[id] ───────────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    const [deleted] = await db
      .delete(experience)
      .where(eq(experience.id, id))
      .returning();

    if (!deleted) return notFound("Experience not found");

    await compactExperienceOrders();

    return ok<{ id: string }>({ id: deleted.id });
  } catch (err) {
    return serverError(err);
  }
}
