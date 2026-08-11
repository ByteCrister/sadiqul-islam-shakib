import { NextRequest } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { counter } from "@/db/schema";
import type { DCounter, DCounterInput, IconPlatform } from "@/types/dashboard.types";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, serverError } from "@/app/api/lib/api-helpers";
import { revalidatePath } from "next/cache";

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

// ── GET /api/v1/counters ──────────────────────────────────────────────────────

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const rows = await db
      .select()
      .from(counter)
      .orderBy(asc(counter.sortOrder));
    return ok<DCounter[]>(rows.map(toCounter));
  } catch (err) {
    return serverError(err);
  }
}

// ── POST /api/v1/counters ─────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body: DCounterInput = await req.json();

    const inserted = await db
      .insert(counter)
      .values({
        label: body.label,
        value: body.value,
        iconName: body.iconName,
        iconPlatform: body.iconPlatform,
        sortOrder: body.sortOrder ?? 0,
      })
      .returning()
      .then((r) => r[0]);

    revalidatePath("/about", "page");
    return ok<DCounter>(toCounter(inserted), 201);
  } catch (err) {
    return serverError(err);
  }
}
