import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { counter } from "@/db/schema";
import type { DCounter, IconPlatform } from "@/types/dashboard.types";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, notFound, serverError } from "@/app/api/lib/api-helpers";

type RouteContext = { params: Promise<{ id: string }> };

function toCounter(row: typeof counter.$inferSelect): DCounter {
  return {
    id: row.id,
    label: row.label,
    value: row.value,
    iconName: row.iconName,
    iconPlatform: row.iconPlatform as IconPlatform,
    sortOrder: row.sortOrder,
  };
}

// ── PATCH /api/v1/counters/[id] ───────────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const body: Partial<DCounter> = await req.json();

    const updates: Partial<typeof counter.$inferInsert> = {};
    if (body.label !== undefined) updates.label = body.label;
    if (body.value !== undefined) updates.value = body.value;
    if (body.iconName !== undefined) updates.iconName = body.iconName;
    if (body.iconPlatform !== undefined) updates.iconPlatform = body.iconPlatform;
    if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;

    const updated = await db
      .update(counter)
      .set(updates)
      .where(eq(counter.id, id))
      .returning()
      .then((r) => r[0]);

    if (!updated) return notFound("Counter not found");
    return ok<DCounter>(toCounter(updated));
  } catch (err) {
    return serverError(err);
  }
}

// ── DELETE /api/v1/counters/[id] ──────────────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    const deleted = await db
      .delete(counter)
      .where(eq(counter.id, id))
      .returning()
      .then((r) => r[0]);

    if (!deleted) return notFound("Counter not found");
    return ok<{ id: string }>({ id: deleted.id });
  } catch (err) {
    return serverError(err);
  }
}
