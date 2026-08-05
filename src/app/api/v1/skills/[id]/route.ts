import { NextRequest } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { skill } from "@/db/schema";
import type { DSkill, SkillCategory, IconPlatform } from "@/types/dashboard.types";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, notFound, serverError } from "@/app/api/lib/api-helpers";
import { compactSkillOrders, reorderSkills } from "../order.utils";

type RouteContext = { params: Promise<{ id: string }> };

function toSkill(row: typeof skill.$inferSelect): DSkill {
  return {
    id: row.id,
    name: row.name,
    category: row.category as SkillCategory,
    iconName: row.iconName,
    iconPlatform: row.iconPlatform as IconPlatform,
    sortOrder: row.sortOrder,
  };
}

// ── PATCH /api/v1/skills/[id] ─────────────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;
    const body: Partial<DSkill> = await req.json();

    const updates: Partial<typeof skill.$inferInsert> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.category !== undefined) updates.category = body.category;
    if (body.iconName !== undefined) updates.iconName = body.iconName;
    if (body.iconPlatform !== undefined) updates.iconPlatform = body.iconPlatform;
    if (body.sortOrder !== undefined) {
      // sortOrder will be handled safely below
    }

    const [updated] = await db
      .update(skill)
      .set(updates)
      .where(eq(skill.id, id))
      .returning();

    if (!updated) return notFound("Skill not found");

    if (body.sortOrder !== undefined) {
      await reorderSkills(id, body.sortOrder);
    }

    const allRows = await db
      .select()
      .from(skill)
      .orderBy(asc(skill.sortOrder));

    const fresh = allRows.find((r) => r.id === id) ?? updated;
    return ok<DSkill>(toSkill(fresh));
  } catch (err) {
    return serverError(err);
  }
}

// ── DELETE /api/v1/skills/[id] ────────────────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const { id } = await params;

    const [deleted] = await db
      .delete(skill)
      .where(eq(skill.id, id))
      .returning();

    if (!deleted) return notFound("Skill not found");

    await compactSkillOrders();

    return ok<{ id: string }>({ id: deleted.id });
  } catch (err) {
    return serverError(err);
  }
}
