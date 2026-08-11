import { NextRequest } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { experience } from "@/db/schema";
import type { DExperience, DExperienceInput, IconPlatform } from "@/types/dashboard.types";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, serverError } from "@/app/api/lib/api-helpers";
import { compactExperienceOrders, nextExperienceOrder } from "../../../../lib/helpers/experiences-order.lib";
import { revalidatePath } from "next/cache";

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

// ── GET /api/v1/experiences ───────────────────────────────────────────────────

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const rows = await db
      .select()
      .from(experience)
      .orderBy(asc(experience.sortOrder));
    return ok<DExperience[]>(rows.map(toExperience));
  } catch (err) {
    return serverError(err);
  }
}

// ── POST /api/v1/experiences ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body: DExperienceInput = await req.json();

    const desiredOrder =
      typeof body.sortOrder === "number" && body.sortOrder >= 0
        ? body.sortOrder
        : await nextExperienceOrder();

    const [inserted] = await db
      .insert(experience)
      .values({
        role: body.role,
        org: body.org ?? null,
        period: body.period,
        description: body.description,
        points: body.points ?? [],
        iconName: body.iconName,
        iconPlatform: body.iconPlatform,
        sortOrder: desiredOrder,
      })
      .returning();

    await compactExperienceOrders();

    const allRows = await db
      .select()
      .from(experience)
      .orderBy(asc(experience.sortOrder));

    const fresh = allRows.find((r) => r.id === inserted.id) ?? inserted;
    revalidatePath("/about", "page");
    return ok<DExperience>(toExperience(fresh), 201);
  } catch (err) {
    return serverError(err);
  }
}
