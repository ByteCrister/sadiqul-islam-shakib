import { NextRequest } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { skill } from "@/db/schema";
import type { DSkill, DSkillInput, SkillCategory, IconPlatform } from "@/types/dashboard.types";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, serverError } from "@/app/api/lib/api-helpers";
import { compactSkillOrders, nextSkillOrder } from "./order.utils";

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

// ── GET /api/v1/skills ────────────────────────────────────────────────────────

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const rows = await db
      .select()
      .from(skill)
      .orderBy(asc(skill.sortOrder));
    return ok<DSkill[]>(rows.map(toSkill));
  } catch (err) {
    return serverError(err);
  }
}

// ── POST /api/v1/skills ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body: DSkillInput = await req.json();

    const desiredOrder =
      typeof body.sortOrder === "number" && body.sortOrder >= 0
        ? body.sortOrder
        : await nextSkillOrder();

    const [inserted] = await db
      .insert(skill)
      .values({
        name: body.name,
        category: body.category,
        iconName: body.iconName,
        iconPlatform: body.iconPlatform,
        sortOrder: desiredOrder,
      })
      .returning();

    await compactSkillOrders();

    const allRows = await db
      .select()
      .from(skill)
      .orderBy(asc(skill.sortOrder));

    const fresh = allRows.find((r) => r.id === inserted.id) ?? inserted;
    return ok<DSkill>(toSkill(fresh), 201);
  } catch (err) {
    return serverError(err);
  }
}
